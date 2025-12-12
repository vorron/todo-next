'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';
import { Switch } from '@/shared/ui/switch';
import {
  setTheme,
  setLanguage,
  setNotifications,
  setCompactView,
  setItemsPerPage,
  resetSettings,
  type Theme,
  type Language,
} from '../model/settings-slice';
import { selectAllSettings } from '../model/selectors';

export function SettingsForm() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectAllSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleThemeChange = (theme: Theme) => {
    dispatch(setTheme(theme));
    setHasUnsavedChanges(true);
  };

  const handleLanguageChange = (language: Language) => {
    dispatch(setLanguage(language));
    setHasUnsavedChanges(true);
  };

  const handleNotificationsChange = (enabled: boolean) => {
    dispatch(setNotifications(enabled));
    setHasUnsavedChanges(true);
  };

  const handleCompactViewChange = (enabled: boolean) => {
    dispatch(setCompactView(enabled));
    setHasUnsavedChanges(true);
  };

  const handleItemsPerPageChange = (value: number) => {
    dispatch(setItemsPerPage(value));
    setHasUnsavedChanges(true);
  };

  const handleReset = () => {
    dispatch(resetSettings());
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    // Здесь будет логика сохранения на бэкенд
    setHasUnsavedChanges(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value as Theme)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Language</h3>
              <p className="text-sm text-gray-600">Interface language</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Compact view</h3>
              <p className="text-sm text-gray-600">Show more content in less space</p>
            </div>
            <Switch checked={settings.compactView} onCheckedChange={handleCompactViewChange} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Push notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications for important updates</p>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={handleNotificationsChange} />
          </div>
        </CardContent>
      </Card>

      {/* Data & Display */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Items per page</h3>
              <p className="text-sm text-gray-600">Number of todos shown per page</p>
            </div>
            <select
              value={settings.itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
