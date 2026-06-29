import { MockTrackOutputProvider } from "./output/TrackOutputProvider";
import { MockReviewProvider } from "./review/ReviewProvider";
import { MockStructuredStoryProvider } from "./story/StructuredStoryProvider";
import { MockTextProvider } from "./text/TextProvider";

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

export function createReviewProvider() {
  return new MockReviewProvider();
}
