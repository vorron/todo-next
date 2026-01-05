import type { StatefulRouteConfig } from './config-types';

/**
 * Universal Stateful Routing Utilities
 */

export function getStateKey<T extends string>(
  states: Record<T, unknown>,
  data: {
    isLoading?: boolean;
    items?: unknown[];
    currentItem?: unknown;
  },
  rules?: {
    loading?: T;
    empty?: T;
    single?: T;
    multiple?: T;
  },
): T {
  const {
    loading = 'loading' as T,
    empty = 'empty' as T,
    single = 'single' as T,
    multiple = 'multiple' as T,
  } = rules || {};

  if (data.isLoading) return loading;

  const items = data.items || [];
  if (items.length === 0) return empty;
  if (items.length === 1) return single;

  return multiple;
}

export function getStateTitle<T extends string>(
  stateKey: T,
  currentItem: unknown,
  config: StatefulRouteConfig,
): string {
  const stateConfig = config.states[stateKey as keyof typeof config.states];

  if (!stateConfig) {
    return (config.metadata?.title || 'Unknown') as string;
  }

  if (currentItem && typeof currentItem === 'object' && 'name' in currentItem) {
    return (currentItem as { name: string }).name;
  }

  const metadata = stateConfig.metadata?.();
  return (metadata?.title || config.metadata?.title || 'Unknown') as string;
}

export function getStateBreadcrumbs<T extends string>(
  stateKey: T,
  currentItem: unknown,
  config: StatefulRouteConfig,
): Array<{ href: string; label: string }> {
  const stateConfig = config.states[stateKey as keyof typeof config.states];

  if (!stateConfig?.header) {
    return [{ href: config.path, label: (config.metadata?.title || 'Unknown') as string }];
  }

  if (currentItem && typeof currentItem === 'object' && stateConfig.header.type === 'entity') {
    const entityData = {
      id: (currentItem as { id: string }).id,
      name: (currentItem as { name: string }).name,
      ...currentItem,
    };

    const breadcrumbs = stateConfig.header.build?.(entityData)?.breadcrumbs;
    if (breadcrumbs) {
      return breadcrumbs.map((b) => ({ href: b.href, label: b.label as string }));
    }
  }

  const descriptorBreadcrumbs = stateConfig.header.descriptor?.breadcrumbs;
  if (descriptorBreadcrumbs) {
    return descriptorBreadcrumbs.map((b) => ({ href: b.href, label: b.label as string }));
  }

  return [{ href: config.path, label: (config.metadata?.title || 'Unknown') as string }];
}

export function getStateData<T extends string, D extends Record<string, unknown>>(
  stateKey: T,
  currentItem: unknown,
  rules?: Partial<Record<T, (currentItem: unknown) => D>>,
): D {
  const rule = rules?.[stateKey];
  if (rule && currentItem) {
    return rule(currentItem) as D;
  }

  if (currentItem && typeof currentItem === 'object' && 'id' in currentItem) {
    return {
      entityId: (currentItem as { id: string }).id,
      ...currentItem,
    } as unknown as D;
  }

  return {} as D;
}

export function createStatefulUtils<T extends string, D extends Record<string, unknown>>(
  config: StatefulRouteConfig,
  options?: {
    stateRules?: {
      loading?: T;
      empty?: T;
      single?: T;
      multiple?: T;
    };
    dataRules?: Partial<Record<T, (currentItem: unknown) => D>>;
  },
) {
  return {
    getStateKey: (data: { isLoading?: boolean; items?: unknown[]; currentItem?: unknown }) =>
      getStateKey(config.states as Record<T, unknown>, data, options?.stateRules),

    getStateTitle: (stateKey: T, currentItem: unknown) =>
      getStateTitle(stateKey, currentItem, config),

    getStateBreadcrumbs: (stateKey: T, currentItem: unknown) =>
      getStateBreadcrumbs(stateKey, currentItem, config),

    getStateData: (stateKey: T, currentItem: unknown) =>
      getStateData(stateKey, currentItem, options?.dataRules),
  };
}
