import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { now } from "./lib/time";
import { requireAuthenticatedUser } from "./guards";

export const createProfile = mutation({
  args: {
    ownerUserId: v.id("users"),
    displayName: v.string(),
    ageBand: v.union(v.literal("6-8"), v.literal("9-10"), v.literal("11-12")),
  },
  handler: async (ctx, args) => {
    const authenticated = await requireAuthenticatedUser(ctx);
    if (authenticated._id !== args.ownerUserId) throw new Error("owner_identity_mismatch");
    const profileId = await ctx.db.insert("profiles", {
      ownerUserId: args.ownerUserId,
      displayName: args.displayName,
      ageBand: args.ageBand,
      replayAllowedForProfile: true,
      status: "active",
      createdAt: now(),
      updatedAt: now(),
    });
    await ctx.db.insert("accessGrants", {
      profileId,
      adultUserId: args.ownerUserId,
      role: "owner",
      status: "active",
      createdAt: now(),
      updatedAt: now(),
    });
    return profileId;
  },
});

export const createMine = mutation({
  args: {
    displayName: v.string(),
    ageBand: v.union(v.literal("6-8"), v.literal("9-10"), v.literal("11-12")),
  },
  handler: async (ctx, args) => {
    const owner = await requireAuthenticatedUser(ctx);
    const profileId = await ctx.db.insert("profiles", {
      ownerUserId: owner._id,
      displayName: args.displayName,
      ageBand: args.ageBand,
      replayAllowedForProfile: true,
      status: "active",
      createdAt: now(),
      updatedAt: now(),
    });
    await ctx.db.insert("accessGrants", {
      profileId,
      adultUserId: owner._id,
      role: "owner",
      status: "active",
      createdAt: now(),
      updatedAt: now(),
    });
    return profileId;
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireAuthenticatedUser(ctx);
    return ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", owner._id))
      .collect();
  },
});

export const listByOwner = query({
  args: { ownerUserId: v.id("users") },
  handler: async (ctx, args) => {
    const authenticated = await requireAuthenticatedUser(ctx);
    if (authenticated._id !== args.ownerUserId) throw new Error("owner_identity_mismatch");
    return ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId))
      .collect();
  },
});
