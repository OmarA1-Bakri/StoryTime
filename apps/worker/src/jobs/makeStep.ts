import { createStoryProvider } from "../providers/providerFactory";
import { buildStepResult } from "./stepResult";

export async function makeStep(id: string, prompt: string) {
  const generated = await createStoryProvider().generate({ prompt });
  return buildStepResult({ id, text: generated.storyBeat, caption: generated.caption });
}
