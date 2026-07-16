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
  requiredControl("OPENAI_ZDR_APPROVED");
  return new SafeStoryProvider(
    new OpenAiStructuredStoryProvider(key, process.env.OPENAI_STORY_MODEL),
    new OpenAiSafetyProvider(key, process.env.OPENAI_MODERATION_MODEL),
  );
}

export function createTextProvider() {
  if (!isLive()) return new MockTextProvider();
  const key = required("GROQ_API_KEY");
  requiredControl("GROQ_ZDR_ENABLED");
  return new GroqTextProvider(key, process.env.GROQ_STT_MODEL);
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
  if (!isLive()) return new MockSafetyProvider();
  const key = required("OPENAI_API_KEY");
  requiredControl("OPENAI_ZDR_APPROVED");
  return new OpenAiSafetyProvider(key, process.env.OPENAI_MODERATION_MODEL);
}

export function createImageProvider() {
  if (!isLive()) return new MockImageProvider();
  const key = required("FAL_KEY");
  const endpoint = required("FAL_IMAGE_ENDPOINT");
  requiredControl("FAL_PRIVATE_OUTPUT_VERIFIED");
  requiredControl("FAL_MEDIA_RETENTION_VERIFIED");
  return new FalImageProvider(key, endpoint);
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

function requiredControl(name: string): void {
  if (process.env[name] !== "true") {
    throw new Error(
      `${name} must be true in live AI mode; refusing to process child data without verified controls`,
    );
  }
}
