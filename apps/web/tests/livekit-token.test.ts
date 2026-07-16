import { auth } from "@clerk/nextjs/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/livekit/token/route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
const mockAuth = vi.mocked(auth);
const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
  vi.clearAllMocks();
});

function request(body: unknown) {
  return new Request("http://localhost/api/livekit/token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = { sessionId: "chapter-123", displayName: "Dad", participantType: "remote_adult" };

describe("LiveKit token route", () => {
  it("requires an authenticated adult", async () => {
    mockAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
    expect((await POST(request(validBody))).status).toBe(401);
  });

  it("fails closed when LiveKit is not configured", async () => {
    mockAuth.mockResolvedValue({ userId: "adult-456" } as Awaited<ReturnType<typeof auth>>);
    delete process.env.LIVEKIT_API_KEY;
    delete process.env.LIVEKIT_API_SECRET;
    delete process.env.LIVEKIT_URL;
    expect((await POST(request(validBody))).status).toBe(503);
  });

  it("rejects malformed participant data", async () => {
    mockAuth.mockResolvedValue({ userId: "adult-456" } as Awaited<ReturnType<typeof auth>>);
    process.env.LIVEKIT_API_KEY = "key";
    process.env.LIVEKIT_API_SECRET = "secret";
    process.env.LIVEKIT_URL = "wss://example.livekit.cloud";
    expect((await POST(request({ ...validBody, sessionId: "invalid room/id" }))).status).toBe(400);
  });

  it("issues a scoped room token", async () => {
    mockAuth.mockResolvedValue({ userId: "adult-456" } as Awaited<ReturnType<typeof auth>>);
    process.env.LIVEKIT_API_KEY = "key";
    process.env.LIVEKIT_API_SECRET = "secret";
    process.env.LIVEKIT_URL = "wss://example.livekit.cloud";
    const response = await POST(request(validBody));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.serverUrl).toBe("wss://example.livekit.cloud");
    expect(body.token.split(".")).toHaveLength(3);
  });
});
