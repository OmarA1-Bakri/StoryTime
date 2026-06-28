export type AgeBand = "6-8" | "9-10" | "11-12";
export type SpeakerRole = "remote_adult" | "child";
export type SafetyStatus = "approved" | "modified" | "blocked";

export type StorySeed = {
  character: string;
  setting: string;
  problem: string;
  tone: string;
  visualFormat: string;
};

export type StoryBeatOutput = {
  storyBeat: string;
  caption: string;
  imagePrompt: string;
  nextTurnPrompt: string;
  safetyStatus: SafetyStatus;
};

export type TurnProcessingInput = {
  sessionId: string;
  turnId: string;
  speakerRole: SpeakerRole;
  childAgeBand: AgeBand;
  storySeed: StorySeed;
  campaignSummary?: string;
  recentTurns: Array<{ speakerRole: SpeakerRole; transcript: string; storyBeat: string }>;
  transcript: string;
};

export type CompositionTimelineEvent = {
  eventType: string;
  timestampMs: number;
  payload: Record<string, unknown>;
};
