Балансируем архитектуру правильно

Entities (src/entities/):

// Только фундаментальные бизнес-сущности
- Типы данных (Todo, User)
- Zod схемы для валидации  
- Базовые API endpoints (RTK Query)
- Чистые утилиты (без зависимостей от React/Redux)

Features (src/features/):

// Конкретная бизнес-логика
- Сложные хуки (useTodos, useAuth)
- Специфичные компоненты (TodoCard, LoginForm)
- Слайсы состояния (authSlice, settingsSlice)
- Бизнес-правила и преобразования данных

Shared (src/shared/):

// Переиспользуемые инфраструктурные части
- UI компоненты (Button, Input, Card)
- API абстракции
- Утилиты (cn, formatters)
- Конфигурация (routes, env)

Пример правильной структуры Todo:

Entities (src/entities/todo/):

// api/todo-api.ts - RTK Query endpoints
// model/types.ts - Todo, CreateTodoDto, UpdateTodoDto  
// model/todo-schema.ts - Zod схемы
// lib/todo-helpers.ts - чистые функции (isTodoOverdue, formatDueDate)

Features (src/features/todos/):

// model/use-todos.ts - хуки с бизнес-логикой
// ui/todo-card/ - компоненты с состоянием
// ui/todo-actions/ - компоненты действий