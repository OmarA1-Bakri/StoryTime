import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    replay: {
      id: "demo-replay-1",
      title: "The Space Princess Chapter",
      status: "ready",
      durationSeconds: 840,
      scenes: 8,
      storageBytes: 128000000,
      thumbnailUrl: null,
      playbackUrl: null
    }
  });
}
