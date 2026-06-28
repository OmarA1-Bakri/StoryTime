import { describe, expect, it } from "vitest";
import { protectedGateInputSchema } from "./consent";

describe("protected gate validator", () => {
  it("requires all adult notices to be accepted", () => {
    expect(
      protectedGateInputSchema.parse({
        adultUserId: "adult_1",
        noticeVersion: "v0.1",
        acceptedRecordingNotice: true,
        acceptedAiProcessingNotice: true,
        acceptedDeletionNotice: true
      })
    ).toMatchObject({ adultUserId: "adult_1" });
  });

  it("rejects missing AI processing notice", () => {
    expect(() =>
      protectedGateInputSchema.parse({
        adultUserId: "adult_1",
        noticeVersion: "v0.1",
        acceptedRecordingNotice: true,
        acceptedAiProcessingNotice: false,
        acceptedDeletionNotice: true
      })
    ).toThrow();
  });
});
