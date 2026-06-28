import { describe, expect, it } from "vitest";
import { isAdultOnlyRoute, isChildSafeRoute, requireChildSafeRoute } from "@storytime/validators";

describe("restricted mode web route policy", () => {
  it("allows child-safe story surfaces", () => {
    expect(isChildSafeRoute("/story/room/demo-session")).toBe(true);
    expect(isChildSafeRoute("/story/audio-fallback/demo-session")).toBe(true);
  });

  it("keeps adult management surfaces adult-only", () => {
    expect(isAdultOnlyRoute("/app/library")).toBe(true);
    expect(isAdultOnlyRoute("/app/preferences")).toBe(true);
  });

  it("blocks adult routes in child-safe mode", () => {
    expect(() => requireChildSafeRoute("/app/preferences")).toThrow("Route is not allowed");
  });
});
