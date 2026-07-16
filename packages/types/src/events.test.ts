import { describe, expect, it } from "vitest";

import { analyticsEvents } from "./events";

describe("analyticsEvents", () => {
  it("contains each supported event exactly once", () => {
    expect(new Set(analyticsEvents).size).toBe(analyticsEvents.length);
    expect(analyticsEvents).toContain("app_opened");
    expect(analyticsEvents).toContain("story_seed_locked");
    expect(analyticsEvents).toContain("composition_ready");
    expect(analyticsEvents).toContain("deletion_completed");
  });

  it("preserves the lifecycle boundaries", () => {
    expect(analyticsEvents.at(0)).toBe("app_opened");
    expect(analyticsEvents.at(-1)).toBe("deletion_completed");
  });
});
