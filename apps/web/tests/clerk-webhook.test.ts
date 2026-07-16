import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../app/api/webhooks/clerk/route";

vi.mock("@clerk/nextjs/webhooks", () => ({ verifyWebhook: vi.fn() }));
const mockVerifyWebhook = vi.mocked(verifyWebhook);
const mockFetch = vi.fn<typeof fetch>();
const syncSecret = "s".repeat(32);
const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.restoreAllMocks();
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockReset();
});

function request(headers: Record<string, string> = { "svix-id": "event_123" }) {
  return new NextRequest("http://localhost/api/webhooks/clerk", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(signedEnvelope),
  });
}

const signedEnvelope = {
  type: "user.updated",
  timestamp: 1_720_000_000_000,
  instance_id: "ins_storytime_dev",
  data: {
    id: "user_clerk_123",
    primary_email_address_id: "email_1",
    email_addresses: [{ id: "email_1", email_address: "adult@example.com" }],
    first_name: "Ada",
    last_name: "Lovelace",
    banned: false,
    locked: false,
  },
};

const verifiedEvent = {
  type: signedEnvelope.type,
  data: signedEnvelope.data,
  object: "event",
  event_attributes: null,
};

describe("Clerk webhook route", () => {
  it("rejects a request that Clerk cannot verify", async () => {
    mockVerifyWebhook.mockRejectedValue(new Error("bad signature"));
    expect((await POST(request())).status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fails closed when the private Convex sync boundary is missing", async () => {
    mockVerifyWebhook.mockResolvedValue(verifiedEvent as never);
    delete process.env.CONVEX_SITE_URL;
    delete process.env.CLERK_SYNC_SECRET;
    delete process.env.CLERK_INSTANCE_ID;
    expect((await POST(request())).status).toBe(503);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fails closed for a weak service secret or untrusted forwarding origin", async () => {
    mockVerifyWebhook.mockResolvedValue(verifiedEvent as never);
    process.env.CLERK_INSTANCE_ID = "ins_storytime_dev";

    process.env.CONVEX_SITE_URL = "https://example.convex.site";
    process.env.CLERK_SYNC_SECRET = "too-short";
    expect((await POST(request())).status).toBe(503);

    process.env.CONVEX_SITE_URL = "https://attacker.example/collect";
    process.env.CLERK_SYNC_SECRET = syncSecret;
    expect((await POST(request())).status).toBe(503);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("forwards only a normalized event over the private sync boundary", async () => {
    mockVerifyWebhook.mockResolvedValue(verifiedEvent as never);
    process.env.CONVEX_SITE_URL = "https://example.convex.site";
    process.env.CLERK_SYNC_SECRET = syncSecret;
    process.env.CLERK_INSTANCE_ID = "ins_storytime_dev";
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.convex.site/internal/clerk-sync",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ authorization: `Bearer ${syncSecret}` }),
        body: JSON.stringify({
          eventId: "event_123",
          eventType: "user.updated",
          subject: "user_clerk_123",
          email: "adult@example.com",
          displayName: "Ada Lovelace",
          accountStatus: "active",
          occurredAt: 1_720_000_000_000,
        }),
      }),
    );
  });

  it("returns a retryable error when the authoritative backend refuses the event", async () => {
    mockVerifyWebhook.mockResolvedValue(verifiedEvent as never);
    process.env.CONVEX_SITE_URL = "https://example.convex.site";
    process.env.CLERK_SYNC_SECRET = syncSecret;
    process.env.CLERK_INSTANCE_ID = "ins_storytime_dev";
    mockFetch.mockResolvedValue(new Response("unavailable", { status: 503 }));
    expect((await POST(request())).status).toBe(502);
  });

  it("rejects a signed event from a different Clerk environment", async () => {
    mockVerifyWebhook.mockResolvedValue(verifiedEvent as never);
    process.env.CONVEX_SITE_URL = "https://example.convex.site";
    process.env.CLERK_SYNC_SECRET = syncSecret;
    process.env.CLERK_INSTANCE_ID = "ins_storytime_prod";
    expect((await POST(request())).status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
