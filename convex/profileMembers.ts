import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser, requireProfileCapability } from "./guards";

export const listMembers = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    await requireProfileCapability(ctx, args.profileId, "profiles:view");
    return await ctx.db
      .query("accessGrants")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
  },
});

export const addMember = mutation({
  args: {
    profileId: v.id("profiles"),
    memberUserId: v.id("users"),
    role: v.literal("approved_adult"),
  },
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx);
    throw new Error("membership_lifecycle_not_implemented");
  },
});

export const removeMember = mutation({
  args: {
    profileId: v.id("profiles"),
    memberUserId: v.id("users"),
  },
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx);
    throw new Error("membership_lifecycle_not_implemented");
  },
});
