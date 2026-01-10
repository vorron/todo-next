import type { NavigationConfig, RouteConfig, DynamicRouteConfig } from './config-types';
import type { Metadata } from 'next';

/**
 * Type guards для безопасной типизации роутер конфигураций
 * Переиспользуемые между модулями для избежания дублирования
 */

export function hasNavigation(config: unknown): config is {
  navigation: NavigationConfig;
} {
  return typeof config === 'object' && config !== null && 'navigation' in config;
}

export function hasMetadata(config: unknown): config is {
  metadata: (data?: unknown) => Metadata;
} {
  return (
    typeof config === 'object' &&
    config !== null &&
    'metadata' in config &&
    typeof (config as { metadata?: unknown }).metadata === 'function'
  );
}

export function hasUrlPattern(config: unknown): config is {
  urlPattern: string;
} {
  return (
    typeof config === 'object' &&
    config !== null &&
    'urlPattern' in config &&
    typeof (config as { urlPattern?: unknown }).urlPattern === 'string'
  );
}

export function isProtectedRoute(
  config: RouteConfig | DynamicRouteConfig,
): config is (RouteConfig & { protected: true }) | DynamicRouteConfig {
  return 'protected' in config && config.protected === true;
}
