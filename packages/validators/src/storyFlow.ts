import type { StorySeed } from "@storytime/types";

export type BatonState = {
  holderParticipantId: string;
  activeSpeakerParticipantId: string;
};

export function assertStorySeedLocked(seed: Partial<StorySeed>): StorySeed {
  const requiredFields: Array<keyof StorySeed> = ["character", "setting", "problem", "tone", "visualFormat"];
  for (const field of requiredFields) {
    if (!seed[field] || seed[field]?.trim().length === 0) {
      throw new Error(`Story seed is missing ${field}`);
    }
  }
  return seed as StorySeed;
}

export function passBaton(state: BatonState, fromParticipantId: string, toParticipantId: string): BatonState {
  if (state.holderParticipantId !== fromParticipantId) {
    throw new Error("Only the current holder can pass the baton");
  }
  return { holderParticipantId: toParticipantId, activeSpeakerParticipantId: toParticipantId };
}
