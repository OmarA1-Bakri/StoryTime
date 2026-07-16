import {
  decideFamilyResourceLink,
  decideFamilyMigrationVersion,
  FAMILY_TENANT_MIGRATION_VERSION,
  familyCreationRequestSchema,
  familyTenantMetadataSchema,
  planLegacyFamilyMigration,
  resolveFamilyTenantConfig,
} from "@storytime/validators";
import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./guards";
import { now } from "./lib/time";

function currentTenantConfig() {
  return resolveFamilyTenantConfig({
    appEnvironment: process.env.APP_ENV,
    dataRegion: process.env.STORYTIME_DATA_REGION,
    deploymentConfigured: Boolean(process.env.CONVEX_DEPLOYMENT),
  });
}

export const createMine = mutation({
  args: { creationRequestId: v.string() },
  handler: async (ctx, args) => {
    const owner = await requireAuthenticatedUser(ctx);
    const { creationRequestId } = familyCreationRequestSchema.parse(args);
    const config = currentTenantConfig();
    const replay = await ctx.db
      .query("families")
      .withIndex("by_owner_creation_request", (q) =>
        q.eq("ownerUserId", owner._id).eq("creationRequestId", creationRequestId),
      )
      .unique();
    if (replay) {
      familyTenantMetadataSchema.parse(replay);
      if (
        replay.regionKey !== config.regionKey ||
        replay.configVersion !== config.configVersion ||
        replay.schemaVersion !== config.schemaVersion
      ) {
        throw new Error("family_creation_config_conflict");
      }
      return replay._id;
    }

    const timestamp = now();
    return ctx.db.insert("families", {
      ownerUserId: owner._id,
      status: "active",
      ...config,
      creationRequestId,
      origin: "created",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const getMine = query({
  args: { familyId: v.id("families") },
  handler: async (ctx, args) => {
    const owner = await requireAuthenticatedUser(ctx);
    const family = await ctx.db.get(args.familyId);
    if (!family || family.ownerUserId !== owner._id || family.status !== "active") return null;
    familyTenantMetadataSchema.parse(family);
    return family;
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireAuthenticatedUser(ctx);
    const families = await ctx.db
      .query("families")
      .withIndex("by_owner_status", (q) => q.eq("ownerUserId", owner._id).eq("status", "active"))
      .collect();
    for (const family of families) familyTenantMetadataSchema.parse(family);
    return families;
  },
});

export const backfillOwnerProfiles = internalMutation({
  args: {
    ownerUserId: v.id("users"),
    cursor: v.optional(v.string()),
    batchSize: v.number(),
  },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.batchSize) || args.batchSize < 1 || args.batchSize > 100) {
      throw new Error("family_migration_batch_invalid");
    }
    const owner = await ctx.db.get(args.ownerUserId);
    const ownerStatus = !owner
      ? "missing"
      : owner.status !== "active" ||
          owner.identityStatus === "disabled" ||
          owner.identityStatus === "deleted"
        ? owner.status === "deleted" || owner.identityStatus === "deleted"
          ? "deleted"
          : "disabled"
        : "active";
    const families = (
      await Promise.all(
        (["active", "deleting", "deleted"] as const).map((status) =>
          ctx.db
            .query("families")
            .withIndex("by_owner_status", (q) =>
              q.eq("ownerUserId", args.ownerUserId).eq("status", status),
            )
            .take(2),
        ),
      )
    ).flat();
    const plan = planLegacyFamilyMigration({
      ownerStatus,
      candidateFamilies: families.map((family) => ({ id: family._id, status: family.status })),
    });
    if (plan.action === "conflict") throw new Error(`family_migration_${plan.reason}`);
    if (!owner) throw new Error("family_migration_owner_missing");

    let familyId: Id<"families">;
    if (plan.action === "attach") {
      const selected = families.find((family) => family._id === plan.familyId);
      if (!selected) throw new Error("family_migration_candidate_missing");
      familyTenantMetadataSchema.parse(selected);
      const config = currentTenantConfig();
      if (
        selected.regionKey !== config.regionKey ||
        selected.configVersion !== config.configVersion ||
        selected.schemaVersion !== config.schemaVersion
      ) {
        throw new Error("family_migration_config_conflict");
      }
      familyId = selected._id;
    } else {
      const creationRequestId = `legacy_${owner._id}`;
      familyCreationRequestSchema.parse({ creationRequestId });
      const priorRequest = await ctx.db
        .query("families")
        .withIndex("by_owner_creation_request", (q) =>
          q.eq("ownerUserId", owner._id).eq("creationRequestId", creationRequestId),
        )
        .unique();
      if (priorRequest) throw new Error("family_migration_deleted_history");
      const timestamp = now();
      familyId = await ctx.db.insert("families", {
        ownerUserId: owner._id,
        status: "active",
        ...currentTenantConfig(),
        creationRequestId,
        origin: "legacy_backfill",
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    const page = await ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", owner._id))
      .paginate({ cursor: args.cursor ?? null, numItems: args.batchSize });
    let linkedProfiles = 0;
    for (const profile of page.page) {
      const link = decideFamilyResourceLink(profile.familyId, familyId);
      const version = decideFamilyMigrationVersion(profile.tenantMigrationVersion);
      if (link === "link" || version === "write") {
        await ctx.db.patch(profile._id, {
          familyId,
          tenantMigrationVersion: FAMILY_TENANT_MIGRATION_VERSION,
          updatedAt: now(),
        });
        linkedProfiles += 1;
      }
    }

    return {
      familyId,
      scannedProfiles: page.page.length,
      linkedProfiles,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});
