import { baseApi as api } from './emptyApi';

const injectedRtkApi = api.injectEndpoints({
  endpoints: () => ({}),
  overrideExisting: false,
});

export { injectedRtkApi as coreApi };

// Basic types for cement depot - can be generated from OpenAPI later
export type LoginUserApiResponse = {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
};

// Export hooks
export const {} = injectedRtkApi;
