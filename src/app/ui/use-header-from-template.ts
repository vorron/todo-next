'use client';

import { useEffect, useMemo } from 'react';

import { headerTemplates, type HeaderTemplateKey } from '@/shared/lib/router';
import { useHeader } from '@/shared/ui/header-context';

import type { HeaderTemplate } from '@/shared/lib/router/config-types';

type TemplateKeyOrObj<T> = HeaderTemplateKey | HeaderTemplate<T>;

/**
 * Универсальный хук для установки хедера на основе шаблона.
 * Поддерживает передачу ключа шаблона или самого объекта шаблона.
 */
export function useHeaderFromTemplate<T>(item: T | undefined, templateOrKey: TemplateKeyOrObj<T>) {
  const { setHeader, resetHeader } = useHeader();

  const template = useMemo(() => {
    if (typeof templateOrKey === 'string') {
      const resolved = headerTemplates[templateOrKey];
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
    if (typeof template === 'object' && template !== null) {
      if (template.type === 'static' && template.descriptor) {
        setHeader(template.descriptor);
      } else if (item && template.build) {
        setHeader(template.build(item));
      } else if (template.fallback) {
        setHeader(template.fallback);
      }
    }

    return () => {
      resetHeader();
    };
  }, [item, setHeader, resetHeader, template]);
}
