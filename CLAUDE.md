# fata.studio (wedding) — Claude Code

Монорепо без workspaces: кожен застосунок має свій `package.json`.

| Папка | Стек | Що це |
|-------|------|-------|
| `apps/api` | NestJS + Prisma + Postgres | API (`:3001`, префікс `/api`) |
| `apps/web` | Next.js (App Router) + SCSS | сайт, кабінет пари, редактор сайту, публічний `/w/[slug]` |
| `apps/mobile` | Expo | мобільний клієнт до того ж API (див. `apps/mobile/README.md`) |
| `scripts/` | `local.cjs`, `LOCAL.md` | локальний сетап |

Прод: Render (`render.yaml`).

## Загальні нотатки для агентів

@AGENTS.md

## Правила, що діють завжди

Джерело — `.cursor/rules/*.mdc` (спільні з Cursor). Імпортуються як є:

@.cursor/rules/local-dev.mdc
@.cursor/rules/brand.mdc
@.cursor/rules/cabinet-scss.mdc
@.cursor/rules/cleanup-removed-features.mdc
@.cursor/rules/figma-screenshots.mdc

## Правила для окремих частин коду

Вони лежать у `.claude/rules/` і підтягуються автоматично, коли працюю з відповідними файлами:

- `api.md` → `apps/api/**`
- `frontend.md` → `apps/web/**/*.{tsx,ts,scss}`
- `seating-wizard.md` → розсадка (`seating*`, `styles/seating`, `app/seating`)
- `website-editor.md` → редактор сайту і публічний сайт (`website`, `w`, `wedding-site`)

Це копії відповідних `.cursor/rules/*.mdc`. Коли змінюєш правило, онови обидва файли.

## Спілкування

- Відповідай українською.
- Тексти в UI пиши українською; назва продукту — fata.studio.
