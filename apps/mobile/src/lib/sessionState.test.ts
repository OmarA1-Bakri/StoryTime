import { describe, expect, it } from "vitest";

import { createInitialSessionState } from "./sessionState";

describe("createInitialSessionState", () => {
  it("creates an idle state for the requested session", () => {
    expect(createInitialSessionState("session-123")).toEqual({
      sessionId: "session-123",
      status: "idle",
    });
  });

  it("returns a fresh state object for each call", () => {
    const first = createInitialSessionState("session-123");
    const second = createInitialSessionState("session-123");

    expect(first).not.toBe(second);
  });
});
