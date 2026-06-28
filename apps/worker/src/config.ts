export type WorkerConfig = {
  appEnv: "development" | "preview" | "production";
  aiMode: "mock" | "live";
  storageProvider: "local" | "r2";
  compositionConcurrency: number;
};

export function loadWorkerConfig(env: NodeJS.ProcessEnv = process.env): WorkerConfig {
  return {
    appEnv: (env.APP_ENV as WorkerConfig["appEnv"]) ?? "development",
    aiMode: (env.AI_MODE as WorkerConfig["aiMode"]) ?? "mock",
    storageProvider: env.R2_BUCKET_PRIVATE ? "r2" : "local",
    compositionConcurrency: Number(env.COMPOSITION_CONCURRENCY ?? 1)
  };
}

export function assertSafeProductionConfig(config: WorkerConfig): void {
  if (config.appEnv === "production" && config.aiMode === "mock") {
    throw new Error("Production cannot use mock AI mode");
  }
}
