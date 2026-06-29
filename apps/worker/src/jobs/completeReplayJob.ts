import { processTrackOutputJob } from "./processTrackOutputJob";

export type CompleteReplayJobInput = {
  sessionId: string;
  trackKeys: string[];
  timelineEventCount: number;
};

export async function completeReplayJob(input: CompleteReplayJobInput) {
  const output = await processTrackOutputJob(input);
  return {
    sessionId: input.sessionId,
    status: output.ready ? "ready" as const : "waiting" as const,
    outputKey: output.ready ? output.plan.outputKey : undefined
  };
}
