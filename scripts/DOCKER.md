# Local Docker (Windows)

> **Лише локалка.** Прод = Render (`render.yaml`). Зміни compose/Dockerfile **не** впливають на деплой.

Агентам: читай також `.cursor/rules/docker-local.mdc`.

## One-liners

```bash
node scripts/docker.cjs up
node scripts/docker.cjs status
node scripts/docker.cjs smoke
node scripts/docker.cjs rebuild-api   # після змін apps/api/src
node scripts/docker.cjs down
node scripts/docker.cjs reset         # Desktop здох / 500 / crash-loop
```

З кореня (якщо є root `package.json`):

```bash
npm run docker:up
npm run docker:status
npm run docker:reset
```

| URL | Що |
|-----|-----|
| http://localhost:3000 | web |
| http://localhost:3001/api/health | api |
| localhost:5432 | postgres (`wedding`/`wedding`/`wedding`) |

## RAM
Docker Desktop → Resources → Memory: **≥ 8 GB**.

## Як влаштований старт api
- Команда: `node scripts/start-render.js` (як на Render)
- Схема: `ensure-schema.cjs` (SQL patches), **не** `prisma db push`
- Prisma client: debian engine з `vendored/` (bake в image через `FORCE_PRISMA_RESTORE=1`)
- Немає `nest --watch` (OOM на Win Docker)

## NEVER в контейнері api
```bash
# НЕ РОБИ ТАК — fork-bomb → OOM → Docker Desktop падає
docker compose exec api npx prisma …
docker compose exec api prisma db push
```

Повний schema sync з хоста (коли треба):
```bash
# db має слухати localhost:5432
cd apps/api
# DATABASE_URL=postgresql://wedding:wedding@localhost:5432/wedding?schema=public
npx prisma db push
```

## API code reload
```bash
node scripts/docker.cjs rebuild-api
```
Це викликає **реальний** Nest CLI (`node_modules/@nestjs/cli/bin/nest.js`), не Render nest-shim.

## Web .next зламався
```powershell
Remove-Item -Recurse -Force apps/web/.next
node scripts/docker.cjs up
# або: docker compose restart web
```

## Troubleshooting
| Симптом | Дія |
|---------|-----|
| `docker` → 500 / зависає | `node scripts/docker.cjs reset` |
| api crash-loop, Desktop тупить | `reset` (прибирає контейнери) |
| api unhealthy після змін prisma | не запускай prisma в контейнері; rebuild image: `docker compose build api --no-cache` потім `up` |
| web не відповідає | `docker compose logs web --tail 80` |
