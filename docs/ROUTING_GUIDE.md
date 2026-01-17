# 🚀 Router System - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Configuration](#configuration)
5. [Route Types](#route-types)
6. [Usage Examples](#usage-examples)
7. [Stateful Routing](#stateful-routing)
8. [Development Tools](#development-tools)
9. [Best Practices](#best-practices)
10. [Migration Guide](#migration-guide)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**Router System** - это единая, масштабируемая система маршрутизации с идеальной архитектурой, автоматической генерацией и 100% типобезопасностью.

### ✨ Key Features

- **🔄 Auto-generated ROUTES** - создаются из конфигурации без дублирования
- **🎯 Type Safety** - строгая типизация без `any`
- **📦 Single Source of Truth** - одна конфигурация для всего роутинга
- **🏗️ Clean Architecture** - разделение конфигурации и имплементации
- **🔧 Developer Experience** - интуитивный API и утилиты
- **⚡ Performance** - оптимизированная генерация и кеширование

---

## 🏗️ Architecture

### 📁 File Structure

```
src/shared/
├── config/
│   ├── router-config.ts       # Декларативная конфигурация маршрутов
│   └── router-config-base.ts   # Базовые константы (примитивы)
└── lib/router/
    ├── config-types.ts         # TypeScript типы
    ├── generators.ts           # Генератор ROUTES и утилит
    ├── navigation.ts           # Композиционный хук навигации
    ├── use-generated-navigation.ts  # Генерация базовых функций
    ├── dev-utils.ts           # Developer утилиты
    ├── validation.ts          # Runtime валидация
    └── index.ts               # Единая точка экспорта
```

### 🎯 Design Principles

1. **Configuration First** - декларативный подход в `router-config.ts`
2. **Auto Generation** - ROUTES генерируется автоматически
3. **Type Safety** - строгая типизация на всех уровнях
4. **Separation of Concerns** - чистое разделение конфигурации и логики
5. **Zero Duplication** - elimination дублирования констант

---

## 🚀 Quick Start

### Basic Usage

```typescript
import { ROUTES, useNavigation } from '@/shared/lib/router';

// Использование констант
ROUTES.HOME;           // '/'
ROUTES.TODOS;          // '/todos'
ROUTES.TODO_DETAIL('123'); // '/todos/123'

// Навигационные функции
function MyComponent() {
  const { navigateToTodos, navigateToTodoDetail } = useNavigation();

  return (
    <nav>
      <button onClick={navigateToTodos}>Todos</button>
      <button onClick={() => navigateToTodoDetail('123')}>Todo Detail</button>
    </nav>
  );
}
```

### Advanced Navigation

```typescript
import { useNavigation } from '@/shared/lib/router';

function NavigationComponent() {
  const {
    navigateTo,
    navigateToTodos,
    navigateToTodoDetail,
    navigateToWorkspaceDashboard
  } = useNavigation();

  return (
    <div>
      <button onClick={navigateToTodos}>Todos</button>
      <button onClick={() => navigateToTodoDetail('123')}>Detail</button>
      <button onClick={() => navigateToWorkspaceDashboard('ws-1')}>Workspace</button>
    </div>
  );
}
```

---

## ⚙️ Configuration

### 🎯 Router Config Structure

```typescript
// src/shared/config/router-config.ts
export const routeConfigData = {
  home: {
    path: BASE_PATHS.HOME,
    public: true,
    metadata: { title: 'Home', description: 'Welcome' },
    navigation: { label: 'Home', order: 0 },
    header: { type: 'static', descriptor: { title: 'Home' } },
  },
  todos: {
    path: BASE_PATHS.TODOS,
    protected: true,
    navigation: {
      label: 'Todos',
      order: 1,
      level: 'section',
    },
  },
} as const satisfies Record<string, RouteConfig>;
```

### 🔧 Base Paths

```typescript
// src/shared/config/router-config-base.ts
export const BASE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  ABOUT: '/about',
  TODOS: '/todos',
  TRACKER: '/tracker',
  TRACKER_SELECT: '/tracker/select',
  TRACKER_MANAGE: '/tracker/manage',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const DYNAMIC_PATH_TEMPLATES = {
  TODO_DETAIL: '/todos/:id',
  TODO_EDIT: '/todos/:id/edit',
  WORKSPACE_DASHBOARD: '/tracker/:id',
  WORKSPACE_TIME_ENTRY: '/tracker/:id/time-entry',
  WORKSPACE_REPORTS: '/tracker/:id/reports',
  WORKSPACE_PROJECTS: '/tracker/:id/projects',
} as const;
```

---

## 🛣️ Route Types

### 📍 Static Routes

```typescript
// Автоматически генерируются из BASE_PATHS
ROUTES.HOME; // '/'
ROUTES.TODOS; // '/todos'
ROUTES.TRACKER; // '/tracker'
ROUTES.SETTINGS; // '/settings'
```

### 🔄 Dynamic Routes

```typescript
// Автоматически генерируются из DYNAMIC_PATH_TEMPLATES
ROUTES.TODO_DETAIL('123'); // '/todos/123'
ROUTES.TODO_EDIT('456'); // '/todos/456/edit'
ROUTES.WORKSPACE_DASHBOARD('ws-1'); // '/tracker/ws-1'
ROUTES.WORKSPACE_REPORTS('ws-1'); // '/tracker/ws-1/reports'
```

### 🎯 Navigation Functions

```typescript
// Все функции генерируются автоматически
const {
  toHome,
  navigateToTodos,
  navigateToTodoDetail,
  navigateToWorkspaceDashboard,
  navigateToWorkspaceReports,
} = useNavigation();
```

---

## 💡 Usage Examples

### 📱 Component Navigation

```typescript
import { useNavigation } from '@/shared/lib/router';

function TodoList() {
  const { navigateToTodos, navigateToTodoDetail, navigateToTodoEdit } = useNavigation();

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={navigateToTodos}>Refresh</button>

      {todos.map(todo => (
        <div key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => navigateToTodoDetail(todo.id)}>View</button>
          <button onClick={() => navigateToTodoEdit(todo.id)}>Edit</button>
        </div>
      ))}
    </div>
  );
}
```

### 🏢 Workspace Navigation

```typescript
function WorkspaceNavigation() {
  const {
    toTracker,
    navigateToWorkspaceSelect,
    navigateToWorkspaceManage,
    navigateToWorkspaceDashboard
  } = useNavigation();

  return (
    <nav>
      <button onClick={toTracker}>Workspaces</button>
      <button onClick={navigateToWorkspaceSelect}>Select Workspace</button>
      <button onClick={navigateToWorkspaceManage}>Manage Workspaces</button>
      <button onClick={() => navigateToWorkspaceDashboard('workspace-1')}>
        Dashboard
      </button>
    </nav>
  );
}
```

### 🔗 Link Components

```typescript
import Link from 'next/link';
import { ROUTES } from '@/shared/lib/router';

function NavigationLinks() {
  return (
    <nav>
      <Link href={ROUTES.HOME}>Home</Link>
      <Link href={ROUTES.TODOS}>Todos</Link>
      <Link href={ROUTES.TRACKER}>Tracker</Link>
      <Link href={ROUTES.PROFILE}>Profile</Link>
      <Link href={ROUTES.SETTINGS}>Settings</Link>
    </nav>
  );
}
```

---

## 🔄 Stateful Routing

### 📊 Stateful Route Configuration

```typescript
export const statefulRouteConfigData = {
  workspace: {
    path: BASE_PATHS.TRACKER,
    protected: true,
    navigation: { label: 'Tracker', level: 'section' },
    states: {
      loading: {
        key: 'loading',
        metadata: () => ({ title: 'Loading...' }),
        header: { type: 'static', descriptor: { title: 'Loading...' } },
      },
      select: {
        key: 'select',
        urlPattern: BASE_PATHS.TRACKER_SELECT,
        metadata: () => ({ title: 'Select Workspace' }),
      },
      dashboard: {
        key: 'dashboard',
        urlPattern: '/workspace/:id',
        metadata: (data) => ({ title: data.name }),
      },
    },
    defaultState: 'loading',
    syncWithUrl: false,
  },
} as const satisfies Record<string, StatefulRouteConfig>;
```

### 🎯 Stateful Usage

```typescript
import { useWorkspaceStateful } from '@/entities/workspace';

function WorkspacePage() {
  const { state, currentState, availableStates, navigateToState } = useWorkspaceStateful();

  return (
    <div>
      <h1>Workspace: {currentState}</h1>

      <div>
        {availableStates.map(state => (
          <button
            key={state.key}
            onClick={() => navigateToState(state.key)}
          >
            {state.label}
          </button>
        ))}
      </div>

      {/* State-specific content */}
      {currentState === 'loading' && <div>Loading...</div>}
      {currentState === 'select' && <WorkspaceSelector />}
      {currentState === 'dashboard' && <WorkspaceDashboard />}
    </div>
  );
}
```

---

## 🛠️ Development Tools

### 🔍 Debug Utilities

```typescript
import { debugRouting, createRouteTester, devShortcuts } from '@/shared/lib/router';

// Полная диагностика системы
debugRouting();
// Output: {
//   routes: { HOME: '/', TODOS: '/todos', ... },
//   navigation: [...],
//   protected: [...],
//   validation: '✅ Valid'
// }

// Тестирование маршрутов
const tester = createRouteTester();
tester.test('/todos/123'); // ✅ Valid dynamic route
tester.test('/invalid/path'); // ❌ Invalid route

// Dev shortcuts в консоли
(window as any).router = devShortcuts;
router.debug(); // Отладка в консоли
router.test('/todos/123'); // Тест маршрута
```

### 🧪 Route Testing

```typescript
import { isProtectedPath, requiresAuth, getRouteInfo } from '@/shared/lib/router';

// Проверка защиты маршрутов
isProtectedPath('/todos'); // true
isProtectedPath('/login'); // false
requiresAuth('/profile'); // true

// Информация о маршруте
const info = getRouteInfo('TODOS');
// Returns: { path: '/todos', protected: true, navigation: {...} }
```

### 🔧 Development Commands

```bash
# Проверка конфигурации роутинга
npm run debug:routing

# Валидация типов
npx tsc --noEmit

# Тесты роутинга
npm test -- src/shared/lib/router

# Линтинг
npm run lint:fix
```

---

## 🏆 Best Practices

### ✅ DO

```typescript
// ✅ Используйте генерируемые функции
const { navigateToTodos } = useNavigation();

// ✅ Используйте константы ROUTES
<Link href={ROUTES.TODO_DETAIL(todo.id)}>View</Link>

// ✅ Добавляйте навигационную конфигурацию
navigation: {
  label: 'Todos',
  order: 1,
  level: 'section'
}

// ✅ Используйте типизацию
type RouteKey = keyof typeof ROUTES;
```

### ❌ DON'T

```typescript
// ❌ Не используйте строковые литералы
router.push('/todos'); // Вместо этого используйте navigateToTodos()

// ❌ Не дублируйте пути
const TODO_PATH = '/todos'; // Вместо этого используйте ROUTES.TODOS

// ❌ Не игнорируйте типизацию
const path = '/todos' as any; // Плохая практика

// ❌ Не создавайте функции вручную
const navigateToTodos = () => router.push('/todos'); // Уже генерируется
```

### 🎯 Configuration Guidelines

1. **Описывайте маршруты в `router-config.ts`**
2. **Используйте `BASE_PATHS` для статических путей**
3. **Используйте `DYNAMIC_PATH_TEMPLATES` для динамических**
4. **Добавляйте `navigation` конфигурацию для UI элементов**
5. **Указывайте `level: 'section'` для основных разделов**

---

## 🔄 Migration Guide

### ➕ Adding New Routes

1. **Добавьте базовый путь (если статический):**

```typescript
// router-config-base.ts
export const BASE_PATHS = {
  // ...existing paths
  NEW_PAGE: '/new-page',
} as const;
```

2. **Добавьте конфигурацию маршрута:**

```typescript
// router-config.ts
export const routeConfigData = {
  // ...existing routes
  newPage: {
    path: BASE_PATHS.NEW_PAGE,
    protected: true,
    navigation: { label: 'New Page', order: 4 },
  },
} as const;
```

3. **Используйте в коде:**

```typescript
// Автоматически доступно
ROUTES.NEW_PAGE;
const { navigateToNewPage } = useNavigation();
```

### ➕ Adding Dynamic Routes

1. **Добавьте шаблон:**

```typescript
// router-config-base.ts
export const DYNAMIC_PATH_TEMPLATES = {
  // ...existing templates
  NEW_DETAIL: '/new-page/:id',
} as const;
```

2. **Добавьте в генератор:**

```typescript
// generators.ts
export const ROUTES = {
  // ...existing routes
  NEW_DETAIL: (id: string) => DYNAMIC_PATH_TEMPLATES.NEW_DETAIL.replace(':id', id),
} as const;
```

3. **Используйте в коде:**

```typescript
ROUTES.NEW_DETAIL('123');
const { navigateToNewDetail } = useNavigation();
```

---

## 🐛 Troubleshooting

### 🔍 Common Issues

#### **TypeScript Errors**

```typescript
// ❌ Property 'navigateToNewPage' does not exist
// Решение: Убедитесь, что маршрут добавлен в конфигурацию

// ❌ Cannot find module '@/shared/lib/router'
// Решение: Проверьте путь импорта и tsconfig.json
```

#### **Route Not Working**

```typescript
// ❌ navigateToNewPage() не работает
// Решение:
// 1. Проверьте конфигурацию в router-config.ts
// 2. Убедитесь, что BASE_PATHS содержит путь
// 3. Проверьте, что компонент использует useNavigation()
```

#### **Navigation Not Showing**

```typescript
// ❌ Кнопка не появляется в меню
// Решение: Добавьте navigation конфигурацию
navigation: {
  label: 'Page Name',
  order: 5,
  hideWhenAuthenticated: false
}
```

### 🛠️ Debug Steps

1. **Проверьте конфигурацию:**

```typescript
import { debugRouting } from '@/shared/lib/router';
debugRouting(); // Показывает всю конфигурацию
```

2. **Проверьте типы:**

```bash
npx tsc --noEmit --skipLibCheck
```

3. **Проверьте генерацию:**

```typescript
console.log(ROUTES); // Показывает все доступные маршруты
```

4. **Проверьте импорты:**

```typescript
import { ROUTES, useNavigation } from '@/shared/lib/router';
// Убедитесь, что импорты правильные
```

---

## 📚 Additional Resources

### 📁 Related Files

- `src/shared/config/router-config.ts` - Основная конфигурация
- `src/shared/config/router-config-base.ts` - Базовые константы
- `src/shared/lib/router/generators.ts` - Генератор ROUTES
- `src/shared/lib/router/dev-utils.ts` - Developer утилиты

### 🧪 Testing

```bash
# Запустить тесты роутинга
npm test -- src/shared/lib/router

# Отладка роутинга
npm run debug:routing
```

### 🚀 Performance Tips

- ROUTES генерируются один раз при импорте
- Навигационные функции мемоизированы
- Валидация кешируется в development
- Use generated functions instead of string literals

---

## 🎉 Summary

Router System предоставляет:

- ✅ **Чистую архитектуру** с автоматической генерацией
- ✅ **100% типобезопасность** без runtime ошибок
- ✅ **Простой API** для навигации
- ✅ **Мощные developer tools** для отладки
- ✅ **Масштабируемую конфигурацию** для роста приложения

**Начните с `router-config.ts` и используйте `useNavigation()` в компонентах!** 🚀
