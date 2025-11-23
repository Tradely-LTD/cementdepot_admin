import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { LoginUserApiResponse } from '@/store/results';

export type AuthState = {
  isAuthenticated: boolean;
  loginResponse: LoginUserApiResponse | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  loginResponse: null,
};

// Improved setAuthHandler
const setAuthHandler = (
  state: AuthState,
  { payload: auth }: PayloadAction<Partial<AuthState>>
) => {
  return {
    ...state,
    ...auth,
    loginResponse: auth.loginResponse ?? state.loginResponse, // Keep existing loginResponse if not provided
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: setAuthHandler,
    logout: () => {
      localStorage.clear();
      // Don't redirect automatically - let PrivateRoute handle redirects
      // Only redirect if we're on a protected page
      const currentPath = window.location.pathname;
      const publicPaths = ['/login', '/register', '/'];
      const isPublicPath = publicPaths.some(path =>
        currentPath.startsWith(path)
      );

      if (!isPublicPath) {
        window.location.href = '/login';
      }
      return initialState;
    },
  },
});

export const { logout, setAuth } = authSlice.actions;

// Selector for accessing auth state
export const useUserSlice = () => useSelector((state: RootState) => state.auth);

export default authSlice.reducer; // Export the reducer
