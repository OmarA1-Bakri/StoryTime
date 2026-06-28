import { describe, expect, it } from "vitest";
import { isAdultOnlyRoute, isChildSafeRoute, requireChildSafeRoute } from "./restrictedMode";

describe("restricted mode route checks", () => {
  it("allows child-safe story routes", () => {
    expect(isChildSafeRoute("/story/room/demo-session")).toBe(true);
    expect(isChildSafeRoute("/story/setup/demo-session")).toBe(true);
  });

  it("marks checkpoint and app routes as adult-only", () => {
    expect(isAdultOnlyRoute("/story/checkpoint/demo-session")).toBe(true);
    expect(isAdultOnlyRoute("/app/library")).toBe(true);
  });

  it("throws when child-safe mode receives an adult route", () => {
    expect(() => requireChildSafeRoute("/app/preferences")).toThrow("Route is not allowed");
  });
});
