import { describe, expect, it } from "vitest";
import { processReplayJob } from "./processReplayJob";

describe("processReplayJob", () => {
  it("returns ready when inputs exist", async () => {
    await expect(processReplayJob({ sessionId: "s1", rawTrackCount: 1, eventCount: 1 })).resolves.toMatchObject({ status: "ready" });
  });
});
