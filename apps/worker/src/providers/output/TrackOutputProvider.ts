export type TrackOutputInput = {
  sessionId: string;
  trackKeys: string[];
};

export type TrackOutputResult = {
  status: "queued" | "ready";
  outputKey?: string;
};

export interface TrackOutputProvider {
  prepare(input: TrackOutputInput): Promise<TrackOutputResult>;
}

export class MockTrackOutputProvider implements TrackOutputProvider {
  async prepare(input: TrackOutputInput): Promise<TrackOutputResult> {
    if (input.trackKeys.length === 0) return { status: "queued" };
    return { status: "ready", outputKey: `tracks/${input.sessionId}/bundle.json` };
  }
}
