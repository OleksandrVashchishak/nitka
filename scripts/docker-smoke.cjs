#!/usr/bin/env node
/**
 * Docker smoke check for local stack.
 * Usage: node scripts/docker-smoke.cjs
 *
 * Checks:
 * 1) docker compose services are up
 * 2) API /api/health responds
 * 3) website templates include the 3 themes
 * 4) web homepage responds
 */

const { spawnSync } = require("child_process");
const http = require("http");

const API = process.env.SMOKE_API_URL || "http://localhost:3001";
const WEB = process.env.SMOKE_WEB_URL || "http://localhost:3000";
const EXPECTED_TEMPLATES = ["classic-white", "navy-gold", "dark-botanical"];
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 120_000);
const INTERVAL_MS = 3_000;

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: true });
  return {
    ok: r.status === 0,
    out: `${r.stdout || ""}${r.stderr || ""}`.trim(),
    status: r.status,
  };
}

function fetchJson(url, timeoutMs = 8_000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        resolve({
          status: res.statusCode || 0,
          body: data,
          json: (() => {
            try {
              return JSON.parse(data);
            } catch {
              return null;
            }
          })(),
        });
      });
    });
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`timeout ${url}`));
    });
    req.on("error", reject);
  });
}

function fetchStatus(url, timeoutMs = 8_000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`timeout ${url}`));
    });
    req.on("error", reject);
  });
}

async function waitFor(label, fn) {
  const start = Date.now();
  let lastErr = null;
  while (Date.now() - start < TIMEOUT_MS) {
    try {
      const value = await fn();
      if (value) return value;
    } catch (err) {
      lastErr = err;
    }
    process.stdout.write(`… waiting ${label}\n`);
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
  throw new Error(
    `${label} failed after ${TIMEOUT_MS}ms${lastErr ? `: ${lastErr.message}` : ""}`,
  );
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

async function main() {
  console.log("Docker smoke check");

  const ps = run("docker", ["compose", "ps", "--format", "json"]);
  if (!ps.ok) fail(`docker compose ps failed:\n${ps.out}`);

  const lines = ps.out
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const services = lines
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // docker compose ps --format json may return one array OR one object per line
  const flat = Array.isArray(services[0]) ? services.flat() : services;
  const byService = Object.fromEntries(
    flat.map((s) => [s.Service || s.Name, s]),
  );

  for (const name of ["db", "api", "web"]) {
    const row =
      byService[name] ||
      flat.find((s) => String(s.Name || "").includes(`-${name}-`));
    if (!row) fail(`service '${name}' not found in compose ps`);
    const state = String(row.State || row.Status || "").toLowerCase();
    if (!state.includes("running")) {
      fail(`service '${name}' is not running: ${row.State || row.Status}`);
    }
  }
  console.log("OK compose services running");

  await waitFor("api /health", async () => {
    const res = await fetchJson(`${API}/api/health`);
    return res.status === 200 ? res : null;
  });
  console.log("OK api /api/health");

  // Public website endpoint shape check is auth-free only for public slug.
  // Templates list comes from /api/website/me (auth). Instead verify source of truth
  // is reachable and the built API answers 401 (route exists) on /api/website/me.
  await waitFor("api website route", async () => {
    const status = await fetchStatus(`${API}/api/website/me`);
    // 401/403 = route exists and auth guard works; 404 = route missing (bad deploy)
    return status === 401 || status === 403 ? status : null;
  });
  console.log("OK api /api/website/me is mounted");

  // Verify template IDs are present in source (api runs prebuilt dist; source is source of truth for themes).
  const fs = require("fs");
  const tplPath = require("path").join(
    __dirname,
    "..",
    "apps",
    "api",
    "src",
    "website",
    "website.service.ts",
  );
  let tplSrc = "";
  try {
    tplSrc = fs.readFileSync(tplPath, "utf8");
  } catch (err) {
    fail(`cannot read website.service.ts: ${err.message}`);
  }
  const missingTpl = EXPECTED_TEMPLATES.filter((id) => !tplSrc.includes(`'${id}'`));
  if (missingTpl.length) {
    fail(`expected templates missing in website.service.ts: ${missingTpl.join(",")}`);
  }
  console.log(`OK templates in source: ${EXPECTED_TEMPLATES.join(", ")}`);

  await waitFor("web homepage", async () => {
    const status = await fetchStatus(WEB);
    return status >= 200 && status < 500 ? status : null;
  });
  console.log("OK web homepage");

  console.log("\nAll smoke checks passed.");
}

main().catch((err) => fail(err.message || String(err)));
