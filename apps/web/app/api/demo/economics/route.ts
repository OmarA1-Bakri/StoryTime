import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    chapter: {
      transcriptionMinutes: 14,
      storyCalls: 8,
      imageCalls: 8,
      storageBytes: 128000000,
      estimatedCostUsd: 0.42
    }
  });
}
