import { describe, expect, it } from "vitest";
import { prepareBundle } from "./prepareBundle";

describe("worker flow", () => {
  it("prepares a bundle path", () => {
    expect(prepareBundle("s1")).toContain("s1");
  });
});
