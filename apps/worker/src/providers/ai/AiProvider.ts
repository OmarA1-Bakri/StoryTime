export type StoryTurnInput = {
  sessionId: string;
  turnId: string;
  speakerRole: "remote_adult" | "young_participant";
  transcript: string;
  storySeed: {
    character: string;
    setting: string;
    problem: string;
    tone: string;
    visualFormat: string;
  };
};

export type StoryTurnOutput = {
  transcript: string;
  storyBeat: string;
  caption: string;
  imagePrompt: string;
  nextTurnPrompt: string;
  safetyStatus: "approved" | "modified" | "blocked";
};

export interface AiProvider {
  processTurn(input: StoryTurnInput): Promise<StoryTurnOutput>;
}
