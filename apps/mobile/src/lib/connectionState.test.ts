import { describe, expect, it } from "vitest";

import { modeForConnection } from "./connectionState";

describe("modeForConnection", () => {
  it.each([
    { score: 0, expected: "reduced" },
    { score: 0.49, expected: "reduced" },
    { score: 0.5, expected: "full" },
    { score: 1, expected: "full" },
  ] as const)("returns $expected for a $score score", ({ score, expected }) => {
    expect(modeForConnection({ score })).toBe(expected);
  });
});
