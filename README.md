# Todo App — Enterprise Template

Production-ready шаблон для создания enterprise-приложений на базе Next.js 16.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **Architecture**: Feature-Sliced Design (FSD)
- **Routing**: Custom hierarchical routing system

## Routing System

Приложение использует собственную систему роутинга с поддержкой иерархической навигации:

### Особенности

- **Единая конфигурация** - все маршруты в `router-config.ts`
- **Автоматическая генерация** - типы и функции создаются из конфигурации
- **Иерархическая навигация** - поддержка sections/pages
- **Строгая типизация** - без `any` и runtime ошибок

### Основные концепции

```typescript
// Конфигурация маршрутов
export const ROUTES = {
  TODOS: '/todos',
  TRACKER: '/workspace', // Tracker UI → workspace implementation
  TIME_ENTRY: '/time-entry',
} as const;

// Использование в компонентах
const { navigateToTodos, toTracker } = useNavigation();

// Иерархическая навигация
const { getMainNavigation, getBreadcrumbs } = useNavigation();
```

### Структура навигации

- **Todos** - управление задачами
- **Tracker** - трекинг времени (реализован через workspace)
- **Settings** - настройки профиля

**Workspace** доступен через Tracker с правильной логикой редиректов.

## Quick Start

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка окружения
cp .env.example .env


# 4. Запуск dev-сервера
npm run dev
```

Приложение доступно на [http://localhost:3002](http://localhost:3002)

### Требования

- Node.js: актуальная LTS
- npm: актуальная версия

### Переменные окружения

Файл `.env` обязателен (см. `.env.example`). Минимально нужно:

| Переменная                    | Пример                        | Назначение                         |
| ----------------------------- | ----------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL`         | `http://localhost:3001`       | Базовый URL для API (RTK Query)    |
| `NEXT_PUBLIC_IMAGE_HOSTNAMES` | `example.com,cdn.example.com` | Allowlist доменов для `next/image` |

Дополнительно (на будущее, под NextAuth):

| Переменная        | Пример                  | Назначение     |
| ----------------- | ----------------------- | -------------- |
| `NEXTAUTH_URL`    | `http://localhost:3002` | URL приложения |
| `NEXTAUTH_SECRET` | `...`                   | Секрет         |

### Порты по умолчанию

| Сервис             | Порт   |
| ------------------ | ------ |
| Next.js dev server | `3002` |
| бэк                | `3001` |

## Scripts

| Команда                | Описание                                   |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Запуск dev-сервера                         |
| `npm run dev:e2e`      | Запуск dev-сервера (для E2E)               |
| `npm run build`        | Production сборка                          |
| `npm run start`        | Запуск production сервера                  |
| `npm run lint`         | ESLint проверка                            |
| `npm run lint:fix`     | ESLint автофиксы                           |
| `npm run format`       | Форматирование Prettier                    |
| `npm run format:check` | Проверка форматирования                    |
| `npm run typecheck`    | TypeScript typecheck                       |
| `npm run test`         | Unit tests (Vitest)                        |
| `npm run test:watch`   | Unit tests watch mode                      |
| `npm run check`        | Quality gate (format+lint+typecheck+tests) |

| `npm run e2e:install` | Установка браузеров Playwright |
| `npm run e2e` | E2E тесты (Playwright) |
| `npm run e2e:ui` | E2E тесты (Playwright UI) |

### Quality Gate

Основная команда для локальной проверки перед PR/мерджем: `npm run check`.

Она должна проходить всегда:

- форматирование
- линт
- типы
- unit tests

E2E тесты (Playwright) намеренно вынесены в отдельную команду (`npm run e2e`), чтобы `npm run check` оставался быстрым и предсказуемым.

## Демо-функционал (как пользоваться)

Этот репозиторий — не только пример архитектуры (FSD), но и набор «шаблонных» реализаций типовых продуктовых сценариев.

### Todos: поиск + сортировка + shareable URL state

На странице `/todos` доступны:

- поиск по тексту и тегам
- фильтры: all / active / completed
- сортировка: Newest / Priority / A–Z

Состояние синхронизировано с URL (удобно шарить ссылку и пользоваться back/forward):

- `q` — строка поиска
- `filter` — `active | completed` (значение `all` по умолчанию не пишется)
- `sort` — `priority | alphabetical` (значение `date` по умолчанию не пишется)

Пример:

`/todos?q=refactor&filter=active&sort=priority`

### Undo при удалении todo

При удалении todo появляется toast с кнопкой **Undo**.

Реализация сделана «универсально для шаблона»: Undo восстанавливает todo через `create` (создаётся новый `id`).

### Selection mode + Bulk actions

В списке todos есть режим выделения:

- нажми **Select**
- выбери несколько todo
- выполни массовое действие:
  - Mark done / Mark active
  - Delete (также с Undo)
  - Select all / Clear

Также доступны глобальные действия:

- Mark all done / Mark all active
- Clear completed

## E2E (Playwright)

В проект добавлен smoke E2E тест: `login → todos → search → detail → back`.

### Первый запуск

1. Установить браузеры:

```bash
npm run e2e:install
```

2. Запустить E2E:

```bash
npm run e2e
```

Playwright сам поднимет dev-сервер приложения и mock API через `dev:e2e`.

### UI режим

```bash
npm run e2e:ui
```

## Project Structure (FSD)

```
src/
├── app/              # App Router: роуты, layouts, providers
│   ├── (protected)/  # Требует авторизации
│   ├── (public)/     # Публичные страницы
│   └── providers/    # React providers
├── screens/          # Page-level компоненты
├── widgets/          # Композиционные блоки UI
├── features/         # Бизнес-логика и фичи
├── entities/         # Доменные сущности
└── shared/           # Переиспользуемая инфраструктура
    ├── api/          # RTK Query base API
    ├── config/       # Конфигурация
    ├── lib/          # Утилиты
    └── ui/           # UI Kit
```

## Docker

```bash
# Build
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t todo-app .

# Run
docker run -p 3000:3000 todo-app
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — детальное описание архитектуры

## Поддержка и обновления (эталонный процесс)

## Release checklist

Перед релизом/мерджем в `main`:

1. `npm run check`
2. `npm run build`
3. `npm audit` (после обновлений зависимостей)
4. Проверить актуальность `.env.example` (новые переменные, дефолты, комментарии)
5. Проверить, что CI зелёный

## Переход с mock-auth на production auth

Сейчас в проекте используется **mock-auth**:

- клиентская сессия хранится в `localStorage` (`SESSION_STORAGE_KEY = app_session`)
- наличие сессии для SSR/layout определяется cookie `app_session_exists`

Это сделано специально, чтобы шаблон работал «из коробки» без БД, но для production нужно перейти на стандартную аутентификацию.

### Рекомендуемый вариант (самый применимый для Next.js)

**Auth.js / NextAuth (App Router)**.

Почему:

- стандарт де-факто для Next.js
- поддержка OAuth (GitHub/Google/…)
- поддержка credentials (логин/пароль к вашему backend)
- единая модель для SSR (`getServerSession`/`auth()`) и client (`useSession`)

### Варианты хранения сессии

- **DB sessions (рекомендуется для enterprise)**
  - сессия хранится в БД, сервер может её отзывать
  - удобно для logout "везде", управления сессиями, compliance
- **JWT**
  - проще деплой, меньше инфраструктуры
  - сложнее делать server-side revoke

### Пошаговая миграция (минимально болезненная)

1. Добавить Auth.js / NextAuth

- установить пакет `next-auth`
- добавить route handler для App Router: `src/app/api/auth/[...nextauth]/route.ts`
- настроить провайдеры:
  - OAuth (например GitHub/Google) или
  - CredentialsProvider (если у вас свой backend)

2. Обновить переменные окружения

В `.env`/`.env.example`:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Плюс переменные выбранного OAuth провайдера (например `GITHUB_ID`, `GITHUB_SECRET`).

3. Заменить серверную проверку авторизации

Сейчас защита реализована через cookie `app_session_exists`:

- `src/app/(protected)/layout.tsx` использует `hasValidSession()`
- `src/features/auth/lib/session-service.server.ts` читает `SESSION_COOKIE_NAME`

После внедрения NextAuth:

- `(protected)/layout.tsx` должен проверять сессию через NextAuth (server-side)
- редирект на `/login` оставляем таким же, но условие берём из `getServerSession`/`auth()`

4. Заменить клиентский auth API

Сейчас `useAuth()` работает с:

- `authApi.login/logout` (mock)
- `sessionStorage` (localStorage)

После внедрения NextAuth:

- логин/логаут делаются через `signIn()` / `signOut()`
- данные сессии берутся через `useSession()`

5. Удалить/выключить mock-слой

Когда production-auth работает:

- удалить/закомментировать `app_session_exists` cookie логику
- `createMockSession`, `sessionStorage`, `session-service.*` либо удалить, либо оставить как dev-only "пример", но не использовать

### Какие файлы затронет миграция в текущем проекте

- `src/app/(protected)/layout.tsx`
- `src/app/(public)/layout.tsx` (условный показ `Navbar` сейчас завязан на cookie)
- `src/features/auth/model/use-auth.ts`
- `src/features/auth/api/auth-api.ts` (mock endpoints)
- `src/features/auth/lib/session-service.client.ts`
- `src/features/auth/lib/session-service.server.ts`

### Альтернатива (внешний провайдер)

Если нужно быстро и enterprise-уровень без поддержки своей auth-инфраструктуры:

- Clerk
- Auth0
- Keycloak (self-hosted)

Но это обычно либо vendor lock-in, либо отдельная инфраструктура. Для шаблона по умолчанию NextAuth — самый универсальный путь.

### 1) Как обновлять зависимости безопасно

Рекомендуемый цикл (например раз в 1–2 недели):

1. Обновить ветку от `main`.
2. Проверить список устаревших пакетов:
   - `npm outdated`
3. Обновлять поэтапно:
   - сначала patch/minor,
   - затем отдельным PR — major.
4. После каждого шага запускать:
   - `npm run check`
   - `npm run build`

### 2) Next.js / React / TypeScript

- Next.js держим в актуальной версии внутри major-линейки.
- При обновлении Next.js:
  - читать release notes,
  - проверить `next.config.ts` (эксперименты/флаги),
  - прогнать `npm run check` и `npm run build`.

### 3) Security

Минимальный набор:

- `npm audit` (после обновлений)
- обновлять уязвимые зависимости без задержек

### 4) Как поддерживать архитектуру в будущем

- Новые страницы добавлять в `src/app/.../page.tsx` как тонкие файлы без логики.
- Page должен рендерить компонент из `src/screens/...`.
- Новые маршруты/названия:
  - `src/shared/config/routes.ts`
  - `src/shared/config/router-config.ts` (metadata)
- Логику сценариев держать в `features/*`, доменные типы/API — в `entities/*`.

### 5) Header/Breadcrumbs для динамических страниц

Для динамических страниц (например `/todos/[id]`) можно задавать заголовок в хедере через `useHeader()`.
Это позволяет показывать бизнес-название (например `todo.text`) вместо технического `Todo`.

### 6) Политика PR

- Один PR — одна цель.
- Обязательное условие: зелёный `npm run check`.
- Изменения зависимостей и инфраструктуры — отдельными PR.

## License

MIT
