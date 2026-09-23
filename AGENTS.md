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

## Do not

- Do not invent a container-based local workflow for this repo.
- Do not run `npm install` in `apps/api` without `--include=dev` (see `.npmrc` `omit=dev`).

## Prod

Render blueprint: `render.yaml` (native Node, managed Postgres). Start path: `apps/api` → `npm run start:prod` / `scripts/start-render.js`.
