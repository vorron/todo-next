# Todo App — Enterprise Template

Production-ready шаблон для создания enterprise-приложений на базе Next.js 16.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **Architecture**: Feature-Sliced Design (FSD)

## Quick Start

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка окружения
cp .env.example .env

# 3. Запуск mock API (в отдельном терминале)
npm run json-server

# 4. Запуск dev-сервера
npm run dev
```

Приложение доступно на [http://localhost:3002](http://localhost:3002)

## Scripts

| Команда                | Описание                |
| ---------------------- | ----------------------- |
| `npm run dev`          | Запуск dev-сервера      |
| `npm run build`        | Production сборка       |
| `npm run lint`         | ESLint проверка         |
| `npm run format`       | Форматирование Prettier |
| `npm run format:check` | Проверка форматирования |
| `npm run json-server`  | Запуск mock API         |

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

## License

MIT
