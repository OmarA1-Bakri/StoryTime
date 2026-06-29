export type ProductionModeInput = {
  nodeEnv: string | undefined;
  aiMode: string | undefined;
  recordingMode: string | undefined;
  storageMode: string | undefined;
};

export function assertProductionReady(input: ProductionModeInput): void {
  if (input.nodeEnv !== "production") return;
  if (input.aiMode !== "live") throw new Error("Production requires live AI mode");
  if (input.recordingMode !== "live") throw new Error("Production requires live recording mode");
  if (input.storageMode !== "live") throw new Error("Production requires live storage mode");
}
