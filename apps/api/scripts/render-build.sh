#!/usr/bin/env bash
# Ultra-light Render build: no Nest compile, no prisma generate.
# db push runs here (build RAM >> 512MB runtime).
set -euo pipefail
export PRISMA_SKIP_POSTINSTALL_GENERATE=1
export PRISMA_HIDE_UPDATE_MESSAGE=1

npm install --omit=dev --no-audit --no-fund
node scripts/restore-prisma-client.cjs
node scripts/verify-dist.cjs

# Schema sync on build machine (runtime free tier OOMs on prisma CLI).
npx prisma db execute --schema prisma/schema.prisma --file prisma/migrate-task-status.sql || true
npx prisma db push --schema prisma/schema.prisma --accept-data-loss
