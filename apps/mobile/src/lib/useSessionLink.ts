import { useCallback, useState } from "react";

export type SessionLinkStatus = "idle" | "opening" | "open" | "closed";

export function useSessionLink(sessionId: string) {
  const [status, setStatus] = useState<SessionLinkStatus>("idle");
  const open = useCallback(() => setStatus("open"), []);
  const close = useCallback(() => setStatus("closed"), []);
  return { sessionId, status, open, close };
}
