# Router Architecture Documentation

## 🎯 **Overview**

Эталонная архитектура роутинга с максимальным DX и соответствием лучшим практикам.

## 📁 **Structure**

```
src/shared/lib/router/
├── config.ts              # Единая конфигурация маршрутов
├── generators.ts          # Простые генераторы данных
├── utils.ts               # Утилиты для работы с путями
├── guards.ts              # Guards для защиты маршрутов
├── types.ts               # Общие типы
├── router-utils.ts        # Хелперы для metadata
├── router-utils.test.ts   # Тесты хелперов
├── index.ts               # Чистый API
└── README.md              # Документация
```

## 🏗️ **Architecture Principles**

### 1. **Single Source of Truth**

- `config.ts` содержит всю конфигурацию маршрутов
- Один файл для изменения любого маршрута

### 2. **Separation of Concerns**

- **Config**: Данные маршрутов
- **Generators**: Преобразование конфига в usable данные
- **Utils**: Переиспользуемые функции
- **Guards**: Логика защиты маршрутов
- **Router Utils**: Хелперы для metadata
- **Types**: TypeScript типы

### 3. **No Circular Dependencies**

- Shared слой не зависит от app слоя
- Чистая архитектура без циклов

### 4. **Maximum DX**

- Автогенерация типов из конфига
- Удобные константы (ROUTES.HOME)
- Простые функции (isPublicPath, requiresAuth)

### 5. **Principle of Locality**

- Вся логика роутинга в одной папке
- Тесты рядом с кодом
- Логические сгруппированные файлы

## 🚀 **Usage Examples**

### Basic Navigation

```typescript
import { ROUTES, paths } from '@/shared/lib/router';

// Константы для backward compatibility
const href = ROUTES.HOME; // '/'
const href = ROUTES.TODO_DETAIL; // Function

// Типизированные пути
const href = paths.home; // '/'
const href = paths.todos; // '/todos'
```

### Dynamic Routes

```typescript
import { dynamicPaths } from '@/shared/lib/router';

const todoUrl = dynamicPaths.todoDetail('123'); // '/todos/123'
const editUrl = dynamicPaths.todoEdit('123'); // '/todos/123/edit'
```

### Guards

```typescript
import { isPublicPath, requiresAuth } from '@/shared/lib/router';

if (requiresAuth(currentPath)) {
  // Redirect to login
}

if (isPublicPath(currentPath)) {
  // Allow access
}
```

### Navigation

```typescript
import { mainNavigation, filterNavigation } from '@/shared/lib/router';

const navItems = filterNavigation(mainNavigation, isAuthenticated);
```

### Metadata

```typescript
import { metadataConfig, getRouteMetadata } from '@/shared/lib/router';

// Прямой доступ к конфигу
const meta = metadataConfig['/todos']; // Typed metadata

// Удобный хелпер
const meta = getRouteMetadata('/todos'); // Same result
```

## 🔧 **Configuration**

### Adding New Routes

```typescript
// config.ts
export const routeConfig = {
  newRoute: {
    path: '/new-route' as const,
    public: true,
    metadata: { title: 'New Route' },
    navigation: { label: 'New', order: 5 },
  },
} as const;
```

### Dynamic Routes

```typescript
// config.ts
export const dynamicRouteConfig = {
  userDetail: {
    path: '/users/:id',
    protected: true,
    metadata: (title) => ({ title: `${title} - User` }),
  },
};

export const dynamicPaths = {
  userDetail: (id: string) => createDynamicPath('/users/:id', { id }),
};
```

## 🎨 **Benefits**

### ✅ **Developer Experience**

- Автодополнение для всех маршрутов
- Типизация путей и параметров
- Единый стиль импортов
- Все в одной папке

### ✅ **Maintainability**

- Легко добавлять новые маршруты
- Централизованная конфигурация
- Четкое разделение ответственности
- Локальность кода и тестов

### ✅ **Performance**

- Compile-time генерация
- Нет runtime оверхеда
- Оптимизированные guards

### ✅ **Architecture**

- Следует FSD принципам
- Нет циклических зависимостей
- Переиспользуемые компоненты
- Принцип локальности

## 🔄 **Migration from Old Architecture**

1. **All imports now from** `@/shared/lib/router`
2. **Same API** - backward compatible
3. **Better types** - improved autocompletion
4. **Cleaner structure** - easier to maintain
5. **Tests included** - comprehensive coverage

## 📝 **Best Practices**

1. **Always import from** `@/shared/lib/router`
2. **Use ROUTES constants** for backward compatibility
3. **Prefer typed paths** over string literals
4. **Add navigation config** for routes in menu
5. **Use guards** for auth checks
6. **Keep tests nearby** - same folder

## 🧪 **Testing**

```bash
# Запустить тесты роутера
npm test src/shared/lib/router/router-utils.test.ts

# Все тесты
npm test
```

---

**This architecture serves as a reference implementation for routing in Next.js applications with FSD methodology.**
