const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Apply idempotent SQL without prisma CLI (CLI OOMs on Render free 512MB).
 * Uses vendored PrismaClient + query engine only.
 */
async function applySqlFile(prisma, filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn('[nitka-api] migrate file missing:', filePath);
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  // Split on semicolons that are outside DO $$ ... $$ blocks.
  const statements = [];
  let buf = '';
  let inDo = false;
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (/^DO\s+\$\$/i.test(trimmed)) inDo = true;
    buf += `${line}\n`;
    if (inDo) {
      if (/END\s+\$\$\s*;?\s*$/i.test(trimmed)) {
        inDo = false;
        statements.push(buf.trim());
        buf = '';
      }
      continue;
    }
    if (trimmed.endsWith(';')) {
      statements.push(buf.trim());
      buf = '';
    }
  }
  if (buf.trim()) statements.push(buf.trim());

  for (const stmt of statements) {
    const sql = stmt.replace(/;\s*$/, '').trim();
    if (!sql || sql.startsWith('--')) continue;
    try {
      await prisma.$executeRawUnsafe(sql);
    } catch (err) {
      console.warn('[nitka-api] sql soft-fail:', err.message?.slice(0, 200));
    }
  }
}

async function migrateThenStart() {
  // Ensure vendored client is in place (build already did this; belt+suspenders).
  try {
    require('./restore-prisma-client.cjs');
  } catch {
    /* restore exits process on Render if missing; ignore local */
  }

  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    console.log('[nitka-api] applying SQL migrate (no prisma CLI)…');
    await applySqlFile(
      prisma,
      path.join(__dirname, '..', 'prisma', 'migrate-task-status.sql'),
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
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
}

migrateThenStart().catch((err) => {
  console.error('[nitka-api] boot failed', err);
  process.exit(1);
});
