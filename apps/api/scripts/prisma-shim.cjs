#!/usr/bin/env node
/**
 * Shim around Prisma CLI: inject --url/--schema for `db execute`
 * so Render Dashboard Start Command without flags still works.
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

const result = spawnSync(process.execPath, [realPrisma, ...args], {
  stdio: 'inherit',
  env: process.env,
});
process.exit(result.status ?? 1);
