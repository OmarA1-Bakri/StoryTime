import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { now } from "./lib/time";

export const listForSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => await ctx.db.query("analytics").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect()
});

export const track = mutation({
  args: { userId: v.optional(v.id("users")), sessionId: v.optional(v.id("sessions")), eventName: v.string() },
  handler: async (ctx, args) => await ctx.db.insert("analytics", { userId: args.userId, sessionId: args.sessionId, eventName: args.eventName, createdAt: now() })
});
