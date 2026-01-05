# Router System

🎯 **Единая система маршрутизации с идеальной архитектурой и поддержкой Stateful Routing**

## 📁 Структура

```
shared/
├── config/
│   └── router-config.ts    # 🗂️  Конфигурация маршрутов (проект-специфичная)
└── lib/
    └── router/
        ├── config-types.ts  # 📝 Все TypeScript типы
        ├── generators.ts    # ⚙️  Автоматическая генерация утилит
        ├── stateful-utils.ts # 🔄 Stateful routing утилиты
        ├── config.ts        # 🔄 Единая точка входа (Router API)
        ├── utils.ts         # 🛠️  Переиспользуемые утилиты
        ├── guards.ts        # 🛡️  Guards для маршрутизации
        ├── validation.ts    # ✅ Runtime валидация с кешированием
        ├── index.ts         # 📤 Публичный API
        └── README.md        # 📚 Документация
```

## 🎯 Принципы

### ✅ Single Responsibility

- `router-config.ts` - только данные конфигурации (в shared/config)
- `generators.ts` - только генерация утилит
- `stateful-utils.ts` - только stateful routing логика
- `utils.ts` - только переиспользуемая логика
- `config-types.ts` - все типы в одном месте

### ✅ Separation of Concerns

- Конфигурация отделена от логики
- Данные проекта в shared/config, общая логика в shared/lib
- UI зависит только от абстракций
- Stateful routing интегрирован в существующую систему

### ✅ FSD Architecture

- `shared/config` - глобальная конфигурация приложения
- `shared/lib/router` - переиспользуемая библиотека роутера
- Четкое разделение проектных и общих данных
- Поддержка современных паттернов роутинга

### ✅ Modern Patterns

- **Static Routes** - традиционные Next.js маршруты
- **Dynamic Routes** - маршруты с параметрами
- **Stateful Routes** - client-side навигация с URL синхронизацией
- **Type Safety** - строгая типизация на всех уровнях

## 🚀 Usage

### Базовое использование

```typescript
import { routeConfig, paths, dynamicPaths } from '@/shared/lib/router';

// Статические пути
paths.home; // '/'
paths.todos; // '/todos'

// Динамические пути
dynamicPaths.todoDetail('123'); // '/todos/123'
```

### Stateful Routing (NEW!)

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

### Продвинутое использование

```typescript
import {
  mainNavigation,
  isProtectedPath,
  headerTemplates,
  statefulNavigationConfig,
  validateRouteConfig,
} from '@/shared/lib/router';

// Фильтрованная навигация (включая stateful)
const nav = mainNavigation.filter((item) => !item.hideWhenAuthenticated);

// Guards (включая stateful)
if (isProtectedPath(path)) {
  // redirect to login
}

// Stateful навигация
const workspaceNav = statefulNavigationConfig.workspace;
console.log(workspaceNav.states); // { loading, create, select, dashboard }

// Валидация с кешированием
const validation = validateRouteConfig();
```

## 🔧 Конфигурация

### Добавление нового статического маршрута

```typescript
// В shared/config/router-config.ts добавить:
newRoute: {
  path: '/new-route' as const,
  protected: true,
  metadata: { title: 'New Route' } satisfies Metadata,
  navigation: {
    label: 'New Route',
    order: 5,
    hideWhenAuthenticated?: boolean, // опционально
  },
  header: {
    type: 'static' as const,
    descriptor: { title: 'New Route', breadcrumbs: [...] }
  },
} satisfies RouteConfig,
```

### Добавление Stateful маршрута (NEW!)

```typescript
// В shared/config/router-config.ts добавить:
export const statefulRouteConfigData = {
  workspace: {
    path: '/workspace',
    protected: true,
    metadata: { title: 'Workspace' } satisfies Metadata,
    states: {
      loading: {
        key: 'loading',
        metadata: () => ({ title: 'Loading...' }) satisfies Metadata,
      },
      create: {
        key: 'create',
        urlPattern: '/workspace/create', // опциональный URL
        metadata: () => ({ title: 'Create' }) satisfies Metadata,
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

### Порядок навигации

- 0-9: Основная навигация
- 10-19: Второстепенные элементы
- 20-29: Административные функции

## 🎨 Features

### ✨ Автоматическая генерация

- `paths` - статические пути
- `dynamicPaths` - динамические пути
- `statefulPaths` - stateful пути с состояниями **(NEW!)**
- `statefulRoutes` - stateful маршруты с утилитами **(NEW!)**
- `navigationConfig` - конфигурация навигации
- `statefulNavigationConfig` - stateful навигация **(NEW!)**
- `mainNavigation` - отсортированная навигация (включая stateful)
- `metadataConfig` - метаданные для всех маршрутов
- `statefulMetadataConfig` - stateful метаданные **(NEW!)**
- `protectedPatterns` - regex patterns для динамических маршрутов

### 🔄 Stateful Routing **(NEW!)**

- Client-side навигация с URL синхронизацией
- Поддержка нескольких состояний в одном маршруте
- Автоматическая генерация URL для состояний
- Интеграция с существующей системой
- Type-safe навигация между состояниями
- Поддержка breadcrumb и metadata для состояний

### 🛡️ Guards

- `isPublicPath()` - проверка публичных маршрутов
- `isProtectedPath()` - проверка защищенных маршрутов (включая stateful)
- `requiresAuth()` - комбинированная проверка

### ✅ Валидация с кешированием

- Runtime валидация в development
- Кеширование результатов для производительности
- Проверка дубликатов путей
- Проверка навигационных порядков
- Проверка формата динамических путей
- Валидация stateful конфигураций **(NEW!)**
- `clearValidationCache()` для тестов

### 🎯 Типизация

- Все типы в `config-types.ts`
- Строгая типизация всех конфигураций
- Автоматические типы из данных
- `Strict*` типы для максимальной безопасности
- Stateful типы **(NEW!)**: `StatefulRouteConfig`, `WorkspaceRouteConfig`

## 🔄 Migration Guide

### Старая структура → Новая структура

```bash
# Было:
src/shared/lib/router/data.ts
src/shared/lib/router/types.ts

# Стало:
src/shared/config/router-config.ts  # (переименовано из data.ts)
src/shared/lib/router/config-types.ts  # (объединено с types.ts)
src/shared/lib/router/stateful-utils.ts  # (NEW!)
```

### Обновление импортов

```typescript
// Старые импорты продолжают работать через index.ts
import { routeConfig } from '@/shared/lib/router';

// Новые импорты (опционально)
import { routeConfig } from '@/shared/lib/router/config';

// Stateful импорты (NEW!)
import { statefulRoutes, statefulRouteConfigData, getStateFromUrl } from '@/shared/lib/router';
```

### Migration на Stateful Routing

```typescript
// Было (client-side только):
const [currentState, setCurrentState] = useState('loading');

// Стало (с URL синхронизацией):
const { state, availableStates, config } = useWorkspaceStateful(window.location.pathname);
const navigate = (newState: string, data?: any) => {
  const url = getUrlForState(config, newState, data);
  router.push(url);
};
```

## 📈 Best Practices

1. **Изменяйте только `shared/config/router-config.ts`** для добавления маршрутов
2. **Используйте `order` свойство** для сортировки навигации
3. **Используйте `hideWhenAuthenticated`** для страниц авторизации
4. **Следуйте диапазонам order** для предсказуемой сортировки
5. **Валидируйте в development** с помощью `validateConfigInDev()`
6. **Используйте кеширование валидации** для производительности
7. **Используйте Stateful Routing** для сложных UI с состояниями **(NEW!)**
8. **Синхронизируйте состояния с URL** для bookmarkability **(NEW!)**
9. **Определяйте urlPattern** для состояний с уникальными URL **(NEW!)**
10. **Используйте fallbackState** для обработки ошибок **(NEW!)**

## 🎯 Stateful Routing Guidelines **(NEW!)**

### Когда использовать Stateful Routing:

- ✅ Dashboard приложения с несколькими view
- ✅ Master-detail интерфейсы
- ✅ Multi-step формы
- ✅ Workspace приложения
- ✅ Complex state management

### Когда НЕ использовать:

- ❌ Простые статические страницы
- ❌ Content-focused сайты
- ❌ SEO критичные страницы

### Паттерны использования:

```typescript
// 1. Определите состояния в конфигурации
states: {
  loading: { key: 'loading' },
  list: { key: 'list', urlPattern: '/workspace/list' },
  detail: { key: 'detail', urlPattern: '/workspace/:id' },
}

// 2. Используйте хуки в компонентах
const { state, availableStates } = useWorkspaceStateful();

// 3. Навигация между состояниями
const navigate = useWorkspaceNavigation();
navigate.navigateTo('detail', { workspaceId: '123' });
```

## 🔍 DX Improvements

- **Четкое разделение**: конфигурация в shared/config, логика в shared/lib
- **Единый API**: все функциональность через `index.ts`
- **Улучшенные сообщения**: понятные ошибки валидации
- **Кеширование**: валидация не тормозит приложение
- **Типизация**: все типы в одном файле
- **Stateful поддержка**: seamless интеграция новых паттернов **(NEW!)**
- **URL синхронизация**: автоматическая синхронизация состояний **(NEW!)**
- **Backward compatibility**: старый код продолжает работать **(NEW!)**

## 🚀 Enterprise Ready Features **(NEW!)**

- **Scalable Architecture**: поддержка сотен маршрутов
- **Type Safety**: строгая типизация на всех уровнях
- **Performance**: кеширование и оптимизация
- **SEO Friendly**: URL синхронизация для stateful маршрутов
- **Developer Experience**: intuitive API и documentation
- **Testing**: валидация и утилиты для тестов
- **Modern Patterns**: соответствие лучшим практикам 2024-2025

---

🎉 **Идеальная система маршрутизации с Stateful Routing готова к масштабированию!**

## 🆕 Что нового в этой версии:

- ✨ **Stateful Routing** - client-side навигация с URL синхронизацией
- 🎯 **Workspace Support** - специализированные типы для workspace приложений
- 🛡️ **Enhanced Type Safety** - улучшенная типизация
- 📚 **Updated Documentation** - полное руководство по новым возможностям
- 🔄 **Backward Compatibility** - старый код продолжает работать
- ⚡ **Performance** - оптимизация и кеширование
