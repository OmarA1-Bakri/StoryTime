import { z } from "zod";

export const FAMILY_ACCESS_POLICY_VERSION = 1 as const;
export const FAMILY_MEMBER_SCHEMA_VERSION = 1 as const;
export const FAMILY_MEMBERSHIP_MIGRATION_VERSION = 1 as const;
export const FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION = 1 as const;

export const familyRoleSchema = z.enum(["owner", "guardian", "approved_adult"]);
export type FamilyRole = z.infer<typeof familyRoleSchema>;

export const familyMemberStatusSchema = z.enum(["active", "revoked"]);
export type FamilyMemberStatus = z.infer<typeof familyMemberStatusSchema>;

export const accessRoleSchema = familyRoleSchema;
export const accessStatusSchema = familyMemberStatusSchema;

export const familyCapabilitySchema = z.enum([
  "family:view",
  "profiles:create",
  "profiles:view",
  "profiles:manage",
  "members:list",
  "members:manage",
  "invites:create",
  "consent:manage",
  "chapters:start",
  "chapters:receive",
  "chapters:supervise",
  "calls:participate",
  "vault:view",
  "replays:view",
  "rights:export",
  "media:download",
  "chapters:delete_request",
  "profiles:delete_request",
  "family:delete",
  "subscription:manage",
  "ownership:transfer",
]);
export type FamilyCapability = z.infer<typeof familyCapabilitySchema>;

export const FAMILY_CAPABILITIES = familyCapabilitySchema.options;

export type FamilyCapabilityPolicy = {
  roles: readonly FamilyRole[];
  profileScoped: boolean;
  delegatedInviteRequired?: boolean;
  replayPermissionRequired?: boolean;
  requiresRecentAuthentication?: boolean;
  requiresConsent?: boolean;
  requiresEntitlement?: boolean;
};

export const FAMILY_CAPABILITY_POLICY = {
  "family:view": {
    roles: ["owner", "guardian", "approved_adult"],
    profileScoped: false,
  },
  "profiles:create": {
    roles: ["owner"],
    profileScoped: false,
  },
  "profiles:view": {
    roles: ["owner", "guardian", "approved_adult"],
    profileScoped: true,
  },
  "profiles:manage": {
    roles: ["owner", "guardian"],
    profileScoped: true,
  },
  "members:list": {
    roles: ["owner"],
    profileScoped: false,
  },
  "members:manage": {
    roles: ["owner"],
    profileScoped: false,
    requiresRecentAuthentication: true,
  },
  "invites:create": {
    roles: ["owner", "guardian"],
    profileScoped: true,
    delegatedInviteRequired: true,
    requiresRecentAuthentication: true,
  },
  "consent:manage": {
    roles: ["owner", "guardian"],
    profileScoped: true,
    requiresRecentAuthentication: true,
  },
  "chapters:start": {
    roles: ["owner", "guardian", "approved_adult"],
    profileScoped: true,
    requiresConsent: true,
  },
  "chapters:receive": {
    roles: ["owner", "guardian", "approved_adult"],
    profileScoped: true,
    requiresConsent: true,
  },
  "chapters:supervise": {
    roles: ["owner", "guardian", "approved_adult"],
    profileScoped: true,
    requiresConsent: true,
  },
  "calls:participate": {
    roles: ["owner", "guardian", "approved_adult"],
    profileScoped: true,
    requiresConsent: true,
  },
  "vault:view": {
    roles: ["owner", "guardian"],
    profileScoped: true,
  },
  "replays:view": {
    roles: ["owner", "guardian", "approved_adult"],
    profileScoped: true,
    replayPermissionRequired: true,
  },
  "rights:export": {
    roles: ["owner"],
    profileScoped: false,
    requiresRecentAuthentication: true,
  },
  "media:download": {
    roles: ["owner"],
    profileScoped: true,
    requiresRecentAuthentication: true,
    requiresEntitlement: true,
  },
  "chapters:delete_request": {
    roles: ["owner", "guardian"],
    profileScoped: true,
    requiresRecentAuthentication: true,
  },
  "profiles:delete_request": {
    roles: ["owner", "guardian"],
    profileScoped: true,
    requiresRecentAuthentication: true,
  },
  "family:delete": {
    roles: ["owner"],
    profileScoped: false,
    requiresRecentAuthentication: true,
  },
  "subscription:manage": {
    roles: ["owner"],
    profileScoped: false,
    requiresRecentAuthentication: true,
  },
  "ownership:transfer": {
    roles: ["owner"],
    profileScoped: false,
    requiresRecentAuthentication: true,
  },
} as const satisfies Record<FamilyCapability, FamilyCapabilityPolicy>;

export type FamilyCapabilityDenialReason =
  | "membership_inactive"
  | "capability_denied"
  | "profile_assignment_required"
  | "invite_delegation_required"
  | "replay_permission_required"
  | "recent_authentication_required"
  | "consent_required"
  | "entitlement_required";

export type FamilyCapabilityDecision =
  { allowed: true } | { allowed: false; reason: FamilyCapabilityDenialReason };

export type FamilyCapabilityAuthorizationInput = {
  role: FamilyRole;
  status: FamilyMemberStatus;
  capability: FamilyCapability;
  profileAssigned?: boolean;
  delegatedInvite?: boolean;
  replayPermitted?: boolean;
  recentAuthenticationVerified?: boolean;
  consentVerified?: boolean;
  entitlementVerified?: boolean;
};

export function authorizeFamilyCapability(
  input: FamilyCapabilityAuthorizationInput,
): FamilyCapabilityDecision {
  if (input.status !== "active") {
    return { allowed: false, reason: "membership_inactive" };
  }

  const policy = FAMILY_CAPABILITY_POLICY[input.capability];
  if (!policy.roles.some((role) => role === input.role)) {
    return { allowed: false, reason: "capability_denied" };
  }

  if (policy.profileScoped && input.role !== "owner" && input.profileAssigned !== true) {
    return { allowed: false, reason: "profile_assignment_required" };
  }

  if (
    "delegatedInviteRequired" in policy &&
    policy.delegatedInviteRequired &&
    input.role === "guardian" &&
    input.delegatedInvite !== true
  ) {
    return { allowed: false, reason: "invite_delegation_required" };
  }

  if (
    "replayPermissionRequired" in policy &&
    policy.replayPermissionRequired &&
    input.role === "approved_adult" &&
    input.replayPermitted !== true
  ) {
    return { allowed: false, reason: "replay_permission_required" };
  }

  if (
    "requiresRecentAuthentication" in policy &&
    policy.requiresRecentAuthentication &&
    input.recentAuthenticationVerified !== true
  ) {
    return { allowed: false, reason: "recent_authentication_required" };
  }

  if ("requiresConsent" in policy && policy.requiresConsent && input.consentVerified !== true) {
    return { allowed: false, reason: "consent_required" };
  }

  if (
    "requiresEntitlement" in policy &&
    policy.requiresEntitlement &&
    input.entitlementVerified !== true
  ) {
    return { allowed: false, reason: "entitlement_required" };
  }

  return { allowed: true };
}
