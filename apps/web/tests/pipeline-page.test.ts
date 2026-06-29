import { describe, expect, it } from "vitest";
import PipelinePage from "../app/app/pipeline/page";

describe("pipeline page", () => {
  it("renders the pipeline shell", () => {
    expect(PipelinePage()).toBeDefined();
  });
});
