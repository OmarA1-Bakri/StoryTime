import { z } from "zod";

export const consentStatusSchema = z.enum(["not_started", "pending", "verified", "rejected", "revoked", "expired"]);

export const protectedGateInputSchema = z.object({
  adultUserId: z.string().min(1),
  childProfileId: z.string().optional(),
  noticeVersion: z.string().min(1),
  acceptedRecordingNotice: z.literal(true),
  acceptedAiProcessingNotice: z.literal(true),
  acceptedDeletionNotice: z.literal(true)
});
