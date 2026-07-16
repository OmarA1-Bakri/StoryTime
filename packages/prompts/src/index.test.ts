import { describe, expect, it } from "vitest";

import { SETUP_ONLY_PROMPT_BOUNDARY } from "./index";

describe("SETUP_ONLY_PROMPT_BOUNDARY", () => {
  it("keeps implementation gated on PRD ingestion", () => {
    expect(SETUP_ONLY_PROMPT_BOUNDARY).toBe(
      "Do not implement product logic before PRD ingestion is complete.",
    );
  });
});
