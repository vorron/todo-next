import { routeConfigData, dynamicRouteConfigData } from '../../config/router-config';

/**
 * Кеширование результатов валидации для производительности
 */
let validationCache: { isValid: boolean; errors: string[] } | null = null;

/**
 * Валидация конфигурации маршрутов с кешированием
 */
export function validateRouteConfig() {
  // Возвращаем кешированный результат если есть
  if (validationCache !== null) {
    return validationCache;
  }

  const errors: string[] = [];

  // Проверка дубликатов путей
  const allPaths = new Set<string>();
  const duplicates: string[] = [];

  // Объединенная проверка для статических и динамических маршрутов
  [...Object.entries(routeConfigData), ...Object.entries(dynamicRouteConfigData)].forEach(
    ([, config]) => {
      if (allPaths.has(config.path)) {
        duplicates.push(config.path);
      } else {
        allPaths.add(config.path);
      }
    },
  );

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

  validationCache = {
    isValid: errors.length === 0,
    errors,
  };

  return validationCache;
}

/**
 * Runtime валидация для development с кешированием
 */
export function validateConfigInDev() {
  if (process.env.NODE_ENV === 'development') {
    const validation = validateRouteConfig();
    if (!validation.isValid) {
      console.error('❌ Route configuration validation failed:', validation.errors);
      console.log('💡 Fix these issues in shared/config/router-config.ts');
    } else {
      console.log('✅ Route configuration is valid');
    }
  }
}

/**
 * Сброс кеши валидации (для тестов и hot reload)
 */
export function clearValidationCache() {
  validationCache = null;
}
