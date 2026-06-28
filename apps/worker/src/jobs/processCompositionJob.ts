export type CompositionJobInput = {
  sessionId: string;
  recordingId: string;
  timelineEventCount: number;
  rawTrackCount: number;
};

export type CompositionJobOutput = {
  status: "ready" | "failed";
  outputAssetKey?: string;
  thumbnailAssetKey?: string;
  error?: string;
};

export async function processCompositionJob(input: CompositionJobInput): Promise<CompositionJobOutput> {
  if (input.rawTrackCount < 1) {
    return { status: "failed", error: "missing_raw_track" };
  }
  return {
    status: "ready",
    outputAssetKey: `replays/${input.recordingId}.mp4`,
    thumbnailAssetKey: `thumbnails/${input.recordingId}.jpg`
  };
}
