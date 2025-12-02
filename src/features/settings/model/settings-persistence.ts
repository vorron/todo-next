import type { SettingsState } from './settings-slice';

const SETTINGS_KEY = 'app_settings';

export const settingsStorage = {
  save(settings: SettingsState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  load(): SettingsState | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data) as unknown;

      // Базовая валидация структуры
      if (typeof parsed === 'object' && parsed !== null) {
        const settings = parsed as Partial<SettingsState>;

        // Проверяем обязательные поля
        if (
          typeof settings.theme === 'string' &&
          typeof settings.language === 'string' &&
          typeof settings.notifications === 'boolean' &&
          typeof settings.compactView === 'boolean' &&
          typeof settings.itemsPerPage === 'number'
        ) {
          return settings as SettingsState;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  },
};
