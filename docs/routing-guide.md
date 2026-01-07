# Routing System Documentation

## Overview

Система роутинга приложения построена на принципах единой конфигурации, автоматической генерации и строгой типизации.

## Architecture

### Core Files

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

### Design Principles

1. **Single Source of Truth** - `router-config.ts`
2. **Automatic Generation** - типы и функции из конфигурации
3. **Type Safety** - строгая типизация без `any`
4. **Separation of Concerns** - композиция хуков
5. **Hierarchical Support** - sections/pages navigation

## Configuration

### Route Types

```typescript
// Static routes
export const ROUTES = {
  HOME: '/',
  TODOS: '/todos',
  TRACKER: '/workspace', // Tracker UI → workspace implementation
  TIME_ENTRY: '/time-entry',
} as const;

// Dynamic routes
export const ROUTES = {
  TODO_DETAIL: (id: string) => `/todos/${id}`,
  WORKSPACE_DASHBOARD: (id: string) => `/workspace/${id}`,
} as const;
```

### Navigation Configuration

```typescript
// Section level navigation
navigation: {
  label: 'Tracker',
  order: 2,
  level: 'section', // Раздел верхнего уровня
}

// Page level navigation
navigation: {
  label: 'Time Entry',
  level: 'page',
  parent: 'tracker', // Дочерняя страница раздела
}
```

## Usage

### Basic Navigation

```typescript
import { useNavigation } from '@/shared/lib/router';

function MyComponent() {
  const { navigateToTodos, navigateToTracker, navigateToTimeEntry } = useNavigation();

  return (
    <nav>
      <button onClick={navigateToTodos}>Todos</button>
      <button onClick={navigateToTracker}>Tracker</button>
      <button onClick={navigateToTimeEntry}>Time Entry</button>
    </nav>
  );
}
```

### Hierarchical Navigation

```typescript
function NavigationMenu() {
  const {
    getMainNavigation,
    getSectionChildren,
    getBreadcrumbs,
    isSection
  } = useNavigation();

  const mainNav = getMainNavigation();
  const trackerChildren = getSectionChildren('tracker');
  const breadcrumbs = getBreadcrumbs('/todos/123');

  return (
    <div>
      {/* Main menu */}
      {mainNav.map(item => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}

      {/* Breadcrumbs */}
      {breadcrumbs.map(crumb => (
        <span key={crumb.href}>{crumb.label}</span>
      ))}
    </div>
  );
}
```

### Section Navigation

```typescript
function TrackerSection() {
  const { navigateToSection, navigateToDefaultState } = useNavigation();

  // Navigate to section with default state
  const handleTrackerClick = () => {
    navigateToSection('tracker'); // → /workspace (with default state logic)
  };

  // Navigate to specific default state
  const handleDefaultState = () => {
    navigateToDefaultState('/workspace'); // → appropriate state
  };

  return <button onClick={handleTrackerClick}>Open Tracker</button>;
}
```

## Stateful Routes

### Configuration

```typescript
export const statefulRouteConfigData = {
  workspace: {
    path: '/workspace',
    navigation: {
      label: 'Tracker',
      level: 'section',
    },
    states: {
      loading: {
        /* ... */
      },
      select: {
        /* ... */
      },
      create: {
        /* ... */
      },
      dashboard: {
        /* ... */
      },
    },
  },
};
```

### Usage

```typescript
function WorkspacePage() {
  const { getStatefulStates, needsDefaultStateRedirect } = useNavigation();

  const states = getStatefulStates('/workspace');
  const needsRedirect = needsDefaultStateRedirect('/workspace');

  if (needsRedirect) {
    // Redirect to appropriate state based on user context
  }

  return (
    <div>
      {states.map(state => (
        <button key={state.key} onClick={() => router.push(state.href)}>
          {state.label}
        </button>
      ))}
    </div>
  );
}
```

## Utilities

### Navigation Path Generation

```typescript
import { getNavigationPath } from '@/shared/lib/router';

const breadcrumbs = getNavigationPath('/todos/123');
// Returns: [{ href: '/todos', label: 'Todos' }, { href: '/todos/123', label: 'Todo #123' }]
```

### Section Children

```typescript
import { getChildNavigation } from '@/shared/lib/router';

const trackerPages = getChildNavigation('tracker');
// Returns: [{ href: '/time-entry', label: 'Time Entry', level: 'page' }]
```

### Default State Resolution

```typescript
import { getDefaultStateUrl } from '@/shared/lib/router';

const defaultUrl = getDefaultStateUrl('/workspace');
// Returns: '/workspace/select' or '/workspace/create' or '/time-entry' based on context
```

## Best Practices

### 1. Route Organization

- Use descriptive names in ROUTES constants
- Group related routes together
- Document UI vs implementation relationships

### 2. Navigation Configuration

- Always specify `level` for hierarchical navigation
- Use `parent` for child pages
- Set appropriate `order` for menu positioning

### 3. Type Safety

- Import types from `router-config.ts`
- Use generated navigation functions
- Avoid string literals for routes

### 4. Component Usage

```typescript
// ✅ Good: Use generated functions
const { navigateToTodos } = useNavigation();

// ❌ Bad: Use string literals
router.push('/todos');
```

## Migration Guide

### Adding New Routes

1. Add to `ROUTES` in `router-config.ts`
2. Add navigation configuration if needed
3. Use generated navigation functions
4. Update types if necessary

### Adding Hierarchical Pages

1. Set `level: 'page'` in navigation config
2. Specify `parent` section
3. Use hierarchical navigation utilities

### Stateful Routes

1. Add to `statefulRouteConfigData`
2. Define states with appropriate configurations
3. Handle default state redirects

## Troubleshooting

### Common Issues

1. **Duplicate paths** - Check route configurations for conflicts
2. **Missing navigation** - Verify navigation configuration exists
3. **Type errors** - Ensure proper imports from generated types
4. **Redirect loops** - Check default state logic

### Debug Tools

```typescript
// Check navigation configuration
console.log(getMainNavigation());

// Verify route generation
console.log(ROUTES);

// Test hierarchical relationships
console.log(getChildNavigation('section-name'));
```

## Performance Considerations

- Navigation functions are memoized
- Route generation happens at build time
- Hierarchical utilities use efficient lookups
- Type checking is compile-time only

## Future Enhancements

- Route-based code splitting
- Advanced breadcrumb generation
- Navigation analytics
- Route guards and permissions
