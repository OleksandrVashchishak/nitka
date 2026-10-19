# Agent notes — fata.studio (wedding)

## Run locally

Follow **`.cursor/rules/local-dev.mdc`** and **`scripts/LOCAL.md`**.

Short version (already set up on this machine):

```bash
npm run api    # :3001
npm run web    # :3000
npm run local:status
```

First-time / new machine: `local:setup` → `local:install` → `local:db` → `local:migrate` → `api` + `web`.

## Візуальна перевірка сторінок (кабінет)

Коли правиш UI кабінету (`apps/web`), перевір сторінку наживо в браузері, не лише по коду.

1. Переконайся, що `api` + `web` підняті (`npm run local:status`).
2. Якщо треба залогінитись — тестовий акаунт із сиду: `/login` → `couple@test.local` / `demo1234` → «Увійти». Повний список акаунтів і креди — у `scripts/LOCAL.md` («Тестові акаунти»). Якщо `Невірний email або пароль` — спершу `npm run local:seed`.
3. Відкрий потрібну сторінку (напр. `/support`), зроби скриншот. Для звірки з макетом виставляй ту саму ширину, що в дизайні (зазвичай 1440).
4. Вихід: меню профілю (ініціали справа вгорі) → «Вийти з акаунту».

Логін — звичайна форма; жодних бекдорів / обходу авторизації в код не додавати (навіть у dev — ризик, що доживе до проду).

## Do not

- Do not invent a container-based local workflow for this repo.
- Do not run `npm install` in `apps/api` without `--include=dev` (see `.npmrc` `omit=dev`).

## Prod

Render blueprint: `render.yaml` (native Node, managed Postgres). Start path: `apps/api` → `npm run start:prod` / `scripts/start-render.js`.
