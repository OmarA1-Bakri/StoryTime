import { FAMILY_TENANT_MIGRATION_VERSION, resolveFamilyTenantConfig } from "@storytime/validators";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser, requireFamilyCapability } from "./guards";
import { now } from "./lib/time";

const profileArgs = {
  displayName: v.string(),
  ageBand: v.union(v.literal("6-8"), v.literal("9-10"), v.literal("11-12")),
};

type ProfileCreationArgs = {
  displayName: string;
  ageBand: "6-8" | "9-10" | "11-12";
};

async function createSyntheticProfile(ctx: MutationCtx, args: ProfileCreationArgs) {
  const owner = await requireAuthenticatedUser(ctx);
  if (process.env.APP_ENV !== "development" && process.env.APP_ENV !== "test") {
    throw new Error("consent_first_profile_creation_not_implemented");
  }
  resolveFamilyTenantConfig({
    appEnvironment: process.env.APP_ENV,
    dataRegion: process.env.STORYTIME_DATA_REGION,
    deploymentConfigured: Boolean(process.env.CONVEX_DEPLOYMENT),
  });
  const families = await ctx.db
    .query("families")
    .withIndex("by_owner_status", (q) => q.eq("ownerUserId", owner._id).eq("status", "active"))
    .take(2);
  if (families.length !== 1) throw new Error("profile_family_ambiguous");
  const family = families[0];
  await requireFamilyCapability(ctx, family._id, "profiles:create", {
    authenticatedUser: owner,
  });
  return ctx.db.insert("profiles", {
    familyId: family._id,
    tenantMigrationVersion: FAMILY_TENANT_MIGRATION_VERSION,
    ownerUserId: family.ownerUserId,
    displayName: args.displayName,
    ageBand: args.ageBand,
    replayAllowedForProfile: true,
    status: "active",
    createdAt: now(),
    updatedAt: now(),
  });
}

export const createProfile = mutation({
  args: profileArgs,
  handler: createSyntheticProfile,
});

export const createMine = mutation({
  args: profileArgs,
  handler: createSyntheticProfile,
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
  args: {},
  handler: async (ctx) => {
    const owner = await requireAuthenticatedUser(ctx);
    return ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", owner._id))
      .collect();
  },
});
