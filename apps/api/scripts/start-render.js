const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, args) {
  console.log(`[nitka-api] $ ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Ідемпотентна міграція + sync схеми (Render free: тільки в start)
run('npx', [
  'prisma',
  'db',
  'execute',
  '--schema',
  'prisma/schema.prisma',
  '--file',
  'prisma/migrate-task-status.sql',
]);
run('npx', [
  'prisma',
  'db',
  'push',
  '--schema',
  'prisma/schema.prisma',
  '--accept-data-loss',
]);

const candidates = ['dist/main.js', 'dist/src/main.js'].map((p) =>
  path.join(process.cwd(), p),
);
const entry = candidates.find((p) => fs.existsSync(p));
if (!entry) {
  console.error('[nitka-api] Nest entrypoint not found. Looked for:');
  for (const p of candidates) console.error(' -', p);
  process.exit(1);
}

console.log('[nitka-api] starting', path.relative(process.cwd(), entry));
const node = spawnSync(process.execPath, [entry], { stdio: 'inherit' });
process.exit(node.status ?? 1);
