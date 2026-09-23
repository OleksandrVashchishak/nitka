/**
 * Native local stack helper (Postgres + host Node).
 *
 *   node scripts/local.cjs setup     # .env files + check Postgres
 *   node scripts/local.cjs install   # api --include=dev + web
 *   node scripts/local.cjs status    # db / api / web probes
 *   node scripts/local.cjs db        # ensure role+db exist (psql)
 *   node scripts/local.cjs migrate   # prisma generate + db push + ensure-schema
 *   node scripts/local.cjs seed      # prisma seed
 *
 * Dev processes (separate terminals):
 *   npm run api
 *   npm run web
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");
const net = require("net");

const root = path.join(__dirname, "..");
const apiDir = path.join(root, "apps", "api");
const webDir = path.join(root, "apps", "web");

const DB = {
  user: "wedding",
  password: "wedding",
  database: "wedding",
  host: "localhost",
  port: 5432,
};

const DATABASE_URL = `postgresql://${DB.user}:${DB.password}@${DB.host}:${DB.port}/${DB.database}?schema=public`;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`OK  ${msg}`);
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    // shell only for npm/npx — absolute paths with spaces break under shell:true
    shell: opts.shell ?? false,
    ...opts,
  });
  return r.status ?? 1;
}

function runCapture(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    shell: opts.shell ?? false,
    ...opts,
  });
  return {
    status: r.status ?? 1,
    out: `${r.stdout || ""}${r.stderr || ""}`.trim(),
  };
}

function findPsql() {
  const which = runCapture(process.platform === "win32" ? "where.exe" : "which", [
    "psql",
  ]);
  if (which.status === 0 && which.out) {
    const first = which.out.split(/\r?\n/).map((s) => s.trim()).find(Boolean);
    if (first && fs.existsSync(first)) return first;
  }
  const versions = ["18", "17", "16", "15", "14"];
  for (const v of versions) {
    const p = `C:\\Program Files\\PostgreSQL\\${v}\\bin\\psql.exe`;
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function tcpOpen(host, port, ms = 1500) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port }, () => {
      s.end();
      resolve(true);
    });
    s.on("error", () => resolve(false));
    s.setTimeout(ms, () => {
      s.destroy();
      resolve(false);
    });
  });
}

function httpOk(url, ms = 3000) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(ms, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function writeEnvIfMissing(file, contents) {
  if (fs.existsSync(file)) {
    ok(`exists ${path.relative(root, file)}`);
    return false;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents, "utf8");
  ok(`wrote ${path.relative(root, file)}`);
  return true;
}

function cmdSetup() {
  writeEnvIfMissing(
    path.join(apiDir, ".env"),
    [
      `DATABASE_URL=${DATABASE_URL}`,
      "JWT_SECRET=dev-jwt-secret-change-me",
      "JWT_REFRESH_SECRET=dev-jwt-refresh-secret-change-me",
      "PORT=3001",
      "CORS_ORIGIN=http://localhost:3000,http://localhost:8081,http://127.0.0.1:8081",
      "PUBLIC_API_URL=http://localhost:3001",
      "WEB_APP_URL=http://localhost:3000",
      "EMAIL_LOG=1",
      "NODE_ENV=development",
      "",
    ].join("\n"),
  );
  writeEnvIfMissing(
    path.join(webDir, ".env.local"),
    [
      "API_URL=http://localhost:3001",
      "NEXT_PUBLIC_API_URL=http://localhost:3001",
      "NEXT_PUBLIC_SITE_URL=http://localhost:3000",
      "",
    ].join("\n"),
  );

  const psql = findPsql();
  if (!psql) {
    console.log("");
    console.log("Postgres (psql) не знайдено.");
    console.log("Встанови PostgreSQL 16:");
    console.log(
      '  winget install PostgreSQL.PostgreSQL.16 --override "--mode unattended --superpassword wedding --serverport 5432"',
    );
    console.log("Після інсталу: node scripts/local.cjs db && node scripts/local.cjs migrate");
    process.exit(2);
  }
  ok(`psql → ${psql}`);
  return 0;
}

function psqlAs(superUser, superPass, sql) {
  const psql = findPsql();
  if (!psql) fail("psql not found — install PostgreSQL first");
  const env = { ...process.env, PGPASSWORD: superPass };
  return runCapture(
    psql,
    [
      "-h",
      DB.host,
      "-p",
      String(DB.port),
      "-U",
      superUser,
      "-d",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      sql,
    ],
    { env },
  );
}

function cmdDb() {
  const candidates = [
    { user: "postgres", pass: "wedding" },
    { user: "postgres", pass: "postgres" },
    { user: DB.user, pass: DB.password },
  ];

  let admin = null;
  for (const c of candidates) {
    const r = psqlAs(c.user, c.pass, "SELECT 1");
    if (r.status === 0) {
      admin = c;
      break;
    }
  }
  if (!admin) {
    fail(
      "не можу зайти в Postgres як postgres/wedding або postgres/postgres. Постав PGPASSWORD або перевстанови з --superpassword wedding",
    );
  }
  ok(`admin login as ${admin.user}`);

  if (admin.user !== DB.user) {
    const role = psqlAs(
      admin.user,
      admin.pass,
      `DO $$ BEGIN
  CREATE ROLE ${DB.user} LOGIN PASSWORD '${DB.password}' SUPERUSER;
EXCEPTION WHEN duplicate_object THEN
  ALTER ROLE ${DB.user} WITH LOGIN PASSWORD '${DB.password}' SUPERUSER;
END $$;`,
    );
    if (role.status !== 0) fail(`create role failed:\n${role.out}`);
    ok(`role ${DB.user}`);

    const exists = psqlAs(
      admin.user,
      admin.pass,
      `SELECT 1 FROM pg_database WHERE datname = '${DB.database}'`,
    );
    if (!exists.out.includes("1")) {
      const created = psqlAs(
        admin.user,
        admin.pass,
        `CREATE DATABASE ${DB.database} OWNER ${DB.user}`,
      );
      if (created.status !== 0) fail(`create database failed:\n${created.out}`);
      ok(`database ${DB.database}`);
    } else {
      ok(`database ${DB.database} already exists`);
    }
  } else {
    ok(`already connected as ${DB.user}`);
  }

  const app = psqlAs(DB.user, DB.password, "SELECT current_database()");
  if (app.status !== 0) fail(`app login failed:\n${app.out}`);
  ok(`app login ${DB.user}@${DB.database}`);
  return 0;
}

function cmdInstall() {
  // apps/api/.npmrc has omit=dev (Render). Local needs Nest CLI etc.
  let code = run("npm", ["install", "--include=dev"], {
    cwd: apiDir,
    shell: true,
  });
  if (code !== 0) fail("api npm install --include=dev failed");
  code = run("npm", ["install"], { cwd: webDir, shell: true });
  if (code !== 0) fail("web npm install failed");
  ok("deps installed");
  return 0;
}

function cmdMigrate() {
  const env = { ...process.env, DATABASE_URL };
  let code = run("npm", ["run", "prisma:generate"], {
    cwd: apiDir,
    env,
    shell: true,
  });
  if (code !== 0) fail("prisma generate failed");
  code = run("npx", ["prisma", "db", "push", "--accept-data-loss"], {
    cwd: apiDir,
    env,
    shell: true,
  });
  if (code !== 0) fail("prisma db push failed");
  code = run(process.execPath, [path.join(apiDir, "scripts", "ensure-schema.cjs")], {
    cwd: apiDir,
    env,
  });
  if (code !== 0) console.warn("WARN ensure-schema exited", code);
  ok("schema ready");
  return 0;
}

function cmdSeed() {
  const env = { ...process.env, DATABASE_URL };
  const code = run("npm", ["run", "prisma:seed"], {
    cwd: apiDir,
    env,
    shell: true,
  });
  if (code !== 0) fail("seed failed");
  ok("seed done");
  return 0;
}

async function cmdStatus() {
  const dbUp = await tcpOpen(DB.host, DB.port);
  console.log(dbUp ? "OK  postgres :5432" : "FAIL postgres :5432");
  const apiUp = await httpOk("http://127.0.0.1:3001/api/health");
  console.log(apiUp ? "OK  api     :3001/api/health" : "FAIL api     :3001");
  const webUp = await httpOk("http://127.0.0.1:3000");
  console.log(webUp ? "OK  web     :3000" : "FAIL web     :3000");
  if (!dbUp || !apiUp || !webUp) process.exit(1);
  return 0;
}

function usage() {
  console.log(`Usage:
  node scripts/local.cjs setup
  node scripts/local.cjs install   # api --include=dev + web
  node scripts/local.cjs db
  node scripts/local.cjs migrate
  node scripts/local.cjs seed
  node scripts/local.cjs status

Dev:
  npm run api
  npm run web`);
}

async function main() {
  const cmd = process.argv[2] || "status";
  switch (cmd) {
    case "setup":
      process.exit(cmdSetup());
      break;
    case "install":
      process.exit(cmdInstall());
      break;
    case "db":
      process.exit(cmdDb());
      break;
    case "migrate":
      process.exit(cmdMigrate());
      break;
    case "seed":
      process.exit(cmdSeed());
      break;
    case "status":
      process.exit(await cmdStatus());
      break;
    default:
      usage();
      process.exit(1);
  }
}

main();
