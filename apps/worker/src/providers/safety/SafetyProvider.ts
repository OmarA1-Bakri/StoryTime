export type SafetyResult = { flagged: boolean; categories: string[] };

export interface SafetyProvider {
  moderate(text: string): Promise<SafetyResult>;
}

export class MockSafetyProvider implements SafetyProvider {
  async moderate(): Promise<SafetyResult> {
    return { flagged: false, categories: [] };
  }
}

export class OpenAiSafetyProvider implements SafetyProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = "omni-moderation-latest",
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async moderate(text: string): Promise<SafetyResult> {
    const response = await this.fetcher("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.model, input: text.slice(0, 10_000) }),
    });
    if (!response.ok) throw new Error(`OpenAI moderation failed (${response.status})`);
    const payload = (await response.json()) as {
      results?: Array<{ flagged?: boolean; categories?: Record<string, boolean> }>;
    };
    const result = payload.results?.[0];
    if (!result) throw new Error("OpenAI moderation returned no result");
    return {
      flagged: result.flagged === true,
      categories: Object.entries(result.categories ?? {})
        .filter(([, hit]) => hit)
        .map(([name]) => name),
    };
  }
}
