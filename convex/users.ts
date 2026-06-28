import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { now } from "./lib/time";

export const upsertMockAdult = mutation({
  args: { email: v.string(), displayName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { displayName: args.displayName ?? existing.displayName, updatedAt: now() });
      return existing._id;
    }
    return await ctx.db.insert("users", { email: args.email, displayName: args.displayName, authProvider: "mock", role: "adult", status: "active", createdAt: now(), updatedAt: now() });
  }
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).unique()
});
