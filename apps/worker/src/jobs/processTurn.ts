import type { AiProvider, StoryTurnInput, StoryTurnOutput } from "../providers/ai/AiProvider";

export async function processTurn(provider: AiProvider, input: StoryTurnInput): Promise<StoryTurnOutput> {
  const startedAt = Date.now();
  const result = await provider.processTurn(input);
  if (Date.now() - startedAt > 10_000) {
    throw new Error("Turn processing exceeded hard timeout");
  }
  return result;
}
