import { z } from "zod";

export const usageTypeSchema = z.enum([
  "stt_seconds",
  "story_llm_call",
  "image_generation",
  "composition_minutes",
  "storage_bytes_added",
  "replay_streamed",
  "adventure_credit_debit"
]);

export const usageLedgerInputSchema = z.object({
  userId: z.string().min(1),
  type: usageTypeSchema,
  quantity: z.number().nonnegative(),
  estimatedCostUsd: z.number().nonnegative().optional(),
  provider: z.string().optional()
});
