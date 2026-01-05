/**
 * Universal State Router - универсальный роутер состояний
 * Переиспользуемый компонент для любых state machine routing
 * С поддержкой transitions и error boundaries
 */

'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';

import { useHeader } from '@/shared/ui';

import type { ComponentType } from 'react';

export interface StateConfig<_T extends string> {
  component: ComponentType;
  title?: string;
  description?: string;
  transition?: 'fade' | 'slide' | 'scale' | 'none';
}

export interface StateRouterProps<T extends string> {
  currentState: T;
  configs: Record<T, StateConfig<T>>;
  title?: string;
  breadcrumbs?: Array<{ href: string; label: string }>;
  fallbackComponent?: ComponentType;
  errorComponent?: ComponentType<{ error: Error; state: T }>;
  loadingComponent?: ComponentType;
  transitions?: boolean;
  transitionDuration?: number;
}

/**
 * Error Boundary для обработки ошибок в состояниях
 */
class StateRouterErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback: ComponentType<{ error: Error; state: string }>;
    state: string;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback: ComponentType<{ error: Error; state: string }>;
    state: string;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('StateRouter Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} state={this.props.state} />;
    }

    return this.props.children;
  }
}

/**
 * Transition компонент для анимации переходов
 */
function StateTransition({
  children,
  transition,
  duration = 300,
}: {
  children: React.ReactNode;
  transition: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (transition === 'none') {
      // Используем setTimeout для предотвращения синхронного setState
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setCurrentChildren(children);
        }
      }, 0);
      return () => clearTimeout(timer);
    }

    // Fade out
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setIsVisible(false);
      }
    }, 0);

    // Смена контента
    const transitionTimer = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentChildren(children);
        // Fade in
        setIsVisible(true);
      }
    }, duration / 2);

    return () => {
      clearTimeout(timer);
      clearTimeout(transitionTimer);
    };
  }, [children, transition, duration]);

  const transitionClasses = {
    fade: `transition-opacity duration-${duration} ${isVisible ? 'opacity-100' : 'opacity-0'}`,
    slide: `transition-transform duration-${duration} ${isVisible ? 'translate-x-0' : '-translate-x-4'}`,
    scale: `transition-transform duration-${duration} ${isVisible ? 'scale-100' : 'scale-95'}`,
    none: '',
  };

  return <div className={transitionClasses[transition]}>{currentChildren}</div>;
}

/**
 * Универсальный роутер состояний с улучшенной функциональностью
 */
export function StateRouter<T extends string>({
  currentState,
  configs,
  title,
  breadcrumbs,
  fallbackComponent,
  errorComponent,
  loadingComponent,
  transitions = true,
  transitionDuration = 300,
}: StateRouterProps<T>) {
  const { setHeader } = useHeader();
  const [isLoading, setIsLoading] = useState(false);
  const [previousState, setPreviousState] = useState<T | null>(null);
  // Используем useRef для отслеживания mounted состояния
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Динамическое обновление заголовка
  useEffect(() => {
    if (title || breadcrumbs) {
      setHeader({
        title: title || '',
        breadcrumbs: breadcrumbs || [],
      });
    }
  }, [title, breadcrumbs, setHeader]);

  // Обработка переходов между состояниями
  useEffect(() => {
    if (previousState && previousState !== currentState && transitions) {
      // Используем setTimeout для предотвращения синхронного setState
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setIsLoading(true);
        }
      }, 0);

      const transitionTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
          setPreviousState(currentState);
        }
      }, transitionDuration / 2);

      return () => {
        clearTimeout(timer);
        clearTimeout(transitionTimer);
      };
    } else if (!previousState) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setPreviousState(currentState);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentState, previousState, transitions, transitionDuration]);

  // Получаем компонент из конфигурации
  const stateConfig = configs[currentState];
  const ComponentToRender = stateConfig?.component || fallbackComponent;
  const transition = stateConfig?.transition || 'fade';

  if (isLoading && loadingComponent) {
    const LoadingComponent = loadingComponent;
    return <LoadingComponent />;
  }

  if (!ComponentToRender) {
    console.warn(`StateRouter: No component found for state "${currentState}"`);

    if (fallbackComponent) {
      return React.createElement(fallbackComponent);
    }

    return (
      <div className="p-4 text-center text-red-500">
        <h2>State Not Found</h2>
        <p>No component configured for state: {String(currentState)}</p>
      </div>
    );
  }

  const content = (
    <Suspense
      fallback={loadingComponent ? React.createElement(loadingComponent) : <div>Loading...</div>}
    >
      <ComponentToRender />
    </Suspense>
  );

  // Error Boundary wrapper
  const wrappedContent = errorComponent ? (
    <StateRouterErrorBoundary
      fallback={errorComponent as ComponentType<{ error: Error; state: string }>}
      state={String(currentState)}
    >
      {content}
    </StateRouterErrorBoundary>
  ) : (
    content
  );

  // Transition wrapper
  if (transitions && previousState) {
    return (
      <StateTransition transition={transition} duration={transitionDuration}>
        {wrappedContent}
      </StateTransition>
    );
  }

  return wrappedContent;
}
