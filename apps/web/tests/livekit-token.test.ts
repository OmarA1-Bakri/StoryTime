import { afterEach, describe, expect, it } from "vitest";
import { POST } from "../app/api/livekit/token/route";

const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
});

function request(body: unknown, betaKey?: string) {
  return new Request("http://localhost/api/livekit/token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(betaKey ? { "x-storytime-beta-key": betaKey } : {}),
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  sessionId: "chapter-123",
  participantId: "adult-456",
  displayName: "Dad",
  participantType: "remote_adult",
};

describe("LiveKit token route", () => {
  it("fails closed when LiveKit is not configured", async () => {
    delete process.env.LIVEKIT_API_KEY;
    delete process.env.LIVEKIT_API_SECRET;
    delete process.env.LIVEKIT_URL;
    delete process.env.STORYTIME_BETA_ACCESS_KEY;
    const response = await POST(request(validBody));
    expect(response.status).toBe(503);
  });

  it("rejects malformed participant data", async () => {
    process.env.LIVEKIT_API_KEY = "key";
    process.env.LIVEKIT_API_SECRET = "secret";
    process.env.LIVEKIT_URL = "wss://example.livekit.cloud";
    const response = await POST(request({ ...validBody, sessionId: "invalid room/id" }));
    expect(response.status).toBe(400);
  });

  it("requires the beta access key when configured", async () => {
    process.env.LIVEKIT_API_KEY = "key";
    process.env.LIVEKIT_API_SECRET = "secret";
    process.env.LIVEKIT_URL = "wss://example.livekit.cloud";
    process.env.STORYTIME_BETA_ACCESS_KEY = "expected-key";
    const response = await POST(request(validBody, "wrong-key"));
    expect(response.status).toBe(401);
  });

  it("issues a scoped room token", async () => {
    process.env.LIVEKIT_API_KEY = "key";
    process.env.LIVEKIT_API_SECRET = "secret";
    process.env.LIVEKIT_URL = "wss://example.livekit.cloud";
    process.env.STORYTIME_BETA_ACCESS_KEY = "expected-key";
    const response = await POST(request(validBody, "expected-key"));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.serverUrl).toBe("wss://example.livekit.cloud");
    expect(body.token.split(".")).toHaveLength(3);
  });
});
