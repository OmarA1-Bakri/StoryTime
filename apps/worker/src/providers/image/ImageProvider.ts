export type ImageProviderInput = { prompt: string; sessionId: string; turnId: string };
export type ImageProviderOutput = { url: string; contentType: string };

export interface ImageProvider {
  generate(input: ImageProviderInput): Promise<ImageProviderOutput>;
}

export class MockImageProvider implements ImageProvider {
  async generate(input: ImageProviderInput): Promise<ImageProviderOutput> {
    return {
      url: `mock://illustration/${input.sessionId}/${input.turnId}`,
      contentType: "image/webp",
    };
  }
}

export class FalImageProvider implements ImageProvider {
  constructor(
    private readonly apiKey: string,
    private readonly endpoint: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async generate(input: ImageProviderInput): Promise<ImageProviderOutput> {
    const response = await this.fetcher(this.endpoint, {
      method: "POST",
      headers: { Authorization: `Key ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${input.prompt.slice(0, 1800)}. Child-safe storybook illustration; no text or logos.`,
        num_images: 1,
        enable_safety_checker: true,
        output_format: "webp",
      }),
    });
    if (!response.ok) throw new Error(`FAL illustration generation failed (${response.status})`);
    const payload = (await response.json()) as {
      images?: Array<{ url?: unknown; content_type?: unknown }>;
    };
    const image = payload.images?.[0];
    if (!image || typeof image.url !== "string") throw new Error("FAL returned no illustration");
    return {
      url: image.url,
      contentType: typeof image.content_type === "string" ? image.content_type : "image/webp",
    };
  }
}
