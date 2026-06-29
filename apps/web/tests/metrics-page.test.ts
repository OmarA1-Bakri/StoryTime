import { describe, expect, it } from "vitest";
import MetricsPage from "../app/app/metrics/page";

describe("metrics page", () => {
  it("exports a route component", () => {
    expect(typeof MetricsPage).toBe("function");
  });
});
