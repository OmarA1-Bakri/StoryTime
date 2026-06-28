export type LocalSessionStatus = "idle" | "joining" | "joined" | "left" | "error";

export type LocalSessionState = { sessionId: string; status: LocalSessionStatus; errorMessage?: string };

export function createInitialSessionState(sessionId: string): LocalSessionState {
  return { sessionId, status: "idle" };
}
