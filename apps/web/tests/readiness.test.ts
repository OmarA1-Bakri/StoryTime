import { describe, expect, it } from "vitest";
import { GET } from "../app/api/demo/readiness/route";

describe("readiness API", () => {
  it("returns MVP readiness items", async () => {
    const response = await GET();
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.items).toHaveLength(8);
  });
});
