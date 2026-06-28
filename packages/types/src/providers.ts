import type { StoryBeatOutput, TurnProcessingInput } from "./domain";

export type SafetyResult = {
  status: "approved" | "modified" | "blocked";
  reason?: string;
  replacementText?: string;
};

export interface SttProvider {
  transcribe(input: { audioAssetId: string; language?: string; timeoutMs: number }): Promise<{ transcript: string; confidence?: number; durationMs?: number }>;
}

export interface StoryDirectorProvider {
  generateStoryBeat(input: TurnProcessingInput): Promise<StoryBeatOutput>;
}

export interface ImageProvider {
  generateImage(input: { prompt: string; visualTier: "basic" | "standard" | "premium" | "best"; timeoutMs: number }): Promise<{ imageBytes: ArrayBuffer; mimeType: "image/png" | "image/jpeg" | "image/webp"; providerReference?: string }>;
}

export interface SafetyProvider {
  checkText(input: { text: string; context: "transcript" | "story_beat" | "image_prompt" | "profile_input"; childAgeBand: string }): Promise<SafetyResult>;
  checkImage?(input: { assetId: string; childAgeBand: string }): Promise<SafetyResult>;
}
