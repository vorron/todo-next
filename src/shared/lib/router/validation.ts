import { routeConfigData, dynamicRouteConfigData } from './data';

/**
 * Валидация конфигурации маршрутов
 */
export function validateRouteConfig() {
  const errors: string[] = [];

  // Проверка дубликатов путей
  const allPaths = new Set<string>();
  const duplicates: string[] = [];

  Object.entries(routeConfigData).forEach(([, config]) => {
    if (allPaths.has(config.path)) {
      duplicates.push(config.path);
    } else {
      allPaths.add(config.path);
    }
  });

  Object.entries(dynamicRouteConfigData).forEach(([, config]) => {
    if (allPaths.has(config.path)) {
      duplicates.push(config.path);
    } else {
      allPaths.add(config.path);
    }
  });

  if (duplicates.length > 0) {
    errors.push(`Duplicate paths found: ${duplicates.join(', ')}`);
  }

  // Проверка навигационных порядков
  const navigationOrders = Object.entries(routeConfigData)
    .filter(([, config]) => 'navigation' in config && config.navigation)
    .map(([, config]) => (config as { navigation: { order: number } }).navigation.order);

  const uniqueOrders = new Set(navigationOrders);
  if (navigationOrders.length !== uniqueOrders.size) {
    errors.push('Duplicate navigation orders found');
  }

  // Проверка формата динамических путей
  Object.entries(dynamicRouteConfigData).forEach(([routeKey, config]) => {
    if (!config.path.includes(':')) {
      errors.push(`Dynamic route ${routeKey} missing path parameters`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Runtime валидация для development
 */
export function validateConfigInDev() {
  if (process.env.NODE_ENV === 'development') {
    const validation = validateRouteConfig();
    if (!validation.isValid) {
      console.error('Route configuration validation failed:', validation.errors);
    }
  }
}
