import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

// Actual API response structure
export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      role: string;
      kycStatus: string;
      isActive: boolean;
      [key: string]: any;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

export type AuthState = {
  isAuthenticated: boolean;
  loginResponse: LoginResponse | null;
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
    setLoginResponse: (state, { payload }: PayloadAction<LoginResponse>) => {
      state.loginResponse = payload;
      state.isAuthenticated = true;
    },
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

export const { logout, setAuth, setLoginResponse } = authSlice.actions;

// Selector for accessing auth state
export const useUserSlice = () => useSelector((state: RootState) => state.auth);

export default authSlice.reducer; // Export the reducer
