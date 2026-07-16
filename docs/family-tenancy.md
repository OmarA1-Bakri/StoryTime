# Family tenancy foundation

`ST-101` introduces the additive family tenant primitive needed before membership/RBAC and
cross-resource authorization. It does not claim that the legacy profile-grant model is already a
complete tenant boundary.

## Trusted creation boundary

`families.createMine` derives `ownerUserId` only from the verified adult auth context. The caller
supplies a bounded opaque `creationRequestId` for retry idempotency, never an owner, region, status,
or configuration version. An identical owner/request retry returns the existing record; a retry
against different trusted server configuration fails closed.

The record stores:

- typed `active`, `deleting`, or `deleted` status;
- server-selected `regionKey`;
- exact configuration and schema versions;
- creation request and `created`/`legacy_backfill` origin;
- creation/update/deletion timestamps.

Owner/status, owner/request, status, and region/config/status indexes avoid full-table discovery.
Owner-only get/list functions derive the current adult from verified auth and return no cross-owner
record. Family membership and delegated roles are deliberately deferred to ST-102.

`STORYTIME_DATA_REGION` is server-only. Local synthetic development defaults to `local`; preview
and production family creation refuse missing, malformed, or `local` regions. The production
capability registry and prebuild environment guard enforce the same boundary. This records the
configured location key but does not prove account region selection; DEC-P01/ST-015/ST-810 remain
open.

## Additive legacy profile migration

The first bridge adds optional `familyId` and `tenantMigrationVersion` fields plus a
`by_family_status` index to `profiles`. Existing `ownerUserId` and `by_owner` remain intact for
dual-read comparison and rollback.

`families.backfillOwnerProfiles` is internal-only and:

1. accepts one internal owner ID plus a cursor and batch size capped at 100;
2. refuses missing, disabled, or deleted owners;
3. creates one `legacy_backfill` family only when no family record exists;
4. attaches to exactly one active family and refuses deleting/deleted or ambiguous history;
5. patches only unassigned/same-family profiles and refuses cross-tenant reassignment;
6. returns a continuation cursor and content-free counts for repeatable batches.

Before any linked deployment runs the migration, take and verify a backup, inventory only synthetic
or approved non-production records, generate Convex types, dry-run the planner, execute every cursor
batch, and compare legacy `by_owner` results with `by_family_status`. Re-running completed batches
must make no duplicate family or tenant reassignment.

Rollback is non-destructive: stop the internal backfill, keep readers on `by_owner`, and ignore the
optional bridge fields. Do not remove the legacy fields/index, delete created family records, or run
a production backfill until backup/restore and parity evidence exists.

## Explicit exclusions and incomplete evidence

- `accessGrants` remains legacy input; `familyMembers` and centralized RBAC are ST-102.
- Consent-first child records are ST-103; invitations are ST-104.
- Propagating `familyId` across campaigns, sessions, media, jobs, playback, storage, and
  entitlements belongs to their owning packages and ST-108 authorization verification.
- Ownership transfer, owner deletion, family deletion, and erasure remain ST-102/ST-600 work.
- Full `AT-ID-001` and `AT-ID-002` remain open.
- The current environment has no linked Convex deployment, generated types, Convex integration
  harness, migration run, concurrency proof, index proof, or deployed parity report. ST-101 must
  remain In Review until those gaps are resolved.
