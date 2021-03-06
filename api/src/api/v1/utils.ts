/*
 * API specific utilities
 */
import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { omit } from 'ramda';
import { ApiResponse } from './schema/response';
import { ModelQuery } from '../../models';
import { ApiRequestQuery } from './users/schema';


/*
 * Boom error type does not include key details
 * added by Joi failAction validation method
 */
export type BoomWithValidation = Boom<any> & Joi.ValidationError;

/*
 * Catches Joi validation errors thrown from failAction and formats response
 *
 * Note joi is configured to fail on first validation error
 * so 'details' only has one element
 *
 *  We only choose to re-format the boom response
 * in order to get rid of the strange artefact of having
 * an `error.error` attribute.
 *
 * This function can be done in one line with `renameKeys`
 * but the compiler complains because it can't infer the
 * correct keys
 */

export const formatBoom = (error: BoomWithValidation): ApiResponse => {
  const { name, details, output: { payload } } = error;

  if (name === 'ValidationError') {
    const message = details[0].message;
    const [, messageTopic, messageError] = message.match(/^"([^"]+)" (.*)/);
    return {
      error: {
        statusCode: payload.statusCode,
        type: payload.error,
        message,
        validation: { [messageTopic]: messageError },
      },
    };
  } else {
    return {
      error: {
        statusCode: payload.statusCode,
        type: payload.error,
        message: payload.message,
      },
    };
  }
};

/*
 * If the response data is "raw", it is wrapped appropriately.
 * Otherwise if the response has meta-data attached to it (and
 * is therefore correctly formatted) it is simply passed through
 *
 * TODO: This function will strip custom headers (set in handlers).
 *       If such headers are required, this function will need to
 *       be re-written.
 *       See https://github.com/TwinePlatform/twine-api/issues/111
 */
export const formatResponse = (res: Hapi.ResponseObject): ApiResponse => {
  const r: any = res.source;

  if (r === null) {
    return { result: null } as ApiResponse;
  }

  if ('result' in r && 'meta' in r) {
    return { ...r } as ApiResponse;
  }

  return {
    result: r,
  };
};

export const requestQueryToModelQuery = <T>(requestQuery: ApiRequestQuery): ModelQuery<T> => {
  let modelQuery: ModelQuery<T> = {
    ...omit(['sort', 'order', 'fields'], requestQuery),
    offset: 'offset' in requestQuery ? Number(requestQuery.offset) : undefined,
    limit: 'limit' in requestQuery ? Number(requestQuery.limit) : undefined,
    userId: 'userId' in requestQuery ? Number(requestQuery.limit) : undefined,
  };

  if (requestQuery.sort) {
    modelQuery = {
      ...modelQuery,
      order: requestQuery.sort ? [requestQuery.sort, requestQuery.order || 'asc'] : undefined,
    };
  }

  if (requestQuery.fields) {
    modelQuery = {
      ...modelQuery,
      fields: requestQuery.fields as (keyof T)[],
    };
  }

  return modelQuery;
};
