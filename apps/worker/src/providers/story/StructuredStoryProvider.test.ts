import { describe, expect, it, vi } from "vitest";
import { OpenAiStructuredStoryProvider } from "./StructuredStoryProvider";

describe("OpenAiStructuredStoryProvider", () => {
  it("requests non-stored structured output and parses it", async () => {
    const fetcher = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      expect(body.store).toBe(false);
      expect(body.text).toMatchObject({ format: { type: "json_schema", strict: true } });
      return new Response(
        JSON.stringify({
          output: [
            {
              content: [
                {
                  type: "output_text",
                  text: JSON.stringify({
                    storyBeat: "Mina found a glowing leaf.",
                    caption: "A glowing leaf!",
                    imagePrompt: "Mina with a glowing leaf",
                    nextTurnPrompt: "Where should Mina go?",
                  }),
                },
              ],
            },
          ],
        }),
      );
    });
    const result = await new OpenAiStructuredStoryProvider(
      "test-key",
      "test-model",
      fetcher as typeof fetch,
    ).generate({ prompt: "Mina explores" });
    expect(result.caption).toBe("A glowing leaf!");
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("does not include provider response bodies in HTTP errors", async () => {
    const fetcher = vi.fn(async () => new Response("secret upstream detail", { status: 429 }));
    await expect(
      new OpenAiStructuredStoryProvider("key", "model", fetcher as typeof fetch).generate({
        prompt: "hello",
      }),
    ).rejects.toThrow("(429)");
  });
});
