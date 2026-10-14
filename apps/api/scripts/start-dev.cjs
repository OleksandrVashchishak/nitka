/**
 * Local Nest watch entry. Refuses a second instance when :3001 already serves
 * /api/health — multiple watches race on Windows and corrupt apps/api/dist
 * (login/API then look "broken").
 */
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const apiRoot = path.join(__dirname, "..");
const healthUrl = "http://127.0.0.1:3001/api/health";

function isApiHealthy() {
  return new Promise((resolve) => {
    const req = http.get(healthUrl, { timeout: 1200 }, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  if (await isApiHealthy()) {
    console.error(
      "[api] Already healthy on :3001 — skip second nest watch (avoids dist lock).",
    );
    process.exit(0);
  }

  const child = spawn(
    process.execPath,
    [
      "--env-file=.env",
      "./node_modules/@nestjs/cli/bin/nest.js",
      "start",
      "--watch",
    ],
    {
      cwd: apiRoot,
      stdio: "inherit",
      env: process.env,
      shell: false,
    },
  );

  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
