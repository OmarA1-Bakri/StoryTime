# ST-102 Family Membership and RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a versioned, fail-closed family membership and profile-assignment policy whose owner, guardian, and approved-adult capabilities are explicit, server-authorized, migration-safe, and exhaustively tested.

**Architecture:** Keep authorization decisions pure in `@storytime/validators`, persist canonical family membership and profile assignment records in Convex, and centralize runtime enforcement in `convex/guards.ts`. Existing `accessGrants` remain a read-only migration source; public callers never select the acting adult, and later invitation, recent-auth, consent-lifecycle, revocation-cascade, deletion, and repository-wide authorization packages remain separate gates.

**Tech Stack:** TypeScript 5.8, Zod 3, Convex 1.17, Vitest 2, pnpm 9.15.9, Node.js 22.23.1.

## Global Constraints

- Persistent family roles are exactly `owner`, `guardian`, and `approved_adult`; nearby supervision is a session role, not another membership role.
- Every active family has exactly one active owner membership and that membership must match `families.ownerUserId`.
- Owners have family-wide authority; guardians and approved adults require an active assignment for every profile-scoped capability.
- Profile creation is owner-only. Until `ST-103`, the compatibility path may create only family-linked synthetic profiles when `APP_ENV` is explicitly `development` or `test`; unset, invalid, preview, and production environments fail closed.
- A guardian may invite only an `approved_adult` for an assigned profile when `canInviteApprovedAdults` is true; invitation persistence and acceptance remain `ST-104`.
- An approved adult may start, receive, supervise, and participate in calls for an assigned profile and may view replay only when `replayPermitted` is true.
- High-risk capabilities fail closed unless a server-derived recent-auth gate is true; `ST-112` owns the durable recent-auth implementation.
- Chapter and call capabilities accept only an explicitly supplied server-derived consent gate. The ST-102 guard must not infer parental consent from the acting adult's legacy consent record; `ST-106` owns the authoritative guardian-to-child consent lookup.
- Existing active non-owner `accessGrants` migrate only to profile-scoped `approved_adult`; legacy labels never auto-promote to guardian.
- Invited grants are deferred to `ST-104`, revoked grants are ignored, duplicate or inconsistent records are conflicts, and unknown schema/policy/migration versions fail closed.
- `accessGrants` remain available for dual-read comparison and rollback; this package performs no destructive rewrite or deletion.
- No new dependencies.
- Do not claim full `AT-ID-001`, `AT-ID-002`, `AT-ID-004`, `AT-ID-006`, revocation cascade, ownership transfer, family deletion, or real-child readiness from this package.
- Use only synthetic or approved adult-only records until the Phase 9 owner/legal gates close.

---

## File Structure

- `packages/validators/src/access.ts` owns role/capability policy, version constants, authorization decisions, and pure legacy-migration decisions.
- `packages/validators/src/access.test.ts` is the exhaustive policy and migration decision suite.
- `convex/schema.ts` owns the persisted canonical family-member and profile-assignment shapes and indexes.
- `convex/lib/familyMembership.ts` creates and validates the one canonical owner membership without duplicating invariant logic.
- `convex/families.ts` creates a family and delegates owner-membership enforcement to the shared helper.
- `convex/familyMembers.ts` exposes safe membership reads and the bounded internal migration from legacy grants.
- `convex/guards.ts` is the single runtime path for authenticated adult, family membership, owner invariant, active profile tenancy, profile assignment, externally supplied consent/recent-auth/entitlement gates, and replay permission.
- `convex/profileMembers.ts` and `convex/profileInvites.ts` retain compatibility reads while all insecure direct membership writes fail closed.
- `convex/profiles.ts`, `convex/joinInfo.ts`, and `convex/sessionOps.ts` remove caller-selected actor identity from public operations.
- `apps/web/tests/convex-auth-boundary.test.ts` prevents the selected Convex public surfaces from regressing to caller-selected actors, actor-scoped consent inference, inactive tenants, or actor-owned family economics.
- `docs/authorization-policy.md` records the canonical matrix, enforcement order, migration, rollback, and exclusions.
- `docs/family-tenancy.md`, `docs/identity-sync.md`, and `docs/current-state.md` record the package boundary and evidence without overstating completion.

---

### Task 1: Lock the Explicit Capability Matrix

**Files:**

- Modify: `packages/validators/src/access.ts`
- Modify: `packages/validators/src/access.test.ts`

**Interfaces:**

- Consumes: `FamilyRole`, `FamilyCapability`, and `authorizeFamilyCapability(input)`.
- Produces: `FAMILY_CAPABILITY_POLICY`, `FAMILY_CAPABILITIES`, `FAMILY_MEMBER_SCHEMA_VERSION`, `FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION`, and explicit denial reasons used by Convex guards.

- [ ] **Step 1: Replace the self-referential role test with an independent expected matrix**

Add `FamilyCapability` to the type imports and define the expected lists independently of `FAMILY_CAPABILITY_POLICY`:

```ts
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
```

Delete the imports and test coverage for `createAccessGrantSchema` and `revokeAccessGrantSchema`. This package intentionally exposes no direct membership command schema.

- [ ] **Step 2: Add focused gate-order and fail-closed tests**

Add these tests:

```ts
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
```

- [ ] **Step 3: Run the focused test and verify the new contract fails**

Run:

```powershell
$env:PATH = 'C:\Users\albak\AppData\Roaming\fnm\node-versions\v22.23.1\installation;' + $env:PATH
pnpm --filter @storytime/validators exec vitest run src/access.test.ts
```

Expected: FAIL because `approved_adult` is not yet allowed for `chapters:supervise`; imports also fail until the obsolete command schemas are removed from the test and implementation together.

- [ ] **Step 4: Apply the minimal policy change and delete unused direct-write schemas**

In `packages/validators/src/access.ts`, add:

```ts
export const FAMILY_MEMBER_SCHEMA_VERSION = 1 as const;
export const FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION = 1 as const;
```

Add `"profiles:create"` to `familyCapabilitySchema` and define:

```ts
"profiles:create": { roles: ["owner"], profileScoped: false },
```

Change the invitation policy to:

```ts
"invites:create": {
  roles: ["owner", "guardian"],
  profileScoped: true,
  delegatedInviteRequired: true,
  requiresRecentAuthentication: true,
},
```

Set the supervision policy to:

```ts
"chapters:supervise": {
  roles: ["owner", "guardian", "approved_adult"],
  profileScoped: true,
  requiresConsent: true,
},
```

Delete `createAccessGrantSchema` and `revokeAccessGrantSchema`. They imply direct membership mutations that this package deliberately does not expose.

- [ ] **Step 5: Run the focused test and typecheck**

Run:

```powershell
pnpm --filter @storytime/validators exec vitest run src/access.test.ts
pnpm --filter @storytime/validators typecheck
```

Expected: both commands PASS.

- [ ] **Step 6: Commit the policy contract**

```powershell
git add packages/validators/src/access.ts packages/validators/src/access.test.ts
git commit -m "Make family authority explicit and independently testable" -m "The role matrix is now asserted independently from its implementation, approved adults can act as assigned nearby supervisors, and unused direct-write schemas no longer imply an insecure membership path.

Constraint: Persistent roles are owner, guardian, and approved_adult only
Rejected: Derive expected test results from FAMILY_CAPABILITY_POLICY | would make the test tautological
Confidence: high
Scope-risk: narrow
Tested: validators access Vitest suite and validators typecheck
Not-tested: deployed Convex authorization"
```

---

### Task 2: Version Canonical Records and Enforce One Owner

**Files:**

- Modify: `packages/validators/src/access.ts`
- Modify: `packages/validators/src/access.test.ts`
- Modify: `convex/schema.ts`
- Create: `convex/lib/familyMembership.ts`
- Modify: `convex/families.ts`
- Modify: `convex/familyMembers.ts`
- Modify: `convex/guards.ts`

**Interfaces:**

- Consumes: version constants from Task 1 and the existing `familyMembers` and `familyProfileAssignments` indexes.
- Produces:
  - `familyMemberPolicyMetadataSchema`
  - `familyProfileAssignmentMetadataSchema`
  - persisted `schemaVersion: 1` on every family member
  - `ensureCanonicalOwnerMembership(ctx, family, source)`
  - `requireCanonicalOwnerMembership(ctx, family)`
  - `requireFamilyCapability(ctx, familyId, capability, options)` that rejects a missing, duplicate, or mismatched owner membership.

- [ ] **Step 1: Write metadata validation tests**

Add these imports:

```ts
import {
  FAMILY_ACCESS_POLICY_VERSION,
  FAMILY_MEMBER_SCHEMA_VERSION,
  FAMILY_MEMBERSHIP_MIGRATION_VERSION,
  FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
  familyMemberPolicyMetadataSchema,
  familyProfileAssignmentMetadataSchema,
} from "./access";
```

Add:

```ts
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
```

- [ ] **Step 2: Run the test and verify missing exports fail**

Run:

```powershell
pnpm --filter @storytime/validators exec vitest run src/access.test.ts
```

Expected: FAIL with missing exports for the two metadata schemas.

- [ ] **Step 3: Add exact metadata schemas**

Add to `packages/validators/src/access.ts` after the role and status schemas:

```ts
export const familyMemberPolicyMetadataSchema = z.object({
  role: familyRoleSchema,
  status: familyMemberStatusSchema,
  canInviteApprovedAdults: z.boolean(),
  schemaVersion: z.literal(FAMILY_MEMBER_SCHEMA_VERSION),
  policyVersion: z.literal(FAMILY_ACCESS_POLICY_VERSION),
  migrationVersion: z.literal(FAMILY_MEMBERSHIP_MIGRATION_VERSION),
});

export const familyProfileAssignmentMetadataSchema = z.object({
  status: familyMemberStatusSchema,
  replayPermitted: z.boolean(),
  schemaVersion: z.literal(FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION),
});
```

- [ ] **Step 4: Persist the member schema version**

Change `familyMembers` in `convex/schema.ts` to include:

```ts
schemaVersion: v.literal(1),
policyVersion: v.literal(1),
migrationVersion: v.literal(1),
source: v.union(v.literal("created"), v.literal("legacy_backfill")),
```

Keep `familyProfileAssignments.source` limited to `created` and `legacy_backfill`. `ST-104` owns any accepted-invitation source and schema transition.

- [ ] **Step 5: Centralize owner creation and validation**

Create `convex/lib/familyMembership.ts`:

```ts
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
```

Delete the duplicate `ensureOwnerMembership` and `ensureLegacyOwnerMembership` implementations from `convex/families.ts` and `convex/familyMembers.ts`. After creating or selecting a family record, load the exact family document and call `ensureCanonicalOwnerMembership`.

- [ ] **Step 6: Write the exact owner invariant in the guard**

Import `familyTenantMetadataSchema` and `requireCanonicalOwnerMembership`. Immediately after loading and asserting the active family, reject unsupported family metadata:

```ts
familyTenantMetadataSchema.parse(family);
```

Then replace the implicit-owner branch in `requireFamilyCapability` with:

```ts
await requireCanonicalOwnerMembership(ctx, family);

const memberships = await ctx.db
  .query("familyMembers")
  .withIndex("by_family_adult", (q) => q.eq("familyId", familyId).eq("adultUserId", user._id))
  .take(2);
assert(memberships.length === 1, "membership_missing", "Family membership is missing");
const storedMembership = memberships[0];
familyMemberPolicyMetadataSchema.parse(storedMembership);
```

Then use only:

```ts
const role = storedMembership.role;
const status = storedMembership.status;
```

Remove every `isImplicitOwner` and `!storedMembership` fallback. Validate assignments with:

```ts
if (assignment) {
  familyProfileAssignmentMetadataSchema.parse(assignment);
  assert(
    assignment.familyId === familyId &&
      assignment.profileId === requestedProfileId &&
      assignment.memberId === storedMembership._id,
    "profile_assignment_invalid",
    "Profile assignment is invalid",
  );
}
```

- [ ] **Step 7: Use shared version constants on every insert and reuse check**

In `convex/families.ts` and `convex/familyMembers.ts`, import:

```ts
FAMILY_ACCESS_POLICY_VERSION,
FAMILY_MEMBER_SCHEMA_VERSION,
FAMILY_MEMBERSHIP_MIGRATION_VERSION,
FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
```

Every family-member insert must contain:

```ts
schemaVersion: FAMILY_MEMBER_SCHEMA_VERSION,
policyVersion: FAMILY_ACCESS_POLICY_VERSION,
migrationVersion: FAMILY_MEMBERSHIP_MIGRATION_VERSION,
```

Every assignment insert must contain:

```ts
schemaVersion: FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
```

Every reuse check must compare all corresponding versions and the exact role/status/delegation fields.

- [ ] **Step 8: Run focused tests, typecheck, and Convex lint**

Run:

```powershell
pnpm --filter @storytime/validators exec vitest run src/access.test.ts
pnpm --filter @storytime/validators typecheck
pnpm exec eslint convex
```

Expected: all commands PASS. If Convex TypeScript still depends on generated remote types, ESLint remains the local static gate and the codegen attempt is recorded in Task 6.

- [ ] **Step 9: Commit canonical record enforcement**

```powershell
git add packages/validators/src/access.ts packages/validators/src/access.test.ts convex/schema.ts convex/lib/familyMembership.ts convex/families.ts convex/familyMembers.ts convex/guards.ts
git commit -m "Require one versioned owner membership per family" -m "Family authorization now depends on canonical versioned records and rejects missing, duplicate, or mismatched owner authority instead of synthesizing an implicit owner at read time.

Constraint: Every active family must have exactly one active owner matching families.ownerUserId
Rejected: Retain an implicit owner fallback | it hides incomplete migrations and violates fail-closed authorization
Confidence: high
Scope-risk: moderate
Tested: validators metadata tests, validators typecheck, Convex ESLint
Not-tested: deployed Convex indexes and migration concurrency"
```

---

### Task 3: Bind Public Operations to Authenticated Adult and Active Tenant

**Files:**

- Modify: `convex/guards.ts`
- Modify: `convex/families.ts`
- Modify: `convex/profileInvites.ts`
- Modify: `convex/profileMembers.ts`
- Modify: `convex/profiles.ts`
- Modify: `convex/joinInfo.ts`
- Modify: `convex/sessionOps.ts`
- Create: `apps/web/tests/convex-auth-boundary.test.ts`

**Interfaces:**

- Consumes: `requireAuthenticatedUser`, `requireFamilyCapability`, `FAMILY_TENANT_MIGRATION_VERSION`, and externally supplied authorization gates.
- Produces:
  - `requireProfileCapability(ctx, profileId, capability, gates?)`
  - public operations whose acting adult always comes from `ctx.auth.getUserIdentity()`
  - owner-only, family-linked, non-production synthetic profile creation
  - family-owned campaign and entitlement accounting even when a guardian or approved adult starts a chapter.

- [ ] **Step 1: Add a source-boundary regression test**

Create `apps/web/tests/convex-auth-boundary.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the source-boundary test and verify the active-tenant assertions fail**

Run:

```powershell
pnpm --filter @storytime/web exec vitest run tests/convex-auth-boundary.test.ts
```

Expected: FAIL because the current guard reads acting-adult consent, does not require the exact tenant migration version, and accepts archived profiles; profile creation and chapter accounting also lack the family-safe behavior.

- [ ] **Step 3: Require an active current-version profile and keep consent external**

In `convex/guards.ts`, import `FAMILY_TENANT_MIGRATION_VERSION` and delete `hasVerifiedRecordForUser` plus the exported `hasVerifiedRecord` compatibility helper. Replace the profile assertion with:

```ts
assert(
  profile &&
    profile.status === "active" &&
    profile.familyId &&
    profile.tenantMigrationVersion === FAMILY_TENANT_MIGRATION_VERSION,
  "profile_unavailable",
  "Profile is unavailable or has not completed tenant migration",
);
```

Pass authorization gates through without querying legacy consent:

```ts
const authorization = await requireFamilyCapability(ctx, profile.familyId, capability, {
  ...gates,
  consentVerified: gates.consentVerified,
  profileId,
  authenticatedUser: user,
});
```

This intentionally leaves chapter/call capabilities denied with `consent_required` until an authoritative server path supplies the gate in `ST-106`.

- [ ] **Step 4: Make compatibility profile creation family-linked, owner-only, and production-closed**

In `convex/profiles.ts`, import `FAMILY_TENANT_MIGRATION_VERSION`, `resolveFamilyTenantConfig`, `MutationCtx`, and `requireFamilyCapability`, then factor both legacy exports through:

```ts
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
```

Do not create another legacy owner `accessGrant`; canonical owner authority comes from `familyMembers`.

- [ ] **Step 5: Preserve family ownership and minimize family reads**

In `convex/sessionOps.ts`, retain the authenticated actor as `startedByUserId`, but use the family owner for the legacy economic owner fields:

```ts
const { user, family } = await requireProfileCapability(ctx, args.profileId, "chapters:start");
const entitlement = await ctx.db
  .query("entitlements")
  .withIndex("by_user", (q) => q.eq("userId", family.ownerUserId))
  .unique();

const campaignId = await ctx.db.insert("campaigns", {
  ownerUserId: family.ownerUserId,
  profileId: args.profileId,
  title: args.campaignTitle,
  status: "active",
  createdAt: now(),
  updatedAt: now(),
});
```

Keep:

```ts
startedByUserId: user._id,
```

In `convex/families.ts`, make `getMine` return a bounded member-safe projection:

```ts
return {
  familyId: family._id,
  status: family.status,
};
```

Owner-only `listMine` may retain its current internal owner setup data until the onboarding package replaces it.

- [ ] **Step 6: Keep public actor arguments absent and insecure invitation writes closed**

Ensure these exact public signatures remain:

```ts
// convex/profiles.ts
args: {
  displayName: v.string(),
  ageBand: v.union(v.literal("6-8"), v.literal("9-10"), v.literal("11-12")),
}

// convex/joinInfo.ts
args: { sessionId: v.id("sessions") }

// convex/sessionOps.ts
args: { profileId: v.id("profiles"), campaignTitle: v.string() }

// convex/profileInvites.ts
args: {
  profileId: v.id("profiles"),
  invitedUserId: v.id("users"),
  role: v.literal("approved_adult"),
}
```

`invitedUserId` is the target, never the actor. `createInvite` and `acceptInvite` must authenticate and then throw:

```ts
throw new Error("invitation_lifecycle_not_implemented");
```

No public add/remove/role-change membership mutation is introduced.

- [ ] **Step 7: Run the source test and relevant static gates**

Run:

```powershell
pnpm --filter @storytime/web exec vitest run tests/convex-auth-boundary.test.ts
pnpm --filter @storytime/web typecheck
pnpm exec eslint convex
```

Expected: all commands PASS.

- [ ] **Step 8: Commit the authenticated boundary**

```powershell
git add convex/guards.ts convex/families.ts convex/profileInvites.ts convex/profileMembers.ts convex/profiles.ts convex/joinInfo.ts convex/sessionOps.ts apps/web/tests/convex-auth-boundary.test.ts
git commit -m "Authorize family operations from trusted adult identity" -m "Selected public Convex surfaces derive the acting adult from verified auth, require active current-version profile tenancy, keep parental consent as an external fail-closed gate, preserve family economic ownership, and leave insecure invitation mutations disabled.

Constraint: Callers may select a target resource but never the acting adult
Rejected: Infer guardian-to-child consent from the acting adult's legacy record | the current model cannot prove authority, scope, expiry, or provider validity
Confidence: high
Scope-risk: moderate
Directive: ST-108 must extend this actor-boundary audit across every resource family
Tested: web Convex actor-boundary Vitest, web typecheck, Convex ESLint
Not-tested: live Clerk-to-Convex request execution or authoritative ST-106 consent"
```

---

### Task 4: Make Legacy Grant Migration Conservative and Idempotent

**Files:**

- Modify: `packages/validators/src/access.ts`
- Modify: `packages/validators/src/access.test.ts`
- Modify: `convex/familyMembers.ts`

**Interfaces:**

- Consumes: `planLegacyMembershipMigration(input)` and canonical record version constants.
- Produces:
  - `decideLegacyMemberWrite(current)`
  - `decideLegacyAssignmentWrite(current)`
  - cursor-bounded `familyMembers.backfillProfileGrants` with content-free success counts and transaction-aborting conflict behavior.

- [ ] **Step 1: Expand legacy role, status, identity, and tenancy tests**

Add:

```ts
it.each(["owner", "co_parent", "grandparent", "guardian"] as const)(
  "ignores revoked legacy %s grants",
  (legacyRole) => {
    expect(
      planLegacyMembershipMigration({
        ...safeBase,
        legacyRole,
        legacyStatus: "revoked",
        isFamilyOwner: legacyRole === "owner",
      }),
    ).toEqual({ action: "ignore", reason: "revoked" });
  },
);

it.each(["missing", "disabled", "deleted"] as const)("rejects a %s adult", (adultStatus) => {
  expect(
    planLegacyMembershipMigration({
      ...safeBase,
      legacyRole: "guardian",
      adultStatus,
      isFamilyOwner: false,
    }),
  ).toEqual({ action: "conflict", reason: "adult_inactive" });
});

it("rejects a profile whose owner does not match the family owner", () => {
  expect(
    planLegacyMembershipMigration({
      ...safeBase,
      legacyRole: "guardian",
      profileOwnerMatchesFamilyOwner: false,
      isFamilyOwner: false,
    }),
  ).toEqual({ action: "conflict", reason: "profile_owner_mismatch" });
});

it.each(["co_parent", "grandparent", "guardian"] as const)(
  "does not turn a family owner carrying legacy %s into a non-owner member",
  (legacyRole) => {
    expect(
      planLegacyMembershipMigration({
        ...safeBase,
        legacyRole,
        isFamilyOwner: true,
      }),
    ).toEqual({ action: "conflict", reason: "legacy_owner_mismatch" });
  },
);
```

- [ ] **Step 2: Add pure canonical reuse-decision tests**

Add:

```ts
describe("legacy canonical write decisions", () => {
  const member = {
    role: "approved_adult" as const,
    status: "active" as const,
    canInviteApprovedAdults: false,
    schemaVersion: FAMILY_MEMBER_SCHEMA_VERSION,
    policyVersion: FAMILY_ACCESS_POLICY_VERSION,
    migrationVersion: FAMILY_MEMBERSHIP_MIGRATION_VERSION,
  };
  const assignment = {
    status: "active" as const,
    replayPermitted: false,
    schemaVersion: FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION,
  };

  it("creates missing records and reuses exact current records", () => {
    expect(decideLegacyMemberWrite(undefined)).toBe("create");
    expect(decideLegacyMemberWrite(member)).toBe("reuse");
    expect(decideLegacyAssignmentWrite(undefined)).toBe("create");
    expect(decideLegacyAssignmentWrite(assignment)).toBe("reuse");
  });

  it("fails closed for conflicting or future-version records", () => {
    expect(decideLegacyMemberWrite({ ...member, role: "guardian" })).toBe("conflict");
    expect(decideLegacyMemberWrite({ ...member, schemaVersion: 2 })).toBe("conflict");
    expect(decideLegacyAssignmentWrite({ ...assignment, status: "revoked" })).toBe("conflict");
    expect(decideLegacyAssignmentWrite({ ...assignment, schemaVersion: 2 })).toBe("conflict");
  });

  it("does not downgrade an existing explicit replay permission", () => {
    expect(decideLegacyAssignmentWrite({ ...assignment, replayPermitted: true })).toBe("reuse");
  });
});
```

- [ ] **Step 3: Run the focused test and verify missing decisions fail**

Run:

```powershell
pnpm --filter @storytime/validators exec vitest run src/access.test.ts
```

Expected: FAIL because `decideLegacyMemberWrite` and `decideLegacyAssignmentWrite` do not exist.

- [ ] **Step 4: Implement the pure decisions**

Add to `packages/validators/src/access.ts`:

```ts
type LegacyMemberCurrent = {
  role: FamilyRole;
  status: FamilyMemberStatus;
  canInviteApprovedAdults: boolean;
  schemaVersion: number;
  policyVersion: number;
  migrationVersion: number;
};

type LegacyAssignmentCurrent = {
  status: FamilyMemberStatus;
  replayPermitted: boolean;
  schemaVersion: number;
};

export function decideLegacyMemberWrite(
  current: LegacyMemberCurrent | undefined,
): "create" | "reuse" | "conflict" {
  if (!current) return "create";
  const parsed = familyMemberPolicyMetadataSchema.safeParse(current);
  return parsed.success &&
    parsed.data.role === "approved_adult" &&
    parsed.data.status === "active" &&
    !parsed.data.canInviteApprovedAdults
    ? "reuse"
    : "conflict";
}

export function decideLegacyAssignmentWrite(
  current: LegacyAssignmentCurrent | undefined,
): "create" | "reuse" | "conflict" {
  if (!current) return "create";
  const parsed = familyProfileAssignmentMetadataSchema.safeParse(current);
  return parsed.success && parsed.data.status === "active" ? "reuse" : "conflict";
}
```

- [ ] **Step 5: Use the decisions in the internal migration**

In `convex/familyMembers.ts`, replace inline canonical-member and assignment version checks with:

```ts
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
```

For an existing assignment, first validate `assignment.familyId`, `assignment.profileId`, and `assignment.memberId` against the requested family/profile/member. Then apply:

```ts
const assignmentWrite = decideLegacyAssignmentWrite(assignment);
if (assignmentWrite === "conflict") {
  throw new Error("membership_migration_assignment_conflict");
}
if (assignmentWrite === "reuse") {
  alreadyCurrent += 1;
  continue;
}
```

Before any writes for a page, convert duplicate grants, invited grants, inactive/missing adults, owner mismatches, unsupported versions, and canonical record conflicts into exact content-free errors:

```ts
if (duplicates.length !== 1) {
  throw new Error("membership_migration_duplicate_grant");
}
if (plan.action === "conflict") {
  throw new Error(`membership_migration_${plan.reason}`);
}
```

Keep batch size in the inclusive range `1..100`, paginate by `accessGrants.by_profile`, return only successful counts/cursor state, and never mutate or delete `accessGrants`. A conflict aborts the Convex transaction, so the caller cannot commit partial writes or advance the cursor past unresolved authority.

- [ ] **Step 6: Run the migration decision suite and static gates**

Run:

```powershell
pnpm --filter @storytime/validators exec vitest run src/access.test.ts
pnpm --filter @storytime/validators typecheck
pnpm exec eslint convex
```

Expected: all commands PASS.

- [ ] **Step 7: Commit the conservative migration**

```powershell
git add packages/validators/src/access.ts packages/validators/src/access.test.ts convex/familyMembers.ts
git commit -m "Cap legacy grants at profile-scoped approved-adult access" -m "The bounded migration now has pure, exhaustively tested reuse decisions, preserves explicit replay permission, ignores revoked grants, and aborts on deferred, duplicate, inactive, conflicting, or future-version authority without rewriting the legacy source.

Constraint: Legacy role labels cannot establish guardian authority
Rejected: Map co_parent or guardian labels directly to guardian | legacy labels lack canonical authority evidence
Confidence: high
Scope-risk: moderate
Directive: Keep accessGrants available until deployed dual-read parity and rollback evidence exist
Tested: validators migration suite, validators typecheck, Convex ESLint
Not-tested: linked Convex backfill, backup restore, index behavior, or concurrent retries"
```

---

### Task 5: Document the Authorization Boundary and Rollback

**Files:**

- Create: `docs/authorization-policy.md`
- Modify: `docs/family-tenancy.md`
- Modify: `docs/identity-sync.md`

**Interfaces:**

- Consumes: the policy and migration behavior completed in Tasks 1–4.
- Produces: the reviewer/operator contract for what ST-102 proves, how migration is run, how rollback works, and what remains open.

- [ ] **Step 1: Create the canonical authorization document**

Create `docs/authorization-policy.md` with these sections and exact policy facts:

```markdown
# Family authorization policy

`ST-102` centralizes versioned family membership and profile-scoped authorization. It does not
complete invitations, recent-auth persistence, consent lifecycle, revocation cascades, ownership
transfer, deletion, or repository-wide resource authorization.

## Roles and scope

| Capability group                                                    | Owner                                                                                                                                                 | Guardian                                              | Approved adult                                  |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| Family view                                                         | Family-wide                                                                                                                                           | Family-wide                                           | Family membership only                          |
| Profile creation                                                    | Synthetic compatibility path only when `APP_ENV` is explicitly `development` or `test`; unset, invalid, preview, and production denied pending ST-103 | Denied                                                | Denied                                          |
| Profile view                                                        | All profiles                                                                                                                                          | Assigned profiles                                     | Assigned profiles                               |
| Profile management and consent                                      | All profiles                                                                                                                                          | Assigned profiles                                     | Denied                                          |
| Member administration                                               | Manage/list                                                                                                                                           | Denied                                                | Denied                                          |
| Invite approved adults                                              | Any family profile                                                                                                                                    | Assigned target profile only with explicit delegation | Denied                                          |
| Start, receive, supervise, and join calls                           | All profiles with verified consent                                                                                                                    | Assigned profiles with verified consent               | Assigned profiles with verified consent         |
| Vault                                                               | All profiles                                                                                                                                          | Assigned profiles                                     | Denied                                          |
| Replay                                                              | All profiles                                                                                                                                          | Assigned profiles                                     | Assigned profiles only when replay is permitted |
| Profile/chapter deletion request                                    | All profiles after recent auth                                                                                                                        | Assigned profiles after recent auth                   | Denied                                          |
| Export, download, family deletion, subscription, ownership transfer | Owner only with the applicable recent-auth and entitlement gates                                                                                      | Denied                                                | Denied                                          |

Nearby supervision is a session role. It does not create another persistent family role.

## Enforcement order

The server resolves the verified Clerk subject to one active internal adult, loads an active family,
proves exactly one active owner membership matches `families.ownerUserId`, loads the acting adult's
canonical current-version membership, loads an active assignment for non-owner profile-scoped
operations, and then evaluates delegation, replay, recent-auth, consent, and entitlement gates.
Missing, duplicate, inactive, mismatched, or future-version authority fails closed.

ST-102 does not infer parental consent from the acting adult's legacy consent record. Chapter and
call capabilities remain denied unless a later authoritative server path supplies the verified
guardian-to-child consent gate.

## Additive legacy migration

`familyMembers.backfillProfileGrants` is internal-only and cursor-bounded to 1–100 grants per batch.
It creates the canonical owner only from `families.ownerUserId`. An active non-owner legacy grant
can create or reuse one non-delegating `approved_adult` member plus one active profile assignment.
It never promotes `co_parent`, `grandparent`, or `guardian` to canonical guardian.

Invited grants are deferred, revoked grants are ignored, and an existing explicit replay permission
is never downgraded. Duplicate grants, inactive adults, owner mismatches, and inconsistent or
future-version canonical records abort the transaction with content-free errors; the cursor cannot
advance past unresolved authority. Successful batches return content-free counts and a continuation
cursor.

Before a linked deployment run: verify a backup and restore path, inventory only synthetic or
approved adult-only data, generate Convex types, run every cursor batch, compare canonical reads
with legacy `accessGrants`, and repeat completed batches to prove idempotency.

## Rollback

Stop the internal migration and route readers back to the retained legacy fields only after a
reviewed rollback decision. Do not delete canonical records, remove indexes, or rewrite
`accessGrants`. Unknown-version records remain denied until code and schema support them explicitly.

## Explicit exclusions

- `ST-103`: production consent-first provisional slot and named child-profile creation.
- `ST-104`: hashed, expiring, single-use invitation lifecycle.
- `ST-106`: durable versioned consent grant lifecycle.
- `ST-108`: repository-wide resource authorization and cross-family negative matrix.
- `ST-112`: durable recent local authentication.
- `ST-109`, `ST-213`, and `ST-515`: audit and revocation cascade effects.
- `ST-600`: ownership/deletion/erasure behavior.
- `DEC-P08`: adult eligibility, guardian authority, approved-adult limits, and custody/dispute escalation.
- Phase 9: real-child household evidence and owner/legal launch approval.

Until those packages and external gates close, ST-102 remains an in-review authorization
foundation and must be exercised only with synthetic or approved adult-only data.
```

- [ ] **Step 2: Update the tenancy and identity boundary statements**

In `docs/family-tenancy.md`, replace the statement that membership is deferred with:

```markdown
`ST-102` adds versioned `familyMembers` and `familyProfileAssignments`. Every new or replayed family
creation ensures one owner membership, while authorization rejects a missing, duplicate, or
mismatched owner instead of synthesizing authority. The retained legacy profile fields remain an
additive rollback bridge.
```

Update the exclusions to link `authorization-policy.md` and state that invitations, consent-first profiles, cross-resource authorization, recent auth, transfer, and erasure remain later packages.

In `docs/identity-sync.md`, replace the stale actor-ID paragraph with:

```markdown
ST-102 removes caller-selected acting-adult IDs from the selected family, profile, join, and
session-start operations and centralizes their membership checks. `ST-108` must still inventory
every remaining Convex, web, mobile, worker, media, and deletion surface before the broader
`AT-ID-001` control can close.
```

- [ ] **Step 3: Format and validate documentation**

Run:

```powershell
pnpm exec prettier --write docs/authorization-policy.md docs/family-tenancy.md docs/identity-sync.md
pnpm exec prettier --check docs/authorization-policy.md docs/family-tenancy.md docs/identity-sync.md
git diff --check
```

Expected: Prettier check PASS and `git diff --check` produces no output.

- [ ] **Step 4: Commit the operational contract**

```powershell
git add docs/authorization-policy.md docs/family-tenancy.md docs/identity-sync.md
git commit -m "Make the ST-102 authorization boundary operable" -m "The documentation now records the exact role matrix, enforcement order, conservative legacy bridge, rollback procedure, and later-package exclusions needed to review or operate the family RBAC foundation truthfully.

Constraint: ST-102 cannot claim invitation, recent-auth, consent-lifecycle, revocation, deletion, or repo-wide authorization completion
Confidence: high
Scope-risk: narrow
Tested: Prettier documentation check and git diff check
Not-tested: deployed migration and rollback rehearsal"
```

---

### Task 6: Verify, Review, Publish, and Record Evidence

**Files:**

- Modify: `docs/current-state.md`
- Create in ignored scratch state: `.superpowers/sdd/progress.md`

**Interfaces:**

- Consumes: all Task 1–5 commits.
- Produces: focused and full local test evidence, a codegen blocker record if the deployment remains unlinked, an independent review result, a pushed stacked branch, a draft GitHub PR targeting `codex/ST-101-family-tenancy`, and an updated package-boundary snapshot.

- [ ] **Step 1: Run focused verification from the pinned Node environment**

Run:

```powershell
$env:PATH = 'C:\Users\albak\AppData\Roaming\fnm\node-versions\v22.23.1\installation;' + $env:PATH
pnpm --filter @storytime/validators exec vitest run src/access.test.ts
pnpm --filter @storytime/web exec vitest run tests/convex-auth-boundary.test.ts
pnpm exec eslint convex
pnpm --filter @storytime/validators typecheck
pnpm --filter @storytime/web typecheck
```

Expected: all commands PASS.

- [ ] **Step 2: Attempt Convex code generation and preserve the exact result**

Run:

```powershell
pnpm convex:codegen
```

Expected in the current unlinked environment: FAIL with guidance to configure or run Convex development because `CONVEX_DEPLOYMENT` is unset. If it succeeds, preserve the generated-type success output instead. Do not invent deployment evidence.

- [ ] **Step 3: Run the complete non-device merge gate**

Run:

```powershell
pnpm check
git diff --check
```

Expected: `pnpm check` PASS and `git diff --check` emits no output. The physical-device gate remains a separate Phase 0/8 external evidence requirement.

- [ ] **Step 4: Run per-task and whole-branch Superpowers reviews**

For each task commit range, generate a review package with the exact base commit recorded before that task:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' '/c/Users/albak/.codex/plugins/cache/claude-plugins-official/superpowers/6.1.1/skills/subagent-driven-development/scripts/review-package' $baseCommit $headCommit
```

Here `$baseCommit` and `$headCommit` are the exact hashes recorded immediately before and after the task. Dispatch a fresh task reviewer against the task brief, implementer report, and generated package. Fix every Critical or Important finding and repeat review until both spec compliance and code quality are approved.

Then generate the full branch package:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' '/c/Users/albak/.codex/plugins/cache/claude-plugins-official/superpowers/6.1.1/skills/subagent-driven-development/scripts/review-package' bcf5b7c HEAD
```

Dispatch the Superpowers code reviewer. Fix all release-blocking findings in one fix wave, re-run covering tests, and repeat review until clean.

- [ ] **Step 5: Commit any review fixes with evidence**

If review changes files, use:

```powershell
git add packages/validators/src/access.ts packages/validators/src/access.test.ts convex apps/web/tests/convex-auth-boundary.test.ts docs
git commit -m "Close the ST-102 independent review findings" -m "The family authorization package now incorporates the complete reviewer finding set and preserves its tested fail-closed boundaries.

Confidence: high
Scope-risk: moderate
Tested: covering focused suites, Convex ESLint, package typechecks, and full pnpm check
Not-tested: linked Convex deployment and physical-device flow"
```

If review is clean without changes, do not create an empty commit.

- [ ] **Step 6: Push and create the stacked draft pull request**

Run:

```powershell
git push -u origin codex/ST-102-family-rbac
gh pr create --draft --base codex/ST-101-family-tenancy --head codex/ST-102-family-rbac --title "ST-102: centralize family membership and RBAC" --body-file docs/superpowers/plans/2026-07-16-st-102-family-rbac.md
```

If the GitHub connector is available, use its equivalent create-pull-request operation with the same base, head, title, and plan link. Record the exact returned PR number and URL.

- [ ] **Step 7: Update the current-state evidence with returned facts**

In `docs/current-state.md`:

1. Change `Newest implementation branch` to `codex/ST-102-family-rbac`, the actual seven-character head commit, and the returned stacked draft PR number.
2. Add a branch-state paragraph stating that ST-102 centralizes versioned owner/guardian/approved-adult policy, exact owner membership, profile assignments, conservative legacy migration, active profile tenancy, externally supplied consent fail-closure, and selected actor-boundary tests.
3. Record the exact focused/full test results.
4. Record the exact Convex codegen result.
5. State explicitly that deployment/index/migration/concurrency evidence, recent auth, invitation lifecycle, consent lifecycle, revocation cascade, repository-wide authorization, and real-child readiness remain open.

Format, commit, and push:

```powershell
pnpm exec prettier --write docs/current-state.md
pnpm exec prettier --check docs/current-state.md
git diff --check
git add docs/current-state.md
git commit -m "Keep ST-102 delivery evidence truthful" -m "The current-state snapshot now identifies the actual stacked branch, pull request, local verification, and unresolved deployment and downstream authorization gates.

Constraint: Stacked branches do not receive the main-base GitHub Actions workflow
Confidence: high
Scope-risk: narrow
Tested: Prettier documentation check and git diff check
Not-tested: linked Convex deployment, migration rehearsal, and physical devices"
git push
```

- [ ] **Step 8: Update the package tracker without claiming Done**

Create or update the canonical Linear issue titled `[ST-102] Membership and RBAC policy`, link the branch, commits, draft PR, policy document, focused tests, full `pnpm check`, review outcome, and codegen result, and keep it `In Review` while deployed Convex evidence is absent.

- [ ] **Step 9: Mark the durable Superpowers ledger**

Append:

```markdown
Task 1: complete (explicit capability matrix; review clean)
Task 2: complete (versioned canonical owner/member records; review clean)
Task 3: complete (authenticated actor, active tenant, and external-consent boundary; review clean)
Task 4: complete (conservative legacy migration; review clean)
Task 5: complete (authorization and rollback documentation; review clean)
Task 6: complete (full local verification, stacked PR, and truthful evidence snapshot)
```

Do not mark the overall Phase 8 design complete. Continue to the next ready canonical package while earlier external blockers remain recorded.

---

## Plan Self-Review

- **Spec coverage:** Tasks 1–4 cover the exact roles, matrix, assignment, delegation, replay, recent-auth fail-closed input, external consent boundary, active profile tenancy, family economic ownership, owner invariant, legacy migration, unknown-version denial, actor identity, and rollback requirements. Task 5 covers operational and scope truth. Task 6 covers verification, review, publication, and evidence.
- **Intentional exclusions:** Invitation persistence, durable recent auth, consent lifecycle, revocation cascade, audit, deletion, repository-wide authorization, deployed account evidence, physical devices, and real-child household evidence remain assigned to their canonical packages.
- **Placeholder scan:** The implementation steps contain concrete paths, signatures, code, commands, expected outcomes, and commit messages. The only runtime-derived facts are the actual review commit hashes and pull-request result, which must be copied exactly from tool output rather than guessed.
- **Type consistency:** `FAMILY_MEMBER_SCHEMA_VERSION`, `FAMILY_PROFILE_ASSIGNMENT_SCHEMA_VERSION`, `familyMemberPolicyMetadataSchema`, `familyProfileAssignmentMetadataSchema`, `decideLegacyMemberWrite`, and `decideLegacyAssignmentWrite` are introduced before their Convex consumers. Role/status/capability literals match the existing validator and Convex schemas.
