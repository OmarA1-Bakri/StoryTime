import { describe, expect, it } from "vitest";
import { runChapterPipeline } from "./runChapterPipeline";

describe("runChapterPipeline", () => {
  it("creates story output and ready replay state", async () => {
    const result = await runChapterPipeline({
      sessionId: "session-1",
      userId: "user-1",
      profileId: "profile-1",
      noticeVersion: "v1",
      prompts: ["start", "continue"],
      trackKeys: ["audio.wav"],
      timelineEventCount: 1
    });

    expect(result.status).toBe("ready");
    expect(result.story.steps).toHaveLength(2);
    expect(result.replay.outputKey).toContain("session-1");
  });
});
