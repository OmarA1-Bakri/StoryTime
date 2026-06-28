export async function GET() {
  return Response.json({
    sessionId: "demo-session",
    status: "storytelling",
    profileName: "Demo profile",
    batonHolder: "Remote adult",
    recording: true,
    scene: {
      title: "The moon-cheese rocket starts to glow",
      caption: "The next story scene appears like a glowing page."
    }
  });
}
