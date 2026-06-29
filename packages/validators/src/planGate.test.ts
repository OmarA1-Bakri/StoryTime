import { describe, expect, it } from "vitest";
import { hasRemainingUnit } from "./planGate";

describe("plan gate helpers", () => {
  it("accepts available units", () => {
    expect(hasRemainingUnit({ active: true, remainingUnits: 1, usedBytes: 0, limitBytes: 100 })).toBe(true);
  });
});
