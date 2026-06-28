import { MockStructuredStoryProvider } from "./story/StructuredStoryProvider";

export type WorkerProviderMode = "mock" | "live";

export function resolveWorkerProviderMode(value: string | undefined): WorkerProviderMode {
  return value === "live" ? "live" : "mock";
}

export function createStoryProvider() {
  return new MockStructuredStoryProvider();
}
