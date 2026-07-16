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

`familyMembers.backfillProfileGrants` is internal-only and cursor-bounded to 1-100 grants per batch.
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
- `DEC-P08`: adult eligibility, guardian authority, approved-adult limits, and custody/dispute
  escalation.
- Phase 9: real-child household evidence and owner/legal launch approval.

Until those packages and external gates close, ST-102 remains an in-review authorization foundation
and must be exercised only with synthetic or approved adult-only data.
