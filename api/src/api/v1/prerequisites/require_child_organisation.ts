/*
 * "organisations_details-child" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an organisation
 * which is actually a "child" entity.
 *
 * Conditions under which this is true for organisation X:
 * - User is a Twine admin
 *
 */
import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import isChildOrganisation from './is_child_organisation';


export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const isChild = await isChildOrganisation(request, h)

  if (!isChild) {
    throw Boom.forbidden();
  }

  return true;
};
