# StoryTime Current State

| Field                         | Value                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| Snapshot date                 | 2026-07-16                                                                                   |
| Default branch                | `main`                                                                                       |
| Default-branch commit audited | `6b57b46057b10f90a8ca40d06c3bed28c8c3ae2b`                                                   |
| Newest implementation branch  | `origin/agent/live-foundation` at `c343667`                                                  |
| Canonical-doc work branch     | Local `docs/canonical-product-build-plan`; not pushed or opened as a PR                      |
| Repository                    | [OmarA1-Bakri/StoryTime](https://github.com/OmarA1-Bakri/StoryTime)                          |
| Linear project                | [StoriTime MVP Build](https://linear.app/leadscout/project/storitime-mvp-build-11d86b03b18e) |

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

There is no open GitHub PR for this branch and the connected GitHub status endpoints returned no CI/check status for either audited head. The branch must be reviewed and tested; it must not be blindly discarded or treated as merged.

The live provider adapters also predate this pack's verified under-13 controls. Before they receive real child data, review and test OpenAI ZDR capability, Groq ZDR/private clip delivery, fal no-store/private ACL and URL handling, plus the deletion/retention path. Existing adapter code or `store: false` alone is not readiness evidence.

### Required recovery action

1. Preserve `agent/live-foundation`.
2. Rebase or merge the current `main` documentation baseline into a dedicated integration branch.
3. Install with Node 22 and pinned pnpm using its lockfile.
4. Run the full available gates.
5. Review auth, consent, LiveKit token, provider, logging, and client-secret boundaries.
6. Open a PR with evidence.
7. Merge only after failures and documentation conflicts are resolved.

## 4. Build and tooling state

Repository intent:

- Node `22.x`;
- pnpm `9.15.9`;
- current shell at audit time used Node 24 and global pnpm 11;
- `main` had no `pnpm-lock.yaml`;
- the live-foundation branch adds the lockfile.

Consequences:

- CI/local reproducibility is not established on `main`.
- Any meaningful test result must use Node 22, Corepack, pinned pnpm, and a frozen lock.
- Existing mobile `test` and `build` scripts on `main` are placeholder `echo` commands and cannot count as gates.
- Existing web/worker tests are useful but exercise demo/mock slices, not the real chapter.

The repository homepage points to a Vercel URL, but this audit did not treat repository metadata as deployment verification.

## 5. Documentation state before this pack

The former:

- `PRD.md` was 814 bytes;
- `IMPLEMENTATION_PLAN.md` was 681 bytes;
- architecture, testing, hard gates, and Codex runbook were placeholders;
- README still stated implementation had not started, despite substantial code.

Those claims were materially stale. The canonical v1 documents replace them.

## 6. Linear state

The connected Linear project contains 60 issues:

- 13 marked `Done`;
- 47 in `Backlog`;
- 56 priority 2 and 4 priority 1;
- project progress reported as ~21.7%;
- no target date or active project lead.

Six setup issues remain in Backlog even though their descriptions claim completion:

- LEA-16 Scaffold monorepo baseline
- LEA-17 Discover Composio tool availability
- LEA-18 Add env example and env guard placeholder
- LEA-19 Create GitHub repository and labels
- LEA-20 Create Mem0 canonical project memory
- LEA-22 Prepare PRD ingestion workflow

Other ticket states are also likely stale relative to code. For example, live-foundation implements portions of provider/auth/LiveKit work whose tickets remain Backlog.

### Required backlog action

- Do not continue by simply taking the next numbered ticket.
- Reconcile each issue against merged code and the v1 PRD.
- Close/update obsolete scaffold tickets with commit/PR evidence.
- Split partially implemented tickets.
- Add missing v1 epics for family tenancy, web parity, native call delivery, safety evals, egress/composition, deletion, app-store release, and beta.
- Use the phase/work-package IDs in [../IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) as the new ordering.

## 7. Source-material findings

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

## 8. Immediate critical path

1. Merge the canonical documents through normal review.
2. Recover and review `agent/live-foundation`.
3. Pin/install the toolchain and make `pnpm check` truthful.
4. Migrate identity/family/consent/state models before production data.
5. Prove the two-adult, unrecorded-lobby, handoff, and recording boundary.
6. Close processor ZDR/private-output and region gates using synthetic data.
7. Complete one synthetic chapter vertically before broad UI polish.

## 9. Completion estimate policy

No date is asserted until Phase 0 produces:

- a green reproducible baseline;
- live-foundation review outcome;
- external account/capability inventory;
- one measured two-device LiveKit spike;
- one measured synthetic AI turn;
- one measured synthetic recording/composition spike.

After those spikes, estimate in work packages with confidence ranges and explicit external-account dependencies. Avoid converting this plan into a false calendar promise.
