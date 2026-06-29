import { useCallback, useState } from "react";

export type StorySessionStatus = "idle" | "joining" | "joined" | "left";

export function useStorySession(sessionId: string) {
  const [status, setStatus] = useState<StorySessionStatus>("idle");

  const join = useCallback(() => setStatus("joined"), []);
  const leave = useCallback(() => setStatus("left"), []);

  return { sessionId, status, join, leave };
}
