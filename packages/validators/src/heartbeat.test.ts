import { describe, expect, it } from "vitest";
import { isStaleHeartbeat } from "./heartbeat";

describe("heartbeat helpers", () => {
  it("marks recent heartbeats as current", () => {
    expect(isStaleHeartbeat({ id: "p1", lastSeenAt: 1000 }, 2000)).toBe(false);
  });

  it("marks old heartbeats as stale", () => {
    expect(isStaleHeartbeat({ id: "p1", lastSeenAt: 1000 }, 20000)).toBe(true);
  });
});
