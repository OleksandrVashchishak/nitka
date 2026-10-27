// Перед `next dev`: якщо кеш .next розрісся — видаляємо (він перебудовується сам).
const fs = require("fs");
const path = require("path");

const MAX_MB = Number(process.env.NEXT_CACHE_MAX_MB || 1024);
const dir = path.join(__dirname, "..", ".next");

function sizeOf(p) {
  let total = 0;
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, entry.name);
    if (entry.isDirectory()) total += sizeOf(full);
    else if (entry.isFile()) total += fs.statSync(full).size;
  }
  return total;
}

if (fs.existsSync(dir)) {
  const mb = sizeOf(dir) / 1024 / 1024;
  if (mb > MAX_MB) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`[clean-next-cache] .next ${Math.round(mb)} MB > ${MAX_MB} MB — видалено`);
  }
}
