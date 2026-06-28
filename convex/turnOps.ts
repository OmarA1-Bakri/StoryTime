import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

const role = v.union(v.literal("remote_adult"), v.literal("young_participant"));

export const listForSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => await ctx.db.query("turns").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect()
});

export const addTurn = mutation({
  args: { sessionId: v.id("sessions"), participantId: v.string(), role },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    assert(session, "session_missing", "Session not found");
    const existing = await ctx.db.query("turns").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect();
    return await ctx.db.insert("turns", { sessionId: args.sessionId, campaignId: session.campaignId, turnIndex: existing.length, speakerParticipantId: args.participantId, speakerRole: args.role, status: "started", safetyStatus: "pending", createdAt: now(), updatedAt: now() });
  }
});

export const finishTurn = mutation({
  args: { turnId: v.id("turns"), transcript: v.string(), storyBeat: v.string(), caption: v.string(), nextTurnPrompt: v.string() },
  handler: async (ctx, args) => {
    const turn = await ctx.db.get(args.turnId);
    assert(turn, "turn_missing", "Turn not found");
    await ctx.db.patch(args.turnId, { transcript: args.transcript, storyBeat: args.storyBeat, caption: args.caption, nextTurnPrompt: args.nextTurnPrompt, status: "completed", safetyStatus: "approved", updatedAt: now() });
    return args.turnId;
  }
});
