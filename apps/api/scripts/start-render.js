const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Schema/migrate runs in scripts/render-build.sh (build RAM).
// Runtime free tier is 512MB — prisma CLI OOMs here.

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
