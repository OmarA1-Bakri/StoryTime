import { afterEach, describe, expect, it } from "vitest";
import {
  createStoryProvider,
  createImageProvider,
  createSafetyProvider,
  createTextProvider,
  createTrackOutputProvider,
  resolveWorkerProviderMode,
} from "./providerFactory";

describe("providerFactory", () => {
  const controlledEnvironment = [
    "AI_MODE",
    "OPENAI_API_KEY",
    "OPENAI_ZDR_APPROVED",
    "GROQ_API_KEY",
    "GROQ_ZDR_ENABLED",
    "FAL_KEY",
    "FAL_IMAGE_ENDPOINT",
    "FAL_PRIVATE_OUTPUT_VERIFIED",
    "FAL_MEDIA_RETENTION_VERIFIED",
  ] as const;
  const originalEnvironment = Object.fromEntries(
    controlledEnvironment.map((name) => [name, process.env[name]]),
  );

  afterEach(() => {
    for (const name of controlledEnvironment) {
      const original = originalEnvironment[name];
      if (original === undefined) delete process.env[name];
      else process.env[name] = original;
    }
  });

  it("defaults to mock mode", () => {
    expect(resolveWorkerProviderMode(undefined)).toBe("mock");
  });

  it("creates worker providers", () => {
    process.env.AI_MODE = "mock";
    expect(createStoryProvider()).toBeDefined();
    expect(createTextProvider()).toBeDefined();
    expect(createTrackOutputProvider()).toBeDefined();
  });

  it("requires live provider credentials instead of silently using mocks", () => {
    process.env.AI_MODE = "live";
    delete process.env.OPENAI_API_KEY;
    delete process.env.FAL_KEY;
    expect(() => createStoryProvider()).toThrow("OPENAI_API_KEY is required");
    expect(() => createImageProvider()).toThrow("FAL_KEY is required");
  });

  it("requires verified child-data controls instead of accepting credentials alone", () => {
    process.env.AI_MODE = "live";
    process.env.OPENAI_API_KEY = "openai-key";
    process.env.OPENAI_ZDR_APPROVED = "false";
    process.env.GROQ_API_KEY = "groq-key";
    process.env.GROQ_ZDR_ENABLED = "false";
    process.env.FAL_KEY = "fal-key";
    process.env.FAL_IMAGE_ENDPOINT = "fal-endpoint";
    process.env.FAL_PRIVATE_OUTPUT_VERIFIED = "false";
    process.env.FAL_MEDIA_RETENTION_VERIFIED = "false";

    expect(() => createStoryProvider()).toThrow("OPENAI_ZDR_APPROVED must be true");
    expect(() => createSafetyProvider()).toThrow("OPENAI_ZDR_APPROVED must be true");
    expect(() => createTextProvider()).toThrow("GROQ_ZDR_ENABLED must be true");
    expect(() => createImageProvider()).toThrow("FAL_PRIVATE_OUTPUT_VERIFIED must be true");
  });
});
