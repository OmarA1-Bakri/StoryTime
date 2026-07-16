import {
  authorizeFamilyCapability,
  FAMILY_TENANT_MIGRATION_VERSION,
  familyMemberPolicyMetadataSchema,
  familyProfileAssignmentMetadataSchema,
  familyTenantMetadataSchema,
} from "@storytime/validators";
import type { FamilyCapability } from "@storytime/validators";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { assert } from "./lib/errors";
import { requireCanonicalOwnerMembership } from "./lib/familyMembership";

type FamilyCapabilityOptions = {
  profileId?: Id<"profiles">;
  recentAuthenticationVerified?: boolean;
  consentVerified?: boolean;
  entitlementVerified?: boolean;
  authenticatedUser?: Doc<"users">;
};

export async function requireAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  assert(identity, "authentication_required", "Adult authentication is required");
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_subject", (q) => q.eq("authSubject", identity.subject))
    .unique();
  assert(
    user &&
      user.status === "active" &&
      user.identityStatus !== "disabled" &&
      user.identityStatus !== "deleted",
    "adult_not_registered",
    "Authenticated adult is not registered",
  );
  return user;
}

export async function requireFamilyCapability(
  ctx: QueryCtx | MutationCtx,
  familyId: Id<"families">,
  capability: FamilyCapability,
  options: FamilyCapabilityOptions = {},
) {
  const user = options.authenticatedUser ?? (await requireAuthenticatedUser(ctx));
  const family = await ctx.db.get(familyId);
  assert(family && family.status === "active", "family_missing", "Active family is missing");
  familyTenantMetadataSchema.parse(family);

  await requireCanonicalOwnerMembership(ctx, family);

  const memberships = await ctx.db
    .query("familyMembers")
    .withIndex("by_family_adult", (q) => q.eq("familyId", familyId).eq("adultUserId", user._id))
    .take(2);
  assert(memberships.length === 1, "membership_missing", "Family membership is missing");
  const storedMembership = memberships[0];
  familyMemberPolicyMetadataSchema.parse(storedMembership);

  let profileAssigned = false;
  let replayPermitted = false;
  if (options.profileId) {
    const assignments = await ctx.db
      .query("familyProfileAssignments")
      .withIndex("by_profile_member", (q) =>
        q.eq("profileId", options.profileId!).eq("memberId", storedMembership._id),
      )
      .take(2);
    assert(
      assignments.length <= 1,
      "profile_assignment_conflict",
      "Profile assignment is not canonical",
    );
    const assignment = assignments[0];
    if (assignment) {
      familyProfileAssignmentMetadataSchema.parse(assignment);
      assert(
        assignment.familyId === familyId &&
          assignment.profileId === options.profileId &&
          assignment.memberId === storedMembership._id,
        "profile_assignment_invalid",
        "Profile assignment is invalid",
      );
      profileAssigned = assignment.status === "active";
      replayPermitted = assignment.replayPermitted;
    }
  }

  const decision = authorizeFamilyCapability({
    role: storedMembership.role,
    status: storedMembership.status,
    capability,
    profileAssigned,
    delegatedInvite: storedMembership.canInviteApprovedAdults,
    replayPermitted,
    recentAuthenticationVerified: options.recentAuthenticationVerified,
    consentVerified: options.consentVerified,
    entitlementVerified: options.entitlementVerified,
  });
  assert(
    decision.allowed,
    decision.allowed ? "capability_denied" : decision.reason,
    "Family capability is denied",
  );

  return { family, member: storedMembership };
}

export async function requireProfileCapability(
  ctx: QueryCtx | MutationCtx,
  profileId: Id<"profiles">,
  capability: FamilyCapability,
  gates: FamilyCapabilityOptions = {},
) {
  const user = await requireAuthenticatedUser(ctx);
  const profile = await ctx.db.get(profileId);
  assert(
    profile &&
      profile.status === "active" &&
      profile.familyId &&
      profile.tenantMigrationVersion === FAMILY_TENANT_MIGRATION_VERSION,
    "profile_unavailable",
    "Profile is unavailable or has not completed tenant migration",
  );
  const authorization = await requireFamilyCapability(ctx, profile.familyId, capability, {
    ...gates,
    consentVerified: gates.consentVerified,
    profileId,
    authenticatedUser: user,
  });
  return { user, profile, ...authorization };
}
