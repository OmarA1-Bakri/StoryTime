import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

export const passBaton = mutation({
  args: { sessionId: v.id("sessions"), fromParticipantId: v.string(), toParticipantId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    assert(session, "session_missing", "Session not found");
    assert(session.batonHolderParticipantId === args.fromParticipantId, "baton_holder_mismatch", "Only the current baton holder can pass the baton");
    await ctx.db.patch(args.sessionId, { batonHolderParticipantId: args.toParticipantId, activeSpeakerParticipantId: args.toParticipantId, updatedAt: now() });
    await ctx.db.insert("compositionEvents", { sessionId: args.sessionId, eventType: "BATON_PASSED", actorParticipantId: args.fromParticipantId, timestampMs: 0, wallClockTime: now(), payload: { toParticipantId: args.toParticipantId }, createdAt: now() });
  }
});
