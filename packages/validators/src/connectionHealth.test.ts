import { describe, expect, it } from "vitest";
import { connectionScore } from "./connectionHealth";

describe("connection health helpers", () => {
  it("scores good samples highly", () => {
    expect(connectionScore({ rttMs: 80, dropRatio: 0, jitterMs: 10 })).toBeGreaterThan(0.8);
  });

  it("scores constrained samples lower", () => {
    expect(connectionScore({ rttMs: 900, dropRatio: 0.08, jitterMs: 80 })).toBeLessThan(0.5);
  });
});
