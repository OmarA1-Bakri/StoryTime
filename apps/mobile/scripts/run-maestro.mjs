import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const mobileRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const suitePath = path.join(mobileRoot, ".maestro");
const appId = process.env.MAESTRO_APP_ID ?? "com.omarbakri.storytime";
const requestedPlatform = process.env.MAESTRO_PLATFORM?.toLowerCase();
const requestedDevice = process.env.MAESTRO_DEVICE_ID;
const isWindows = process.platform === "win32";

function fail(message) {
  console.error(`[mobile:e2e] ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: mobileRoot,
    encoding: "utf8",
    shell: isWindows,
    ...options,
  });
}

function commandWorks(command, args) {
  const result = run(command, args);
  return !result.error && result.status === 0;
}

function androidTarget() {
  if (!commandWorks("adb", ["version"])) return null;
  const prefix = requestedDevice ? ["-s", requestedDevice] : [];
  const state = run("adb", [...prefix, "get-state"]);
  if (state.status !== 0 || state.stdout.trim() !== "device") return null;
  return { platform: "android", device: requestedDevice, prefix };
}

function iosTarget() {
  if (process.platform !== "darwin" || !commandWorks("xcrun", ["simctl", "help"])) return null;
  if (requestedDevice) {
    const state = run("xcrun", ["simctl", "list", "devices", requestedDevice, "--json"]);
    if (state.status !== 0 || !state.stdout.includes('"state" : "Booted"')) return null;
    return { platform: "ios", device: requestedDevice };
  }

  const result = run("xcrun", ["simctl", "list", "devices", "booted", "--json"]);
  if (result.status !== 0) return null;
  try {
    const parsed = JSON.parse(result.stdout);
    const device = Object.values(parsed.devices ?? {})
      .flat()
      .find((entry) => entry.state === "Booted");
    return device ? { platform: "ios", device: device.udid } : null;
  } catch {
    return null;
  }
}

if (!/^[A-Za-z0-9._-]+$/.test(appId)) fail(`Invalid MAESTRO_APP_ID: ${appId}`);
if (requestedDevice && !/^[A-Za-z0-9._:-]+$/.test(requestedDevice)) {
  fail(`Invalid MAESTRO_DEVICE_ID: ${requestedDevice}`);
}
if (requestedPlatform && !["android", "ios"].includes(requestedPlatform)) {
  fail("MAESTRO_PLATFORM must be either android or ios.");
}
if (!existsSync(path.join(suitePath, "config.yaml"))) fail("Maestro suite config is missing.");

const version = run("maestro", ["--version"]);
if (version.error || version.status !== 0) {
  fail(
    "Maestro CLI is unavailable. Install it from https://maestro.mobile.dev/getting-started/installing-maestro and ensure `maestro` is on PATH.",
  );
}

let target;
if (requestedPlatform === "android") target = androidTarget();
else if (requestedPlatform === "ios") target = iosTarget();
else target = androidTarget() ?? iosTarget();

if (!target) {
  fail(
    "No supported booted target was found. Start an Android emulator/device with adb access or a booted iOS Simulator; set MAESTRO_PLATFORM and MAESTRO_DEVICE_ID when selection is ambiguous.",
  );
}

let appCheck;
if (target.platform === "android") {
  appCheck = run("adb", [...target.prefix, "shell", "pm", "path", appId]);
  if (appCheck.status !== 0 || !appCheck.stdout.includes("package:")) {
    fail(
      `Android app ${appId} is not installed on the selected target. Install a development/EAS build containing the required EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY and EXPO_PUBLIC_CONVEX_URL values.`,
    );
  }
} else {
  appCheck = run("xcrun", ["simctl", "get_app_container", target.device, appId]);
  if (appCheck.status !== 0 || !appCheck.stdout.trim()) {
    fail(
      `iOS app ${appId} is not installed on the selected simulator. Install a development/EAS build containing the required EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY and EXPO_PUBLIC_CONVEX_URL values.`,
    );
  }
}

const deviceArgs = target.device ? ["--device", target.device] : [];
console.log(
  `[mobile:e2e] Running Maestro ${version.stdout.trim()} against ${target.platform}${target.device ? ` target ${target.device}` : " target"}.`,
);
const result = run(
  "maestro",
  [...deviceArgs, "test", suitePath, "--env", `MAESTRO_APP_ID=${appId}`],
  { stdio: "inherit", encoding: undefined },
);

if (result.error) fail(`Maestro could not start: ${result.error.message}`);
if (result.status !== 0) process.exit(result.status ?? 1);
console.log("[mobile:e2e] Maestro completed the mobile E2E suite successfully.");
