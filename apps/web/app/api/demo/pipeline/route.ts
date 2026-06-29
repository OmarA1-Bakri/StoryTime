import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    sessionId: "demo-session",
    story: {
      status: "ready",
      turns: 2,
      title: "Rania and the Space Princess"
    },
    replay: {
      status: "ready",
      outputKey: "outputs/demo-session/chapter.mp4"
    }
  });
}
