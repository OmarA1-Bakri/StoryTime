import { describe, expect, it } from "vitest";
import { MockAiProvider } from "../providers/ai/MockAiProvider";
import { processTurn } from "./processTurn";

describe("processTurn", () => {
  it("returns a structured story beat from the mock provider", async () => {
    const result = await processTurn(new MockAiProvider(), {
      sessionId: "s1",
      turnId: "t1",
      speakerRole: "remote_adult",
      transcript: "The rocket opens",
      storySeed: {
        character: "Explorer",
        setting: "Moon garden",
        problem: "Lost light",
        tone: "brave",
        visualFormat: "storybook"
      }
    });
    expect(result.safetyStatus).toBe("approved");
    expect(result.storyBeat).toContain("Explorer");
  });
});
