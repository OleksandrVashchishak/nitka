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
console.log('[api-shims] installed prisma + nest');
