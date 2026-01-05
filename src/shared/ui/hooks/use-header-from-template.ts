'use client';

import { useEffect, useMemo } from 'react';

import { headerTemplates, type headerTemplates as headerTemplatesType } from '@/shared/lib/router';
import { useHeader } from '@/shared/ui/header-context';

import type { HeaderTemplate } from '@/shared/lib/router/config-types';

type TemplateKey = keyof typeof headerTemplatesType;
type TemplateKeyOrObj<T> = TemplateKey | HeaderTemplate<T>;

/**
 * Универсальный хук для установки хедера на основе шаблона.
 * Поддерживает передачу ключа шаблона или самого объекта шаблона.
 */

// Перегрузка для ключа шаблона (без приведения типа)
export function useHeaderFromTemplate<T>(item: T | undefined, templateKey: TemplateKey): void;

// Перегрузка для объекта шаблона
export function useHeaderFromTemplate<T>(item: T | undefined, template: HeaderTemplate<T>): void;

// Реализация
export function useHeaderFromTemplate<T>(item: T | undefined, templateOrKey: TemplateKeyOrObj<T>) {
  const { setHeader, resetHeader } = useHeader();

  const template = useMemo(() => {
    if (typeof templateOrKey === 'string') {
      const resolved = headerTemplates[templateOrKey as TemplateKey];
      if (!resolved) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`useHeaderFromTemplate: unknown template key "${templateOrKey}"`);
        }
        return null;
      }
      return resolved as unknown as HeaderTemplate<T>;
    }
    return templateOrKey;
  }, [templateOrKey]);

  useEffect(() => {
    if (!template) return;

    // Проверяем, что template является объектом HeaderTemplate
    if (typeof template === 'object' && template !== null && 'type' in template) {
      if (template.type === 'static' && template.descriptor) {
        setHeader(template.descriptor);
      } else if (item && 'build' in template && template.build) {
        setHeader(template.build(item));
      } else if ('fallback' in template && template.fallback) {
        setHeader(template.fallback);
      }
    }

    return () => {
      resetHeader();
    };
  }, [item, setHeader, resetHeader, template]);
}
