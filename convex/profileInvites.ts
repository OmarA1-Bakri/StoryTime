import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireGrant } from "./guards";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

const memberRole = v.union(v.literal("co_parent"), v.literal("grandparent"), v.literal("guardian"));

export const listInvites = query({
  args: { profileId: v.id("profiles"), requesterUserId: v.id("users") },
  handler: async (ctx, args) => {
    await requireGrant(ctx, args.requesterUserId, args.profileId);
    const grants = await ctx.db.query("accessGrants").withIndex("by_profile", (q) => q.eq("profileId", args.profileId)).collect();
    return grants.filter((grant) => grant.status === "invited");
  }
});

export const createInvite = mutation({
  args: { profileId: v.id("profiles"), requesterUserId: v.id("users"), invitedUserId: v.id("users"), role: memberRole },
  handler: async (ctx, args) => {
    const requester = await requireGrant(ctx, args.requesterUserId, args.profileId);
    assert(requester.role === "owner", "owner_required", "Owner role required");
    const existing = await ctx.db.query("accessGrants").withIndex("by_profile_adult", (q) => q.eq("profileId", args.profileId).eq("adultUserId", args.invitedUserId)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role, status: "invited", invitedBy: args.requesterUserId, updatedAt: now() });
      return existing._id;
    }
    return await ctx.db.insert("accessGrants", { profileId: args.profileId, adultUserId: args.invitedUserId, role: args.role, status: "invited", invitedBy: args.requesterUserId, createdAt: now(), updatedAt: now() });
  }
});

export const acceptInvite = mutation({
  args: { profileId: v.id("profiles"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const grant = await ctx.db.query("accessGrants").withIndex("by_profile_adult", (q) => q.eq("profileId", args.profileId).eq("adultUserId", args.userId)).unique();
    assert(grant && grant.status === "invited", "invite_missing", "Invitation not found");
    await ctx.db.patch(grant._id, { status: "active", updatedAt: now() });
    return grant._id;
  }
});
