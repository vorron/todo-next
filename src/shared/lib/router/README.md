# 🚀 Router System - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Core Concepts](#core-concepts)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)
7. [Advanced Features](#advanced-features)
8. [Developer Experience](#developer-experience)
9. [Best Practices](#best-practices)
10. [Migration Guide](#migration-guide)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**Router System** - это единая система маршрутизации с идеальной архитектурой, поддержкой Stateful Routing и 100% типобезопасностью.

### ✨ Key Features

- **Static Routes** - традиционные Next.js маршруты
- **Dynamic Routes** - маршруты с параметрами (`/todos/:id`)
- **Stateful Routes** - client-side навигация с URL синхронизацией
- **Type Safety** - строгая типизация на всех уровнях
- **Auto-generation** - автоматическая генерация утилит из конфигурации
- **Validation** - runtime валидация с кешированием
- **Developer Experience** - интуитивный API и утилиты

---

## 🏗️ Architecture

### 🎯 Design Principles

#### ✅ Single Responsibility

- `router-config.ts` - только данные конфигурации
- `generators.ts` - только генерация утилит
- `utils.ts` - только переиспользуемая логика
- `validation.ts` - только валидация
- `dev-utils.ts` - только development утилиты

#### ✅ Separation of Concerns

- **Configuration vs Logic**: Данные в `shared/config`, логика в `shared/lib`
- **Project-specific vs Reusable**: Специфичное в config, общее в lib
- **Static vs Dynamic**: Разделение статических и динамических сущностей

#### ✅ FSD Architecture

```
shared/
├── config/           # Глобальная конфигурация приложения
└── lib/router/       # Переиспользуемая библиотека роутера
```

---

## 📁 File Structure

```
src/shared/
├── config/
│   └── router-config.ts      # 🗂️ Единственная конфигурация маршрутов
└── lib/router/
    ├── config-types.ts        # 📝 Все TypeScript типы
    ├── generators.ts          # ⚙️ Автоматическая генерация утилит
    ├── utils.ts               # 🛠️ Переиспользуемые утилиты
    ├── guards.ts              # 🛡️ Guards для защиты маршрутов
    ├── validation.ts          # ✅ Runtime валидация с кешированием
    ├── dev-utils.ts           # 🔧 Development утилиты
    ├── index.ts               # 📤 Единый публичный API
    └── COMPLETE_GUIDE.md       # 📚 Эта документация
```

### 📖 File Responsibilities

| File               | Responsibility                                    | Key Exports                                            |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------ |
| `router-config.ts` | **Единственный источник правды** для конфигурации | `ROUTES`, `routeConfigData`, `statefulRouteConfigData` |
| `config-types.ts`  | Все TypeScript типы                               | `RouteConfig`, `StatefulRouteConfig`, guards           |
| `generators.ts`    | Автоматическая генерация утилит                   | `paths`, `navigationConfig`, `protectedPatterns`       |
| `utils.ts`         | Переиспользуемая логика                           | `createDynamicPath`, `createBreadcrumbs`               |
| `guards.ts`        | Защита маршрутов                                  | `createAuthGuard`, `isProtectedPath`                   |
| `validation.ts`    | Валидация конфигурации                            | `validateRouteConfig`, `validateConfigInDev`           |
| `dev-utils.ts`     | Development утилиты                               | `debugRouting`, `findRouteByPath`                      |
| `index.ts`         | Публичный API                                     | Все экспорты в одном месте                             |

---

## 🧠 Core Concepts

### 🔄 Route Types

#### 1. Static Routes

Традиционные маршруты без параметров:

```typescript
home: { path: '/', public: true }
login: { path: '/login', public: true }
```

#### 2. Dynamic Routes

Маршруты с параметрами:

```typescript
todoDetail: { path: '/todos/:id', protected: true }
```

#### 3. Stateful Routes ⭐

Маршруты с несколькими состояниями и URL синхронизацией:

```typescript
workspace: {
  path: '/workspace',
  states: {
    loading: { key: 'loading' },
    create: { key: 'create', urlPattern: '/workspace/create' },
    dashboard: { key: 'dashboard', urlPattern: '/workspace/:id' }
  }
}
```

### 🛡️ Protection Levels

```typescript
// Public routes
{ path: '/', public: true }

// Protected routes
{ path: '/todos', protected: true }

// Stateful protected routes
{ path: '/workspace', protected: true, states: {...} }
```

---

## ⚙️ Configuration

### 📍 Единственный источник правды

**Всегда изменяйте только `shared/config/router-config.ts`**

```typescript
// ✅ ПРАВИЛЬНО: Изменение в router-config.ts
export const routeConfigData = {
  newRoute: {
    path: '/new-route',
    protected: true,
    metadata: { title: 'New Route' } satisfies Metadata,
    navigation: { label: 'New Route', order: 5 },
  },
} as const satisfies Record<string, RouteConfig>;

// ❌ НЕПРАВИЛЬНО: Изменение в других файлах
```

### 🔧 Добавление нового статического маршрута

```typescript
// В shared/config/router-config.ts:
newRoute: {
  path: '/new-route' as const,
  protected: true,
  metadata: {
    title: 'New Route',
    description: 'Description for new route'
  } satisfies Metadata,
  navigation: {
    label: 'New Route',
    order: 5,
    hideWhenAuthenticated?: boolean, // опционально
  },
  header: {
    type: 'static' as const,
    descriptor: {
      title: 'New Route',
      breadcrumbs: [
        { href: '/', label: 'Home' },
        { href: '/new-route', label: 'New Route' }
      ]
    }
  },
} satisfies RouteConfig,
```

### 🔄 Добавление Stateful маршрута

```typescript
// В shared/config/router-config.ts:
export const statefulRouteConfigData = {
  workspace: {
    path: '/workspace',
    protected: true,
    metadata: { title: 'Workspace' } satisfies Metadata,
    navigation: { label: 'Workspaces', order: 2 },
    states: {
      loading: {
        key: 'loading',
        metadata: () => ({ title: 'Loading...' }) satisfies Metadata,
      },
      create: {
        key: 'create',
        urlPattern: '/workspace/create', // опциональный URL
        metadata: () => ({ title: 'Create Workspace' }) satisfies Metadata,
      },
      dashboard: {
        key: 'dashboard',
        urlPattern: '/workspace/:id',
        metadata: (data: { workspaceId: string }) =>
          ({
            title: `Workspace ${data.workspaceId}`,
          }) satisfies Metadata,
      },
    },
    defaultState: 'loading' as const,
    syncWithUrl: true, // синхронизация с URL
    fallbackState: 'loading' as const,
  } as const satisfies StatefulRouteConfig<{
    loading: {};
    create: {};
    dashboard: { workspaceId: string };
  }>,
} as const;
```

### 📊 Порядок навигации

```typescript
navigation: {
  order: 1,  // 0-9: Основная навигация
  order: 15, // 10-19: Второстепенные элементы
  order: 25, // 20-29: Административные функции
}
```

---

## 💡 Usage Examples

### 🚀 Базовое использование

```typescript
import { ROUTES, paths, dynamicPaths } from '@/shared/lib/router';

// Статические пути
paths.home; // '/'
paths.todos; // '/todos'

// Динамические пути
dynamicPaths.todoDetail('123'); // '/todos/123'
dynamicPaths.todoEdit('123'); // '/todos/123/edit'

// Прямые константы
ROUTES.HOME; // '/'
ROUTES.TODOS; // '/todos'
ROUTES.TODO_DETAIL('123'); // '/todos/123'
```

### 🔄 Stateful Routing

```typescript
import {
  statefulRoutes,
  statefulRouteConfigData,
  getStateFromUrl,
  getUrlForState,
} from '@/shared/lib/router';

// Stateful пути
const workspaceRoutes = statefulRoutes.workspace;
workspaceRoutes.getStatePath('dashboard', { workspaceId: '123' }); // '/workspace/123'

// URL синхронизация
const { state, data } = getStateFromUrl(statefulRouteConfigData.workspace, '/workspace/123');
// { state: 'dashboard', data: { workspaceId: '123' } }

// Генерация URL для состояния
const url = getUrlForState(statefulRouteConfigData.workspace, 'dashboard', { workspaceId: '123' });
// '/workspace/123'
```

### 🛡️ Guards и защита

```typescript
import {
  isPublicPath,
  isProtectedPath,
  requiresAuth,
  protectedPatterns,
  publicPaths,
  protectedPaths,
} from '@/shared/lib/router';

// Проверки маршрутов
if (isProtectedPath('/todos')) {
  // Требуется авторизация
}

if (isPublicPath('/login')) {
  // Публичный маршрут
}

// Sets для удобной проверки
protectedPaths.has('/todos'); // true
publicPaths.has('/login'); // true
protectedPatterns.includes('/todos/:id'); // true
```

### 🧭 Навигация

```typescript
import {
  mainNavigation,
  navigationConfig,
  statefulNavigationConfig,
  getProtectedRoutes,
  getPublicRoutes,
} from '@/shared/lib/router';

// Отсортированная навигация (включая stateful)
const nav = mainNavigation.filter((item) => !item.hideWhenAuthenticated);

// Анализ маршрутов
const protected = getProtectedRoutes();
const public = getPublicRoutes();

// Stateful навигация
const workspaceNav = statefulNavigationConfig.workspace;
console.log(workspaceNav.states); // { loading, create, select, dashboard }
```

### 📝 Metadata и Headers

```typescript
import {
  metadataConfig,
  statefulMetadataConfig,
  headerTemplates,
  getRouteMetadata,
  createBreadcrumbs,
} from '@/shared/lib/router';

// Metadata для маршрута
const meta = metadataConfig['/todos'];
// { title: 'Todos - Todo App', description: '...' }

// Stateful metadata
const workspaceMeta = statefulMetadataConfig.workspace;
// { base: {...}, states: {...} }

// Headers
const header = headerTemplates.todos;
// { type: 'static', descriptor: {...} }

// Breadcrumbs
const breadcrumbs = createBreadcrumbs('/todos/123', 'Todo Title');
// [{ href: '/', label: 'Home' }, { href: '/todos', label: 'Todos' }, { href: '#', label: 'Todo Title' }]
```

---

## 🔥 Advanced Features

### 🔄 Stateful Routing Deep Dive

#### Когда использовать Stateful Routing:

✅ **Идеально для:**

- Dashboard приложения с несколькими view
- Master-detail интерфейсы
- Multi-step формы
- Workspace приложения
- Complex state management

❌ **Не использовать для:**

- Простых статических страниц
- Content-focused сайты
- SEO критичные страницы

#### Паттерны использования:

```typescript
// 1. Определите состояния в конфигурации
states: {
  loading: { key: 'loading' },
  list: { key: 'list', urlPattern: '/workspace/list' },
  detail: { key: 'detail', urlPattern: '/workspace/:id' },
  edit: { key: 'edit', urlPattern: '/workspace/:id/edit' }
}

// 2. Используйте в компонентах
const { state, availableStates, config } = useWorkspaceStateful();

// 3. Навигация между состояниями
const navigate = useWorkspaceNavigation();
navigate.navigateTo('detail', { workspaceId: '123' });

// 4. URL синхронизация
useEffect(() => {
  const { state, data } = getStateFromUrl(config, pathname);
  setCurrentState(state);
  setData(data);
}, [pathname]);
```

### 🔍 Development Utilities

```typescript
import {
  debugRouting,
  findRouteByPath,
  getRouteInfo,
  createPathGenerator,
  createRouteTester,
  devShortcuts,
} from '@/shared/lib/router';

// 🔍 Отладка всей системы
debugRouting();
// Выводит полную статистику и валидацию

// 🔍 Поиск маршрута по пути
const routeKey = findRouteByPath('/todos/123');
if (routeKey) {
  const info = getRouteInfo(routeKey);
  console.log(info); // { path, key, navigation, isStateful }
}

// 🛠️ Генератор путей
const paths = createPathGenerator();
paths.dynamic.todoDetail('123'); // '/todos/123'
paths.stateful.workspaceCreate; // '/workspace/create'

// 🧪 Тестирование роутов
const tester = createRouteTester();
const result = tester.test('/todos');
console.log(result); // { found: true, path: '/todos', key: 'todos', info: {...} }

// ⌨️ Dev shortcuts (в консоли)
window.router = devShortcuts;
router.debug(); // Отладочная информация
router.routes(); // Все маршруты в виде таблицы
router.validate(); // Валидация конфигурации
```

### ✅ Валидация и ошибки

```typescript
import {
  validateRouteConfig,
  validateConfigInDev,
  clearValidationCache,
} from '@/shared/lib/router';

// Ручная валидация
const validation = validateRouteConfig();
if (!validation.isValid) {
  console.error('❌ Errors:', validation.errors);
  // Duplicate paths found: /workspace (workspace vs workspace)
  // Stateful route workspace.dashboard urlPattern conflicts with existing route
  // Route home missing required metadata.title
}

// Автоматическая валидация в development
validateConfigInDev(); // Вызывается автоматически при импорте

// Очистка кеша (для тестов)
clearValidationCache();
```

---

## 🎨 Developer Experience

### 🚀 Улучшения для разработки

#### Type Guards

```typescript
import { hasNavigation, hasMetadata, isProtectedRoute } from '@/shared/lib/router';

if (hasNavigation(config)) {
  // TypeScript знает что config.navigation существует
  console.log(config.navigation.label);
}

if (hasMetadata(stateConfig)) {
  // TypeScript знает что stateConfig.metadata - функция
  const meta = stateConfig.metadata(data);
}

if (isProtectedRoute(routeConfig)) {
  // TypeScript знает что route защищен
  // routeConfig.protected === true
}
```

#### Строгая типизация

```typescript
// Автоматически сгенерированные типы
type StrictRouteKey = keyof typeof routeConfigData;
type StrictDynamicRouteKey = keyof typeof dynamicRouteConfigData;
type StrictStatefulRouteKey = keyof typeof statefulRouteConfigData;

// Использование в коде
const routeKey: StrictRouteKey = 'home'; // ✅ Только валидные ключи
const dynamicKey: StrictDynamicRouteKey = 'todoDetail'; // ✅
```

#### IntelliSense поддержка

```typescript
// Полное автодополнение для всех сущностей
ROUTES. // autocomplete: HOME, LOGIN, ABOUT, TODOS, WORKSPACE, etc.
paths.  // autocomplete: home, login, about, todos, etc.
mainNavigation. // autocomplete со всеми свойствами
```

---

## 📚 Best Practices

### 🎯 Общие принципы

1. **Единый источник правды**

   ```typescript
   // ✅ Всегда изменяйте только router-config.ts
   // ❌ Не изменяйте сгенерированные файлы
   ```

2. **Порядок навигации**

   ```typescript
   navigation: {
     order: 1,  // 0-9: Основная навигация
     order: 15, // 10-19: Второстепенные
     order: 25, // 20-29: Административные
   }
   ```

3. **Защита маршрутов**

   ```typescript
   // ✅ Используйте protected/public явно
   { path: '/todos', protected: true }
   { path: '/login', public: true }
   ```

4. **Stateful маршруты**
   ```typescript
   // ✅ Определяйте urlPattern для bookmarkability
   states: {
     detail: { key: 'detail', urlPattern: '/workspace/:id' }
   }
   ```

### 🔧 Конфигурация

```typescript
// ✅ ПРАВИЛЬНО: Полная конфигурация
newRoute: {
  path: '/new-route' as const,
  protected: true,
  metadata: {
    title: 'New Route',
    description: 'Complete description'
  } satisfies Metadata,
  navigation: {
    label: 'New Route',
    order: 5,
  },
  header: {
    type: 'static' as const,
    descriptor: {
      title: 'New Route',
      breadcrumbs: [
        { href: '/', label: 'Home' },
        { href: '/new-route', label: 'New Route' }
      ]
    }
  },
} satisfies RouteConfig,
```

### 🧪 Тестирование

```typescript
// ✅ Используйте утилиты для тестов
import { createRouteTester, clearValidationCache } from '@/shared/lib/router';

describe('Router', () => {
  beforeEach(() => {
    clearValidationCache(); // Очистка кеша валидации
  });

  it('should validate routes', () => {
    const tester = createRouteTester();
    const result = tester.test('/todos');
    expect(result.found).toBe(true);
  });
});
```

### 🚀 Performance

```typescript
// ✅ Используйте кешированную валидацию
validateRouteConfig(); // Кешируется после первого вызова

// ✅ Используйте Set для проверок
protectedPaths.has('/todos'); // O(1) вместо O(n)

// ✅ Используйте готовые утилиты
createBreadcrumbs(path, title); // Оптимизированная реализация
```

---

## 🔄 Migration Guide

### 📋 Из старой архитектуры

```bash
# Было (старая структура):
src/shared/lib/router/data.ts
src/shared/lib/router/types.ts
src/shared/lib/router/utils.ts

# Стало (новая структура):
src/shared/config/router-config.ts     # Конфигурация
src/shared/lib/router/config-types.ts  # Все типы
src/shared/lib/router/generators.ts    # Генераторы
src/shared/lib/router/validation.ts    # Валидация
src/shared/lib/router/dev-utils.ts     # DX утилиты
```

### 🔄 Обновление импортов

```typescript
// Старые импорты (продолжают работать)
import { routeConfig } from '@/shared/lib/router';

// Новые импорты (рекомендуется)
import {
  routeConfig,
  paths,
  dynamicPaths,
  statefulRoutes,
  mainNavigation,
} from '@/shared/lib/router';

// Stateful импорты (новые возможности)
import { statefulRouteConfigData, getStateFromUrl, getUrlForState } from '@/shared/lib/router';
```

### 🔄 Migration на Stateful Routing

```typescript
// Было (только client-side):
const [currentState, setCurrentState] = useState('loading');
const navigate = (state: string) => {
  setCurrentState(state);
};

// Стало (с URL синхронизацией):
const { state, availableStates, config } = useWorkspaceStateful(window.location.pathname);
const navigate = useWorkspaceNavigation();
navigate.navigateTo('detail', { workspaceId: '123' }); // Автоматически обновит URL
```

---

## 🐛 Troubleshooting

### 🔍 Распространенные проблемы

#### 1. Дубликаты путей

```
❌ Duplicate paths found: /workspace (workspace vs workspace)
```

**Решение:** Удалите дубликат из `routeConfigData`, оставьте только в `statefulRouteConfigData`

#### 2. Отсутствует metadata

```
❌ Route home missing required metadata.title
```

**Решение:** Добавьте `title` в metadata конфигурации

#### 3. Нарушен порядок навигации

```
❌ Duplicate navigation orders found
```

**Решение:** Используйте уникальные `order` значения для видимых маршрутов

#### 4. Stateful маршрут не работает

```
❌ Stateful route workspace.dashboard urlPattern conflicts with existing route
```

**Решение:** Измените `urlPattern` или удалите конфликтующий маршрут

### 🔧 Debug инструменты

```typescript
// 🔍 Полная диагностика
import { debugRouting } from '@/shared/lib/router';
debugRouting();

// 🧪 Тестирование конкретного маршрута
import { createRouteTester } from '@/shared/lib/router';
const tester = createRouteTester();
console.log(tester.test('/problematic-route'));

// ✅ Валидация конфигурации
import { validateRouteConfig, clearValidationCache } from '@/shared/lib/router';
clearValidationCache(); // Сброс кеша
const validation = validateRouteConfig();
if (!validation.isValid) {
  console.table(validation.errors);
}
```

### 📞 Получение помощи

1. **Проверьте валидацию:** `debugRouting()`
2. **Изучите конфигурацию:** `shared/config/router-config.ts`
3. **Используйте типы:** `StrictRouteKey`, `StrictDynamicRouteKey`
4. **Тестируйте:** `createRouteTester()`

---

## 🎉 Summary

### ✅ Что мы имеем:

- **🏗️ Идеальную архитектуру** с четким разделением ответственности
- **🔄 Stateful Routing** с URL синхронизацией
- **🛡️ 100% Type Safety** без компромиссов
- **⚡ Высокую производительность** с кешированием
- **🔧 Лучший DX** с интуитивными утилитами
- **📚 Полную документацию** в одном файле

### 🚀 Готово к использованию:

```typescript
// Простое начало
import { ROUTES, isProtectedPath } from '@/shared/lib/router';

// Продвинутое использование
import { statefulRoutes, debugRouting } from '@/shared/lib/router';

// Enterprise возможности
import { validateRouteConfig, createRouteTester } from '@/shared/lib/router';
```

**🎯 Router System - идеальное решение для масштабируемых Next.js приложений!**

---

_Последнее обновление: January 2026_
_Версия: 2.0 с Stateful Routing и улучшенной типобезопасностью_
