import type { AppState } from '@/shared/store/types';

export const selectTheme = (state: AppState) => state.settings.theme;
export const selectLanguage = (state: AppState) => state.settings.language;
export const selectNotifications = (state: AppState) => state.settings.notifications;
export const selectCompactView = (state: AppState) => state.settings.compactView;
export const selectItemsPerPage = (state: AppState) => state.settings.itemsPerPage;
export const selectAllSettings = (state: AppState) => state.settings;
