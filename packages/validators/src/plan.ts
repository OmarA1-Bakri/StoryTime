import { z } from "zod";

export const planSchema = z.enum(["free", "family", "pro", "vault"]);

export const visualTierSchema = z.enum(["basic", "standard", "premium", "best"]);

export const planLimitSchema = z.object({
  userId: z.string().min(1),
  plan: planSchema,
  storageLimitBytes: z.number().int().positive(),
  weeklyAdventureCredits: z.number().int().nonnegative(),
  remainingAdventureCredits: z.number().int().nonnegative(),
  visualTier: visualTierSchema,
  canDownload: z.boolean(),
  canCloudBackup: z.boolean(),
  canRemaster: z.boolean(),
  active: z.boolean()
});

export const storageUsageSchema = z.object({
  userId: z.string().min(1),
  usedBytes: z.number().int().nonnegative(),
  limitBytes: z.number().int().positive(),
  lastCalculatedAt: z.number().positive()
});

export function hasAdventureCredit(input: { remainingAdventureCredits: number }): boolean {
  return input.remainingAdventureCredits > 0;
}

export function hasStorageCapacity(input: { usedBytes: number; limitBytes: number; additionalBytes: number }): boolean {
  return input.usedBytes + input.additionalBytes <= input.limitBytes;
}
