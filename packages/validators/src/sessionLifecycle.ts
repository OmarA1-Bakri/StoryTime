import { sessionStates, type SessionState } from "./schemas";

export type SessionTransition = {
  from: SessionState;
  to: SessionState;
  reason: string;
};

const terminalStates = new Set<SessionState>(["completed", "failed", "abandoned"]);

const allowedTransitions: Record<SessionState, SessionState[]> = {
  created: ["waiting", "failed", "abandoned"],
  waiting: ["incoming_alert_sent", "adult_connecting", "failed", "abandoned"],
  incoming_alert_sent: ["adult_connecting", "abandoned", "failed"],
  adult_connecting: ["adult_connected", "audio_fallback", "failed", "abandoned"],
  adult_connected: ["consent_blocked", "handoff_ready", "audio_fallback", "failed", "abandoned"],
  consent_blocked: ["handoff_ready", "abandoned", "failed"],
  handoff_ready: ["story_setup", "audio_fallback", "failed", "abandoned"],
  story_setup: ["recording_starting", "audio_fallback", "failed", "abandoned"],
  recording_starting: ["recording", "failed", "abandoned"],
  recording: ["storytelling", "checkpoint", "ending", "paused", "failed", "abandoned"],
  storytelling: ["checkpoint", "ending", "paused", "audio_fallback", "failed", "abandoned"],
  checkpoint: ["storytelling", "ending", "paused", "completed", "failed", "abandoned"],
  ending: ["completed", "paused", "failed", "abandoned"],
  paused: ["storytelling", "ending", "completed", "failed", "abandoned"],
  completed: [],
  failed: [],
  abandoned: []
};

export function isSessionState(value: string): value is SessionState {
  return (sessionStates as readonly string[]).includes(value);
}

export function canTransitionSession(from: SessionState, to: SessionState): boolean {
  return allowedTransitions[from].includes(to);
}

export function assertSessionTransition(from: SessionState, to: SessionState): SessionTransition {
  if (terminalStates.has(from)) {
    throw new Error(`Cannot transition from terminal state: ${from}`);
  }
  if (!canTransitionSession(from, to)) {
    throw new Error(`Invalid session transition: ${from} -> ${to}`);
  }
  return { from, to, reason: `${from}_to_${to}` };
}

export function nextSessionStates(from: SessionState): SessionState[] {
  return [...allowedTransitions[from]];
}
