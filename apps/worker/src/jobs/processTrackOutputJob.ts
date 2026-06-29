import { createTrackOutputProvider } from "../providers/providerFactory";
import { buildOutputPlan } from "./outputPlan";

export type TrackOutputJobInput = {
  sessionId: string;
  trackKeys: string[];
  timelineEventCount: number;
};

export async function processTrackOutputJob(input: TrackOutputJobInput) {
  const output = await createTrackOutputProvider().prepare({ sessionId: input.sessionId, trackKeys: input.trackKeys });
  const plan = buildOutputPlan({ sessionId: input.sessionId, trackKeys: input.trackKeys, timelineEventCount: input.timelineEventCount });

  return {
    sessionId: input.sessionId,
    output,
    plan,
    ready: output.status === "ready" && plan.canRender
  };
}
