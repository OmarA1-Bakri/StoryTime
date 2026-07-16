import { describe, expect, it } from "vitest";
import {
  decideFamilyMigrationVersion,
  decideFamilyResourceLink,
  familyCreationRequestSchema,
  familyTenantMetadataSchema,
  planLegacyFamilyMigration,
  resolveFamilyTenantConfig,
} from "./familyTenant";

describe("family tenant configuration and migration", () => {
  it("validates bounded request IDs and exact supported versions", () => {
    expect(familyCreationRequestSchema.parse({ creationRequestId: "family-create-0001" })).toEqual({
      creationRequestId: "family-create-0001",
    });
    expect(() => familyCreationRequestSchema.parse({ creationRequestId: "short" })).toThrow();
    expect(() =>
      familyTenantMetadataSchema.parse({
        status: "active",
        regionKey: "eu-west-1",
        configVersion: 2,
        schemaVersion: 1,
      }),
    ).toThrow();
  });

  it("uses a deterministic local region only for local development", () => {
    expect(resolveFamilyTenantConfig({})).toEqual({
      regionKey: "local",
      configVersion: 1,
      schemaVersion: 1,
    });
    expect(
      resolveFamilyTenantConfig({ appEnvironment: "preview", dataRegion: "eu-west-1" }),
    ).toMatchObject({ regionKey: "eu-west-1" });
  });

  it("fails closed when a hosted environment has no real region", () => {
    expect(() => resolveFamilyTenantConfig({ appEnvironment: "production" })).toThrow();
    expect(() =>
      resolveFamilyTenantConfig({ appEnvironment: "preview", dataRegion: "local" }),
    ).toThrow();
    expect(() =>
      resolveFamilyTenantConfig({ appEnvironment: "production", dataRegion: "EU West" }),
    ).toThrow();
    expect(() =>
      resolveFamilyTenantConfig({ appEnvironment: "staging", dataRegion: "eu-west-1" }),
    ).toThrow();
    expect(() =>
      resolveFamilyTenantConfig({ deploymentConfigured: true, dataRegion: "eu-west-1" }),
    ).toThrow();
  });

  it("plans zero, one, ambiguous, and inactive-owner migrations without guessing", () => {
    expect(planLegacyFamilyMigration({ ownerStatus: "active", candidateFamilies: [] })).toEqual({
      action: "create",
    });
    expect(
      planLegacyFamilyMigration({
        ownerStatus: "active",
        candidateFamilies: [{ id: "family_a", status: "active" }],
      }),
    ).toEqual({ action: "attach", familyId: "family_a" });
    expect(
      planLegacyFamilyMigration({
        ownerStatus: "active",
        candidateFamilies: [
          { id: "family_a", status: "active" },
          { id: "family_b", status: "deleting" },
        ],
      }),
    ).toEqual({ action: "conflict", reason: "ambiguous_family" });
    expect(planLegacyFamilyMigration({ ownerStatus: "disabled", candidateFamilies: [] })).toEqual({
      action: "conflict",
      reason: "owner_inactive",
    });
    expect(
      planLegacyFamilyMigration({
        ownerStatus: "active",
        candidateFamilies: [{ id: "family_deleted", status: "deleted" }],
      }),
    ).toEqual({ action: "conflict", reason: "family_inactive" });
  });

  it("links only unassigned profiles and refuses cross-tenant reassignment", () => {
    expect(decideFamilyResourceLink(undefined, "family_a")).toBe("link");
    expect(decideFamilyResourceLink("family_a", "family_a")).toBe("already_linked");
    expect(() => decideFamilyResourceLink("family_b", "family_a")).toThrow(
      "family_tenant_conflict",
    );
  });

  it("never downgrades an unknown or future tenant migration version", () => {
    expect(decideFamilyMigrationVersion(undefined)).toBe("write");
    expect(decideFamilyMigrationVersion(1)).toBe("already_current");
    expect(() => decideFamilyMigrationVersion(2)).toThrow("family_migration_version_conflict");
  });
});
