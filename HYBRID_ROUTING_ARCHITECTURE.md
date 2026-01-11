# Hybrid Routing Architecture - Tracker

## Обзор

Реализован **гибридный подход** к роутингу в tracker секции:

- **Server-side редирект** для начальной страницы `/tracker`
- **Client-side роутинг** для всей остальной логики workspace

## Архитектура

### 1. Server-side компонент (стартовая страница)

```typescript
// src/app/(protected)/tracker/page.tsx
export default async function TrackerPage() {
  const workspaces = await getUserWorkspaces(userId);
  const defaultWorkspace = getDefaultWorkspace(workspaces);

  if (!defaultWorkspace) {
    redirect('/tracker/onboarding');
  }

  // Server-side редирект на default workspace
  redirect(`/tracker/${defaultWorkspace.id}/time-entry`);
}
```

**Преимущества:**

- ✅ **Zero мигания** - редирект до рендера
- ✅ **SEO friendly** - правильные URL сразу
- ✅ **Fast** - один запрос к серверу
- ✅ **Works without JS** - progressive enhancement

### 2. Client-side компоненты (workspace логика)

```typescript
// src/screens/workspace-time-entry.tsx
export function WorkspaceTimeEntryPage({ params }: { params: { id: string } }) {
  const { workspaces, isLoading } = useWorkspaces();
  const workspace = workspaces.find(w => w.id === params.id) || null;

  return <WorkspaceTimeEntryComponent workspace={workspace} />;
}
```

**Преимущества:**

- ✅ **Интерактивность** - client-side навигация
- ✅ **Реальные данные** - актуальное состояние workspace
- ✅ **DX** - привычные React patterns
- ✅ **Reactive** - обновления при изменении данных

## User Flow

### Сценарий 1: Пользователь с workspace

1. Заходит на `/tracker`
2. **Server-side**: мгновенный редирект на `/tracker/w2/time-entry`
3. **Client-side**: загружается workspace UI с интерактивностью

### Сценарий 2: Новый пользователь

1. Заходит на `/tracker`
2. **Server-side**: редирект на `/tracker/onboarding`
3. **Client-side**: форма создания workspace

### Сценарий 3: Навигация внутри workspace

1. Пользователь на `/tracker/w2/time-entry`
2. **Client-side**: клик на "Projects" → `/tracker/w2/projects`
3. **Client-side**: мгновенная навигация без перезагрузки

## Технические преимущества

### Performance

- **Initial load**: Server-side редирект (zero мигания)
- **Navigation**: Client-side routing (instant)
- **Data loading**: Оптимизированные RTK Query кеши

### UX

- **No flashing** - нет экранов "Redirecting..."
- **Fast navigation** - client-side routing внутри workspace
- **Correct URLs** - семантические адреса

### DX

- **Separation of concerns** - server для редиректов, client для логики
- **Type safety** - строгая типизация везде
- **Testable** - легко тестировать server и client части

## Файловая структура

```
src/app/(protected)/tracker/
├── page.tsx                    # Server-side редирект
├── onboarding/page.tsx         # Server-first onboarding
├── [id]/
│   ├── time-entry/page.tsx     # Client-side time entry
│   ├── projects/page.tsx       # Client-side projects
│   └── reports/page.tsx        # Client-side reports
└── layout.tsx                  # Общий layout

src/screens/
├── workspace-time-entry.tsx    # Client wrapper
└── workspace/                  # Client components

src/entities/workspace/lib/
└── server-workspace.ts         # Server-side utils
```

## Migration Guide

### Что изменилось:

- ✅ Добавлен server-side редирект для `/tracker`
- ✅ Сохранена вся client-side логика
- ✅ Улучшен UX (zero мигания)
- ✅ Сохранена обратная совместимость

### Что осталось как было:

- ✅ Все client-side компоненты workspace
- ✅ RTK Query для данных
- ✅ Client-side навигация внутри workspace
- ✅ Все существующие маршруты

## Best Applied Patterns

1. **Hybrid approach** - лучшее из двух миров
2. **Progressive enhancement** - работает без JS
3. **Type safety** - строгая типизация
4. **Performance first** - zero мигание
5. **DX focused** - понятная архитектура

Эта архитектура обеспечивает максимальный UX и DX при минимальных компромиссах.
