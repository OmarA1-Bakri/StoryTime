import { describe, expect, it } from "vitest";
import { createStoryProvider, createTextProvider, createTrackOutputProvider, resolveWorkerProviderMode } from "./providerFactory";

describe("providerFactory", () => {
  it("defaults to mock mode", () => {
    expect(resolveWorkerProviderMode(undefined)).toBe("mock");
  });

  it("creates worker providers", () => {
    expect(createStoryProvider()).toBeDefined();
    expect(createTextProvider()).toBeDefined();
    expect(createTrackOutputProvider()).toBeDefined();
  });
});
