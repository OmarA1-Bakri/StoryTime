# Adult identity synchronization

`ST-100` binds a verified Clerk adult subject to one internal Convex user. It does not treat an
email address, client argument, route parameter, or Clerk webhook payload as identity proof by itself.

## Two complementary paths

1. `users.ensureCurrentAdult` reads Convex's verified auth context. It resolves only
   `identity.subject`, creates the internal adult idempotently, updates bounded display fields, and
   refuses to reactivate a disabled or deleted binding.
2. `POST /api/webhooks/clerk` uses Clerk's official `verifyWebhook` helper before accepting
   `user.created`, `user.updated`, or `user.deleted`. It normalizes only the provider subject,
   primary email, display name, account status, event ID, and event timestamp. The web service then
   forwards that bounded record to a private Convex HTTP action over a separate service-to-service
   secret; only an internal mutation may change lifecycle state.

The route clones the signed request before verification, then parses that exact signed envelope for
the provider timestamp that Clerk's helper does not return. Its signed `instance_id` must exactly
match `CLERK_INSTANCE_ID`, preventing a valid development event from mutating preview or production
state.

Both paths are necessary because Clerk documents webhook synchronization as eventually consistent.
The verified token path supports synchronous onboarding, while the webhook path applies later
updates, suspension, and deletion.

## Replay and ordering

- `identitySyncEvents` records one content-free result per Clerk event ID.
- A replay returns the previously bound internal user without another mutation.
- Events older than the binding's last provider timestamp are recorded as stale and ignored.
- Deletion wins at an equal timestamp and is terminal; a later create/update cannot silently
  reactivate the tombstone.
- At an equal provider timestamp, the more restrictive state wins (`deleted` > `disabled` >
  `active`) regardless of delivery order.
- Provider identity status is distinct from StoryTime's internal user status, so a benign Clerk
  update cannot undo an internal suspension.
- Deletion removes the copied email and display name while retaining the internal record needed to
  preserve references and deny late events. Full account/family data erasure remains the separate
  ST-600 deletion workflow.

## Required private configuration

```dotenv
CLERK_JWT_ISSUER_DOMAIN=...
CLERK_INSTANCE_ID=...
CLERK_WEBHOOK_SIGNING_SECRET=...
CLERK_SYNC_SECRET=...
CONVEX_SITE_URL=...
```

`CLERK_WEBHOOK_SIGNING_SECRET` verifies Clerk's request. `CLERK_SYNC_SECRET` is a distinct,
cryptographically random secret of at least 32 characters shared only by the web and Convex server
environments; it must never be exposed in a client bundle or used as the Clerk signing secret.
Production readiness fails while either secret or the Convex site URL is absent or weak. Hosted
forwarding accepts only a clean HTTPS `*.convex.site` origin; loopback HTTP is an explicit
non-production exception.

The intended Clerk instance must subscribe only the identity endpoint to `user.created`,
`user.updated`, and `user.deleted`. No real account event has been exercised yet because Clerk and
Convex are not linked in this environment. Account linkage, endpoint configuration, generated Convex
types, and a synthetic create/update/disable/delete deployment test remain required before ST-100 is
complete.

The deleted internal tombstone preserves existing references and denies activity, but Phase 1 family
ownership transfer/deletion policy and the ST-600 erasure workflow must resolve its owned resources.
This package is not complete until that deployed fail-closed behavior is proven.

ST-100 also does not claim repository-wide removal of caller-selected actor IDs. Existing grant,
profile-member, and profile-invite entry points still accept actor identifiers and must be migrated
to the authenticated internal user in ST-102/ST-108 before the broader `AT-ID-001` control can be
closed.

References: [Clerk webhook overview](https://clerk.com/docs/guides/development/webhooks/overview),
[Clerk data synchronization](https://clerk.com/docs/guides/development/webhooks/syncing), and
[`verifyWebhook`](https://clerk.com/docs/reference/backend/verify-webhook).
