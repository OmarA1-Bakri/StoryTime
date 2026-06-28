import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireGrant } from "./guards";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

const memberRole = v.union(v.literal("co_parent"), v.literal("grandparent"), v.literal("guardian"));

export const listMembers = query({
  args: { profileId: v.id("profiles"), requesterUserId: v.id("users") },
  handler: async (ctx, args) => {
    await requireGrant(ctx, args.requesterUserId, args.profileId);
    return await ctx.db.query("accessGrants").withIndex("by_profile", (q) => q.eq("profileId", args.profileId)).collect();
  }
});

export const addMember = mutation({
  args: { profileId: v.id("profiles"), requesterUserId: v.id("users"), memberUserId: v.id("users"), role: memberRole },
  handler: async (ctx, args) => {
    const requester = await requireGrant(ctx, args.requesterUserId, args.profileId);
    assert(requester.role === "owner", "owner_required", "Owner role required");
    const existing = await ctx.db.query("accessGrants").withIndex("by_profile_adult", (q) => q.eq("profileId", args.profileId).eq("adultUserId", args.memberUserId)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role, status: "active", updatedAt: now() });
      return existing._id;
    }
    return await ctx.db.insert("accessGrants", { profileId: args.profileId, adultUserId: args.memberUserId, role: args.role, status: "active", invitedBy: args.requesterUserId, createdAt: now(), updatedAt: now() });
  }
});
