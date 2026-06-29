import { describe, expect, it } from "vitest";
import { processTrackOutputJob } from "./processTrackOutputJob";

describe("processTrackOutputJob", () => {
  it("marks output ready when tracks and timeline events exist", async () => {
    const result = await processTrackOutputJob({ sessionId: "session-1", trackKeys: ["audio.wav"], timelineEventCount: 1 });
    expect(result.ready).toBe(true);
    expect(result.plan.outputKey).toContain("session-1");
  });

  it("waits when track inputs are missing", async () => {
    const result = await processTrackOutputJob({ sessionId: "session-1", trackKeys: [], timelineEventCount: 1 });
    expect(result.ready).toBe(false);
  });
});
