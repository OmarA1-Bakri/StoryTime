import { describe, expect, it } from "vitest";
import { GET } from "../app/api/demo/export/route";

describe("demo export API", () => {
  it("returns ok", async () => {
    const response = await GET();
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });
});
