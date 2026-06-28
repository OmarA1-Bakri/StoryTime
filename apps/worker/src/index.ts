import { loadWorkerConfig, assertSafeProductionConfig } from "./config";
import { logger } from "./logger";

export function workerStatus(): string {
  return "StoryTime worker scaffold ready";
}

export function bootWorker(): void {
  const config = loadWorkerConfig();
  assertSafeProductionConfig(config);
  logger.info("StoryTime worker booted", { appEnv: config.appEnv, aiMode: config.aiMode });
}

if (process.env.STORYTIME_WORKER_AUTOSTART === "1") {
  bootWorker();
}
