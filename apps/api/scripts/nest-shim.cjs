#!/usr/bin/env node
/**
 * Nest CLI shim: `nest build` on Render OOMs (>8GB). Use committed dist instead.
 * Other nest commands still forward to the real CLI when present.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args[0] === 'build') {
  console.log('[nest-shim] nest build → verify prebuilt dist (Render OOM guard)');
  const verify = path.join(__dirname, 'verify-dist.cjs');
  const result = spawnSync(process.execPath, [verify], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

const candidates = [
  path.join(__dirname, '..', 'node_modules', '@nestjs', 'cli', 'bin', 'nest.js'),
  path.join(__dirname, '..', 'node_modules', '@nestjs', 'cli', 'bin', 'nest'),
];
const real = candidates.find((p) => fs.existsSync(p));
if (!real) {
  console.error('[nest-shim] @nestjs/cli not installed; only `nest build` is shimmed');
  process.exit(1);
}

const result = spawnSync(process.execPath, [real, ...args], {
  stdio: 'inherit',
  env: process.env,
});
process.exit(result.status ?? 1);
