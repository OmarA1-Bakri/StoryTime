export type ConnectionSample = { rttMs: number; dropRatio: number; jitterMs: number };

export function connectionScore(sample: ConnectionSample): number {
  const latencyPenalty = Math.min(sample.rttMs / 1000, 1);
  const dropPenalty = Math.min(sample.dropRatio * 8, 1);
  const jitterPenalty = Math.min(sample.jitterMs / 150, 1);
  return Math.max(0, 1 - Math.max(latencyPenalty, dropPenalty, jitterPenalty));
}

export function shouldReduceMedia(sample: ConnectionSample): boolean {
  return connectionScore(sample) < 0.5;
}
