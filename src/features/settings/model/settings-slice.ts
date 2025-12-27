import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { settingsStorage } from './settings-persistence';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ru';

export interface SettingsState {
  theme: Theme;
  language: Language;
  notifications: boolean;
  compactView: boolean;
  itemsPerPage: number;
}

// Валидация загруженных настроек
function validateLoadedSettings(loaded: unknown): SettingsState | null {
  if (typeof loaded !== 'object' || loaded === null) return null;

  const settings = loaded as Partial<SettingsState>;

  const isValid =
    (settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system') &&
    (settings.language === 'en' || settings.language === 'ru') &&
    typeof settings.notifications === 'boolean' &&
    typeof settings.compactView === 'boolean' &&
    typeof settings.itemsPerPage === 'number' &&
    [5, 10, 20, 50].includes(settings.itemsPerPage);

  return isValid ? (settings as SettingsState) : null;
}

const defaultSettings: SettingsState = {
  theme: 'system',
  language: 'en',
  notifications: true,
  compactView: false,
  itemsPerPage: 10,
};

// Загружаем и валидируем настройки
const loadedSettings = settingsStorage.load();
const validatedSettings = loadedSettings ? validateLoadedSettings(loadedSettings) : null;

const initialState: SettingsState = validatedSettings ?? defaultSettings;

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      settingsStorage.save(state);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      settingsStorage.save(state);
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
      settingsStorage.save(state);
    },
    setCompactView: (state, action: PayloadAction<boolean>) => {
      state.compactView = action.payload;
      settingsStorage.save(state);
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      // Валидируем допустимые значения
      const validValues = [5, 10, 20, 50];
      state.itemsPerPage = validValues.includes(action.payload) ? action.payload : 10;
      settingsStorage.save(state);
    },
    resetSettings: (state) => {
      Object.assign(state, defaultSettings);
      settingsStorage.save(defaultSettings);
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setNotifications,
  setCompactView,
  setItemsPerPage,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
