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
  const navigationEntries = Object.entries(routeConfigData).filter(
    ([, config]) => 'navigation' in config && config.navigation,
  );

  const visibleNavigationEntries = navigationEntries.filter(
    ([, config]) =>
      !(config as { navigation: { hideWhenAuthenticated?: boolean } }).navigation
        ?.hideWhenAuthenticated,
  );

  const navigationOrders = visibleNavigationEntries.map(
    ([, config]) => (config as { navigation: { order?: number } }).navigation.order,
  );

  // Проверка что у видимых маршрутов есть order
  const missingOrders = visibleNavigationEntries.filter(
    ([, config]) => (config as { navigation: { order?: number } }).navigation.order === undefined,
  );

  if (missingOrders.length > 0) {
    errors.push(
      `Missing navigation order for visible routes: ${missingOrders.map(([key]) => key).join(', ')}`,
    );
  }

  // Проверка что у скрытых маршрутов нет order
  const hiddenEntriesWithOrder = navigationEntries.filter(
    ([, config]) =>
      (config as { navigation: { hideWhenAuthenticated?: boolean; order?: number } }).navigation
        ?.hideWhenAuthenticated &&
      (config as { navigation: { order?: number } }).navigation.order !== undefined,
  );

  if (hiddenEntriesWithOrder.length > 0) {
    errors.push(
      `Unnecessary navigation order for hidden routes: ${hiddenEntriesWithOrder
        .map(([key]) => key)
        .join(', ')}`,
    );
  }

  // Проверка дубликатов order только для видимых маршрутов
  const definedOrders = navigationOrders.filter((order): order is number => order !== undefined);
  const uniqueOrders = new Set(definedOrders);
  if (definedOrders.length !== uniqueOrders.size) {
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
