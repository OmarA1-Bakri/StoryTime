import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = path.resolve(process.cwd(), "app");

const requiredRoutes = [
  "page.tsx",
  "demo/page.tsx",
  "pricing/page.tsx",
  "privacy/page.tsx",
  "terms/page.tsx",
  "child-privacy/page.tsx",
  "record-preview/[sessionId]/page.tsx",
  "app/page.tsx",
  "app/library/page.tsx",
  "app/library/[chapterId]/page.tsx",
  "app/preferences/page.tsx",
  "app/pipeline/page.tsx",
  "api/health/route.ts",
  "api/demo/session/route.ts",
  "api/demo/chapter-status/route.ts",
  "api/demo/pipeline/route.ts",
  "api/demo/replay/route.ts",
  "api/demo/readiness/route.ts",
  "api/demo/economics/route.ts"
];

describe("web route map", () => {
  it.each(requiredRoutes)("has %s", (relativePath) => {
    expect(existsSync(path.join(appRoot, relativePath))).toBe(true);
  });
});
