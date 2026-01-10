# 🚀 Router System

## 📚 Complete Documentation

Для полной информации о системе роутинга см. [**ROUTING_GUIDE**](../../../../docs/ROUTING_GUIDE.md)

## 🚀 Quick Start

```typescript
import { ROUTES, useNavigation } from '@/shared/lib/router';

// Базовое использование
ROUTES.HOME;           // '/'
ROUTES.TODOS;          // '/todos'
ROUTES.TODO_DETAIL('123'); // '/todos/123'

// Навигационные функции
function MyComponent() {
  const { navigateToTodos, navigateToTodoDetail } = useNavigation();

  return (
    <nav>
      <button onClick={navigateToTodos}>Todos</button>
      <button onClick={() => navigateToTodoDetail('123')}>Detail</button>
    </nav>
  );
}
```

## 🔧 Development Tools

```typescript
import { debugRouting, createRouteTester } from '@/shared/lib/router';

debugRouting(); // Полная диагностика
const tester = createRouteTester(); // Тестирование маршрутов
```

---

_Для подробной документации см. [ROUTING_GUIDE](../../../../docs/ROUTING_GUIDE.md)_
