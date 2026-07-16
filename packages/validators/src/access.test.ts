import { describe, expect, it } from "vitest";
import {
  FAMILY_ACCESS_POLICY_VERSION,
  FAMILY_CAPABILITIES,
  FAMILY_MEMBER_SCHEMA_VERSION,
  FAMILY_MEMBERSHIP_MIGRATION_VERSION,
  FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
  authorizeFamilyCapability,
  familyMemberPolicyMetadataSchema,
  familyProfileAssignmentMetadataSchema,
} from "./access";
import type { FamilyCapability, FamilyRole } from "./access";

const roles = ["owner", "guardian", "approved_adult"] as const satisfies readonly FamilyRole[];

const expectedCapabilities: Record<FamilyRole, readonly FamilyCapability[]> = {
  owner: [
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
  ],
  guardian: [
    "family:view",
    "profiles:view",
    "profiles:manage",
    "invites:create",
    "consent:manage",
    "chapters:start",
    "chapters:receive",
    "chapters:supervise",
    "calls:participate",
    "vault:view",
    "replays:view",
    "chapters:delete_request",
    "profiles:delete_request",
  ],
  approved_adult: [
    "family:view",
    "profiles:view",
    "chapters:start",
    "chapters:receive",
    "chapters:supervise",
    "calls:participate",
    "replays:view",
  ],
};

describe("family capability policy", () => {
  it.each(roles)("matches the independent capability matrix for %s", (role) => {
    for (const capability of FAMILY_CAPABILITIES) {
      const decision = authorizeFamilyCapability({
        role,
        status: "active",
        capability,
        profileAssigned: true,
        delegatedInvite: true,
        replayPermitted: true,
        recentAuthenticationVerified: true,
        consentVerified: true,
        entitlementVerified: true,
      });
      expect(decision.allowed, `${role}:${capability}`).toBe(
        expectedCapabilities[role].includes(capability),
      );
    }
  });

  it("allows an assigned approved adult to supervise a consented chapter", () => {
    expect(
      authorizeFamilyCapability({
        role: "approved_adult",
        status: "active",
        capability: "chapters:supervise",
        profileAssigned: true,
        consentVerified: true,
      }),
    ).toEqual({ allowed: true });
  });

  it("requires profile assignment before replay permission", () => {
    expect(
      authorizeFamilyCapability({
        role: "approved_adult",
        status: "active",
        capability: "replays:view",
        replayPermitted: true,
      }),
    ).toEqual({ allowed: false, reason: "profile_assignment_required" });
  });

  it("requires guardian invite delegation before recent authentication", () => {
    expect(
      authorizeFamilyCapability({
        role: "guardian",
        status: "active",
        capability: "invites:create",
        profileAssigned: true,
        recentAuthenticationVerified: false,
      }),
    ).toEqual({ allowed: false, reason: "invite_delegation_required" });
  });

  it("requires an assigned profile before guardian invite delegation", () => {
    expect(
      authorizeFamilyCapability({
        role: "guardian",
        status: "active",
        capability: "invites:create",
        delegatedInvite: true,
        recentAuthenticationVerified: true,
      }),
    ).toEqual({ allowed: false, reason: "profile_assignment_required" });
  });

  it("keeps profile creation owner-only", () => {
    expect(
      authorizeFamilyCapability({
        role: "owner",
        status: "active",
        capability: "profiles:create",
      }),
    ).toEqual({ allowed: true });
    expect(
      authorizeFamilyCapability({
        role: "guardian",
        status: "active",
        capability: "profiles:create",
        profileAssigned: true,
      }),
    ).toEqual({ allowed: false, reason: "capability_denied" });
  });

  it("does not let approved adults inherit guardian administration", () => {
    for (const capability of [
      "profiles:manage",
      "members:list",
      "members:manage",
      "invites:create",
      "consent:manage",
      "vault:view",
      "chapters:delete_request",
      "profiles:delete_request",
    ] as const) {
      expect(
        authorizeFamilyCapability({
          role: "approved_adult",
          status: "active",
          capability,
          profileAssigned: true,
          delegatedInvite: true,
          recentAuthenticationVerified: true,
        }),
      ).toEqual({ allowed: false, reason: "capability_denied" });
    }
  });
});

describe("canonical membership metadata", () => {
  it("accepts only the current family-member versions", () => {
    const current = {
      role: "guardian",
      status: "active",
      canInviteApprovedAdults: true,
      schemaVersion: FAMILY_MEMBER_SCHEMA_VERSION,
      policyVersion: FAMILY_ACCESS_POLICY_VERSION,
      migrationVersion: FAMILY_MEMBERSHIP_MIGRATION_VERSION,
    };
    expect(familyMemberPolicyMetadataSchema.parse(current)).toEqual(current);
    expect(() =>
      familyMemberPolicyMetadataSchema.parse({ ...current, schemaVersion: 2 }),
    ).toThrow();
  });

  it("accepts only the current profile-assignment version", () => {
    const current = {
      status: "active",
      replayPermitted: false,
      schemaVersion: FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
    };
    expect(familyProfileAssignmentMetadataSchema.parse(current)).toEqual(current);
    expect(() =>
      familyProfileAssignmentMetadataSchema.parse({ ...current, schemaVersion: 2 }),
    ).toThrow();
  });
});
