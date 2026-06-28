import { describe, expect, it } from "vitest";
import { processCompositionJob } from "./processCompositionJob";

describe("processCompositionJob", () => {
  it("fails when no raw tracks are available", async () => {
    const result = await processCompositionJob({ sessionId: "s1", recordingId: "r1", timelineEventCount: 2, rawTrackCount: 0 });
    expect(result.status).toBe("failed");
  });

  it("returns output keys for valid input", async () => {
    const result = await processCompositionJob({ sessionId: "s1", recordingId: "r1", timelineEventCount: 2, rawTrackCount: 2 });
    expect(result.status).toBe("ready");
    expect(result.outputAssetKey).toBe("replays/r1.mp4");
  });
});
