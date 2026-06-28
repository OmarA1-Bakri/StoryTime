import { z } from "zod";

export const recordingStatusSchema = z.enum([
  "not_started",
  "starting",
  "recording",
  "stopping",
  "tracks_ready",
  "processing",
  "ready",
  "failed",
  "deleted"
]);

export const compositionEventSchema = z.object({
  sessionId: z.string().min(1),
  eventType: z.string().min(1),
  timestampMs: z.number().nonnegative(),
  wallClockTime: z.number().nonnegative(),
  payload: z.record(z.unknown())
});
