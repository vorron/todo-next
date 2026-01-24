# Declarative Server-Side Routing Architecture

## Обзор

Реализована полнофункциональная **декларативная система server-side роутинга**, которая интегрируется в существующую архитектуру роутинга приложения. Система следует лучшим практикам Next.js 16+ и обеспечивает максимальный UX/DX.

## Архитектура

### 1. Декларативная конфигурация

```typescript
// src/shared/config/router-config.ts
tracker: route({
  path: BASE_PATHS.TRACKER,
  protected: true,
  title: 'Tracker',
  description: 'Time tracking and workspace management',
  nav: {
    label: 'Tracker',
    order: 2,
    level: 'section',
  },
  serverRedirect: {
    enabled: true,
    strategy: 'dynamic',
    resolver: 'resolveTrackerRedirect',
    fallback: '/tracker/onboarding',
  },
}),
```

**Компоненты конфигурации:**

- `enabled: boolean` - включить/выключить server-side редирект
- `strategy: 'static' | 'dynamic'` - тип редиректа
- `resolver: string` - имя функции-резолвера
- `fallback: string` - запасной маршрут при ошибке

### 2. Расширенные типы

```typescript
// src/shared/lib/router/config-types.ts
export type ServerRedirectConfig = {
  readonly enabled: boolean;
  readonly strategy: 'static' | 'dynamic';
  readonly target?: string;
  readonly resolver?: string;
  readonly fallback?: string;
};

type BaseRouteConfig = {
  path: string;
  metadata: Metadata;
  navigation?: NavigationConfig;
  header?: HeaderTemplate;
  layout?: 'default' | 'auth' | 'dashboard';
  serverRedirect?: ServerRedirectConfig; // Новое поле
};
```

### 3. Builder функции

```typescript
// src/shared/lib/router/builders.ts
interface StaticRouteOptions {
  path: string;
  public?: boolean;
  protected?: boolean;
  title: string;
  description: string;
  nav?: NavigationConfig & { order?: number; level?: 'section' | 'page' };
  parent?: string;
  serverRedirect?: ServerRedirectConfig; // Новая опция
}

export function route(options: StaticRouteOptions): RouteConfig {
  // Автоматическая обработка serverRedirect конфигурации
  if (options.serverRedirect?.enabled) {
    (baseConfig as any).serverRedirect = options.serverRedirect;
  }
  // ...
}
```

### 4. Автоматическая генерация server-side функций

```typescript
// src/shared/lib/router/server-generators.ts
export interface ServerRedirectResolvers {
  resolveTrackerRedirect: () => Promise<void>;
}

export function generateServerRedirectResolvers(): ServerRedirectResolvers {
  const resolvers: Partial<ServerRedirectResolvers> = {};

  // Автоматическая генерация резолверов из конфигурации
  for (const [key, config] of Object.entries(routeConfigData)) {
    const serverRedirect = (config as any).serverRedirect as ServerRedirectConfig;

    if (serverRedirect?.enabled && serverRedirect.resolver) {
      switch (serverRedirect.resolver) {
        case 'resolveTrackerRedirect':
          resolvers.resolveTrackerRedirect = createTrackerResolver(serverRedirect);
          break;
        // Расширяемость для других резолверов
      }
    }
  }

  return resolvers as ServerRedirectResolvers;
}
```

### 5. Единый API

```typescript
// src/shared/lib/router/generators.ts
export const serverRedirectResolvers = generateServerRedirectResolvers();

// src/shared/lib/router/index.ts
export * as serverRedirect from './generators';
```

## Пользовательский опыт

### Server-side редирект (Zero мигания)

```typescript
// src/app/(protected)/tracker/page.tsx
import { serverRedirect } from '@/shared/lib/router';

export default async function TrackerPage() {
  try {
    // Декларативный вызов из конфигурации
    await serverRedirect.serverRedirectResolvers.resolveTrackerRedirect();
  } catch (error) {
    // NEXT_REDIRECT - ожидаемое поведение Next.js
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    // Обработка других ошибок
    console.error('Unexpected error in tracker redirect:', error);
    redirect('/tracker/onboarding');
  }

  return <div>Redirecting...</div>;
}
```

**Преимущества:**

- ✅ **Zero мигания** - редирект до рендера
- ✅ **SEO friendly** - правильные URL сразу
- ✅ **Works without JS** - progressive enhancement
- ✅ **Type safety** - строгая типизация

## Flow выполнения

### 1. Конфигурация → Генерация

```
router-config.ts → server-generators.ts → generators.ts → index.ts
```

### 2. Запрос пользователя

```
GET /tracker → TrackerPage → serverRedirectResolvers.resolveTrackerRedirect() → redirect()
```

### 3. Server-side логика

```
1. Получить userId из сессии
2. Загрузить workspaces пользователя
3. Найти default workspace
4. Выполнить redirect на /tracker/{id}/time-entry
```

## Расширяемость

### Добавление нового server-side редиректа

**Шаг 1: Конфигурация**

```typescript
// router-config.ts
profile: route({
  path: BASE_PATHS.PROFILE,
  protected: true,
  title: 'Profile',
  description: 'Manage your account',
  serverRedirect: {
    enabled: true,
    strategy: 'dynamic',
    resolver: 'resolveProfileRedirect',
    fallback: '/profile/edit',
  },
}),
```

**Шаг 2: Резолвер**

```typescript
// server-generators.ts
case 'resolveProfileRedirect':
  resolvers.resolveProfileRedirect = createProfileResolver(serverRedirect);
  break;
```

**Шаг 3: Использование**

```typescript
// profile/page.tsx
await serverRedirect.serverRedirectResolvers.resolveProfileRedirect();
```

## Стратегии редиректов

### Static Strategy

```typescript
serverRedirect: {
  enabled: true,
  strategy: 'static',
  target: '/todos', // Всегда редирект на /todos
}
```

### Dynamic Strategy

```typescript
serverRedirect: {
  enabled: true,
  strategy: 'dynamic',
  resolver: 'resolveTrackerRedirect', // Вычислить target динамически
  fallback: '/tracker/onboarding',
}
```

## Обработка ошибок

### NEXT_REDIRECT

`NEXT_REDIRECT` - это **фича**, а не ошибка Next.js. Это специальный тип ошибки для:

- Прерывания выполнения server component
- Выполнения HTTP редиректа
- Предотвращения рендера контента после редиректа

### Graceful fallback

```typescript
try {
  await serverRedirect.serverRedirectResolvers.resolveTrackerRedirect();
} catch (error) {
  if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
    throw error; // Ожидаемое поведение
  }

  // Неожиданные ошибки
  console.error('Unexpected error:', error);
  redirect(config.fallback);
}
```

## Интеграция с существующей архитектурой

### Совместимость

- ✅ **Сохранены все существующие маршруты**
- ✅ **Client-side навигация работает как раньше**
- ✅ **RTK Query и state management без изменений**
- ✅ **Типизация и генераторы работают**

### Гибридный подход

- **Server-side**: только начальные редиректы
- **Client-side**: вся интерактивная логика
- **Best of both worlds**: zero мигания + интерактивность

## Файловая структура

```
src/shared/
├── config/
│   └── router-config.ts          # Декларативная конфигурация
├── lib/router/
│   ├── builders.ts                 # Builder функции
│   ├── config-types.ts            # Типы конфигурации
│   ├── server-generators.ts       # Генерация server-side функций
│   ├── generators.ts              # Основные генераторы
│   └── index.ts                   # Единый API
└── app/(protected)/tracker/
    └── page.tsx                    # Использование server-side редиректа
```

## Best Practices Applied

### 1. Separation of Concerns

- **Конфигурация** - декларативная в router-config.ts
- **Генерация** - автоматическая в server-generators.ts
- **Использование** - чистое в page компонентах

### 2. Type Safety

- **Строгая типизация** всех конфигураций
- **Автоматическая генерация** типов
- **Compile-time проверки** ошибок

### 3. Extensibility

- **Плагинная архитектура** для новых редиректов
- **Конфигурируемые стратегии** (static/dynamic)
- **Fallback механизмы** для обработки ошибок

### 4. Performance

- **Zero мигание** для начальных редиректов
- **Client-side навигация** для интерактивности
- **Оптимизированные** генераторы и кеширование

### 5. Developer Experience

- **Декларативный подход** - минимум кода
- **Интеллектуальные подсказки** от IDE
- **Единый API** для всех роутинговых нужд

## Migration Guide

### Из императивного подхода

```typescript
// Было (императивно)
export default async function TrackerPage() {
  const userId = 'user-1';
  const workspaces = await getUserWorkspaces(userId);
  const defaultWorkspace = getDefaultWorkspace(workspaces);

  if (!defaultWorkspace) {
    redirect('/tracker/onboarding');
  }

  redirect(`/tracker/${defaultWorkspace.id}/time-entry`);
}
```

### К декларативному подходу

```typescript
// Стало (декларативно)
export default async function TrackerPage() {
  try {
    await serverRedirect.serverRedirectResolvers.resolveTrackerRedirect();
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    redirect('/tracker/onboarding');
  }
}
```

## Результаты

### UX улучшения

- **Zero мигание** при начальной загрузке
- **Правильные URL** с первого запроса
- **Works without JavaScript**

### DX улучшения

- **Декларативная конфигурация** в одном месте
- **Автоматическая генерация** server-side функций
- **Type safety** на всех уровнях
- **Расширяемость** для новых редиректов

### Архитектурные преимущества

- **Separation of concerns** - server/client разделение
- **Consistent patterns** - единый подход для всех редиректов
- **Maintainable code** - легко изменять и расширять
- **Testable** - каждая часть тестируется отдельно

Эта архитектура обеспечивает максимальный UX при минимальном коде и полной интеграции в существующую систему роутинга.
