import { MockTrackOutputProvider } from "./output/TrackOutputProvider";
import { MockReviewProvider } from "./review/ReviewProvider";
import { MockSafetyProvider, OpenAiSafetyProvider } from "./safety/SafetyProvider";
import { SafeStoryProvider } from "./story/SafeStoryProvider";
import {
  MockStructuredStoryProvider,
  OpenAiStructuredStoryProvider,
} from "./story/StructuredStoryProvider";
import { GroqTextProvider, MockTextProvider } from "./text/TextProvider";
import { FalImageProvider, MockImageProvider } from "./image/ImageProvider";

export type WorkerProviderMode = "mock" | "live";

export function resolveWorkerProviderMode(value: string | undefined): WorkerProviderMode {
  return value === "live" ? "live" : "mock";
}

export function createStoryProvider() {
  if (!isLive()) return new MockStructuredStoryProvider();
  const key = required("OPENAI_API_KEY");
  return new SafeStoryProvider(
    new OpenAiStructuredStoryProvider(key, process.env.OPENAI_STORY_MODEL),
    new OpenAiSafetyProvider(key, process.env.OPENAI_MODERATION_MODEL),
  );
}

export function createTextProvider() {
  return isLive()
    ? new GroqTextProvider(required("GROQ_API_KEY"), process.env.GROQ_STT_MODEL)
    : new MockTextProvider();
}

export function createTrackOutputProvider() {
  if (isLive()) {
    throw new Error(
      "Live recording output is not configured; refusing to fall back to mock output",
    );
  }
  return new MockTrackOutputProvider();
}

export function createReviewProvider() {
  if (isLive()) {
    throw new Error("Live consent review is not configured; refusing to fall back to mock output");
  }
  return new MockReviewProvider();
}

export function createSafetyProvider() {
  return isLive()
    ? new OpenAiSafetyProvider(required("OPENAI_API_KEY"), process.env.OPENAI_MODERATION_MODEL)
    : new MockSafetyProvider();
}

export function createImageProvider() {
  return isLive()
    ? new FalImageProvider(required("FAL_KEY"), required("FAL_IMAGE_ENDPOINT"))
    : new MockImageProvider();
}

function isLive() {
  return resolveWorkerProviderMode(process.env.AI_MODE) === "live";
}

function required(name: string): string {
  const value = process.env[name];
  if (!value)
    throw new Error(`${name} is required in live AI mode; refusing to fall back to mock output`);
  return value;
}
