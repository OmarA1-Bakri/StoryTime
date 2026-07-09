import { afterEach, describe, expect, it } from "vitest";
import {
  createStoryProvider,
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

  it("refuses to produce mock output in live mode", () => {
    process.env.AI_MODE = "live";
    expect(() => createStoryProvider()).toThrow("refusing to fall back to mock output");
  });
});
