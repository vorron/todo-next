import type { SettingsState } from './settings-slice';

declare module '@/shared/store/types' {
  interface AppState {
    settings: SettingsState;
  }
}
