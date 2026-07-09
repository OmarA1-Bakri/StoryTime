import { describe, expect, it } from "vitest";
import { GET } from "../app/api/demo/readiness/route";

describe("readiness API", () => {
  it("does not claim readiness when integrations are absent", async () => {
    const response = await GET();
    const json = await response.json();
    expect(response.status).toBe(503);
    expect(json.ok).toBe(false);
    expect(json.blockers).toContain("realtimeCall");
    expect(json.capabilities).toHaveLength(11);
  });
});
