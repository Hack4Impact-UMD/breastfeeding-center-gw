import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { stripVTControlCharacters } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const FRONTEND_PORT = 5173;
const EMULATOR_UI_PORT = 4000;

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function prefix(label, color) {
  return `${color}[${label}]${colors.reset}`;
}

function pipeLogs(proc, label, color) {
  const tag = prefix(label, color);
  const pipe = (stream) => {
    stream.on("data", (data) => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (line.trim()) {
          process.stdout.write(`${tag} ${stripVTControlCharacters(line)}\n`);
        }
      }
    });
  };
  if (proc.stdout) pipe(proc.stdout);
  if (proc.stderr) pipe(proc.stderr);
}

/** Try to connect to a TCP port. Resolves true when the port accepts connections. */
function waitForPort(port, { timeout = 120_000, interval = 1000 } = {}) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeout;

    function attempt() {
      if (Date.now() > deadline) {
        return reject(new Error(`Timed out waiting for port ${port}`));
      }
      const socket = createConnection({ port, host: "localhost" });
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("error", () => {
        socket.destroy();
        setTimeout(attempt, interval);
      });
    }
    attempt();
  });
}

// ── Spawn all three processes ──────────────────────────────────────────

/***
 * @type {import("node:child_process").ChildProcessByStdio[]}
 */
const children = [];

// 1. Firebase emulators (with test data import)
const emulators = spawn(
  "npx",
  [
    "firebase",
    "emulators:start",
    "--import",
    resolve(ROOT, "cloud-functions/emulator_test_data"),
  ],
  { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env } },
);
pipeLogs(emulators, "emulators", colors.yellow);
children.push(emulators);

// 2. Cloud Functions TypeScript watch
const fnBuild = spawn("npm", ["run", "build:watch"], {
  cwd: resolve(ROOT, "cloud-functions/functions"),
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env },
});
pipeLogs(fnBuild, "functions-build", colors.magenta);
children.push(fnBuild);

// 3. Vite frontend dev server
const vite = spawn("npm", ["run", "dev"], {
  cwd: resolve(ROOT, "react-app"),
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env },
});
pipeLogs(vite, "frontend", colors.cyan);
children.push(vite);

// ── Wait for services and print URLs ───────────────────────────────────

async function waitForReady() {
  console.log(
    `\n${colors.bold}Waiting for all services to start...${colors.reset}\n`,
  );

  try {
    await Promise.all([
      waitForPort(FRONTEND_PORT).then(() =>
        console.log(
          `  ${colors.green}✓${colors.reset} Frontend dev server ready`,
        ),
      ),
      waitForPort(EMULATOR_UI_PORT).then(() =>
        console.log(
          `  ${colors.green}✓${colors.reset} Firebase Emulator UI ready`,
        ),
      ),
    ]);
  } catch (err) {
    console.error(`\n${colors.red}${err.message}${colors.reset}`);
    shutdown(1);
    return;
  }

  console.log(
    `\n${colors.bold}${colors.green}All services are running!${colors.reset}\n`,
  );
  console.log(
    `  ${colors.bold}Frontend:${colors.reset}     http://localhost:${FRONTEND_PORT}`,
  );
  console.log(
    `  ${colors.bold}Emulator UI:${colors.reset}  http://localhost:${EMULATOR_UI_PORT}`,
  );
  console.log();
}

waitForReady();

// ── Graceful shutdown ──────────────────────────────────────────────────

function shutdown(code = 0) {
  console.log(`\n${colors.bold}Shutting down...${colors.reset}`);
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
  setTimeout(() => process.exit(code), 5000);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

// If any child exits unexpectedly, shut everything down
for (const child of children) {
  child.on("exit", (code, signal) => {
    if (signal !== "SIGTERM" && signal !== "SIGINT" && code !== 0) {
      console.error(
        `\n${colors.red}A child process exited unexpectedly (code: ${code}, signal: ${signal}). Shutting down.${colors.reset}`,
      );
      shutdown(1);
    }
  });
}
