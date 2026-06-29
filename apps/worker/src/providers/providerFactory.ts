import { MockStructuredStoryProvider } from "./story/StructuredStoryProvider";
import { MockTextProvider } from "./text/TextProvider";
import { MockTrackOutputProvider } from "./output/TrackOutputProvider";

export type WorkerProviderMode = "mock" | "live";

export function resolveWorkerProviderMode(value: string | undefined): WorkerProviderMode {
  return value === "live" ? "live" : "mock";
}

export function createStoryProvider() {
  return new MockStructuredStoryProvider();
}

export function createTextProvider() {
  return new MockTextProvider();
}

export function createTrackOutputProvider() {
  return new MockTrackOutputProvider();
}
