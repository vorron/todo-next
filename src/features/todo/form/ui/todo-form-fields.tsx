'use client';

import { type Control } from 'react-hook-form';

import { TODO_PRIORITY_LABELS } from '@/entities/todo';
import {
  type CreateTodoFormData,
  type EditTodoFormData,
} from '@/entities/todo/model/todo-form-schemas';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui';
import { Input } from '@/shared/ui/input-primitive';

export interface TodoFormFieldsProps {
  mode: 'create' | 'edit';
  control: Control<CreateTodoFormData | EditTodoFormData>;
  disabled?: boolean;
}

/**
 * Поля формы todo
 * Знают о доменной логике (todo) и рендерят соответствующие поля
 */
export const TodoFormFields = ({ mode, control, disabled }: TodoFormFieldsProps) => {
  return (
    <>
      {/* Поле текста - всегда отображается */}
      <FormField
        control={control}
        name="text"
        render={({ field }) => (
          <FormItem className={mode === 'create' ? 'flex-1' : ''}>
            <FormLabel className={mode === 'create' ? 'sr-only' : ''}>Text</FormLabel>
            <FormControl>
              <Input
                placeholder={mode === 'create' ? 'What needs to be done?' : 'Todo text'}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Дополнительные поля только для режима редактирования */}
      {mode === 'edit' && (
        <>
          <FormField
            control={control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <select
                    className="rounded-lg border border-gray-300 px-3 py-2 w-full"
                    disabled={disabled}
                    {...field}
                  >
                    <option value="low">{TODO_PRIORITY_LABELS.low}</option>
                    <option value="medium">{TODO_PRIORITY_LABELS.medium}</option>
                    <option value="high">{TODO_PRIORITY_LABELS.high}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="tagsInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="work, personal, urgent" disabled={disabled} {...field} />
                </FormControl>
                <p className="text-xs text-gray-500">Comma-separated. Example: work, planning.</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
};
