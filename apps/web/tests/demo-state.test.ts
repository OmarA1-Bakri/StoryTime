import { describe, expect, it } from "vitest";
import { GET } from "../app/api/demo/replay/route";

describe("demo state APIs", () => {
  it("returns state", async () => {
    const response = await GET();
    const json = await response.json();
    expect(json.ok).toBe(true);
  });
});
