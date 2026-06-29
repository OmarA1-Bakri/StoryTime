export type ReplayLifecycleState = "idle" | "capturing" | "tracks_ready" | "processing" | "ready" | "failed";

export function canStartReplayProcessing(state: ReplayLifecycleState): boolean {
  return state === "tracks_ready" || state === "failed";
}

export function isReplayTerminalState(state: ReplayLifecycleState): boolean {
  return state === "ready" || state === "failed";
}

export function isReplayRecoverableState(state: ReplayLifecycleState): boolean {
  return state === "capturing" || state === "processing" || state === "failed";
}
