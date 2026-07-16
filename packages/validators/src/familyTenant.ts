import { z } from "zod";

export const FAMILY_CONFIG_VERSION = 1 as const;
export const FAMILY_SCHEMA_VERSION = 1 as const;
export const FAMILY_TENANT_MIGRATION_VERSION = 1 as const;

export const familyCreationRequestSchema = z.object({
  creationRequestId: z
    .string()
    .trim()
    .min(16)
    .max(128)
    .regex(/^[A-Za-z0-9_-]+$/),
});

export const familyDataRegionSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid family data region");

export const familyTenantMetadataSchema = z.object({
  status: z.enum(["active", "deleting", "deleted"]),
  regionKey: familyDataRegionSchema,
  configVersion: z.literal(FAMILY_CONFIG_VERSION),
  schemaVersion: z.literal(FAMILY_SCHEMA_VERSION),
});

export function resolveFamilyTenantConfig(input: {
  appEnvironment?: string;
  dataRegion?: string;
  deploymentConfigured?: boolean;
}) {
  const environment = z
    .enum(["development", "test", "preview", "production"])
    .parse(input.appEnvironment ?? (input.deploymentConfigured ? "" : "development"));
  const hosted = environment === "preview" || environment === "production";
  const regionKey = familyDataRegionSchema.parse(input.dataRegion ?? (hosted ? "" : "local"));
  if (hosted && regionKey === "local") {
    throw new Error("Hosted family data region cannot be local");
  }
  return {
    regionKey,
    configVersion: FAMILY_CONFIG_VERSION,
    schemaVersion: FAMILY_SCHEMA_VERSION,
  };
}

export function decideFamilyMigrationVersion(
  currentVersion: number | undefined,
): "write" | "already_current" {
  if (currentVersion === undefined) return "write";
  if (currentVersion === FAMILY_TENANT_MIGRATION_VERSION) return "already_current";
  throw new Error("family_migration_version_conflict");
}

export function decideFamilyResourceLink(
  currentFamilyId: string | undefined,
  expectedFamilyId: string,
): "link" | "already_linked" {
  if (currentFamilyId === undefined) return "link";
  if (currentFamilyId === expectedFamilyId) return "already_linked";
  throw new Error("family_tenant_conflict");
}

export function planLegacyFamilyMigration(input: {
  ownerStatus: "active" | "disabled" | "deleted" | "missing";
  candidateFamilies: Array<{ id: string; status: "active" | "deleting" | "deleted" }>;
}):
  | { action: "create" }
  | { action: "attach"; familyId: string }
  | {
      action: "conflict";
      reason: "owner_inactive" | "family_inactive" | "ambiguous_family";
    } {
  if (input.ownerStatus !== "active") return { action: "conflict", reason: "owner_inactive" };
  if (input.candidateFamilies.length === 0) return { action: "create" };
  if (input.candidateFamilies.length === 1) {
    const [candidate] = input.candidateFamilies;
    return candidate.status === "active"
      ? { action: "attach", familyId: candidate.id }
      : { action: "conflict", reason: "family_inactive" };
  }
  return { action: "conflict", reason: "ambiguous_family" };
}
