import { useCallback, useState } from "react";

export type ReplayActionStatus = "idle" | "playing" | "download_requested" | "removal_requested";

export function useReplayActions(recordingId: string) {
  const [status, setStatus] = useState<ReplayActionStatus>("idle");
  const play = useCallback(() => setStatus("playing"), []);
  const requestDownload = useCallback(() => setStatus("download_requested"), []);
  const requestRemoval = useCallback(() => setStatus("removal_requested"), []);
  return { recordingId, status, play, requestDownload, requestRemoval };
}
