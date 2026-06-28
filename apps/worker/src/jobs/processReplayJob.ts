export type ReplayJobInput = {
  sessionId: string;
  rawTrackCount: number;
  eventCount: number;
};

export type ReplayJobResult = {
  sessionId: string;
  status: "ready" | "needs_more_input";
  outputKey?: string;
};

export async function processReplayJob(input: ReplayJobInput): Promise<ReplayJobResult> {
  if (input.rawTrackCount < 1 || input.eventCount < 1) {
    return { sessionId: input.sessionId, status: "needs_more_input" };
  }
  return { sessionId: input.sessionId, status: "ready", outputKey: `replays/${input.sessionId}/final.mp4` };
}
