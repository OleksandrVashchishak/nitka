# Local development (fata.studio)

Прод = Render (`render.yaml`). Локалка = Postgres + Nest API + Next web на хості.

Для агентів: також `.cursor/rules/local-dev.mdc` (alwaysApply).

## Щоденний старт

```bash
npm run api              # http://localhost:3001
npm run web              # http://localhost:3000
npm run local:status     # postgres / api / web
```

| URL | Сервіс |
|-----|--------|
| http://localhost:3000 | web (Next) |
| http://localhost:3001/api/health | api (Nest) |
| localhost:5432 | postgres (`wedding` / `wedding` / `wedding`) |

## Перший сетап

```bash
npm run local:setup
npm run local:install
npm run local:db
npm run local:migrate
npm run local:seed       # опційно
```

### Postgres 16 (раз на машину)

```powershell
winget install PostgreSQL.PostgreSQL.16 --accept-package-agreements --accept-source-agreements --override "--mode unattended --superpassword wedding --serverport 5432 --disable-components stackbuilder"
```

Новий термінал → `npm run local:db && npm run local:migrate`.

Windows service: `postgresql-x64-16`.

## Env

| Файл | Для |
|------|-----|
| `apps/api/.env` | Nest + Prisma |
| `apps/web/.env.local` | Next |
| `.env.example` | шаблон / коментарі |

Створити автоматично: `npm run local:setup`.

## npm scripts (корінь)

| Script | Що робить |
|--------|-----------|
| `local:setup` | `.env` файли + перевірка `psql` |
| `local:install` | deps (api з `--include=dev`) |
| `local:db` | role/db `wedding` |
| `local:migrate` | `prisma generate` + `db push` + `ensure-schema` |
| `local:seed` | seed |
| `local:status` | health probes |
| `api` | Nest `--watch` |
| `web` | Next `dev` |

Хелпер: `node scripts/local.cjs <setup|install|db|migrate|seed|status>`.

## API notes

- `apps/api/.npmrc` → `omit=dev` (Render). Локально: `npm run local:install`.
- Dev entry: `apps/api` → `npm run start:dev` (читає `.env` через `node --env-file`).
- Після правок у `apps/api/src` — просто зберігай; watch перезбирає.
- Схема: `npm run local:migrate` або `cd apps/api && npx prisma db push`.
