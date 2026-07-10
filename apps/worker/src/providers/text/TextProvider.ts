export type TextProviderInput = {
  sourceKey: string;
  audioUrl?: string;
};

export type TextProviderOutput = {
  text: string;
  confidence: number;
};

export interface TextProvider {
  read(input: TextProviderInput): Promise<TextProviderOutput>;
}

export class GroqTextProvider implements TextProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = "whisper-large-v3-turbo",
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async read(input: TextProviderInput): Promise<TextProviderOutput> {
    if (!input.audioUrl)
      throw new Error(`Audio URL is required for live transcription (${input.sourceKey})`);
    const audio = await this.fetcher(input.audioUrl);
    if (!audio.ok) throw new Error(`Unable to fetch source audio (${audio.status})`);
    const form = new FormData();
    form.append("file", await audio.blob(), fileName(input.sourceKey));
    form.append("model", this.model);
    form.append("response_format", "verbose_json");
    form.append("temperature", "0");
    const response = await this.fetcher("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: form,
    });
    if (!response.ok) throw new Error(`Groq transcription failed (${response.status})`);
    const payload = (await response.json()) as { text?: unknown };
    if (typeof payload.text !== "string" || !payload.text.trim()) {
      throw new Error("Groq transcription returned no text");
    }
    return { text: payload.text.trim(), confidence: 1 };
  }
}

function fileName(sourceKey: string): string {
  const finalPart = sourceKey.split("/").pop();
  return finalPart?.includes(".") ? finalPart : `${finalPart || "turn"}.webm`;
}

export class MockTextProvider implements TextProvider {
  async read(input: TextProviderInput): Promise<TextProviderOutput> {
    return { text: `Text for ${input.sourceKey}`, confidence: 1 };
  }
}
