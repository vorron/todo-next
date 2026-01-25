'use client';

import { type Control } from 'react-hook-form';

import { type CreateProjectFormData } from '@/entities/project/model/project-form-schemas';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export interface ProjectFormFieldsProps {
  control: Control<CreateProjectFormData>;
  disabled?: boolean;
  showSubmitButton?: boolean;
}

/**
 * Поля формы проекта
 * Знают о доменной логике (project) и рендерят соответствующие поля
 */
export const ProjectFormFields = ({
  control,
  disabled,
  showSubmitButton = false,
}: ProjectFormFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* Поле "Название проекта" */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Название проекта</FormLabel>
            <FormControl>
              <Input placeholder="Введите название проекта" disabled={disabled} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Поле "Описание" */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Описание</FormLabel>
            <FormControl>
              <Input
                value={field.value || ''}
                placeholder="Введите описание проекта (необязательно)"
                disabled={disabled}
                onChange={(e) => field.onChange(e.target.value || null)}
                onBlur={(e) => field.onChange(e.target.value || null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Кнопка сабмита - только если showSubmitButton=true */}
      {showSubmitButton && (
        <Button type="submit" disabled={disabled} className="w-full">
          Создать проект
        </Button>
      )}
    </div>
  );
};
