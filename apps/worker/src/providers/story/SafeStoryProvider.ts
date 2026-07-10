import type { SafetyProvider } from "../safety/SafetyProvider";
import type {
  StructuredStoryInput,
  StructuredStoryOutput,
  StructuredStoryProvider,
} from "./StructuredStoryProvider";

const safeFallback: StructuredStoryOutput = {
  storyBeat:
    "A friendly golden light filled the path, and everyone paused together to choose a safe new direction.",
  caption: "A safe new path appears.",
  imagePrompt: "warm golden storybook path, friendly family adventure, gentle shapes, no text",
  nextTurnPrompt: "What friendly place should they visit next?",
};

export class SafeStoryProvider implements StructuredStoryProvider {
  constructor(
    private readonly story: StructuredStoryProvider,
    private readonly safety: SafetyProvider,
  ) {}

  async generate(input: StructuredStoryInput): Promise<StructuredStoryOutput> {
    const incoming = await this.safety.moderate(`${input.context ?? ""}\n${input.prompt}`);
    if (incoming.flagged) return safeFallback;
    const generated = await this.story.generate(input);
    const outgoing = await this.safety.moderate(
      `${generated.storyBeat}\n${generated.caption}\n${generated.nextTurnPrompt}\n${generated.imagePrompt}`,
    );
    return outgoing.flagged ? safeFallback : generated;
  }
}
