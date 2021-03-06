/*
 * Registration endpoints for volunteers
 */
import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import {
  id,
  userName,
  birthYear,
  email,
  phoneNumber,
  postCode,
  password,
  isEmailConsentGranted,
  isSMSConsentGranted,
  gender,
  response
} from '../schema';
import { Volunteers, Users, CommunityBusinesses } from '../../../../models';
import { Api } from '../../types/api';
import { RoleEnum } from '../../../../models/types';
import Roles from '../../../../models/role';
import { Tokens } from '../../../../models/token';
import { Serialisers } from '../../serialisers';


const routes: [Api.Users.Register.Volunteers.POST.Route] = [
  {
    method: 'POST',
    path: '/users/register/volunteers',
    options: {
      description: 'Retreive list of all users',
      auth: {
        mode: 'try',
        strategy: 'standard',
        access: {
          scope: ['user_details-child:write'],
        }
      },
      validate: {
        payload: {
          organisationId: id.required(),
          role: Joi.alternatives(RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN).required(),
          adminCode: Joi.string().regex(/^\w{5,8}$/),
          name: userName.required(),
          gender: gender.default('prefer not to say'),
          birthYear: birthYear.default(null),
          email: email.required(),
          phoneNumber: phoneNumber.allow(''),
          postCode: postCode.allow(''),
          password: password,
          emailConsent: isEmailConsentGranted.default(false),
          smsConsent: isSMSConsentGranted.default(false),
        },
      },
      response: { schema: response },
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex, EmailService, config } },
        payload,
        auth
      } = request;
      const { email, role, organisationId, adminCode } = payload;

      /*
       * Preliminaries
       */

      // Authenticated requests do not need to supply a password https://github.com/TwinePlatform/twine-monolith/issues/401
      if (!auth.isAuthenticated && !payload.password) {
        return Boom.badRequest('password is required', {
          validation: { name: 'is required' }
        })
      }

      const communityBusiness = await CommunityBusinesses
        .getOne(knex, { where: { id: organisationId, deletedAt: null } });

      // check organisation exists
      if (!communityBusiness) return Boom.badRequest('Unrecognised organisation');


      // Check user exists
      if (await Users.exists(knex, { where: { email } })) {
        // VOLUNTEER_ADMIN cannot have a second role
        if (role === RoleEnum.VOLUNTEER_ADMIN) {
          return Boom.conflict('It appears this email is already registered. Try logging in, or speak to an admin if you need help');
        }
        // Registering second role
        const user = await Users.getOne(knex, { where: { email } });

        // check role doesnt exist on user account
        if (await Roles.userHas(knex, user, role)) {
          throw Boom.conflict(
            `${Roles.toDisplay(role)} with this e-mail already registered`);
        }
        // currently not supporting roles at different cbs
        if (!(await Users.isMemberOf(knex, user, communityBusiness))) {
          throw Boom.conflict(
            'User with this e-mail already registered at another Community Business');
        }

        const { token } = await Tokens.createConfirmAddRoleToken(knex, user);

        try {
          await EmailService.addRole(config, user, communityBusiness, RoleEnum.VOLUNTEER, token);

        } catch (error) {
          /*
               * we should do something meaningful here!
               * such as retry with backoff and log/email
               * dev team if unsuccessful
               */
          return Boom.badGateway('E-mail service unavailable');
        }
        throw Boom.conflict(
          'Email is associated to a visitor, '
          + 'please see email confirmation to create volunteer account'
        );
      }

      /*
       * Registration
       */

      if (role === RoleEnum.VOLUNTEER_ADMIN && !adminCode) {
        return Boom.badRequest('Registration Unsuccessful: The admin code is for staff members to register admin accounts. If you are a volunteer, just leave it blank. If you are staff, seek assistance from whoever set up Twine at your organisation.');
      }

      try {
        const volunteer =
          await Volunteers.addWithRole(knex, payload, role, communityBusiness, adminCode);

        return Serialisers.volunteers.noSecrets(volunteer);

      } catch (error) {
        if (error.message === 'Invalid volunteer admin code') {
          return Boom.unauthorized(error.message);
        }
        return error;
      }

      /*
       * Auxillary
       */

      if (auth.isAuthenticated) {
        //TODO: send email if authenticated
      }
    },
  },
];

export default routes;
