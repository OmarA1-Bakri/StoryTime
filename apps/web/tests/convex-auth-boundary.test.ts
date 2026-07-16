import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(process.cwd(), "../..");
const publicActorBoundaries = [
  "convex/profileInvites.ts",
  "convex/profileMembers.ts",
  "convex/profiles.ts",
  "convex/joinInfo.ts",
  "convex/sessionOps.ts",
];

function source(relativePath: string) {
  return readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

describe("Convex authenticated-actor boundary", () => {
  it.each(publicActorBoundaries)("%s does not accept a caller-selected acting user", (file) => {
    expect(source(file)).not.toMatch(
      /\b(requesterUserId|requestedByUserId|ownerUserId|userId)\s*:\s*v\.id\("users"\)/,
    );
  });

  it("does not retain the legacy caller-selected grant guard", () => {
    expect(source("convex/guards.ts")).not.toContain("requireGrant");
    expect(source("convex/guards.ts")).not.toContain("isImplicitOwner");
  });

  it("does not infer parental consent from the acting adult", () => {
    const guards = source("convex/guards.ts");
    expect(guards).not.toContain('.query("consentRecords")');
    expect(guards).not.toContain("hasVerifiedRecordForUser");
    expect(guards).toContain("consentVerified: gates.consentVerified");
  });

  it("requires an active, current-version profile tenant", () => {
    const guards = source("convex/guards.ts");
    expect(guards).toContain("familyTenantMetadataSchema.parse(family)");
    expect(guards).toContain('profile.status === "active"');
    expect(guards).toContain("profile.tenantMigrationVersion === FAMILY_TENANT_MIGRATION_VERSION");
  });

  it("keeps compatibility profile creation family-linked and production-closed", () => {
    const profiles = source("convex/profiles.ts");
    expect(profiles).toMatch(/requireFamilyCapability\(\s*ctx,\s*family\._id,\s*"profiles:create"/);
    expect(profiles).toContain("familyId: family._id");
    expect(profiles).toContain("tenantMigrationVersion: FAMILY_TENANT_MIGRATION_VERSION");
    expect(profiles).toContain('process.env.APP_ENV !== "development"');
    expect(profiles).toContain('process.env.APP_ENV !== "test"');
    expect(profiles).toContain("resolveFamilyTenantConfig");
    expect(profiles).toContain("consent_first_profile_creation_not_implemented");
  });

  it("charges chapter ownership to the family owner, not the acting adult", () => {
    const sessionOps = source("convex/sessionOps.ts");
    expect(sessionOps).toContain("ownerUserId: family.ownerUserId");
    expect(sessionOps).toContain('q.eq("userId", family.ownerUserId)');
    expect(sessionOps).toContain("startedByUserId: user._id");
  });

  it("returns a bounded family projection to non-owner members", () => {
    const families = source("convex/families.ts");
    expect(families).toContain("familyId: family._id");
    expect(families).toContain("status: family.status");
    expect(families).not.toMatch(/getMine[\s\S]*?return family;/);
  });
});
