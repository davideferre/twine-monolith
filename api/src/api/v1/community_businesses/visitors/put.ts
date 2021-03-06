import * as Boom from '@hapi/boom';
import { Visitors } from '../../../../models';
import {
  response,
  id,
  userName,
  birthYear,
  gender,
  disability,
  ethnicity,
  email,
  phoneNumber,
  postCode,
  isEmailConsentGranted,
  isSMSConsentGranted,
} from '../../users/schema';
import { meOrId } from '../schema';
import { Api } from '../../types/api';
import { getCommunityBusiness, requireChildUser } from '../../prerequisites';
import { Serialisers } from '../../serialisers';


const routes: [
  Api.CommunityBusinesses.Id.Visitors.Id.PUT.Route,
] = [
  {
    method: 'PUT',
    path: '/community-businesses/{organisationId}/visitors/{userId}',
    options: {
      description: 'Update child users details; NOTE: "PUT /users/:id" offers same functionality',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:write'],
        },
      },
      validate: {
        params: {
          userId: id.required(),
          organisationId: meOrId.required(),
        },
        payload: {
          name: userName,
          gender,
          birthYear,
          email,
          phoneNumber,
          postCode,
          isEmailConsentGranted,
          isSMSConsentGranted,
          disability,
          ethnicity,
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
        requireChildUser,
      ],
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        payload,
        pre: { communityBusiness },
        params: { userId },
      } = request;

      const changeset = { ...payload };

      const [user] = await Visitors.fromCommunityBusiness(
        knex,
        communityBusiness,
        { where: { id: Number(userId) } }
      );

      if (!user) {
        return Boom.notFound(`User with id ${userId} not found`);
      }

      try {
        const updatedUser = await Visitors.update(knex, user, changeset);

        return Serialisers.visitors.noSecrets(updatedUser);

      } catch (error) {
      // Intercept subset of class 23 postgres error codes thrown by `knex`
      // Class 23 corresponds to integrity constrain violation
      // See https://www.postgresql.org/docs/10/static/errcodes-appendix.html
      // Happens, for e.g., if try to set a sector or region that doesn't exist
      // TODO:
      // Handle this better, preferably without having to perform additional check
      // queries. See https://github.com/TwinePlatform/twine-api/issues/147
        if (error.code === '23502') {
          return Boom.badRequest();
        } else {
          throw error;
        }
      }
    },
  },
];


export default routes;
