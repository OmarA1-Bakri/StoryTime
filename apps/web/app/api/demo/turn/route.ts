import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt : "A brave explorer continues the adventure.";
  return NextResponse.json({
    ok: true,
    storyBeat: `${prompt} The path opens into a glowing new scene, and everyone gets one clear choice for what happens next.`,
    caption: "A new chapter begins.",
    imagePrompt: "warm cinematic storybook scene, family adventure, soft light",
    nextTurnPrompt: "What should happen next?"
  });
}
