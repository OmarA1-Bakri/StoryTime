import { MockTrackOutputProvider } from "./output/TrackOutputProvider";
import { MockReviewProvider } from "./review/ReviewProvider";
import { MockStructuredStoryProvider } from "./story/StructuredStoryProvider";
import { MockTextProvider } from "./text/TextProvider";

export type WorkerProviderMode = "mock" | "live";

export function resolveWorkerProviderMode(value: string | undefined): WorkerProviderMode {
  return value === "live" ? "live" : "mock";
}

export function createStoryProvider() {
  assertMockProviderMode("story");
  return new MockStructuredStoryProvider();
}

export function createTextProvider() {
  assertMockProviderMode("text");
  return new MockTextProvider();
}

export function createTrackOutputProvider() {
  assertMockProviderMode("recording");
  return new MockTrackOutputProvider();
}

export function createReviewProvider() {
  assertMockProviderMode("safety");
  return new MockReviewProvider();
}

function assertMockProviderMode(capability: string) {
  if (resolveWorkerProviderMode(process.env.AI_MODE) === "live") {
    throw new Error(
      `Live ${capability} provider is not configured; refusing to fall back to mock output`,
    );
  }
}
