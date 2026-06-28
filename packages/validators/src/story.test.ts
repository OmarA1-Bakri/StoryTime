import { describe, expect, it } from "vitest";
import { storyBeatOutputSchema, storySeedSchema } from "./story";

describe("story validators", () => {
  it("accepts a complete story seed", () => {
    expect(
      storySeedSchema.parse({
        character: "Space princess",
        setting: "Moon garden",
        problem: "Lost starlight",
        tone: "Silly and brave",
        visualFormat: "Warm storybook"
      })
    ).toMatchObject({ character: "Space princess" });
  });

  it("rejects empty story output fields", () => {
    expect(() =>
      storyBeatOutputSchema.parse({
        storyBeat: "",
        caption: "caption",
        imagePrompt: "prompt",
        nextTurnPrompt: "next",
        safetyStatus: "approved"
      })
    ).toThrow();
  });
});
