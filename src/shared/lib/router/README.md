# 🚀 Router System

## 📚 Complete Documentation

Для полной информации о системе роутинга см. [**Complete Routing Guide**](../../../../../docs/complete-routing-guide.md)

## 🚀 Quick Start

```typescript
import { ROUTES, paths, dynamicPaths } from '@/shared/lib/router';

// Базовое использование
paths.home; // '/'
dynamicPaths.todoDetail('123'); // '/todos/123'
ROUTES.TODOS; // '/todos'
```

## 🔄 Stateful Routing

```typescript
import { useWorkspaceStateful, useWorkspaceNavigationActions } from '@/entities/workspace';

const { state } = useWorkspaceStateful();
const { navigateToDashboard } = useWorkspaceNavigationActions();
```

## 🔍 Development Tools

```typescript
import { debugRouting, createRouteTester } from '@/shared/lib/router';

debugRouting(); // Полная диагностика
const tester = createRouteTester(); // Тестирование маршрутов
```

---

_Для подробной документации см. [Complete Routing Guide](../../../../../docs/complete-routing-guide.md)_
