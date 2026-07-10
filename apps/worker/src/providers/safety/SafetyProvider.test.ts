import { describe, expect, it, vi } from "vitest";
import { OpenAiSafetyProvider } from "./SafetyProvider";

describe("OpenAiSafetyProvider", () => {
  it("returns only matched categories", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            results: [{ flagged: true, categories: { violence: true, harassment: false } }],
          }),
        ),
    );
    const result = await new OpenAiSafetyProvider("key", "model", fetcher as typeof fetch).moderate(
      "text",
    );
    expect(result).toEqual({ flagged: true, categories: ["violence"] });
  });
});
