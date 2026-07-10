export type StructuredStoryInput = {
  prompt: string;
  context?: string;
};

export type StructuredStoryOutput = {
  storyBeat: string;
  caption: string;
  imagePrompt: string;
  nextTurnPrompt: string;
};

export interface StructuredStoryProvider {
  generate(input: StructuredStoryInput): Promise<StructuredStoryOutput>;
}

export class MockStructuredStoryProvider implements StructuredStoryProvider {
  async generate(input: StructuredStoryInput): Promise<StructuredStoryOutput> {
    return {
      storyBeat: `${input.prompt} The adventure continues with one clear choice for the next storyteller.`,
      caption: "The adventure continues.",
      imagePrompt: "warm storybook family adventure scene",
      nextTurnPrompt: "What happens next?",
    };
  }
}

const storySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storyBeat: { type: "string", minLength: 1, maxLength: 1200 },
    caption: { type: "string", minLength: 1, maxLength: 180 },
    imagePrompt: { type: "string", minLength: 1, maxLength: 600 },
    nextTurnPrompt: { type: "string", minLength: 1, maxLength: 180 },
  },
  required: ["storyBeat", "caption", "imagePrompt", "nextTurnPrompt"],
} as const;

export class OpenAiStructuredStoryProvider implements StructuredStoryProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = "gpt-5-mini",
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async generate(input: StructuredStoryInput): Promise<StructuredStoryOutput> {
    const response = await this.fetcher("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        store: false,
        instructions:
          "You write one short, warm, age-appropriate story beat for a shared family story. " +
          "Avoid fear, violence, romance, personal data, commercial persuasion, and unsafe instructions. " +
          "Preserve the supplied characters and context. End with one simple invitation for the next storyteller.",
        input: `STORY CONTEXT:\n${(input.context ?? "None").slice(0, 5000)}\n\nNEW TURN:\n${input.prompt.slice(0, 2500)}`,
        text: {
          format: { type: "json_schema", name: "story_turn", strict: true, schema: storySchema },
        },
      }),
    });

    if (!response.ok) throw new Error(`OpenAI story generation failed (${response.status})`);
    const payload = (await response.json()) as unknown;
    return parseStoryOutput(extractResponseText(payload));
  }
}

function extractResponseText(payload: unknown): string {
  if (!isRecord(payload)) throw new Error("OpenAI returned an invalid response");
  if (typeof payload.output_text === "string") return payload.output_text;
  if (!Array.isArray(payload.output))
    throw new Error("OpenAI response did not contain output text");
  for (const item of payload.output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (isRecord(content) && content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }
  throw new Error("OpenAI response did not contain output text");
}

function parseStoryOutput(text: string): StructuredStoryOutput {
  const value = JSON.parse(text) as unknown;
  if (!isRecord(value)) throw new Error("OpenAI returned invalid structured story output");
  const keys = ["storyBeat", "caption", "imagePrompt", "nextTurnPrompt"] as const;
  for (const key of keys) {
    if (typeof value[key] !== "string" || value[key].trim().length === 0) {
      throw new Error(`OpenAI story output is missing ${key}`);
    }
  }
  return {
    storyBeat: value.storyBeat as string,
    caption: value.caption as string,
    imagePrompt: value.imagePrompt as string,
    nextTurnPrompt: value.nextTurnPrompt as string,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
