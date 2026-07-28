#!/usr/bin/env node
/**
 * Restore pre-generated Prisma client into node_modules.
 * Render free tier OOMs / hangs on `prisma generate` — we commit the client instead.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'vendored', 'prisma-client');
const dest = path.join(root, 'node_modules', '.prisma', 'client');

if (!fs.existsSync(src)) {
  // Local first clone before `npm run prisma:vendor`
  if (process.env.RENDER || process.env.RENDER_SERVICE_ID) {
    console.error('[prisma-restore] missing vendored/prisma-client on Render');
    process.exit(1);
  }
  console.warn('[prisma-restore] skip — run npm run prisma:vendor once');
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('[prisma-restore] restored', path.relative(root, dest));
