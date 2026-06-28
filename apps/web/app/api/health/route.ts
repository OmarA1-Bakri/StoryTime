export async function GET() {
  return Response.json({ ok: true, app: "StoryTime", version: "0.0.1", phase: "mvp" });
}
