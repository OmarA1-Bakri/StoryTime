import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/webhooks/clerk/route";

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.unstubAllGlobals();
});

describe("Clerk webhook signature integration", () => {
  it("accepts a real Standard Webhooks signature and preserves the signed timestamp", async () => {
    const secretBytes = Buffer.from("storytime-clerk-webhook-test-secret");
    process.env.CLERK_WEBHOOK_SIGNING_SECRET = `whsec_${secretBytes.toString("base64")}`;
    process.env.CLERK_INSTANCE_ID = "ins_storytime_test";
    process.env.CONVEX_SITE_URL = "https://example.convex.site";
    process.env.CLERK_SYNC_SECRET = "s".repeat(32);
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const eventId = "event_signed_123";
    const deliveryTimestamp = Math.floor(Date.now() / 1000).toString();
    const providerTimestamp = 1_720_000_000_321;
    const body = JSON.stringify({
      type: "user.updated",
      object: "event",
      timestamp: providerTimestamp,
      instance_id: "ins_storytime_test",
      data: {
        id: "user_clerk_123",
        primary_email_address_id: "email_1",
        email_addresses: [{ id: "email_1", email_address: "adult@example.com" }],
        first_name: "Ada",
        last_name: "Lovelace",
        banned: false,
        locked: false,
      },
    });
    const signature = createHmac("sha256", secretBytes)
      .update(`${eventId}.${deliveryTimestamp}.${body}`)
      .digest("base64");
    const request = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "svix-id": eventId,
        "svix-timestamp": deliveryTimestamp,
        "svix-signature": `v1,${signature}`,
      },
      body,
    });

    expect((await POST(request)).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.convex.site/internal/clerk-sync",
      expect.objectContaining({
        body: expect.stringContaining(`"occurredAt":${providerTimestamp}`),
      }),
    );
  });
});
