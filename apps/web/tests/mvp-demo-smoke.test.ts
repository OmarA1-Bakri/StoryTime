import { describe, expect, it } from "vitest";
import { GET as health } from "../app/api/health/route";
import { GET as pipeline } from "../app/api/demo/pipeline/route";
import { GET as replay } from "../app/api/demo/replay/route";
import { GET as usage } from "../app/api/demo/usage/route";

describe("MVP demo smoke", () => {
  it("reports a healthy story, replay, and usage surface", async () => {
    await expect((await health()).json()).resolves.toMatchObject({ ok: true });
    await expect((await pipeline()).json()).resolves.toMatchObject({ ok: true, story: { status: "ready" }, replay: { status: "ready" } });
    await expect((await replay()).json()).resolves.toMatchObject({ ok: true, replay: { status: "ready" } });
    await expect((await usage()).json()).resolves.toMatchObject({ ok: true });
  });
});
