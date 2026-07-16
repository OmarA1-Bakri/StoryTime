import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { clerkIdentitySyncEventSchema, isStrongServiceSecret } from "@storytime/validators";

const http = httpRouter();
const secretCheckPayload = new TextEncoder().encode("storytime-clerk-sync-v1");

async function secretsMatch(expected: string, supplied: string): Promise<boolean> {
  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const [expectedKey, suppliedKey] = await Promise.all([
    crypto.subtle.importKey("raw", new TextEncoder().encode(expected), algorithm, false, [
      "verify",
    ]),
    crypto.subtle.importKey("raw", new TextEncoder().encode(supplied), algorithm, false, ["sign"]),
  ]);
  const suppliedSignature = await crypto.subtle.sign(algorithm, suppliedKey, secretCheckPayload);
  return crypto.subtle.verify(algorithm, expectedKey, suppliedSignature, secretCheckPayload);
}

http.route({
  path: "/internal/clerk-sync",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const expectedSecret = process.env.CLERK_SYNC_SECRET;
    const authorization = request.headers.get("authorization");
    const suppliedSecret = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : "";
    if (
      !isStrongServiceSecret(expectedSecret) ||
      !isStrongServiceSecret(suppliedSecret) ||
      !(await secretsMatch(expectedSecret, suppliedSecret))
    ) {
      return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    let event;
    try {
      event = clerkIdentitySyncEventSchema.parse(await request.json());
    } catch {
      return Response.json({ ok: false, error: "invalid_event" }, { status: 400 });
    }

    try {
      await ctx.runMutation(internal.users.applyClerkIdentityEvent, event);
      return Response.json({ ok: true });
    } catch {
      return Response.json({ ok: false, error: "identity_sync_failed" }, { status: 400 });
    }
  }),
});

export default http;
