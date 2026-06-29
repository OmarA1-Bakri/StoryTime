import { describe, expect, it } from "vitest";
import { GET } from "../app/api/demo/economics/route";

describe("demo economics API", () => {
  it("returns measurable chapter cost fields", async () => {
    const response = await GET();
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.chapter.estimatedCostUsd).toBeGreaterThanOrEqual(0);
  });
});
