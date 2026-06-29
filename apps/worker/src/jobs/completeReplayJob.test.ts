import { describe, expect, it } from "vitest";
import { completeReplayJob } from "./completeReplayJob";

describe("completeReplayJob", () => {
  it("returns ready when inputs can render", async () => {
    const result = await completeReplayJob({ sessionId: "session-1", trackKeys: ["audio.wav"], timelineEventCount: 1 });
    expect(result.status).toBe("ready");
    expect(result.outputKey).toContain("session-1");
  });

  it("waits when inputs are incomplete", async () => {
    const result = await completeReplayJob({ sessionId: "session-1", trackKeys: [], timelineEventCount: 1 });
    expect(result.status).toBe("waiting");
  });
});
