import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

export const listForSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => await ctx.db.query("turns").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect()
});

export const addTurn = mutation({
  args: { sessionId: v.id("sessions"), participantId: v.string(), role: v.union(v.literal("remote_adult"), v.literal("young_participant")) },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    assert(session, "session_missing", "Session not found");
    const existing = await ctx.db.query("turns").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect();
    return await ctx.db.insert("turns", { sessionId: args.sessionId, campaignId: session.campaignId, turnIndex: existing.length, speakerParticipantId: args.participantId, speakerRole: args.role, status: "started", safetyStatus: "pending", createdAt: now(), updatedAt: now() });
  }
});
