'use client';

import { useEffect, useMemo } from 'react';

import { headerTemplates, type HeaderTemplateKey } from '@/shared/config/routes';

import { useHeader } from './header-context';

import type { HeaderTemplate } from '@/shared/types/header';

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

    if (template.type === 'static') {
      setHeader(template.descriptor);
    } else if (item) {
      setHeader(template.build(item));
    } else if (template.fallback) {
      setHeader(template.fallback);
    }

    return () => {
      resetHeader();
    };
  }, [item, setHeader, resetHeader, template]);
}
