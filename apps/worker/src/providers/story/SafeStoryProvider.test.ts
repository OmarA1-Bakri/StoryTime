import { describe, expect, it } from "vitest";
import type { SafetyProvider } from "../safety/SafetyProvider";
import { SafeStoryProvider } from "./SafeStoryProvider";
import type { StructuredStoryProvider } from "./StructuredStoryProvider";

describe("SafeStoryProvider", () => {
  it("returns a deterministic safe beat without generating when input is flagged", async () => {
    let generated = false;
    const story: StructuredStoryProvider = {
      generate: async () => {
        generated = true;
        throw new Error("unused");
      },
    };
    const safety: SafetyProvider = {
      moderate: async () => ({ flagged: true, categories: ["violence"] }),
    };
    const result = await new SafeStoryProvider(story, safety).generate({ prompt: "unsafe" });
    expect(generated).toBe(false);
    expect(result.caption).toBe("A safe new path appears.");
  });

  it("checks both input and generated output", async () => {
    let checks = 0;
    const story: StructuredStoryProvider = {
      generate: async () => ({
        storyBeat: "A calm walk.",
        caption: "A calm walk",
        imagePrompt: "calm path",
        nextTurnPrompt: "Next?",
      }),
    };
    const safety: SafetyProvider = {
      moderate: async () => ({ flagged: ++checks === 2, categories: [] }),
    };
    const result = await new SafeStoryProvider(story, safety).generate({ prompt: "walk" });
    expect(checks).toBe(2);
    expect(result.caption).toBe("A safe new path appears.");
  });
});
