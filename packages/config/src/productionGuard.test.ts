import { describe, expect, it } from "vitest";
import { assertProductionReady } from "./productionGuard";

describe("assertProductionReady", () => {
  it("allows non-production scaffold modes", () => {
    expect(() => assertProductionReady({ nodeEnv: "development", aiMode: "mock", recordingMode: "mock", storageMode: "local" })).not.toThrow();
  });

  it("blocks production mock modes", () => {
    expect(() => assertProductionReady({ nodeEnv: "production", aiMode: "mock", recordingMode: "live", storageMode: "live" })).toThrow("Production requires live AI mode");
  });

  it("allows live production modes", () => {
    expect(() => assertProductionReady({ nodeEnv: "production", aiMode: "live", recordingMode: "live", storageMode: "live" })).not.toThrow();
  });
});
