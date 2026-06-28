import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

const seed = v.object({ character: v.string(), setting: v.string(), problem: v.string(), tone: v.string(), visualFormat: v.string() });

export const lockSeed = mutation({
  args: { campaignId: v.id("campaigns"), storySeed: seed },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    assert(campaign, "campaign_missing", "Campaign not found");
    assert(!campaign.storySeed, "seed_already_locked", "Story seed is already locked");
    await ctx.db.patch(args.campaignId, { storySeed: args.storySeed, updatedAt: now() });
    return args.storySeed;
  }
});
