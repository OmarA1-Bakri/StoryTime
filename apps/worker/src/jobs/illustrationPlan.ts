export type IllustrationPlan = {
  sessionId: string;
  prompt: string;
  outputKey: string;
};

export function createIllustrationPlan(sessionId: string, prompt: string): IllustrationPlan {
  return { sessionId, prompt, outputKey: `illustrations/${sessionId}/card.json` };
}
