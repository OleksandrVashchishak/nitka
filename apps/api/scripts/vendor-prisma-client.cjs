#!/usr/bin/env node
/**
 * Local helper: prisma generate + copy client into vendored/ for Render.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'node_modules', '.prisma', 'client');
const dest = path.join(root, 'vendored', 'prisma-client');

const gen = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['prisma', 'generate', '--schema', 'prisma/schema.prisma'],
  { cwd: root, stdio: 'inherit', shell: true },
);
if (gen.status !== 0) process.exit(gen.status ?? 1);

if (!fs.existsSync(src)) {
  console.error('[prisma-vendor] generate did not create', src);
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('[prisma-vendor] wrote', path.relative(root, dest));
