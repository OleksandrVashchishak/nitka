#!/usr/bin/env node
/**
 * Installs Prisma + Nest CLI shims into node_modules/.bin
 * so Render Dashboard legacy commands don't OOM / fail on flags.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const binDir = path.join(root, 'node_modules', '.bin');

if (!fs.existsSync(binDir)) {
  console.warn('[api-shims] node_modules/.bin missing — skip');
  process.exit(0);
}

function installShim(name, scriptFile) {
  const shimAbs = path.resolve(__dirname, scriptFile);
  const launcher = `#!/usr/bin/env node
require(${JSON.stringify(shimAbs)});
`;

  fs.writeFileSync(path.join(binDir, name), launcher, { mode: 0o755 });
  fs.writeFileSync(
    path.join(binDir, `${name}.cmd`),
    `@ECHO off\r\nnode ${JSON.stringify(shimAbs)} %*\r\n`,
  );
  fs.writeFileSync(
    path.join(binDir, `${name}.ps1`),
    `#!/usr/bin/env pwsh\nnode ${JSON.stringify(shimAbs)} @args\nexit $LASTEXITCODE\n`,
  );
}

installShim('prisma', 'prisma-shim.cjs');
installShim('nest', 'nest-shim.cjs');

// Also rewrite @nestjs/cli package bin so `npx nest` / direct resolves hit the shim.
try {
  const cliPkgPath = path.join(root, 'node_modules', '@nestjs', 'cli', 'package.json');
  if (fs.existsSync(cliPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(cliPkgPath, 'utf8'));
    const rel = path
      .relative(path.join(root, 'node_modules', '@nestjs', 'cli'), path.resolve(__dirname, 'nest-shim.cjs'))
      .replace(/\\/g, '/');
    pkg.bin = { nest: rel.startsWith('.') ? rel : `./${rel}` };
    fs.writeFileSync(cliPkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log('[api-shims] rewrote @nestjs/cli bin → nest-shim');
  }
} catch (err) {
  console.warn('[api-shims] could not rewrite @nestjs/cli bin:', err.message);
}

console.log('[api-shims] installed prisma + nest');
