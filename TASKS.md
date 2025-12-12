# Задачи проекта (todo-next)

## Цель

Сделать репозиторий эталонной основой (template) для профессиональных Next.js приложений.

## Backlog

- [x] Устранить расхождения с best practices (конфиги, структура, env, качество).
- [x] Привести CI и локальные скрипты к единому "quality gate" (lint/typecheck/format/typecheck/test).
- [x] Добавить минимальный слой тестирования (unit) и включить в CI через общий quality gate.
- [x] Проверить, что FSD-правила реально работают (ESLint boundaries) и устранить нарушения слоёв.
- [x] Привести документацию/примеры запуска к актуальным портам и переменным окружения.
- [x] Опционально: добавить типизированные Redux hooks (useAppDispatch/useAppSelector) и public API, чтобы не писать типы стора вручную в фичах.
- [x] Привести app shell (header/main/footer) к переиспользуемому виду и добавить breadcrumbs/page title в хедер (включая динамический title для /todos/[id]).
- [ ] Опционально: добавить smoke e2e (Playwright) и запуск в CI.
