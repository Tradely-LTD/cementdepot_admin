export const HTTP_STATUS_CODE = {
  OK: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  TooManyRequests: 429,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  ConnectionError: 0,
};

const LIST = 'LIST';
const UNKNOWN_ERROR = 0;
const defaultTags = [UNKNOWN_ERROR, HTTP_STATUS_CODE.Unauthorized];

const invalidateOnSuccess = (type: string[]) => {
  return (_result: unknown, error: unknown) => (error ? [] : type);
};

const concatErrorToCache = (exisitingCache: unknown[] = [], error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === HTTP_STATUS_CODE.Unauthorized
  ) {
    return [...exisitingCache, HTTP_STATUS_CODE.Unauthorized];
  }
  return [...exisitingCache, UNKNOWN_ERROR];
};

const providesList =
  (
    type: string,
    { nestedKey, idKey }: { nestedKey?: string; idKey?: string } = {}
  ) =>
  (payload: unknown, error: unknown) => {
    if (payload && typeof payload === 'object') {
      /**
       * If nestedKey is provided, we assume the actual data is accessible via the key.
       */
      const actualData = nestedKey
        ? (payload as Record<string, unknown>)[nestedKey]
        : payload;
      const idProp = idKey ?? 'id';
      const tags = [
        { type, id: LIST },
        ...(Array.isArray(actualData)
          ? actualData.map((item: Record<string, unknown>) => ({
              type,
              id: item[idProp] as string,
            }))
          : []),
      ];
      return tags;
    }
    return concatErrorToCache([{ type, id: LIST }], error);
  };

const invalidatesList = (type: string) => () => ({ type, id: LIST });

const cacheById =
  (type: string) => (_payload: unknown, _error: unknown, id: string) => [
    { type, id },
  ];

const cacheByIdProperty =
  (type: string) =>
  (_payload: unknown, _error: unknown, arg: { id: string }) => [
    { type, id: arg.id },
  ];

const invalidateByError = (errorCase: unknown) => () => [errorCase];

export default {
  defaultTags,
  providesList,
  invalidatesList,
  invalidateByError,
  cacheById,
  invalidateOnSuccess,
  invalidateByIdProperty: cacheByIdProperty,
  cacheByIdProperty,
};
