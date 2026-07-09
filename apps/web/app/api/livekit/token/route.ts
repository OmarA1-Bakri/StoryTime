import { timingSafeEqual } from "node:crypto";
import { AccessToken } from "livekit-server-sdk";
import { z } from "zod";

export const runtime = "nodejs";

const tokenRequestSchema = z.object({
  sessionId: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/),
  participantId: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/),
  displayName: z.string().trim().min(1).max(80),
  participantType: z.enum(["remote_adult", "nearby_adult"]),
});

function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function isAuthorized(request: Request): boolean {
  if (process.env.NODE_ENV !== "production" && !process.env.STORYTIME_BETA_ACCESS_KEY) return true;
  const expected = process.env.STORYTIME_BETA_ACCESS_KEY;
  const supplied = request.headers.get("x-storytime-beta-key");
  return Boolean(expected && supplied && secureEqual(expected, supplied));
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });

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
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { sessionId, participantId, displayName, participantType } = parsed.data;
  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantId,
    name: displayName,
    ttl: "15m",
    metadata: JSON.stringify({ sessionId, participantType }),
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
