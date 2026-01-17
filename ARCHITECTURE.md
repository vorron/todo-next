# Архитектура проекта todo-next

## Цель архитектуры

Проект todo-next — эталонный шаблон для создания новых приложений:

- масштабируемая, понятная FSD‑архитектура
- минимум «проектной магии»: новый разработчик быстро понимает устройство
- готовность заменить mock‑авторизацию на реальную
- возможность вынесения ядра в условный `company/foundation` (дизайн‑система, API‑база, layouts, провайдеры)

## Слои и структура папок

Корневые слои:

`src/app` — маршрутизация (App Router), layout’ы, метаданные.

`src/screens` — страничный слой (page‑level UI и логика оркестрации).

`src/widgets` — переиспользуемые композиционные блоки UI.

`src/features` — фича‑ориентированная логика + UI.

`src/entities` — доменные сущности (типы, схемы, API, чистые функции).

`src/shared` — инфраструктура и атомарные вещи (UI, lib, config, api‑база).

### app/ — инфраструктура маршрутизации

Ответственность:

структура роутов App Router;
layout’ы (root, (public), (protected) и др.);
metadata, viewport, error‑страницы;
склейка:
Page
→ Screen (почти без логики).
Правила:

Page и Layout не содержат бизнес‑логики.

Типичный page.tsx:

```
import { TodosPage } from '@/screens';
import { getRouteMetadata } from '@/shared/lib/utils/router-utils';
import { ROUTES } from '@/shared/config/routes';
import type { Metadata } from 'next';

export const metadata: Metadata = getRouteMetadata(ROUTES.TODOS);

export default function Page() {
  return <TodosPage />;
}
```

Весь HTML/BODY — только в `src/app/layout.tsx`.

### shared/lib/router/ — система роутинга

Ответственность:

единая конфигурация маршрутов приложения;
генерация навигационных функций и утилит;
поддержка иерархической навигации (sections/pages);
типобезопасная работа с маршрутами.

Структура:

```
src/shared/lib/router/
├── config-types.ts          # Типы для конфигурации маршрутов
├── router-config.ts         # Конфигурация маршрутов приложения
├── generators.ts             # Генераторы навигации и утилит
├── hierarchical-navigation.ts # Утилиты иерархической навигации
├── use-generated-navigation.ts  # Хук генерации базовых функций
├── use-hierarchical-navigation.ts # Хук утилит иерархии
├── navigation.ts             # Композиционный хук навигации
└── index.ts                  # Единая точка экспорта
```

Принципы работы:

Единый источник правды - `router-config.ts`
Автоматическая генерация типов и функций
Поддержка иерархии (section → page)
Разделение ответственности через композицию хуков

Использование:

```typescript
// Базовая навигация
const { navigateToTodos, toTracker } = useNavigation();

// Иерархическая навигация
const { getMainNavigation, getSectionChildren, getBreadcrumbs } = useNavigation();

// Навигация по разделам
navigateToSection('tracker'); // → /workspace
navigateToDefaultState('/workspace'); // → default state
```

Особенности архитектуры:

Tracker UI концепция реализуется через workspace функциональность
Поддержка breadcrumbs и иерархического меню
Автоматическая генерация функций из ROUTES констант
Строгая типизация без использования any

### screens/ — слой страниц (page‑level)

Ответственность:

всё, что касается конкретной страницы:
layout секций;
композиция widgets, features, entities, shared/ui;
координация фич между собой (страничная логика).
Если какой‑то компонент/логика используется только на этой странице, он может жить внутри дерева этой screen.
Примеры:

tsx
// src/screens/todos/ui/todos-page.tsx

```
'use client';

import { CreateTodoForm } from '@/features/todo/todo-create';
import { TodoList } from '@/features/todo/ui/todo-list';

export function TodosPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <CreateTodoForm />
      <TodoList />
    </div>
  );
}
```

Допускается хранить в screens:

общие фильтры/состояние для нескольких фич на странице;
обработчики, которые «склеивают» несколько виджетов/фич.
Ограничения:

- screens не идут напрямую в `shared/api` или `entities/*/api` (они используют для этого features/hooks)

### widgets/ — композиционные блоки UI

Ответственность:

многократно переиспользуемые фрагменты интерфейса:
Navbar, Sidebar, UserSummary;
доменно‑специфичные блоки типа TodoSummaryPanel, TodoBoard и т.п.
собирают features + entities + shared/ui, но не являются страницами.
Правила:

widget может быть доменно‑специфичным (Todo*), если он используется в нескольких screens.
Тяжёлая доменная логика по типам/валидации/DTO — в entities/features, а не в widgets.*

### features/ — фичи и бизнес‑логика

Ответственность:

законченные пользовательские сценарии:
todo-create, todo-update, todo-delete, todo-filter;
auth/login, auth/logout;
settings/update-profile и т.п.
сложные хуки + UI, специфичные для фичи:
useTodos, useAuth, useOptimisticToggle;
CreateTodoForm, LoginForm.
Правила:

features могут использовать entities и
shared
, но не screens и не app.
В идеале, экраны (screens) получают от фич готовые хуки и компоненты, не залезая в детали API.

### entities/ — доменные сущности

Ответственность:

доменные типы, zod‑схемы, RTK Query endpoints, чистые функции:
Todo, User, Session и т.п.;
todo-schema.ts, todo-api.ts, user-schema.ts.
Правила:

нет React‑компонентов;
никакого знания о screens/features/widgets/app;
RTK Query endpoints живут здесь (через общий baseApi из shared/api).

### shared/ — инфраструктура и атомы

Ответственность:

переиспользуемая инфраструктура:
shared/ui — дизайн‑система (Button, Card, Input, Spinner, Toaster и т.п.);
shared/api — base-api, baseQueryWithLogging;
shared/lib — утилиты (cn, форматтеры, обработка ошибок);
shared/config — конфиги (routes, env, etc.).
Правила:

не зависят от доменных сущностей (features/screens);
могут быть вынесены в будущий
company/foundation
. ## Auth-flow (вариант A)

### Общая идея

Единственная точка auth‑защиты роутов — (protected)/layout.tsx (SSR).
middleware.ts
не решает авторизацию:
используется для логирования, аналитики, технических задач;
не редиректит пользователя в зависимости от сессии.
Это убирает дублирование auth‑логики и упрощает понимание.

### Сессия

Сессия хранится в mock‑виде (localStorage + cookie app_session_exists), но:
будет вынесен единый «session service» (в entities/session или features/auth/lib/session-service);
он:
валидирует структуру Session через zod;
управляет сроком жизни;
синхронизирует localStorage и cookie.
Все потребители (useAuth, useSessionCookie, SSR‑layout) используют один сервис, а не работают с localStorage/cookie напрямую.

### (protected)/layout.tsx

Ответственность:

проверить, есть ли валидная сессия (через cookie/запрос);
если нет — сделать redirect(ROUTES.LOGIN) на сервере;
если есть — отрендерить приватный shell:
Navbar,

<main>, обёртки и т.д.
Важно:

layout не использует `useEffect` и client‑редиректы для базовой защиты.
client‑guard (useAuth.requireAuth) остаётся только как fallback для отдельных client‑компонентов (если нужно).

### middleware.ts

Ответственность:

логирование запросов (например, `console.log(path)` или отправка в трекинг);
технические функции (кеш‑заголовки, edge‑фичи и т.п.), но не auth‑gateway.

## UI каркас приложения (App Shell)

Приватные и публичные layout’ы используют единый каркас:

- `AppShell` (widgets) — `header + main + footer`
- `Navbar` (widgets) — верхняя панель
- `HeaderProvider` (shared/ui) — позволяет динамически переопределять `title/breadcrumbs` для хедера на конкретных страницах

Практика для динамических страниц:

- на `/todos/[id]` страница выставляет `header.title` (например, `todo.text`), чтобы в хедере было бизнес-название

## Применение в домене Todo

Для ориентира:

Страница списка туду:
app/(protected)/todos/page.tsx → тонкий
Page
, рендерит
TodosPage
и мета.
screens/todos/ui/todos-page.tsx
→ компоновка заголовка, CreateTodoForm,
TodoList
.
features/todo/_ → создание/редактирование/удаление, useTodos, оптимистичные апдейты.
entities/todo/_ → схемы, типы, RTK Query эндпоинты.
shared/ui → Card, Button, Skeleton, Layout‑компоненты.

4. Практическое правило для нашего проекта

По умолчанию:
всё, что касается только одной страницы, живёт в её screen (внутри дерева screens/todos/...).
Выносим в features, когда:
логика/компонент начинает использоваться в нескольких местах,
или становится «ядром домена» (логика, которую имеет смысл иметь в foundation).
