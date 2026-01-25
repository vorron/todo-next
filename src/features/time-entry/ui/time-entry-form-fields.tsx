'use client';

import { type Control } from 'react-hook-form';

import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import { Input } from '@/shared/ui/input';

import { useProjects, type Project } from '../model/queries/use-projects';
import { type TimeEntryFormData } from '../model/time-entry-form-schemas';

export interface TimeEntryFormFieldsProps {
  control: Control<TimeEntryFormData>;
  disabled?: boolean;
  showSubmitButton?: boolean; // опционально показывать кнопку сабмита
}

/**
 * Поля формы time entry
 * Знают о доменной логике (time entry) и рендерят соответствующие поля
 */
export const TimeEntryFormFields = ({
  control,
  disabled,
  showSubmitButton = false,
}: TimeEntryFormFieldsProps) => {
  // Получаем реальные проекты из API
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();

  return (
    <div className="flex gap-2 items-center">
      {/* Поле "Описание задачи" */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input placeholder="Что вы делали?" disabled={disabled} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Селектор "Проект" */}
      <FormField
        control={control}
        name="projectId"
        render={({ field }) => (
          <FormItem className="w-48">
            <FormControl>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={disabled || isLoadingProjects}
                {...field}
              >
                <option value="">Выберите проект</option>
                {projects.map((project: Project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Поле "Дата" */}
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Поле "Время начала" */}
      <FormField
        control={control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="ЧЧ:ММ"
                disabled={disabled}
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Поле "Длительность" */}
      <FormField
        control={control}
        name="duration"
        render={({ field }) => (
          <FormItem className="w-24">
            <FormControl>
              <Input
                type="number"
                placeholder="мин"
                disabled={disabled}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Кнопка "Добавить" - только если showSubmitButton=true */}
      {showSubmitButton && (
        <Button type="submit" disabled={disabled} className="shrink-0">
          Добавить
        </Button>
      )}
    </div>
  );
};
