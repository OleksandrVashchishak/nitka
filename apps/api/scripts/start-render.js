const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, args, { optional = false } = {}) {
  console.log(`[nitka-api] $ ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    if (optional) {
      console.warn(
        `[nitka-api] optional step failed (exit ${result.status}), continuing…`,
      );
      return false;
    }
    process.exit(result.status ?? 1);
  }
  return true;
}

// SQL-міграція ідемпотентна, але не блокуємо старт якщо щось пішло не так —
// prisma db push нижче піджене схему.
run(
  'npx',
  [
    'prisma',
    'db',
    'execute',
    '--schema',
    'prisma/schema.prisma',
    '--file',
    'prisma/migrate-task-status.sql',
  ],
  { optional: true },
);

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
