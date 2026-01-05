# Router Development Guide

## 🚀 Улучшения для разработчиков

### Новые утилиты для улучшения DX

#### 1. Отладка роутинга

```typescript
import { debugRouting } from '@/shared/lib/router';

// Показать детальную информацию о всех маршрутах
debugRouting();
```

#### 2. Поиск маршрутов

```typescript
import { findRouteByPath, getRouteInfo } from '@/shared/lib/router';

// Найти маршрут по пути
const routeKey = findRouteByPath('/todos/123');
if (routeKey) {
  const info = getRouteInfo(routeKey);
  console.log(info); // { path, key, navigation, isStateful }
}
```

#### 3. Анализ маршрутов

```typescript
import { getProtectedRoutes, getPublicRoutes } from '@/shared/lib/router';

// Получить все защищенные маршруты
const protected = getProtectedRoutes();
// [{ key: 'todos', path: '/todos', label: 'Todos' }]

// Получить все публичные маршруты
const public = getPublicRoutes();
```

#### 4. Генератор путей

```typescript
import { createPathGenerator } from '@/shared/lib/router';

const paths = createPathGenerator();
paths.dynamic.todoDetail('123'); // '/todos/123'
paths.stateful.workspaceCreate; // '/workspace/create'
```

#### 5. Тестирование роутов

```typescript
import { createRouteTester } from '@/shared/lib/router';

const tester = createRouteTester();
const result = tester.test('/todos');
console.log(result); // { found: true, path: '/todos', key: 'todos', info: {...} }
```

### 🛡️ Улучшенная типобезопасность

#### Type Guards

Добавлены строгие type guards для безопасной типизации:

- `hasNavigation()` - проверка наличия навигации
- `hasMetadata()` - проверка наличия метаданных
- `hasUrlPattern()` - проверка URL паттернов
- `isProtectedRoute()` - проверка защищенных маршрутов

#### Пример использования:

```typescript
import { hasNavigation } from '@/shared/lib/router';

if (hasNavigation(config)) {
  // TypeScript знает что config.navigation существует
  console.log(config.navigation.label);
}
```

### 🔍 Расширенная валидация

#### Новые проверки:

- **Конфликты путей** между всеми типами маршрутов
- **Корректность urlPattern** в stateful маршрутах
- **Обязательные поля** в metadata и header
- **Конфликты urlPattern** с существующими маршрутами

#### Пример ошибок:

```
❌ Duplicate paths found: /workspace (workspace vs workspace)
❌ Stateful route workspace.dashboard urlPattern conflicts with existing route: /workspace/:id
❌ Route home missing required metadata.title
```

### 🎯 Улучшенные Guards

#### Статические защищенные маршруты

Теперь guards включают все защищенные маршруты:

```typescript
// Раньше: только динамические и stateful
// Теперь: все защищенные (статические + динамические + stateful)

import { isProtectedPath } from '@/shared/lib/router';

isProtectedPath('/todos'); // true (статический защищенный)
isProtectedPath('/todos/123'); // true (динамический)
isProtectedPath('/workspace'); // true (stateful)
```

### 🏗️ Архитектурные улучшения

#### Устранение дублирования

- Удален дублирующийся `workspace` из `routeConfigData`
- `workspace` теперь только в `statefulRouteConfigData` с полной конфигурацией состояний

#### Чистая типизация

- Убраны все `eslint-disable-next-line @typescript-eslint/no-explicit-any`
- Используются proper type guards вместо `as any`
- Строгая типизация во всех генераторах

### 🛠️ Development Shortcuts

Для быстрой разработки в консоли:

```typescript
import { devShortcuts } from '@/shared/lib/router';

// Глобальные шорткаты в dev tools
(window as any).router = devShortcuts;

// Использование:
router.debug(); // Отладочная информация
router.routes(); // Все маршруты в виде таблицы
router.navigation(); // Навигация в виде таблицы
router.validate(); // Валидация конфигурации
```

### 📊 Статистика роутинга

`debugRouting()` показывает:

```text
🔍 Router Debug Information
✅ Route configuration is valid
📊 Route Statistics:
- Total routes: 9
- Static routes: 6
- Dynamic routes: 2
- Protected routes: 4
- Public routes: 2
- Stateful routes: 1
  - workspace: 4 states
```

### 🧪 Тестирование

#### Unit тесты improvements:

- Тесты для новых type guards
- Тесты для расширенной валидации
- Тесты для development утилит

#### E2E тестирование:

```typescript
import { createRouteTester } from '@/shared/lib/router';

const tester = createRouteTester();
const allTests = tester.testAll();
// Проверяет все маршруты на корректность
```

### 🔄 Migration Guide

#### Если использовали `as any`:

```typescript
// Раньше:
const label = (config as any).navigation?.label;

// Теперь:
if (hasNavigation(config)) {
  const label = config.navigation.label;
}
```

#### Если relied на workspace duplication:

```typescript
// Раньше (routeConfigData):
workspace: { path: '/workspace', ... }

// Теперь (только statefulRouteConfigData):
workspace: {
  path: '/workspace',
  states: { loading, create, select, dashboard },
  ...
}
```

### 🎉 Результат

- **Type Safety**: 100% без `as any`
- **Validation**: Покрывает все типы маршрутов
- **DX**: Удобные утилиты для разработки
- **Performance**: Кешированная валидация
- **Architecture**: Чистое разделение ответственности
