#!/usr/bin/env node
/**
 * Restore pre-generated Prisma client into node_modules.
 * Render free tier OOMs / hangs on `prisma generate` — we commit the client instead.
 *
 * ONLY on Render (or FORCE_PRISMA_RESTORE=1). Locally / Docker the vendored Windows
 * bits must not clobber a correct linux engine unless we explicitly force it
 * (Docker bookworm image build copies debian engine from vendored).
 *
 * Never process.exit on skip — this file is required() from start-render.js.
 */
const fs = require('fs');
const path = require('path');

function main() {
  const onRender = !!(process.env.RENDER || process.env.RENDER_SERVICE_ID);
  if (!onRender && !process.env.FORCE_PRISMA_RESTORE) {
    console.log('[prisma-restore] skip (not Render; use local/image prisma client)');
    return;
  }

  const root = path.join(__dirname, '..');
  const src = path.join(root, 'vendored', 'prisma-client');
  const dest = path.join(root, 'node_modules', '.prisma', 'client');

  if (!fs.existsSync(src)) {
    if (onRender) {
      console.error('[prisma-restore] missing vendored/prisma-client on Render');
      process.exit(1);
    }
    console.warn('[prisma-restore] skip — run npm run prisma:vendor once');
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log('[prisma-restore] restored', path.relative(root, dest));
}

main();
