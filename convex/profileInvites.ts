import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser, requireProfileCapability } from "./guards";

export const listInvites = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    await requireProfileCapability(ctx, args.profileId, "profiles:view");
    const grants = await ctx.db
      .query("accessGrants")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    return grants.filter((grant) => grant.status === "invited");
  },
});

export const createInvite = mutation({
  args: {
    profileId: v.id("profiles"),
    invitedUserId: v.id("users"),
    role: v.literal("approved_adult"),
  },
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx);
    throw new Error("invitation_lifecycle_not_implemented");
  },
});

export const acceptInvite = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx);
    throw new Error("invitation_lifecycle_not_implemented");
  },
});
