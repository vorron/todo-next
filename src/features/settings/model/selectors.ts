import type { RootState } from '@/app/store';

export const selectTheme = (state: RootState) => state.settings.theme;
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectNotifications = (state: RootState) => state.settings.notifications;
export const selectCompactView = (state: RootState) => state.settings.compactView;
export const selectItemsPerPage = (state: RootState) => state.settings.itemsPerPage;
export const selectAllSettings = (state: RootState) => state.settings;