export type TextProviderInput = {
  sourceKey: string;
};

export type TextProviderOutput = {
  text: string;
  confidence: number;
};

export interface TextProvider {
  read(input: TextProviderInput): Promise<TextProviderOutput>;
}

export class MockTextProvider implements TextProvider {
  async read(input: TextProviderInput): Promise<TextProviderOutput> {
    return { text: `Text for ${input.sourceKey}`, confidence: 1 };
  }
}
