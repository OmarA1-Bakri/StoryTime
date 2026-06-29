import { describe, expect, it } from "vitest";
import { GET } from "../app/api/demo/pipeline/route";

describe("demo pipeline API", () => {
  it("returns story and replay readiness", async () => {
    const response = await GET();
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.story.status).toBe("ready");
    expect(json.replay.status).toBe("ready");
  });
});
