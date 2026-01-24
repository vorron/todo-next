# Time Entry Architecture Specification

## Обзор

Спецификация эталонной FSD-архитектуры для функциональности Time Entry (учет времени) в соответствии с лучшими практиками Next.js 15+ и Feature-Sliced Design.

**Цель:** Создать масштабируемую, тестируемую и переиспользуемую архитектуру для time management функциональности.

---

## Архитектурные слои

### 1. Entities Layer (`src/entities/time-entry/`)

**Ответственность:** Чистые доменные сущности, бизнес-правила, API контракты

```
src/entities/time-entry/
├── model/
│   ├── schema.ts              # Zod схемы валидации
│   ├── types.ts               # TypeScript типы
│   └── constants.ts           # Константы домена
├── api/
│   ├── time-entry-api.ts      # RTK Query эндпоинты
│   ├── project-api.ts         # API для проектов
│   └── index.ts
├── lib/
│   ├── time-calculations.ts   # Чистые функции времени
│   ├── validation-rules.ts    # Правила валидации
│   └── index.ts
└── index.ts                   # Публичный API сущности
```

**Ключевые принципы:**

- Нет React зависимостей
- Чистые функции и схемы
- RTK Query эндпоинты
- Бизнес-инварианты

### 2. Features Layer (`src/features/time-entry/`)

**Ответственность:** Пользовательские сценарии, UI компоненты, состояние

```
src/features/time-entry/
├── ui/
│   ├── time-entry-view.tsx        # Основной UI компонент
│   ├── time-entry-form.tsx         # Форма ввода
│   ├── time-entry-dialog.tsx       # Диалог редактирования
│   ├── time-scale.tsx              # Часовая шкала
│   ├── time-entry-block.tsx        # Визуальный блок задачи
│   ├── time-entry-header.tsx       # Заголовок с формой
│   └── index.ts
├── model/
│   ├── use-time-entries.ts        # Хук управления записями
│   ├── use-time-entry-form.ts      # Хук формы
│   ├── use-time-entry-dialog.ts    # Хук диалога
│   └── time-entry-providers.tsx    # Context providers
├── lib/
│   ├── time-utils.ts               # Утилиты для UI
│   ├── form-utils.ts               # Утилиты форм
│   └── dialog-utils.ts            # Утилиты диалогов
└── index.ts
```

**Ключевые принципы:**

- React компоненты и хуки
- UI состояние и логика
- Пользовательские сценарии
- Используют entities и shared

### 3. Widgets Layer (`src/widgets/time-entry/`)

**Ответственность:** Композиционные блоки UI для переиспользования

```
src/widgets/time-entry/
├── ui/
│   ├── time-entry-page-layout.tsx  # Layout страницы
│   ├── time-entry-summary.tsx      # Сводка времени
│   └── time-entry-toolbar.tsx      # Панель инструментов
└── index.ts
```

**Ключевые принципы:**

- Композиция features + entities
- Многократное переиспользование
- Сложные UI композиции
- Доменно-специфичные блоки

### 4. Screens Layer (`src/screens/time-entry/`)

**Ответственность:** Страничная логика, композиция, роутинг

```
src/screens/time-entry/
├── ui/
│   ├── time-entry-page.tsx          # Страничный компонент
│   └── time-entry-error-boundary.tsx # Error handling
├── model/
│   ├── use-time-entry-page.ts       # Страничное состояние
│   └── time-entry-page-effects.ts   # Side effects
└── index.ts
```

**Ключевые принципы:**

- Композиция widgets и features
- Страничное состояние
- Параметры роутинга
- Error boundaries

---

## Детальная реализация слоев

### Entities Layer - Детали

#### `src/entities/time-entry/model/schema.ts`

```typescript
import z from 'zod';

export const TimeEntrySchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1).max(500),
  projectId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .nullable(),
  duration: z
    .number()
    .positive()
    .max(24 * 60), // минуты
  tags: z.array(z.string()).default([]),
  isBillable: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  workspaceId: z.string().uuid(),
  isArchived: z.boolean().default(false),
  hourlyRate: z.number().positive().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TimeEntry = z.infer<typeof TimeEntrySchema>;
export type Project = z.infer<typeof ProjectSchema>;
```

#### `src/entities/time-entry/lib/time-calculations.ts`

```typescript
export const calculateDuration = (startTime: string, endTime: string | null): number => {
  if (!endTime) return 0;

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  return (end.getTime() - start.getTime()) / (1000 * 60); // минуты
};

export const roundToNearest = (minutes: number, precision: number = 15): number => {
  return Math.round(minutes / precision) * precision;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}м`;
  if (mins === 0) return `${hours}ч`;

  return `${hours}ч ${mins}м`;
};
```

### Features Layer - Детали

#### `src/features/time-entry/ui/time-entry-view.tsx`

```typescript
'use client';

import { TimeEntryHeader } from './time-entry-header';
import { TimeScale } from './time-scale';
import { TimeEntryField } from './time-entry-field';
import { useTimeEntries } from '../model/use-time-entries';

interface TimeEntryViewProps {
  workspaceId: string;
  date?: string;
}

export function TimeEntryView({ workspaceId, date }: TimeEntryViewProps) {
  const { timeEntries, isLoading, error } = useTimeEntries(workspaceId, date);

  return (
    <div className="time-entry-view">
      <TimeEntryHeader workspaceId={workspaceId} />

      <div className="time-entry-workspace">
        <TimeScale />
        <TimeEntryField
          timeEntries={timeEntries}
          onEntryUpdate={/* handler */}
        />
      </div>
    </div>
  );
}
```

#### `src/features/time-entry/model/use-time-entries.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeEntryApi } from '@/entities/time-entry/api';

export function useTimeEntries(workspaceId: string, date?: string) {
  const queryClient = useQueryClient();

  const timeEntries = useQuery({
    queryKey: ['time-entries', workspaceId, date],
    queryFn: () => timeEntryApi.getTimeEntries(workspaceId, date),
  });

  const createTimeEntry = useMutation({
    mutationFn: timeEntryApi.createTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['time-entries', workspaceId]);
    },
  });

  const updateTimeEntry = useMutation({
    mutationFn: timeEntryApi.updateTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['time-entries', workspaceId]);
    },
  });

  return {
    timeEntries: timeEntries.data ?? [],
    isLoading: timeEntries.isLoading,
    error: timeEntries.error,
    createTimeEntry,
    updateTimeEntry,
  };
}
```

### Widgets Layer - Детали

#### `src/widgets/time-entry/ui/time-entry-page-layout.tsx`

```typescript
'use client';

import { cn } from '@/shared/lib/utils';

interface TimeEntryPageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function TimeEntryPageLayout({
  children,
  header,
  sidebar,
  className
}: TimeEntryPageLayoutProps) {
  return (
    <div className={cn('time-entry-page-layout', className)}>
      {header && (
        <header className="time-entry-page__header">
          {header}
        </header>
      )}

      <main className="time-entry-page__main">
        {children}
      </main>

      {sidebar && (
        <aside className="time-entry-page__sidebar">
          {sidebar}
        </aside>
      )}
    </div>
  );
}
```

### Screens Layer - Детали

#### `src/screens/time-entry/ui/time-entry-page.tsx`

```typescript
'use client';

import { TimeEntryPageLayout } from '@/widgets/time-entry';
import { TimeEntryView } from '@/features/time-entry';
import { WorkspaceActionsBar } from '@/features/workspace';
import { WorkspaceInfoCard } from '@/features/workspace/components';

interface TimeEntryPageProps {
  workspace: Workspace;
  workspaces: Workspace[];
}

export function TimeEntryPage({ workspace, workspaces }: TimeEntryPageProps) {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <WorkspaceActionsBar
        workspaces={workspaces}
        currentWorkspaceId={workspace.id}
      />

      <TimeEntryView workspaceId={workspace.id} />

      <WorkspaceInfoCard workspace={workspace} />
    </div>
  );
}
```

---

## Принципы и паттерны

### 1. Разделение ответственности

**Entities:** Чистый домен, без UI
**Features:** UI + бизнес-логика
**Widgets:** Композиция для переиспользования
**Screens:** Страничная логика и роутинг

### 2. Поток данных

```
Entities (API) → Features (Hooks) → Widgets (Components) → Screens (Pages)
```

### 3. State Management

- **Server state:** RTK Query в entities
- **Client state:** React state в features
- **Global state:** Context providers в features
- **Form state:** React Hook Form в features

### 4. Типизация

- Строгая типизация на всех уровнях
- Zod для валидации и runtime типов
- Generics для переиспользуемых компонентов

---

## Интеграция с существующей архитектурой

### Совместимость с Workspace

```typescript
// features/time-entry/model/use-time-entries.ts
export function useTimeEntries(workspaceId: string) {
  // Использует существующий workspace API
  const { workspace } = useWorkspace(workspaceId);

  return {
    // ... time entries logic
    workspace,
  };
}
```

### Переиспользование компонентов

```typescript
// widgets/time-entry/ui/time-entry-page-layout.tsx
import { WorkspaceActionsBar } from '@/features/workspace/ui';
import { WorkspaceInfoCard } from '@/features/workspace/components';

// Композиция с существующими компонентами
```

---

## Тестирование

### 1. Unit тесты

**Entities:** Чистые функции и схемы
**Features:** Хуки и UI компоненты
**Widgets:** Композиционные компоненты

### 2. Integration тесты

**Screens:** Полные пользовательские сценарии
**API:** Эндпоинты и мутации

### 3. E2E тесты

**Пользовательские пути:** Добавление, редактирование, удаление

---

## Migration Path

### Phase 1: Foundation

1. Создать `entities/time-entry/`
2. Базовые схемы и API
3. Простые UI компоненты

### Phase 2: Features

1. Реализовать `features/time-entry/`
2. Хуки и состояние
3. Основные UI компоненты

### Phase 3: Integration

1. Создать `widgets/time-entry/`
2. Обновить `screens/time-entry/`
3. Интеграция с workspace

### Phase 4: Enhancement

1. Оптимизация производительности
2. Дополнительные фичи
3. Тестирование

---

Эта архитектура обеспечивает:

- **Масштабируемость** через четкое разделение
- **Тестируемость** через изолированные слои
- **Переиспользование** через widgets и features
- **Совместимость** с существующим кодом
- **Поддерживаемость** через понятную структуру
