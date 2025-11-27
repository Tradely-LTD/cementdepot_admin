import { logout } from '@/pages/admin/auth-slice';
import urls from '@/utils/config';
import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

export const TAGS = {
  AUTH: 'AUTH',
  USER: 'USER',
  PRODUCT: 'PRODUCT',
  BRAND: 'BRAND',
  DEPOT: 'DEPOT',
  INVENTORY: 'INVENTORY',
  ORDER: 'ORDER',
  PAYMENT: 'PAYMENT',
  NOTIFICATION: 'NOTIFICATION',
  REPORT: 'REPORT',
  DELIVERY_ROUTE: 'DELIVERY_ROUTE',
  PRICING: 'PRICING',
} as const;

export const baseQuery = fetchBaseQuery({
  baseUrl: urls.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    const token = state.auth.loginResponse?.data?.tokens?.accessToken || '';
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Get refresh token from Redux state
    const state = api.getState() as RootState;
    const refreshToken =
      state.auth.loginResponse?.data?.tokens?.refreshToken || '';

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/api/v1/auth/refresh',
          method: 'POST',
          body: {
            refreshToken: refreshToken,
          },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Token refreshed successfully, retry original request
        return baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, clear tokens and logout
        api.dispatch(logout());
      }
    } else {
      // No refresh token available, logout
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  tagTypes: Object.values(TAGS),
});
