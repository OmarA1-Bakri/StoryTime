import { describe, expect, it } from "vitest";
import { createUpgradePlan } from "./upgradePlan";

describe("upgrade helper", () => {
  it("builds a plan", () => {
    const result = createUpgradePlan("s1", "input.mp4", true);
    expect(result.enabled).toBe(true);
  });
});
