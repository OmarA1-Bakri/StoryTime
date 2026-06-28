import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

export const listForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => await ctx.db.query("usageLedger").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect()
});

export const addMeter = mutation({
  args: { userId: v.id("users"), sessionId: v.optional(v.id("sessions")), type: v.string(), quantity: v.number(), provider: v.optional(v.string()) },
  handler: async (ctx, args) => {
    assert(args.quantity >= 0, "invalid_quantity", "Quantity must not be negative");
    return await ctx.db.insert("usageLedger", { userId: args.userId, sessionId: args.sessionId, type: args.type, quantity: args.quantity, provider: args.provider, createdAt: now() });
  }
});
