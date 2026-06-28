import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

const plan = v.union(v.literal("free"), v.literal("family"), v.literal("pro"), v.literal("vault"));
const visualTier = v.union(v.literal("basic"), v.literal("standard"), v.literal("premium"), v.literal("best"));

export const getForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => await ctx.db.query("entitlements").withIndex("by_user", (q) => q.eq("userId", args.userId)).unique()
});

export const upsertManualPlan = mutation({
  args: { userId: v.id("users"), plan, storageLimitBytes: v.number(), weeklyAdventureCredits: v.number(), remainingAdventureCredits: v.number(), visualTier },
  handler: async (ctx, args) => {
    assert(args.storageLimitBytes > 0, "invalid_storage_limit", "Storage limit must be positive");
    assert(args.weeklyAdventureCredits >= 0, "invalid_weekly_credits", "Weekly credits must not be negative");
    assert(args.remainingAdventureCredits >= 0, "invalid_remaining_credits", "Remaining credits must not be negative");
    const existing = await ctx.db.query("entitlements").withIndex("by_user", (q) => q.eq("userId", args.userId)).unique();
    const values = {
      plan: args.plan,
      storageLimitBytes: args.storageLimitBytes,
      weeklyAdventureCredits: args.weeklyAdventureCredits,
      remainingAdventureCredits: args.remainingAdventureCredits,
      visualTier: args.visualTier,
      canDownload: args.plan !== "free",
      canCloudBackup: args.plan === "pro" || args.plan === "vault",
      canRemaster: args.plan === "pro" || args.plan === "vault",
      active: true,
      provider: "manual" as const,
      updatedAt: now()
    };
    if (existing) {
      await ctx.db.patch(existing._id, values);
      return existing._id;
    }
    return await ctx.db.insert("entitlements", { userId: args.userId, ...values });
  }
});

export const spendAdventureCredit = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const record = await ctx.db.query("entitlements").withIndex("by_user", (q) => q.eq("userId", args.userId)).unique();
    assert(record && record.active, "plan_missing", "Active plan record is required");
    assert(record.remainingAdventureCredits > 0, "credits_empty", "No adventure credits remaining");
    await ctx.db.patch(record._id, { remainingAdventureCredits: record.remainingAdventureCredits - 1, updatedAt: now() });
    return record.remainingAdventureCredits - 1;
  }
});
