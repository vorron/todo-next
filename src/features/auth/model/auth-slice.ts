import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, Session } from './types';

const initialState: AuthState = {
  session: null,
  isAuthenticated: false,
  isLoading: true,
};

/**
 * Redux slice для управления аутентификацией
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    clearSession: (state) => {
      state.session = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSession, clearSession, setLoading } = authSlice.actions;
export default authSlice.reducer;
