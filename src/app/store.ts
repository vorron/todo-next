import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@/features/auth';
import settingsReducer from '@/features/settings/model/settings-slice';
import { baseApi } from '@/shared/api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      settings: settingsReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
