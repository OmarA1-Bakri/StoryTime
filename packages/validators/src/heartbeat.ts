export type Heartbeat = { id: string; lastSeenAt: number };

export function isStaleHeartbeat(input: Heartbeat, nowMs: number, timeoutMs = 15000): boolean {
  return nowMs - input.lastSeenAt > timeoutMs;
}
