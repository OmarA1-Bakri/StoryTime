import type { AiProvider, StoryTurnInput, StoryTurnOutput } from "./AiProvider";

export class MockAiProvider implements AiProvider {
  async processTurn(input: StoryTurnInput): Promise<StoryTurnOutput> {
    const transcript = input.transcript.trim() || "The adventure continues with a brave idea.";
    const { character, setting, problem, visualFormat } = input.storySeed;
    return {
      transcript,
      storyBeat: `${character} explores ${setting} and finds a playful clue about ${problem}.`,
      caption: "The next story scene appears like a glowing page.",
      imagePrompt: `${visualFormat} illustration of ${character} in ${setting}, safe, warm, magical, family friendly`,
      nextTurnPrompt: input.speakerRole === "remote_adult" ? "What does Rania do next?" : "Dad, what happens next?",
      safetyStatus: "approved"
    };
  }
}
