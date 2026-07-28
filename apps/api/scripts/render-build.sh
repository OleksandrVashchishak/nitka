#!/usr/bin/env bash
# Ultra-light Render build — never compile Nest (dist is in git).
set -euo pipefail
npm install --omit=dev --no-audit --no-fund
npx prisma generate
node scripts/verify-dist.cjs
