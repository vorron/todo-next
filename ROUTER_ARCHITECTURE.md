# Router Architecture Documentation

## Overview

Эта архитектура реализует компромиссный подход между FSD принципами и максимальным DX, разделяя общую логику и специфичные для приложения данные.

## Структура

```
src/
├── shared/lib/router/          # Общая логика (переиспользуемая)
│   ├── types.ts               # Базовые типы маршрутизации
│   ├── utils.ts               # Утилиты для работы с маршрутами
│   ├── guards.ts              # Фабрики guard'ов для защиты маршрутов
│   └── index.ts               # Публичный API shared слоя
├── app/router/                # Данные приложения (специфичные)
│   ├── paths.ts               # Пути приложения + специфичные типы
│   ├── navigation.ts          # Навигация + специфичные типы
│   ├── metadata.ts            # Метаданные + специфичные типы
│   ├── header.ts              # Шаблоны хедеров + специфичные типы
│   ├── guards.ts              # Конфигурация guard'ов приложения
│   └── index.ts               # Экспорты + legacy совместимость
└── shared/config/routes/      # Legacy (deprecated)
    └── index.ts               # Обратная совместимость
```

## Принципы

### 1. Разделение ответственности

- **Shared**: общая логика, типы, утилиты
- **App**: конкретные данные приложения

### 2. Типизация

- **Общие типы** (`RoutePath`, `NavItem`, `Breadcrumb`) → `shared/lib/router/types.ts`
- **Специфичные типы** (`AppRoutePath`, `NavConfigKey`) → `app/router/*.ts`

### 3. Guards

- **Фабрики** → `shared/lib/router/guards.ts` (переиспользуемая логика)
- **Конфигурация** → `app/router/guards.ts` (данные приложения)

## Использование

### Новые проекты (рекомендуется)

```typescript
// Используем новый API
import { paths, navigationConfig } from '@/app/router';
```

### Существующие проекты (обратная совместимость)

```typescript
// Старые импорты продолжают работать
import { ROUTES, mainNavigation } from '@/shared/config/routes';
```

## Преимущества

1. **Масштабируемость** - легко добавлять новые проекты
2. **Переиспользование** - общая логика вынесена в shared
3. **DX** - понятная структура, удобные импорты
4. **FSD совместимость** - соблюдены принципы слоев
5. **Type Safety** - строгая типизация на всех уровнях

## Миграция

Для миграции существующих проектов:

1. Создайте `app/router/` с нужными файлами
2. Скопируйте данные из `shared/config/routes/`
3. Постепенно обновляйте импорты на `@/app/router`
4. Удалите legacy файл когда все импорты обновлены

## Пример добавления нового маршрута

```typescript
// app/router/paths.ts
export const paths = {
  // ... существующие пути
  dashboard: '/dashboard',
} as const;

// app/router/navigation.ts
export const navigationConfig = {
  // ... существующие элементы
  dashboard: {
    label: 'Dashboard',
    href: paths.dashboard,
    requiresAuth: true,
  },
} as const;
```
