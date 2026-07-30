#!/usr/bin/env node
/**
 * Shim around Prisma CLI: inject --url/--schema for `db execute`
 * so Render Dashboard Start Command without flags still works.
 *
 * IMPORTANT: strip node_modules/.bin from PATH when spawning the real CLI,
 * otherwise Prisma re-execs `prisma` → hits this shim again → fork bomb → OOM.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const realPrisma = require.resolve('prisma/build/index.js');
const args = process.argv.slice(2);

function hasFlag(list, name) {
  return list.some((a) => a === name || a.startsWith(`${name}=`));
}

const isDbExecute = args[0] === 'db' && args[1] === 'execute';
if (isDbExecute && !hasFlag(args, '--url') && !hasFlag(args, '--schema')) {
  if (process.env.DATABASE_URL) {
    args.push('--url', process.env.DATABASE_URL);
  } else {
    args.push('--schema', path.join(process.cwd(), 'prisma', 'schema.prisma'));
  }
}

const env = { ...process.env };
const binDir = path.join(process.cwd(), 'node_modules', '.bin');
const pathKey = process.platform === 'win32' ? 'Path' : 'PATH';
const rawPath = env[pathKey] || env.PATH || '';
env.PATH = rawPath
  .split(path.delimiter)
  .filter((p) => p && path.resolve(p) !== path.resolve(binDir))
  .join(path.delimiter);
if (process.platform === 'win32') env.Path = env.PATH;

const result = spawnSync(process.execPath, [realPrisma, ...args], {
  stdio: 'inherit',
  env,
});
process.exit(result.status ?? 1);
