import { describe, expect, it } from "vitest";
import { assertSessionTransition, canTransitionSession, isSessionState, nextSessionStates } from "./sessionLifecycle";

describe("session lifecycle", () => {
  it("recognizes declared session states", () => {
    expect(isSessionState("storytelling")).toBe(true);
    expect(isSessionState("unknown")).toBe(false);
  });

  it("allows the expected protected setup path", () => {
    expect(canTransitionSession("created", "waiting")).toBe(true);
    expect(canTransitionSession("adult_connected", "handoff_ready")).toBe(true);
    expect(canTransitionSession("handoff_ready", "story_setup")).toBe(true);
  });

  it("rejects jumping straight from created to storytelling", () => {
    expect(() => assertSessionTransition("created", "storytelling")).toThrow("Invalid session transition");
  });

  it("treats completed as terminal", () => {
    expect(nextSessionStates("completed")).toEqual([]);
    expect(() => assertSessionTransition("completed", "storytelling")).toThrow("terminal state");
  });
});
