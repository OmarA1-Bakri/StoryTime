export type ArtPlan = {
  id: string;
  prompt: string;
  key: string;
};

export function createArtPlan(id: string, prompt: string): ArtPlan {
  return { id, prompt, key: `art/${id}/card.json` };
}
