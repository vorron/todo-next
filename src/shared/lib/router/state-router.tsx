/**
 * Universal State Router - универсальный роутер состояний
 * Переиспользуемый компонент для любых state machine routing
 */

'use client';

import { useEffect } from 'react';

import { useHeader } from '@/shared/ui';

import type { ComponentType } from 'react';

export interface StateConfig<_T extends string> {
  component: ComponentType;
  title?: string;
  description?: string;
}

export interface StateRouterProps<T extends string> {
  currentState: T;
  configs: Record<T, StateConfig<T>>;
  title?: string;
  breadcrumbs?: Array<{ href: string; label: string }>;
  fallbackComponent?: ComponentType;
}

/**
 * Универсальный роутер состояний
 * Работает с любой конфигурацией состояний
 */
export function StateRouter<T extends string>({
  currentState,
  configs,
  title,
  breadcrumbs,
  fallbackComponent,
}: StateRouterProps<T>) {
  const { setHeader } = useHeader();

  // Динамическое обновление заголовка
  useEffect(() => {
    if (title || breadcrumbs) {
      setHeader({
        title: title || '',
        breadcrumbs: breadcrumbs || [],
      });
    }
  }, [title, breadcrumbs, setHeader]);

  // Получаем компонент из конфигурации
  const stateConfig = configs[currentState];
  const ComponentToRender = stateConfig?.component || fallbackComponent;

  if (!ComponentToRender) {
    console.warn(`StateRouter: No component found for state "${currentState}"`);
    return null;
  }

  return <ComponentToRender />;
}
