export const sessionStates = [
  "created",
  "waiting",
  "incoming_alert_sent",
  "adult_connecting",
  "adult_connected",
  "consent_blocked",
  "handoff_ready",
  "story_setup",
  "recording_starting",
  "recording",
  "storytelling",
  "checkpoint",
  "ending",
  "paused",
  "completed",
  "failed",
  "abandoned"
] as const;

export type SessionState = (typeof sessionStates)[number];
