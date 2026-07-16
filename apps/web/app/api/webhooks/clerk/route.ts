import {
  isStrongServiceSecret,
  normalizeClerkIdentityEvent,
  normalizeConvexSiteUrl,
} from "@storytime/validators";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";

const supportedEvents = new Set(["user.created", "user.updated", "user.deleted"]);

export async function POST(request: NextRequest) {
  const signedEnvelopeRequest = request.clone();
  let event: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    event = await verifyWebhook(request);
  } catch {
    return Response.json({ ok: false, error: "invalid_webhook" }, { status: 400 });
  }

  if (!supportedEvents.has(event.type)) {
    return Response.json({ ok: true, ignored: true });
  }

  const eventId = request.headers.get("svix-id") ?? request.headers.get("webhook-id");
  const convexSiteUrl = normalizeConvexSiteUrl(process.env.CONVEX_SITE_URL, {
    allowLocal: process.env.APP_ENV !== "production",
  });
  const syncSecret = process.env.CLERK_SYNC_SECRET;
  const expectedInstanceId = process.env.CLERK_INSTANCE_ID;
  if (!eventId || !convexSiteUrl || !isStrongServiceSecret(syncSecret) || !expectedInstanceId) {
    return Response.json({ ok: false, error: "identity_sync_unavailable" }, { status: 503 });
  }

  let normalizedEvent;
  try {
    const signedEnvelope = await signedEnvelopeRequest.json();
    normalizedEvent = normalizeClerkIdentityEvent(signedEnvelope, eventId, expectedInstanceId);
    if (normalizedEvent.eventType !== event.type) throw new Error("Verified event type mismatch");
  } catch {
    return Response.json({ ok: false, error: "invalid_identity_event" }, { status: 400 });
  }

  try {
    const response = await fetch(`${convexSiteUrl}/internal/clerk-sync`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${syncSecret}`,
      },
      body: JSON.stringify(normalizedEvent),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      return Response.json({ ok: false, error: "identity_sync_failed" }, { status: 502 });
    }
  } catch {
    return Response.json({ ok: false, error: "identity_sync_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
