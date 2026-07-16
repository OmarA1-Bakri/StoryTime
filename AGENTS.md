# AGENTS.md — StoryTime Autonomous Delivery Contract

This file governs coding agents working in this repository. It applies recursively unless a more specific `AGENTS.md` exists in a subdirectory.

## 1. Mission

Take StoryTime from its current scaffold to the complete, deployed, verified product defined by the canonical documents. Optimize for one safe, replayable family story chapter across web, iOS, and Android.

Never confuse code volume, mocked screens, or a green narrow unit test with product completion.

## 2. Read before changing code

Read in this order:

1. [PRD.md](PRD.md)
2. [docs/security-privacy.md](docs/security-privacy.md)
3. [docs/state-machines.md](docs/state-machines.md)
4. [docs/architecture.md](docs/architecture.md)
5. [docs/acceptance-test-plan.md](docs/acceptance-test-plan.md)
6. [docs/screen-state-inventory.md](docs/screen-state-inventory.md)
7. [docs/traceability.md](docs/traceability.md)
8. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
9. [docs/current-state.md](docs/current-state.md)
10. [docs/decision-log.md](docs/decision-log.md)

Then inspect the relevant code, tests, current branch/PR, and Linear issue. Historical PDFs, prototypes, old placeholders, comments, and Linear prose are secondary when they conflict with the documents above.

## 3. Canonical invariants

Do not weaken these without an explicit owner-approved decision-log entry:

- Product spelling is `StoryTime`.
- A child has no independent account.
- Every child session is adult-mediated and trusted-family only.
- Authentication is not consent.
- The adult lobby is unrecorded.
- No child media is published, persisted, transcribed, or sent to AI before server-derived consent, recording acceptance, and handoff authority.
- Both adults see truthful recording state.
- The call may be recorded for replay, but only a submitted baton interval is sent to STT/LLM.
- Baton, chapter, recording, job, entitlement, and deletion state are server-authoritative, versioned, and idempotent.
- All AI/provider output is untrusted until schema and safety checks pass.
- Production never silently falls back to mock identity, consent, AI, recording, storage, safety, or deletion.
- Production never sends real child data to OpenAI without approved ZDR, to STT without approved minimum-retention controls, or to image generation without verified no-store/private output.
- The nearby supervisor and child use distinct sequential media identities. No child-mode participant or grant exists before committed handoff; lobby media is never chapter egress.
- Family media is private, served through a per-request authorization gateway without exposing origin URLs, never used for model training, and deletable end-to-end.
- Raw tracks plus an ordered ledger build the replay asynchronously; live RoomComposite is not the default.
- Logs/analytics contain no raw child/family content, prompt, transcript, token, secret, or signed URL.

## 4. Current repository warning

At the 2026-07-16 baseline:

- `main` is at `6b57b46057b10f90a8ca40d06c3bed28c8c3ae2b`;
- `origin/agent/live-foundation` is three commits ahead and has no open PR;
- that branch contains important Clerk, LiveKit, provider, and lockfile work;
- `main` has stale docs and incomplete/placeholder mobile gates in its historical state;
- Linear has stale issue statuses.

Never delete, overwrite, or ignore `agent/live-foundation` without reviewing and preserving its work. Re-read [docs/current-state.md](docs/current-state.md) because this snapshot will change.

## 5. Startup protocol

Before each work package:

```bash
git status --short --branch
git remote -v
git fetch --all --prune
git log --oneline --decorate -20
node --version
corepack pnpm --version
```

Then:

1. confirm the worktree is clean or identify user-owned changes;
2. identify the highest-priority ready work package in `IMPLEMENTATION_PLAN.md`;
3. read its Linear issue and dependent merged PRs;
4. inspect existing implementation/tests before proposing new structure;
5. state the expected behaviour and proof;
6. create a focused branch from the current integration/default branch.

Do not reset, discard, rewrite, or absorb unrelated user changes.

## 6. Branch and commit protocol

- Branch: `codex/ST-###-short-slug` or the established repository convention.
- Keep one logical work package per branch.
- Use small, meaningful commits with imperative messages.
- Rebase/merge current target before final verification as repository policy permits.
- Never force-push shared branches unless explicitly authorized.
- Never push secrets, generated credentials, raw media, local databases, build output, or environment files.
- Open a PR only after local relevant gates pass.
- PR body includes scope, acceptance evidence, migrations, risk/privacy notes, screenshots where useful, and rollback.

Repository publish/merge actions must be within the active user's requested scope. Preparing local changes is not permission to merge or deploy an unrelated change.

## 7. Work-package loop

For each package:

1. **Orient:** inspect code, state, issue, dependencies, and current provider contracts.
2. **Design:** choose the smallest vertical implementation that meets the canonical contract.
3. **Test first where risk is high:** authorization, consent, state transition, idempotency, deletion, private media gateway, and safety require negative tests before/with implementation.
4. **Implement:** include loading, empty, denied, retry, degraded, cancellation, recovery, and terminal states.
5. **Verify locally:** run focused tests, then all affected workspace gates, then root gates.
6. **Review against the story:** trace the behaviour from user action through server state, provider/media, UI, audit, and failure.
7. **Update canonical state:** decision log for material decisions; current state/plan status when merged facts change.
8. **Publish in scope:** push/PR and update Linear with concise evidence.
9. **Observe CI:** fix failures; do not declare success while required checks are pending/failing.
10. **Clean up:** temporary worktrees, scratch media, logs, containers, test accounts/data, branches when safe.

Continue to the next ready package when the active instruction authorizes autonomous full-build execution. Stop only for a genuine blocker defined below.

## 8. Genuine blockers

Ask the owner when work requires:

- credentials/account access that is not connected or available;
- purchase, contract acceptance, payment, app-store submission, public launch, production data migration, or destructive external action not already authorized;
- final legal/jurisdiction/VPC/retention/pricing decision;
- a direct contradiction between canonical invariants that changes product scope;
- destructive handling of user-owned uncommitted work;
- a security/privacy issue that makes continued real-data operation unsafe.

Do not stop for:

- routine naming, file placement, component/API shape, retry count, test design, or implementation detail already bounded by canonical docs;
- a provider being temporarily unavailable when fixtures/adapters/independent work remain;
- an unrelated optional integration;
- an existing bug that can be fixed safely within the work package;
- missing polish before the vertical acceptance scenario.

When blocked, finish all independent work, preserve a reproducible state, document the exact missing authority/input, and identify the next unblocked package.

## 9. Toolchain

- Node: `22.x`
- Package manager: Corepack-managed `pnpm@9.15.9`
- Monorepo: Turborepo
- Language: strict TypeScript
- Web: Next.js App Router / React
- Mobile: Expo Router / React Native development builds
- Backend: Convex
- Realtime: LiveKit
- Worker: Node 22 + pinned FFmpeg in a container
- Local storage: MinIO; production default: private R2
- Unit/integration: Vitest and Convex test harness
- Web E2E: Playwright
- Mobile E2E: Maestro

Use repository scripts rather than globally drifting tool versions. Install with a frozen lockfile after Phase 0.

## 10. Required commands

Run the smallest useful subset during iteration, then the full affected gates:

```bash
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test:unit
corepack pnpm test:integration
corepack pnpm test:e2e:web
corepack pnpm test:e2e:mobile
corepack pnpm test:ai
corepack pnpm test:media
corepack pnpm build
corepack pnpm check
```

If a command does not yet exist, implementing a truthful command is part of the relevant Phase 0/package work. Never replace a missing gate with `echo success`.

## 11. TypeScript and domain standards

- Strict TypeScript; do not introduce `any` at trust/domain boundaries.
- Validate external/client/provider input with shared schemas.
- Use discriminated unions for critical state; no arbitrary `status: string`.
- Exhaustively switch on state and error codes.
- Keep IDs opaque; no names/emails in room, object, event, or log identifiers.
- Use UTC epoch/ISO timestamps as specified; recording-relative time is a separate field.
- All external effects have idempotency keys and normalized errors.
- All retryable jobs have attempt, not-before, lease, heartbeat, and terminal/dead-letter semantics.
- Keep provider SDK imports inside adapters.
- Do not expose internal stack/provider errors to clients.
- Do not hide failed work behind optimistic “ready” UI.

## 12. Convex rules

- Resolve the current adult from trusted auth context.
- Authorize before fetching/mutating protected data where possible.
- Index protected queries by family/resource/actor; avoid full scans.
- Use atomic compare-and-set semantics for versioned transitions.
- Allocate chapter event sequence server-side.
- Store media metadata only, not large blobs.
- Verify webhook signatures before domain mutation.
- Migration scripts are versioned, testable, reversible or forward-repairable.
- No production data migration without backup/rollback evidence and explicit scope.

## 13. Web rules

- Public pages and authenticated app are distinct route concerns.
- Protected BFF routes authenticate, validate, authorize, rate-limit, and return stable codes.
- Apply secure cookie/session, origin/CSRF, CORS, CSP, frame, MIME, and referrer controls appropriate to the route.
- Meet WCAG 2.2 AA for adult surfaces.
- Keyboard, visible focus, reduced motion, 200% zoom, loading/error/empty/retry are mandatory.
- Never ship server/provider secrets in `NEXT_PUBLIC_*` variables or bundles.
- Do not treat repository/demo content as production legal copy.

## 14. Mobile rules

- Expo Go compatibility is not required; use development builds/prebuild.
- Store sensitive tokens in platform secure storage.
- Request camera/mic/notification/biometric permissions in adult context with purpose.
- Validate deep-link environment, recipient, expiry, and session.
- Push lock-screen payloads are minimal and avoid child/story names by default.
- Child and adult route groups are guarded at client and server.
- Test physical iOS and Android for media, push, background, interruption, and reconnect.
- Use platform-appropriate native modules only when the measured spike requires them.

## 15. AI and media rules

- Test network adapters with synthetic fixtures and network disabled by default.
- Record provider/model/prompt/policy/schema versions.
- Send only bounded submitted-turn audio/context.
- Validate and safety-check before publication.
- Use approved fallback rather than raw error/repeated unsafe generation.
- Record usage/cost for successes, failures, and retries.
- Raw tracks and private objects remain outside git/test reports.
- Composition inputs are deterministic manifests with checksums.
- Verify output with ffprobe/decode/sync before `READY`.
- Worker scratch is isolated, bounded, and removed on every path.

## 16. Testing requirements

Follow [docs/acceptance-test-plan.md](docs/acceptance-test-plan.md).

Critical modules require:

- positive and negative authorization;
- every valid/invalid state transition;
- duplicate, stale, concurrent, and out-of-order commands;
- provider timeout/malformed/replay cases;
- revocation during active use;
- crash/restart/retry;
- content/log redaction;
- deletion precedence;
- synthetic end-to-end proof.

Use real device/provider sandboxes only in dedicated integration environments. CI uses synthetic fixtures and no real child content.

## 17. Secrets and external tools

- Read `.env.example` for names only.
- Never print, commit, paste, summarize, or move secret values.
- Use connected GitHub/Linear/Composio tools for scoped repository/project work.
- Read before writing external systems; verify exact repo/project/issue/branch.
- External writes must be traceable to the active work package.
- Do not create duplicate projects/issues when an existing canonical one exists.
- Do not mark Linear `Done` until the merged code/evidence satisfies acceptance.
- Do not put sensitive data in GitHub, Linear, analytics, or connector payloads.

## 18. Documentation rules

Update:

- `PRD.md` only for owner-approved product changes;
- `docs/decision-log.md` for material architecture/product decisions;
- `docs/current-state.md` for verified merged/deployed facts;
- `IMPLEMENTATION_PLAN.md` for package/phase status and ordering;
- operational runbooks when a new failure/response path is introduced.

Do not duplicate canonical requirements into contradictory local READMEs. Link instead.

## 19. Definition of verified completion

Before claiming the application is complete, prove:

- production web is deployed and healthy;
- signed iOS and Android builds pass the physical-device matrix;
- production cannot use mock capabilities;
- consent/handoff/recording boundary passes negative E2E;
- real submitted-turn STT/story/safety/image works with fallback;
- separate tracks and ledger produce a verified private replay;
- worker/client/provider failure is recoverable;
- Vault/replay/continuation authorization is correct;
- deletion purges every target and reconciles;
- cost ledger reconciles;
- monitoring, alerts, incident/rollback/support are active;
- release evidence and Linear/current-state match the release SHA.

If any item is unproven, report the precise gap. Never use “fully working,” “production ready,” or “complete” as an aspiration.

## 20. Cleanup

At the end of every package:

- remove temporary worktrees/files/media;
- stop/remove local containers created solely for the task;
- delete synthetic external test resources when no longer needed;
- ensure no secret/untracked artifact remains;
- leave the worktree and branch state explicit;
- preserve user-owned changes;
- provide exact verification results and remaining blockers.
