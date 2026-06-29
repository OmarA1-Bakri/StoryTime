import { describe, expect, it } from "vitest";
import { canStartReplayProcessing, isReplayRecoverableState, isReplayTerminalState } from "./replayLifecycle";

describe("replay lifecycle", () => {
  it("starts processing when tracks are ready", () => {
    expect(canStartReplayProcessing("tracks_ready")).toBe(true);
  });

  it("detects terminal and recoverable states", () => {
    expect(isReplayTerminalState("ready")).toBe(true);
    expect(isReplayRecoverableState("failed")).toBe(true);
  });
});
