---
paths:
  - "apps/api/**/*"
---

<!-- Дзеркало .cursor/rules/api.mdc — правити обидва. -->

# API (apps/api)

## Локалка після змін

- Dev: `npm run api` з кореня (= Nest watch). Зміни в `apps/api/src` підхоплюються самі.
- Схема: `npm run local:migrate` або `cd apps/api && npx prisma db push`
- Env: `apps/api/.env` (див. `npm run local:setup`, `scripts/LOCAL.md`)
- На Render runtime schema patches: `ensure-schema.cjs` (не `prisma` CLI в start)

## Структура фічі

- Одна фіча = `*.module.ts` + `*.controller.ts` + `*.service.ts` + `dto/*.dto.ts`
- Зареєструй модуль у `app.module.ts`, якщо новий
- DTO: `class-validator` / `class-transformer` (`@IsString`, `@IsOptional`, `@Type`…) — як у існуючих dto
- Бізнес-логіка в service; controller тонкий

## Auth і доступ до весілля

- Приватні ендпоінти: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(...)` + `@CurrentUser()`
- Скоуп весілля юзера — через `wedding-access.ts`:
  - `requireWeddingForUser` / `resolveWeddingForUser`
  - `requireWeddingOwner` коли лише OWNER
- Не вигадуй новий спосіб «знайти wedding по userId» — reuse цих хелперів
- Публічні роути (типу `rsvp/:token`, `website/public/:slug`) — без JWT, окремо від cabinet API

## Стиль змін

- Мінімальний diff; не рефактори сусідні модулі «по дорозі»
- Повідомлення помилок українською, у тому ж тоні що в проєкті
- Нові npm-пакети — лише якщо задача не закривається наявним стеком
