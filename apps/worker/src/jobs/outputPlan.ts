export type OutputPlanInput = {
  sessionId: string;
  trackKeys: string[];
  timelineEventCount: number;
};

export type OutputPlan = {
  sessionId: string;
  canRender: boolean;
  outputKey: string;
};

export function buildOutputPlan(input: OutputPlanInput): OutputPlan {
  return {
    sessionId: input.sessionId,
    canRender: input.trackKeys.length > 0 && input.timelineEventCount > 0,
    outputKey: `outputs/${input.sessionId}/chapter.mp4`
  };
}
