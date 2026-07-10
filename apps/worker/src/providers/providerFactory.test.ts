import { afterEach, describe, expect, it } from "vitest";
import {
  createStoryProvider,
  createImageProvider,
  createTextProvider,
  createTrackOutputProvider,
  resolveWorkerProviderMode,
} from "./providerFactory";

describe("providerFactory", () => {
  const originalMode = process.env.AI_MODE;
  afterEach(() => {
    if (originalMode === undefined) delete process.env.AI_MODE;
    else process.env.AI_MODE = originalMode;
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
});
