export type StructuredStoryInput = {
  prompt: string;
  context?: string;
};

export type StructuredStoryOutput = {
  storyBeat: string;
  caption: string;
  imagePrompt: string;
  nextTurnPrompt: string;
};

export interface StructuredStoryProvider {
  generate(input: StructuredStoryInput): Promise<StructuredStoryOutput>;
}

export class MockStructuredStoryProvider implements StructuredStoryProvider {
  async generate(input: StructuredStoryInput): Promise<StructuredStoryOutput> {
    return {
      storyBeat: `${input.prompt} The adventure continues with one clear choice for the next storyteller.`,
      caption: "The adventure continues.",
      imagePrompt: "warm storybook family adventure scene",
      nextTurnPrompt: "What happens next?"
    };
  }
}
