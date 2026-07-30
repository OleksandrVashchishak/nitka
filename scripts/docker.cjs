#!/usr/bin/env node
/**
 * Easy local Docker ops for agents & humans (Windows-friendly).
 *
 * Usage:
 *   node scripts/docker.cjs <up|down|status|smoke|reset|rebuild-api>
 */
const { spawnSync } = require("child_process");
const http = require("http");
const path = require("path");

const root = path.join(__dirname, "..");
const cmd = (process.argv[2] || "help").toLowerCase();

function run(command, args, opts = {}) {
  const r = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: true,
    stdio: opts.stdio || "inherit",
    ...opts,
  });
  return r;
}

function runCapture(command, args) {
  const r = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });
  return {
    ok: r.status === 0,
    out: `${r.stdout || ""}${r.stderr || ""}`.trim(),
    status: r.status,
  };
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function dockerReady() {
  const r = runCapture("docker", ["version", "--format", "{{.Server.Version}}"]);
  return r.ok && !!r.out && !/error|500/i.test(r.out);
}

function waitDocker(timeoutMs = 180_000) {
  const start = Date.now();
  let i = 0;
  while (Date.now() - start < timeoutMs) {
    i += 1;
    if (dockerReady()) {
      console.log(`OK Docker engine ready (try ${i})`);
      return;
    }
    console.log(`… waiting Docker engine (${i})`);
    if (process.platform === "win32") {
      spawnSync(
        "powershell",
        ["-NoProfile", "-Command", "Start-Sleep -Seconds 5"],
        { stdio: "ignore" },
      );
    } else {
      spawnSync("sleep", ["5"], { stdio: "ignore" });
    }
  }
  fail("Docker engine not ready. Quit/Start Docker Desktop (Memory ≥ 8GB), then retry.");
}

function fetchStatus(url, timeoutMs = 5_000) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });
    req.on("timeout", () => {
      req.destroy();
      resolve(0);
    });
    req.on("error", () => resolve(0));
  });
}

async function status() {
  waitDocker(30_000);
  const ps = runCapture("docker", ["compose", "ps", "-a"]);
  console.log(ps.out || "(no compose output)");
  const api = await fetchStatus("http://127.0.0.1:3001/api/health");
  const web = await fetchStatus("http://127.0.0.1:3000");
  console.log(`api /api/health → ${api || "down"}`);
  console.log(`web / → ${web || "down"}`);
  if (api !== 200) process.exitCode = 1;
}

function up() {
  waitDocker();
  console.log("→ docker compose up -d --build");
  const r = run("docker", ["compose", "up", "-d", "--build"]);
  if (r.status !== 0) fail("compose up failed");
  console.log("OK stack starting. Check: node scripts/docker.cjs status");
  console.log("  web http://localhost:3000");
  console.log("  api http://localhost:3001/api/health");
}

function down() {
  if (!dockerReady()) {
    console.warn("Docker engine not ready — skip compose down");
    return;
  }
  const r = run("docker", ["compose", "down", "--remove-orphans"]);
  if (r.status !== 0) fail("compose down failed");
  console.log("OK down");
}

function rebuildApi() {
  waitDocker();
  console.log("→ real nest build (not nest-shim)");
  let r = run("docker", [
    "compose",
    "exec",
    "-T",
    "api",
    "node",
    "node_modules/@nestjs/cli/bin/nest.js",
    "build",
  ]);
  if (r.status !== 0) fail("nest build failed — is api running? try: node scripts/docker.cjs up");
  r = run("docker", ["compose", "restart", "api"]);
  if (r.status !== 0) fail("api restart failed");
  console.log("OK api rebuilt + restarted");
}

function smoke() {
  waitDocker(60_000);
  const r = run(process.execPath, [path.join(__dirname, "docker-smoke.cjs")]);
  process.exit(r.status ?? 1);
}

function reset() {
  console.log("→ hard reset Docker Desktop (crash-loop / engine 500)");
  if (process.platform === "win32") {
    run(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        [
          "Get-Process 'Docker Desktop','com.docker.backend','com.docker.build','docker-sandbox' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue",
          "Start-Sleep -Seconds 2",
          "Stop-Service com.docker.service -Force -ErrorAction SilentlyContinue",
          "wsl --shutdown",
          "Start-Sleep -Seconds 4",
          "Start-Service com.docker.service -ErrorAction SilentlyContinue",
          "Start-Process 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'",
        ].join("; "),
      ],
      { stdio: "inherit" },
    );
  } else {
    console.warn("reset is tuned for Windows Docker Desktop; restart Docker manually");
  }

  waitDocker(240_000);
  run("docker", ["rm", "-f", "wedding-api-1", "wedding-web-1", "wedding-db-1"]);
  console.log("→ compose up -d --build --renew-anon-volumes");
  const r = run("docker", [
    "compose",
    "up",
    "-d",
    "--build",
    "--force-recreate",
    "--renew-anon-volumes",
  ]);
  if (r.status !== 0) fail("compose up after reset failed");
  console.log("OK reset + stack up. Next: node scripts/docker.cjs status");
}

function help() {
  console.log(`Local Docker helper

  node scripts/docker.cjs up            Start stack (compose up --build)
  node scripts/docker.cjs down          Stop stack
  node scripts/docker.cjs status        compose ps + health probes
  node scripts/docker.cjs smoke         Full smoke script
  node scripts/docker.cjs rebuild-api   Nest build in api + restart
  node scripts/docker.cjs reset         Fix dead Docker Desktop + recreate stack

NEVER run prisma CLI inside the api container (fork-bomb).
Details: scripts/DOCKER.md
`);
}

const actions = {
  up,
  down,
  status,
  smoke,
  reset,
  "rebuild-api": rebuildApi,
  help,
};

const fn = actions[cmd];
if (!fn) {
  help();
  fail(`unknown command: ${cmd}`);
}

Promise.resolve(fn()).catch((err) => fail(err.message || String(err)));
