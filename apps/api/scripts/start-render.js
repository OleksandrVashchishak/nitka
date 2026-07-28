const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Schema via PrismaClient (not prisma CLI — OOM on free 512MB).
try {
  require('./restore-prisma-client.cjs');
} catch {
  /* restore may already have run in build */
}

console.log('[nitka-api] ensuring schema…');
const ensure = spawnSync(
  process.execPath,
  [path.join(__dirname, 'ensure-schema.cjs')],
  { stdio: 'inherit' },
);
if (ensure.status !== 0) {
  console.warn('[nitka-api] ensure-schema exited', ensure.status, '— continuing boot');
}

const candidates = ['dist/main.js', 'dist/src/main.js'].map((p) =>
  path.join(process.cwd(), p),
);
const entry = candidates.find((p) => fs.existsSync(p));
if (!entry) {
  console.error('[nitka-api] Nest entrypoint not found');
  process.exit(1);
}

console.log('[nitka-api] starting', path.relative(process.cwd(), entry));
const node = spawnSync(process.execPath, [entry], { stdio: 'inherit' });
process.exit(node.status ?? 1);
