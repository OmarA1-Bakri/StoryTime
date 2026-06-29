import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

export const getQuota = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => await ctx.db.query("storageUsage").withIndex("by_user", (q) => q.eq("userId", args.userId)).unique()
});

export const setQuota = mutation({
  args: { userId: v.id("users"), usedBytes: v.number(), limitBytes: v.number() },
  handler: async (ctx, args) => {
    assert(args.usedBytes >= 0, "invalid_used_bytes", "Used bytes must not be negative");
    assert(args.limitBytes > 0, "invalid_limit_bytes", "Limit bytes must be positive");
    const existing = await ctx.db.query("storageUsage").withIndex("by_user", (q) => q.eq("userId", args.userId)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { usedBytes: args.usedBytes, limitBytes: args.limitBytes, updatedAt: now() });
      return existing._id;
    }
    return await ctx.db.insert("storageUsage", { userId: args.userId, usedBytes: args.usedBytes, limitBytes: args.limitBytes, lastCalculatedAt: now(), createdAt: now(), updatedAt: now() });
  }
});
