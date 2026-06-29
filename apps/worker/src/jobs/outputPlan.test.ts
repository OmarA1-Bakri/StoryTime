import { describe, expect, it } from "vitest";
import { buildOutputPlan } from "./outputPlan";

describe("buildOutputPlan", () => {
  it("marks output renderable when tracks and events exist", () => {
    const plan = buildOutputPlan({ sessionId: "session-1", trackKeys: ["audio.wav"], timelineEventCount: 1 });
    expect(plan.canRender).toBe(true);
    expect(plan.outputKey).toContain("session-1");
  });

  it("blocks rendering until inputs exist", () => {
    const plan = buildOutputPlan({ sessionId: "session-1", trackKeys: [], timelineEventCount: 1 });
    expect(plan.canRender).toBe(false);
  });
});
