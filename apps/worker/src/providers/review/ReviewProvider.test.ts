import { describe, expect, it } from "vitest";
import { MockReviewProvider } from "./ReviewProvider";

describe("MockReviewProvider", () => {
  it("accepts demo review checks", async () => {
    await expect(new MockReviewProvider().check({ userId: "u1", profileId: "p1", noticeVersion: "v1" })).resolves.toMatchObject({ accepted: true });
  });
});
