import { describe, expect, it } from "vitest";

import { uiTokens } from "./index";

describe("uiTokens", () => {
  it("exposes the supported radius scale", () => {
    expect(uiTokens.radius).toEqual({ sm: 8, md: 16, lg: 24 });
  });

  it("orders radius sizes from smallest to largest", () => {
    expect(uiTokens.radius.sm).toBeLessThan(uiTokens.radius.md);
    expect(uiTokens.radius.md).toBeLessThan(uiTokens.radius.lg);
  });
});
