# StoryTime Current State

| Field                         | Value                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Snapshot date                 | 2026-07-16                                                                                         |
| Default branch                | `main`                                                                                             |
| Default-branch commit audited | `6b57b46057b10f90a8ca40d06c3bed28c8c3ae2b`                                                         |
| Newest implementation branch  | `codex/ST-101-family-tenancy` at `058dd9d`; stacked draft PR #4                                    |
| Integration work branch       | `codex/ST-000-canonical-baseline`; pushed in draft PR #2                                           |
| Repository                    | [OmarA1-Bakri/StoryTime](https://github.com/OmarA1-Bakri/StoryTime)                                |
| Linear project                | [StoryTime MVP Delivery](https://linear.app/leadscout/project/storytime-mvp-delivery-11d86b03b18e) |

This is an evidence snapshot, not a completion claim. Update it at phase boundaries and after material branch/deployment changes.

The local documentation pack passed Prettier, `git diff --check`, local Markdown-link resolution, balanced-fence/heading checks, and automated coverage of every PRD requirement and acceptance ID in [traceability.md](traceability.md). These are document checks, not application-build evidence; the audited `main` toolchain caveats below still apply.

## 1. Executive status

StoryTime is a substantial scaffold and interactive demo, not a working MVP.

Present:

- TypeScript/pnpm/Turborepo monorepo;
- Next.js public/demo/adult-shell routes;
- Expo Router mobile route shell;
- Convex schema and early operations;
- worker/provider/job abstractions with unit tests;
- shared types, validators, state-transition scaffolding, and production guard;
- local LiveKit/MinIO/Redis infrastructure configuration;
- GitHub Actions baseline;
- an unmerged branch adding Clerk, LiveKit client/token foundations, and live AI provider adapters.

Not yet proven end-to-end:

- real family/role authorization across all resources;
- production consent provider and recording boundary;
- two-device notification/join/handoff flow;
- complete web and native parity;
- submitted-turn audio capture through live STT/story/image/safety;
- real track egress into private R2;
- durable job claims connected to Convex;
- FFmpeg composition and verified replay;
- complete Vault access, recovery, retention, export, and deletion;
- cross-platform entitlements/billing;
- production deployment, device matrix, privacy-safe observability, app-store builds, or beta evidence.

## 2. Repository inventory

The default branch contains 235 files:

| Area          | Evidence                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile        | 20+ Expo routes for auth, adult, call, story, replay, settings, and diagnostics; most are small mocked shells                           |
| Web           | Public/legal pages, dashboard/library/pipeline/metrics shells, demo APIs, and an interactive mock flow                                  |
| Worker        | Job/provider interfaces and many small unit-tested helpers; mostly mock/local behaviour                                                 |
| Convex        | 20 schema/operation files for users, profiles, access, consent, sessions, choices, turns, baton, quota, metering, safety, and telemetry |
| Shared        | Config, types, validators, prompts, and UI tokens                                                                                       |
| Infra         | Docker Compose, local LiveKit, MinIO notes, environment/setup scripts                                                                   |
| Documentation | Former placeholders now superseded by the canonical v1 pack                                                                             |

The current schema is useful but has critical production gaps:

- no explicit family tenant entity;
- critical `status` fields are generic strings;
- call, chapter, recording, and composition lifecycles are conflated;
- incomplete idempotency/version/event ordering;
- incomplete trusted device/push, per-session recording acceptance, webhook, and deletion-target models;
- several operations accept caller-provided user IDs instead of resolving trusted auth context on `main`.

## 3. Branch state

`origin/agent/live-foundation` is three commits ahead of `main`:

1. `6d0e3f9 Add live media and readiness foundation`
2. `3026911 Integrate Clerk adult identity and consent`
3. `c343667 Add guarded live AI provider pipeline`

It changes 62 files and adds:

- a pnpm lockfile;
- Clerk web/mobile/Convex auth foundations;
- LiveKit token/client components;
- OpenAI story/safety adapters;
- Groq STT adapter;
- fal image adapter;
- capability tests and safer live-mode refusal.

[Draft PR #1](https://github.com/OmarA1-Bakri/StoryTime/pull/1) is open from `agent/live-foundation` to `main`, mergeable, and has a passing GitHub Actions run but no review. That CI uses a non-frozen install, a mutating format command, placeholder mobile/web/worker test gates, and a typecheck-only worker build, so it is not Phase 0 or release evidence. The branch must be reviewed and tested; it must not be blindly discarded or treated as merged.

The `codex/ST-000-canonical-baseline` branch preserves the supplied canonical pack and merges all three `agent/live-foundation` commits. [Draft PR #2](https://github.com/OmarA1-Bakri/StoryTime/pull/2) is pushed for normal review. Its `workspace` GitHub Actions check passed from a clean checkout. No remote branch history was rewritten and the PR remains unmerged.

The `main` branch now requires the `workspace` status check on an up-to-date branch, one approving review, dismissal of stale reviews, and resolved conversations. Force-push and branch deletion are disabled. GitHub secret scanning and push protection are enabled; the alerts API reports zero open alerts. Admin bypass remains available for repository recovery, but the normal merge path is protected.

The live provider adapters now fail closed unless OpenAI ZDR, Groq ZDR, fal private-output, and fal media-retention attestations are exactly `true`. The central production capability registry enforces the same controls, and the web prebuild runs the production environment guard. These flags record verified account state; they do not configure a provider or replace the remaining legal, regional, deletion, synthetic-spike, and processor review. No real child data was sent.

The focused `codex/ST-100-clerk-binding` branch is stacked on the canonical baseline in [draft PR #3](https://github.com/OmarA1-Bakri/StoryTime/pull/3). It adds verified-subject adult bootstrap, signed Clerk lifecycle synchronization, replay and restrictive-ordering policy, a private allowlisted Convex service boundary, and focused regression tests. Its full local `pnpm check` passed, but the package remains in review because Clerk and Convex are not linked, generated Convex types and deployed ingress were not exercised, and broader caller-selected actor IDs remain ST-102/ST-108 work.

The dependent `codex/ST-101-family-tenancy` branch is stacked in [draft PR #4](https://github.com/OmarA1-Bakri/StoryTime/pull/4). It adds the versioned owner-only family tenant primitive, trusted region/config readiness, and an additive cursor-bounded legacy-profile bridge with an explicit rollback path. Its final local `pnpm check` passed after independent review. It remains in review because `CONVEX_DEPLOYMENT` is unset, code generation and deployed migration/index/concurrency evidence are absent, and membership/RBAC, full cross-family negatives, ownership transfer, and erasure remain ST-102/ST-108/ST-600 work.

### Remaining recovery action

The source preservation, integration merge, pinned install, available gates, boundary review, and evidence-bearing draft PR are complete. PR #2 must still receive the independent approval required by branch protection and be merged without bypassing the green `workspace` check.

## 4. Build and tooling state

The local integration branch now has a reproducible non-device merge gate:

- Node `22.23.1`, Corepack, and pnpm `9.15.9` were selected explicitly;
- `pnpm install --frozen-lockfile` passed from the reviewed lockfile;
- `pnpm check` passed formatting, lint across eight packages, typechecking, real unit and integration suites, three Chromium Playwright checks, AI/media suites, Next production compilation, and capped Android/iOS Expo exports;
- Turbo build output contracts distinguish generated web/mobile artifacts from intentional typecheck-only package builds;
- generated `.next`, Expo, Turbo, OMX, codebase-memory, build, coverage, and distribution state is excluded from source formatting/lint discovery;
- the web unit runner excludes Playwright-owned specs, and the root ESLint configuration resolves the Next core-web-vitals rules;
- mobile bundles use two Metro workers and root builds are serialized to stay below the verified Windows memory ceiling.

The physical-device gate is deliberately separate. `pnpm check:device` executes a real Maestro contract and currently fails closed because this machine has no Maestro CLI, booted device, or installed native app. `pnpm check:release` combines the merge gate and that device gate. CI runs `pnpm check`; it does not claim physical-device coverage.

This is Phase 0 local engineering evidence, not proof of a working chapter or release. Existing web/worker tests still exercise demo, policy, provider-fixture, and media-plan slices rather than the complete production vertical.

The repository is linked to Vercel project `storytime` under `omar-proj-canonical`, with `apps/web` as the project root and Node 22. The inherited project commands incorrectly used npm and caused prior deployments to fail. The project now uses the pinned pnpm workspace install and filtered web build. Preview deployment [`dpl_2U9tJj5kaRdsC7KMS6xfKuMasZUc`](https://vercel.com/omar-proj-canonical/storytime/2U9tJj5kaRdsC7KMS6xfKuMasZUc) completed successfully at [storytime-jxq3q7yug-omar-proj-canonical.vercel.app](https://storytime-jxq3q7yug-omar-proj-canonical.vercel.app). No production deployment or alias was changed.

The current no-secret deployment, provider, monitoring, billing, and native-account findings are recorded in [capability-inventory.md](capability-inventory.md). Convex and Cloudflare connector records exist but their API authentication is unusable; Sentry is readable but contains no StoryTime project; PostHog project discovery is unusable; LiveKit/R2/Clerk/Groq/fal/EAS/store/consent/billing production paths remain unconfigured or decision-gated.

## 5. Phase 0 spike evidence

`ST-012` has a repeatable local synthetic composition spike. It creates two checksum-distinct H.264/AAC tracks, applies a two-event ordered ledger, emits a six-second 1280×720 H.264/AAC replay, verifies it with ffprobe, repeats the encode, and removes all scratch data.

Measured on local FFmpeg 8.1.1:

- output: 737,253 bytes, exactly 6.000 seconds, 48 kHz stereo audio;
- deterministic repeat SHA-256: `105d300db01cd79fae4461e950ca1de4ab47fef00839a14f0b5749b47458acf3`;
- Node 22.23.1 wall time: 1,899.66 ms; FFmpeg CPU: 2.016 s user / 0.438 s system; 3.61× realtime;
- retained scratch before cleanup: 2,013,984 bytes; zero entries after cleanup.

The spike proves only the synthetic sequential-ledger path. Scene layouts, captions, degraded intervals, and ±250 ms sync fixtures remain later composition work. `ST-010` remains blocked on LiveKit credentials/server and physical devices. `ST-011` remains blocked on approved Groq and fal capabilities/credentials; available OpenAI story and moderation adapters do not satisfy the full bounded audio-to-image spike.

## 6. Documentation state before this pack

The former:

- `PRD.md` was 814 bytes;
- `IMPLEMENTATION_PLAN.md` was 681 bytes;
- architecture, testing, hard gates, and Codex runbook were placeholders;
- README still stated implementation had not started, despite substantial code.

Those claims were materially stale. The canonical v1 documents replace them.

## 7. Linear state

The connected Linear project was renamed from the legacy typo to [StoryTime MVP Delivery](https://linear.app/leadscout/project/storytime-mvp-delivery-11d86b03b18e), assigned an owner, and moved to `In Progress`. `ST-007` compared all 60 legacy issues with code, replaced the eleven legacy milestones with canonical Phases 0–9 plus one explicit legacy marker, and updated every legacy issue:

- verified scaffold/setup foundations LEA-16–20 were closed without claiming production readiness;
- obsolete LEA-22 and LEA-23 were canceled and LEA-54 was linked as a duplicate of LEA-52;
- deployment inventory LEA-21 and LEA-24 were moved to `Todo` with current gaps; LEA-25 was completed after branch protection, secret scanning, and push protection were enabled;
- truthful merge-gate work LEA-41 was moved to `In Review` with PR #2 and CI evidence;
- partially implemented auth, consent, LiveKit, domain, AI, and storage tickets were moved to `In Progress` with explicit missing acceptance criteria;
- [LEA-105](https://linear.app/leadscout/issue/LEA-105/st-007-reconcile-legacy-linear-backlog-with-canonical-plan) records the completed reconciliation and canonical phase/package mapping.

The resulting 60-issue legacy inventory has 12 `Done`, 28 `In Progress`, 5 `Todo`, 12 `Canceled`, 2 `Duplicate`, and 1 `In Review`; none remain in `Backlog`. These states describe the legacy slices and do not override the ST package proof requirements.

### Ongoing tracker rules

- Select work in canonical dependency order, not legacy issue-number order.
- Keep partial foundation tickets below `Done` until their named ST acceptance evidence exists.
- Create focused canonical issues as packages become ready rather than reviving superseded phase parents.
- Link commit, PR, CI, deployment, migration/rollback, and test evidence at each package boundary.
- Use the phase/work-package IDs in [../IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) as the ordering authority.

## 8. Source-material findings

Reviewed:

- StoryTime MVP PRD v0.4, 9 pages;
- StoryTime MVP Blueprint, 15 pages;
- static HTML UX prototype, 590 lines;
- “Turning video calls into AI adventures” audio;
- atomic-unit/state-machine video;
- GitHub default and live-foundation branches;
- complete Linear project/issue inventory.

The sources agree on:

- atomic value is a completed replayable chapter;
- adult-mediated child use;
- trusted family only;
- five-part seed and alternating baton;
- raw tracks plus ordered event ledger;
- async composition;
- private Vault;
- AI as constrained stage crew;
- deletion, safety, and cost as release gates.

The v1 PRD resolves their conflicting spelling, web scope, consent ordering, low-bandwidth language, cloud-backup semantics, recorder layout, and deletion/ledger claims.

## 9. Immediate critical path

1. Complete review of integration PR #2 and merge only after required protection/review evidence.
2. Reauthorize or configure the account capabilities identified in the completed inventory as their dependent packages become ready; keep Linear synchronized at package boundaries.
3. Measure the blocked synthetic LiveKit and full AI-turn spikes; preserve the completed composition evidence.
4. Migrate identity/family/consent/state models before production data.
5. Prove the two-adult, unrecorded-lobby, handoff, and recording boundary.
6. Close processor ZDR/private-output and region gates using synthetic data.
7. Complete one synthetic chapter vertically; the public/demo frontend polish is visual product work, not vertical acceptance evidence.

## 10. Completion estimate policy

No date is asserted until Phase 0 produces:

- a green reproducible baseline;
- live-foundation review outcome;
- external account/capability inventory;
- one measured two-device LiveKit spike;
- one measured synthetic AI turn;
- one measured synthetic recording/composition spike.

After those spikes, estimate in work packages with confidence ranges and explicit external-account dependencies. Avoid converting this plan into a false calendar promise.
