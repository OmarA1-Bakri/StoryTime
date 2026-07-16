import {
  FAMILY_ACCESS_POLICY_VERSION,
  FAMILY_MEMBER_SCHEMA_VERSION,
  FAMILY_MEMBERSHIP_MIGRATION_VERSION,
  FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
  decideLegacyAssignmentWrite,
  decideLegacyMemberWrite,
  planLegacyMembershipMigration,
} from "@storytime/validators";
import type { Doc } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { now } from "./lib/time";

function adultStatus(adult: Doc<"users"> | null): "active" | "disabled" | "deleted" | "missing" {
  if (!adult) return "missing";
  if (adult.status === "deleted" || adult.identityStatus === "deleted") return "deleted";
  if (adult.status !== "active" || adult.identityStatus === "disabled") return "disabled";
  return "active";
}

export const backfillProfileGrants = internalMutation({
  args: {
    profileId: v.id("profiles"),
    cursor: v.optional(v.string()),
    batchSize: v.number(),
  },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.batchSize) || args.batchSize < 1 || args.batchSize > 100) {
      throw new Error("membership_migration_batch_invalid");
    }

    const profile = await ctx.db.get(args.profileId);
    if (!profile || !profile.familyId) throw new Error("membership_migration_profile_missing");
    const family = await ctx.db.get(profile.familyId);
    if (!family || family.status !== "active")
      throw new Error("membership_migration_family_missing");

    const page = await ctx.db
      .query("accessGrants")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .paginate({ cursor: args.cursor ?? null, numItems: args.batchSize });

    let ignoredGrants = 0;
    let insertedMembers = 0;
    let insertedAssignments = 0;
    let alreadyCurrent = 0;

    for (const grant of page.page) {
      const duplicates = await ctx.db
        .query("accessGrants")
        .withIndex("by_profile_adult", (q) =>
          q.eq("profileId", args.profileId).eq("adultUserId", grant.adultUserId),
        )
        .take(2);
      if (duplicates.length !== 1) {
        throw new Error("membership_migration_duplicate_grant");
      }

      const adult = await ctx.db.get(grant.adultUserId);
      const plan = planLegacyMembershipMigration({
        legacyRole: grant.role,
        legacyStatus: grant.status,
        adultStatus: adultStatus(adult),
        profileOwnerMatchesFamilyOwner: profile.ownerUserId === family.ownerUserId,
        isFamilyOwner: grant.adultUserId === family.ownerUserId,
      });
      if (plan.action === "ignore") {
        ignoredGrants += 1;
        continue;
      }
      if (plan.action === "conflict") {
        throw new Error(`membership_migration_${plan.reason}`);
      }

      const members = await ctx.db
        .query("familyMembers")
        .withIndex("by_family_adult", (q) =>
          q.eq("familyId", family._id).eq("adultUserId", grant.adultUserId),
        )
        .take(2);
      if (members.length > 1) throw new Error("membership_migration_member_conflict");
      let member = members[0];
      const memberWrite = decideLegacyMemberWrite(member);
      if (memberWrite === "conflict") {
        throw new Error("membership_migration_member_conflict");
      }
      if (memberWrite === "create") {
        const timestamp = now();
        const memberId = await ctx.db.insert("familyMembers", {
          familyId: family._id,
          adultUserId: grant.adultUserId,
          role: "approved_adult",
          status: "active",
          canInviteApprovedAdults: false,
          schemaVersion: FAMILY_MEMBER_SCHEMA_VERSION,
          policyVersion: FAMILY_ACCESS_POLICY_VERSION,
          migrationVersion: FAMILY_MEMBERSHIP_MIGRATION_VERSION,
          source: "legacy_backfill",
          createdByUserId: family.ownerUserId,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        member = await ctx.db.get(memberId);
        if (!member) throw new Error("membership_migration_insert_failed");
        insertedMembers += 1;
      }

      const assignments = await ctx.db
        .query("familyProfileAssignments")
        .withIndex("by_profile_member", (q) =>
          q.eq("profileId", args.profileId).eq("memberId", member._id),
        )
        .take(2);
      if (assignments.length > 1) {
        throw new Error("membership_migration_assignment_conflict");
      }
      const assignment = assignments[0];
      if (
        assignment &&
        (assignment.familyId !== family._id ||
          assignment.profileId !== args.profileId ||
          assignment.memberId !== member._id)
      ) {
        throw new Error("membership_migration_assignment_conflict");
      }

      const assignmentWrite = decideLegacyAssignmentWrite(assignment);
      if (assignmentWrite === "conflict") {
        throw new Error("membership_migration_assignment_conflict");
      }
      if (assignmentWrite === "reuse") {
        alreadyCurrent += 1;
        continue;
      }

      const timestamp = now();
      await ctx.db.insert("familyProfileAssignments", {
        familyId: family._id,
        profileId: args.profileId,
        memberId: member._id,
        status: "active",
        replayPermitted: plan.replayPermitted,
        schemaVersion: FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
        source: "legacy_backfill",
        createdByUserId: family.ownerUserId,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      insertedAssignments += 1;
    }

    return {
      scannedGrants: page.page.length,
      ignoredGrants,
      insertedMembers,
      insertedAssignments,
      alreadyCurrent,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});
