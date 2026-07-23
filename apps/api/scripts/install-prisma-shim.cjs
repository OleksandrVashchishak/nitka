#!/usr/bin/env node
/**
 * Installs a Prisma CLI shim into node_modules/.bin so `npx prisma ...`
 * picks it up (needed for Render's legacy Start Command).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const binDir = path.join(root, 'node_modules', '.bin');
const shimAbs = path.resolve(__dirname, 'prisma-shim.cjs');

if (!fs.existsSync(binDir)) {
  console.warn('[prisma-shim] node_modules/.bin missing — skip');
  process.exit(0);
}

const launcher = `#!/usr/bin/env node
require(${JSON.stringify(shimAbs)});
`;

const targets = ['prisma'];
for (const name of targets) {
  const unixPath = path.join(binDir, name);
  fs.writeFileSync(unixPath, launcher, { mode: 0o755 });

  // Windows npm also uses *.cmd
  const cmdPath = path.join(binDir, `${name}.cmd`);
  const cmd = `@ECHO off\r\nnode ${JSON.stringify(shimAbs)} %*\r\n`;
  fs.writeFileSync(cmdPath, cmd);

  const ps1Path = path.join(binDir, `${name}.ps1`);
  const ps1 = `#!/usr/bin/env pwsh\nnode ${JSON.stringify(shimAbs)} @args\nexit $LASTEXITCODE\n`;
  fs.writeFileSync(ps1Path, ps1);
}

console.log('[prisma-shim] installed for npx prisma');
