import { z } from "zod";

export const storySeedSchema = z.object({
  character: z.string().min(1),
  setting: z.string().min(1),
  problem: z.string().min(1),
  tone: z.string().min(1),
  visualFormat: z.string().min(1)
});

export const storyBeatOutputSchema = z.object({
  storyBeat: z.string().min(1),
  caption: z.string().min(1),
  imagePrompt: z.string().min(1),
  nextTurnPrompt: z.string().min(1),
  safetyStatus: z.enum(["approved", "modified", "blocked"])
});
