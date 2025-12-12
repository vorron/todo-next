import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';

export interface AppState {
  __brand?: never;
}

export interface AppDispatch extends Dispatch<UnknownAction> {
  __brand?: never;
}
