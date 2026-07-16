import {
  FAMILY_ACCESS_POLICY_VERSION,
  FAMILY_MEMBER_SCHEMA_VERSION,
  FAMILY_MEMBERSHIP_MIGRATION_VERSION,
  familyMemberPolicyMetadataSchema,
} from "@storytime/validators";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { now } from "./time";

type OwnerMembershipSource = "created" | "legacy_backfill";

function isActiveAdult(user: Doc<"users"> | null) {
  return (
    user?.status === "active" &&
    user.identityStatus !== "disabled" &&
    user.identityStatus !== "deleted"
  );
}

export async function requireCanonicalOwnerMembership(
  ctx: QueryCtx | MutationCtx,
  family: Doc<"families">,
) {
  const owners = await ctx.db
    .query("familyMembers")
    .withIndex("by_family_role_status", (q) =>
      q.eq("familyId", family._id).eq("role", "owner").eq("status", "active"),
    )
    .take(2);
  if (
    owners.length !== 1 ||
    owners[0].adultUserId !== family.ownerUserId ||
    !familyMemberPolicyMetadataSchema.safeParse(owners[0]).success
  ) {
    throw new Error("family_owner_invariant_broken");
  }
  return owners[0];
}

export async function ensureCanonicalOwnerMembership(
  ctx: MutationCtx,
  family: Doc<"families">,
  source: OwnerMembershipSource,
): Promise<Id<"familyMembers">> {
  const owner = await ctx.db.get(family.ownerUserId);
  if (!isActiveAdult(owner)) throw new Error("family_owner_inactive");

  const memberships = await ctx.db
    .query("familyMembers")
    .withIndex("by_family_adult", (q) =>
      q.eq("familyId", family._id).eq("adultUserId", family.ownerUserId),
    )
    .take(2);
  if (memberships.length > 1) throw new Error("family_owner_membership_conflict");
  if (memberships.length === 1) {
    const membership = memberships[0];
    const parsed = familyMemberPolicyMetadataSchema.safeParse(membership);
    if (
      !parsed.success ||
      membership.role !== "owner" ||
      membership.status !== "active" ||
      !membership.canInviteApprovedAdults
    ) {
      throw new Error("family_owner_membership_conflict");
    }
    await requireCanonicalOwnerMembership(ctx, family);
    return membership._id;
  }

  const existingOwners = await ctx.db
    .query("familyMembers")
    .withIndex("by_family_role_status", (q) =>
      q.eq("familyId", family._id).eq("role", "owner").eq("status", "active"),
    )
    .take(1);
  if (existingOwners.length !== 0) throw new Error("family_owner_membership_conflict");

  const timestamp = now();
  const memberId = await ctx.db.insert("familyMembers", {
    familyId: family._id,
    adultUserId: family.ownerUserId,
    role: "owner",
    status: "active",
    canInviteApprovedAdults: true,
    schemaVersion: FAMILY_MEMBER_SCHEMA_VERSION,
    policyVersion: FAMILY_ACCESS_POLICY_VERSION,
    migrationVersion: FAMILY_MEMBERSHIP_MIGRATION_VERSION,
    source,
    createdByUserId: family.ownerUserId,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await requireCanonicalOwnerMembership(ctx, family);
  return memberId;
}
