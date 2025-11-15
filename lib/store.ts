import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import todoReducer from './slices/todoSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      todo: todoReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];