import { describe, expect, it } from "vitest";
import { isStrongServiceSecret, normalizeConvexSiteUrl } from "./serviceBoundary";

describe("private service boundary", () => {
  it("requires a service secret with at least 32 characters", () => {
    expect(isStrongServiceSecret("short-secret")).toBe(false);
    expect(isStrongServiceSecret("s".repeat(32))).toBe(true);
  });

  it("allows only a clean HTTPS Convex site origin in hosted environments", () => {
    expect(normalizeConvexSiteUrl("https://calm-otter-123.convex.site/")).toBe(
      "https://calm-otter-123.convex.site",
    );
    expect(normalizeConvexSiteUrl("https://attacker.example/collect")).toBeNull();
    expect(
      normalizeConvexSiteUrl("https://calm-otter-123.convex.site@attacker.example"),
    ).toBeNull();
    expect(normalizeConvexSiteUrl("http://calm-otter-123.convex.site")).toBeNull();
  });

  it("allows loopback only when local development opts in", () => {
    expect(normalizeConvexSiteUrl("http://127.0.0.1:3211", { allowLocal: true })).toBe(
      "http://127.0.0.1:3211",
    );
    expect(normalizeConvexSiteUrl("http://127.0.0.1:3211")).toBeNull();
  });
});
