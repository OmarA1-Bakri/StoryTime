import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { now } from "./lib/time";

const severity = v.union(v.literal("low"), v.literal("medium"), v.literal("high"));
const action = v.union(v.literal("allowed"), v.literal("modified"), v.literal("blocked"));

export const listForSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => await ctx.db.query("safetyEvents").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect()
});

export const addGuardEvent = mutation({
  args: { sessionId: v.optional(v.id("sessions")), userId: v.optional(v.id("users")), profileId: v.optional(v.id("profiles")), type: v.string(), severity, action, reason: v.string() },
  handler: async (ctx, args) => await ctx.db.insert("safetyEvents", { sessionId: args.sessionId, userId: args.userId, profileId: args.profileId, type: args.type, severity: args.severity, action: args.action, reason: args.reason, createdAt: now() })
});
