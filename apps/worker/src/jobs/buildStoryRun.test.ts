import { describe, expect, it } from "vitest";
import { buildStoryRun } from "./buildStoryRun";

describe("buildStoryRun", () => {
  it("builds steps and a bundle", async () => {
    const result = await buildStoryRun({ sessionId: "session-1", userId: "user-1", prompts: ["start", "continue"] });
    expect(result.steps).toHaveLength(2);
    expect(result.bundleKey).toContain("session-1");
    expect(result.usage.quantity).toBe(2);
  });
});
