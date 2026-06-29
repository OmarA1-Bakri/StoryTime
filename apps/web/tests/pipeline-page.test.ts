import { describe, expect, it } from "vitest";
import PipelinePage from "../app/app/pipeline/page";

describe("pipeline page", () => {
  it("exports a route component", () => {
    expect(typeof PipelinePage).toBe("function");
  });
});
