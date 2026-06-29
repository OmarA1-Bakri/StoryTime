import { makeStep } from "./makeStep";
import { prepareBundle } from "./prepareBundle";
import { createUsageLogEntry } from "./usageLog";

export type StoryRunInput = {
  sessionId: string;
  userId: string;
  prompts: string[];
};

export async function buildStoryRun(input: StoryRunInput) {
  const steps = [];
  for (let index = 0; index < input.prompts.length; index += 1) {
    steps.push(await makeStep(`turn-${index + 1}`, input.prompts[index]));
  }

  return {
    sessionId: input.sessionId,
    steps,
    bundleKey: prepareBundle(input.sessionId),
    usage: createUsageLogEntry({ userId: input.userId, type: "story_step", quantity: steps.length, provider: "mock" })
  };
}
