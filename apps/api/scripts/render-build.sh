#!/usr/bin/env bash
# Ultra-light Render build: no Nest, no prisma generate (both OOM on free tier).
set -euo pipefail
export PRISMA_SKIP_POSTINSTALL_GENERATE=1
export PRISMA_HIDE_UPDATE_MESSAGE=1
npm install --omit=dev --no-audit --no-fund
node scripts/restore-prisma-client.cjs
node scripts/verify-dist.cjs
