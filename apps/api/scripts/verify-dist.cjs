#!/usr/bin/env node
/**
 * Render-safe "build": never run nest build (OOM on free/low RAM).
 * Dist is committed; we only check the entrypoint exists.
 */
const fs = require('fs');
const path = require('path');

const candidates = ['dist/main.js', 'dist/src/main.js'].map((p) =>
  path.join(__dirname, '..', p),
);
const entry = candidates.find((p) => fs.existsSync(p));

if (!entry) {
  console.error('[nitka-api] Missing Nest dist entry. Looked for:');
  for (const p of candidates) console.error(' -', p);
  console.error('Rebuild locally: npm run build:nest && commit apps/api/dist');
  process.exit(1);
}

console.log(
  '[nitka-api] using prebuilt dist:',
  path.relative(path.join(__dirname, '..'), entry),
);
