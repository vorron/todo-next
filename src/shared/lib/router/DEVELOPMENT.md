# 🔧 Router Development

## 📚 Complete Documentation

Для полной информации о разработке с системой роутинга см. [**Complete Routing Guide**](../../../../../docs/complete-routing-guide.md#developer-experience)

## 🚀 Quick Development Tools

```typescript
import { debugRouting, createRouteTester, devShortcuts } from '@/shared/lib/router';

// Отладка всей системы
debugRouting();

// Тестирование маршрутов
const tester = createRouteTester();
tester.test('/todos/123');

// Dev shortcuts в консоли
(window as any).router = devShortcuts;
router.debug();
```

## 🔍 Common Development Tasks

### Добавление нового маршрута

См. [Configuration Guide](../../../../../docs/complete-routing-guide.md#configuration)

### Отладка проблем

См. [Troubleshooting](../../../../../docs/complete-routing-guide.md#troubleshooting)

### Тестирование

См. [Testing](../../../../../docs/complete-routing-guide.md#testing)

---

_Для полной документации см. [Complete Routing Guide](../../../../../docs/complete-routing-guide.md)_
