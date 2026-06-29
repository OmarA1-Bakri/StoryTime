import { describe, expect, it } from "vitest";
import { makeStep } from "./makeStep";

describe("flow check", () => {
  it("builds a step", async () => {
    const step = await makeStep("turn-1", "Open the moon door");
    expect(step.status).toBe("done");
  });
});
