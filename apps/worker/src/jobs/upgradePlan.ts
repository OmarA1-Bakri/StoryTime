export type UpgradePlan = {
  id: string;
  inputKey: string;
  outputKey: string;
  enabled: boolean;
};

export function createUpgradePlan(id: string, inputKey: string, enabled: boolean): UpgradePlan {
  return { id, inputKey, outputKey: `upgrade/${id}/chapter.mp4`, enabled };
}
