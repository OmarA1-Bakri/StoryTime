import { auth } from "@clerk/nextjs/server";
import { AccessToken } from "livekit-server-sdk";
import { z } from "zod";

export const runtime = "nodejs";

const tokenRequestSchema = z.object({
  sessionId: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/),
  displayName: z.string().trim().min(1).max(80),
  participantType: z.enum(["remote_adult", "nearby_adult"]),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL;
  if (!apiKey || !apiSecret || !serverUrl) {
    return Response.json({ error: "livekit_not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = tokenRequestSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      { error: "invalid_request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );

  const { sessionId, displayName, participantType } = parsed.data;
  const participantId = `${userId}-${participantType}`;
  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantId,
    name: displayName,
    ttl: "15m",
    metadata: JSON.stringify({ sessionId, participantType, clerkUserId: userId }),
  });
  token.addGrant({
    room: `storytime-${sessionId}`,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  return Response.json({ serverUrl, token: await token.toJwt(), expiresInSeconds: 900 });
}
