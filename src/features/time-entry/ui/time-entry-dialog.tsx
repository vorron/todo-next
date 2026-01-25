'use client';

import { type Control } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import { Input } from '@/shared/ui/input';

import { useProjects, type Project } from '../model/queries/use-projects';
import { type TimeEntryFormData } from '../model/time-entry-form-schemas';

export interface TimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  control: Control<TimeEntryFormData>;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Диалог редактирования time entry
 * Используется когда не все поля заполнены в быстрой форме
 */
export function TimeEntryDialog({
  open,
  onOpenChange,
  control,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TimeEntryDialogProps) {
  // Получаем реальные проекты из API
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать запись времени</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Описание задачи */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание задачи</FormLabel>
                <FormControl>
                  <Input placeholder="Что делаем?" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Проект */}
          <FormField
            control={control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Проект</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting || isLoadingProjects}
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

          {/* Дата */}
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Время начала */}
          <FormField
            control={control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Время начала</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="ЧЧ:ММ"
                    disabled={isSubmitting}
                    {...field}
                    onChange={(e) => {
                      console.log('Dialog time input changed:', e.target.value);
                      field.onChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Длительность */}
          <FormField
            control={control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Длительность</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="минуты"
                    disabled={isSubmitting}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Создание...' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
