import type * as BaseApiModule from './base-api';

declare module '@/shared/store/types' {
  interface AppState {
    api: ReturnType<(typeof BaseApiModule.baseApi)['reducer']>;
  }
}
