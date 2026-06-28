export type StateFlag = "idle" | "running" | "ready";

export function isReadyFlag(flag: StateFlag): boolean {
  return flag === "ready";
}
