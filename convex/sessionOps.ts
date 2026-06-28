import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireGrant } from "./guards";
import { now } from "./lib/time";
import { assert } from "./lib/errors";

export const startAdventure = mutation({
  args: { userId: v.id("users"), profileId: v.id("profiles"), campaignTitle: v.string() },
  handler: async (ctx, args) => {
    await requireGrant(ctx, args.userId, args.profileId);
    const entitlement = await ctx.db.query("entitlements").withIndex("by_user", (q) => q.eq("userId", args.userId)).unique();
    assert(!entitlement || entitlement.remainingAdventureCredits > 0, "credits_empty", "No Adventure Credits remaining");
    const campaignId = await ctx.db.insert("campaigns", { ownerUserId: args.userId, profileId: args.profileId, title: args.campaignTitle, status: "active", createdAt: now(), updatedAt: now() });
    return await ctx.db.insert("sessions", { campaignId, profileId: args.profileId, startedByUserId: args.userId, status: "waiting", currentPhase: "waiting", livekitRoomName: `storytime-${campaignId}`, checkpointIntervalMinutes: 15, createdAt: now(), updatedAt: now() });
  }
});
