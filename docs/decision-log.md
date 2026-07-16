# StoryTime Decision Log

No owner approval was recorded during this synthesis. `Source-derived` means the decision follows the supplied evidence; it is not a substitute for owner/legal approval. `Provisional` is the autonomous implementation default until its named approver closes it.

| ID        | Date       | Status         | Decision                                                                                                                                                                                                                     | Authority / approver                                                    |
| --------- | ---------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `ADR-001` | 2026-06-28 | Superseded     | Phase-0-only setup before product implementation                                                                                                                                                                             | Historical repo decision; superseded by v1 source pack                  |
| `ADR-002` | 2026-07-16 | Source-derived | Product spelling is `StoryTime`; `StoriTime` is a legacy typo                                                                                                                                                                | PRD, blueprint, repository; owner may override brand                    |
| `ADR-003` | 2026-07-16 | Source-derived | Atomic value unit is one safe, recorded, privately replayable chapter                                                                                                                                                        | All supplied product/media sources                                      |
| `ADR-004` | 2026-07-16 | Provisional    | Mobile is canonical for child handoff; full public/adult web and desktop adult participation are in scope                                                                                                                    | User request extends mobile sources; owner approval pending             |
| `ADR-005` | 2026-07-16 | Source-derived | Adult lobby is unrecorded; recording/AI child-media authority begins only after consent, adult acceptances, and handoff                                                                                                      | PRD/blueprint consent gates                                             |
| `ADR-006` | 2026-07-16 | Source-derived | Live audio may remain open, but STT/LLM receives only the submitted baton interval                                                                                                                                           | PRD, blueprint, audio/video analyses                                    |
| `ADR-007` | 2026-07-16 | Source-derived | Record separate LiveKit participant tracks and ordered events; compose replay asynchronously with FFmpeg                                                                                                                     | Blueprint and state-machine video                                       |
| `ADR-008` | 2026-07-16 | Source-derived | Prototype recorder is an output-layout reference, not live RoomComposite architecture                                                                                                                                        | Blueprint/prototype conflict resolution                                 |
| `ADR-009` | 2026-07-16 | Provisional    | Convex is authoritative control plane and initial durable job queue; no required production Redis queue for beta                                                                                                             | Architecture synthesis; engineering owner pending spike                 |
| `ADR-010` | 2026-07-16 | Provisional    | One containerized worker service initially handles typed AI/media/deletion jobs with separate concurrency                                                                                                                    | Architecture synthesis; engineering owner pending load spike            |
| `ADR-011` | 2026-07-16 | Provisional    | Private R2-compatible storage holds media; an authorization gateway serves every client range/segment without origin URLs                                                                                                    | Privacy design; security/engineering owner pending spike                |
| `ADR-012` | 2026-07-16 | Provisional    | Clerk authenticates adults; versioned VPC is a separate provider-backed workflow                                                                                                                                             | Existing branch plus privacy requirement; owner/legal pending           |
| `ADR-013` | 2026-07-16 | Source-derived | AI output is structured, safety-gated before publication, and has an approved deterministic fallback                                                                                                                         | PRD/blueprint/media sources                                             |
| `ADR-014` | 2026-07-16 | Source-derived | Family media is never used for first-party or provider model training                                                                                                                                                        | Product/privacy source invariant                                        |
| `ADR-015` | 2026-07-16 | Provisional    | Event ledger is append-only while retained but deleted with chapter content; only content-free audit evidence survives                                                                                                       | Source conflict resolution; legal/privacy owner pending                 |
| `ADR-016` | 2026-07-16 | Provisional    | Basic private Vault is core; paid media archive/remaster is separate from free privacy-rights access                                                                                                                         | Product hypothesis; owner/legal approval pending                        |
| `ADR-017` | 2026-07-16 | Source-derived | Audio-first degradation/reconnect is required reliability, but low-bandwidth market support is not promised                                                                                                                  | Prototype/blueprint conflict resolution                                 |
| `ADR-018` | 2026-07-16 | Provisional    | Default beta replay is private 1280×720 H.264/AAC MP4 with captions and verified sync                                                                                                                                        | Media engineering default; owner/accessibility approval pending         |
| `ADR-019` | 2026-07-16 | Provisional    | Raw tracks default to seven days after verified replay and up to 30 days for recoverable failure                                                                                                                             | Conservative engineering default; legal/privacy owner pending           |
| `ADR-020` | 2026-07-16 | Provisional    | Web/mobile share contracts, state machines, safety, and tokens, not entire screen implementations                                                                                                                            | Engineering synthesis; owner pending implementation spike               |
| `ADR-021` | 2026-07-16 | Source-derived | Preserve and review `agent/live-foundation`; do not discard or assume merged                                                                                                                                                 | Verified Git branch evidence                                            |
| `ADR-022` | 2026-07-16 | Provisional    | Build vertically to one synthetic chapter before broad UI polish                                                                                                                                                             | Delivery strategy; product/engineering owner pending                    |
| `ADR-023` | 2026-07-16 | Provisional    | Real under-13 AI processing is capability-gated on approved zero-retention/private-output controls; no-training and `store:false` alone are insufficient                                                                     | Current primary provider policies; legal/privacy owner must approve     |
| `ADR-024` | 2026-07-16 | Provisional    | Nearby supervisor and child use distinct sequential participant identities; chapter egress starts after committed handoff and uses segment manifests                                                                         | Consent/media design; LiveKit spike and owner approval pending          |
| `ADR-025` | 2026-07-16 | Provisional    | Standard WebRTC transport encryption is the recorded beta baseline; no E2EE claim without a proven recording key path                                                                                                        | LiveKit architecture constraint; security/legal owner pending           |
| `ADR-026` | 2026-07-16 | Source-derived | Reconstruct the unavailable packaged baseline as a local commit on `main`, then merge `agent/live-foundation` without dropping its three commits                                                                             | Package/remote Git evidence; autonomous delivery contract               |
| `ADR-027` | 2026-07-16 | Provisional    | Keep the reproducible merge gate separate from physical-device Maestro evidence; combine both only in the release gate                                                                                                       | CI truthfulness and current device/tool availability                    |
| `ADR-028` | 2026-07-16 | Provisional    | Use a deterministic FFmpeg sequential-ledger composition spike as the Phase 0 replay baseline; expand it with layouts, captions, degraded intervals, and sync fixtures in Phase 5                                            | Measured ST-012 synthetic evidence; media engineering review pending    |
| `ADR-029` | 2026-07-16 | Provisional    | Migrate the scaffold schema and state machines additively: version new records/events, backfill non-production data, verify dual-read parity, cut writers/readers, then remove legacy fields in a later reversible migration | No linked production Convex deployment; backend/security review pending |
| `ADR-030` | 2026-07-16 | Provisional    | Provider privacy controls are exact attestations enforced by the registry, production prebuild, and live worker constructors; credentials alone never enable child-data processing                                           | Provider policies; legal/privacy and account verification pending       |

## ADR-001 — Setup-only phase

The original decision prevented speculative implementation before the source documents were available. It is superseded because the PRD, blueprint, prototype, media, repository, and backlog have now been reconciled into the canonical v1 pack.

## ADR-026 — Packaged baseline recovery

The installation bundle identifies commit `61ad4f3`, but that object is not reachable from the canonical remote. The extracted application files match remote `main` while the canonical documents and registered source artifacts are additional local content. The recovery path therefore commits the supplied bundle on top of `main` and merges `origin/agent/live-foundation`, resolving documentation conflicts in favor of the newer canonical pack while preserving all Clerk, LiveKit, provider, and lockfile work. This avoids inventing an unavailable commit or replacing either evidence set. Rollback is a normal revert of the local baseline and merge commits; no remote history is rewritten.

## ADR-027 — Merge and physical-device gates

`pnpm check` is the clean-checkout merge gate and includes format, lint, types, unit/integration, Chromium E2E, AI/media fixtures, Next production compilation, and Android/iOS Expo bundle export. `pnpm check:device` is a real Maestro runner that fails when Maestro, a booted target, or the installed application is unavailable. `pnpm check:release` combines both. Making an unavailable physical-device runner part of every generic CI job would keep CI permanently red; silently skipping it would create false evidence. The separate release gate preserves the failure while allowing deterministic source integration. A device-backed CI or release runner can replace this provisional split without changing the Maestro flows.

## ADR-028 — Deterministic composition spike baseline

The Phase 0 compositor uses two generated H.264/AAC sources plus a monotonic two-event ledger to create and probe a six-second 1280×720 replay. A repeat run must produce the same SHA-256, and cleanup must leave no scratch entries. This narrow spike measures encoding time, CPU, scratch, output size, duration, codecs, and determinism without introducing a production compositor abstraction or dependency. It does not decide final scene layout, caption rendering, degraded-interval treatment, or the complete ±250 ms synchronization fixture; those remain explicit ST-510/ST-519 acceptance work.

## ADR-029 — Additive schema and state migration

The current generic `status` fields and conflated session/chapter/recording lifecycle are migration inputs, not contracts to preserve. New family, membership, call, chapter, recording, composition, asset, event, and job records use strict versioned schemas and explicit transition versions. Migrations first add fields/tables/indexes, then backfill synthetic/dev data idempotently, verify old/new read parity, move trusted writers and readers, and only later remove legacy paths after a clean backup/restore and rollback rehearsal. Unknown versions fail closed at authorization/media boundaries. No destructive production migration may be inferred from this decision; the production Convex project, region, backup, and data inventory must be verified first.

## ADR-030 — Provider-control attestations

OpenAI ZDR approval, Groq ZDR enablement, fal private output, and fal media-retention verification are represented as explicit environment attestations whose only accepted live value is `true`. They default to `false`. The capability registry reports each false or absent attestation as missing, the production web prebuild invokes the environment guard, and worker constructors repeat the provider-specific check before creating a live adapter. An attestation records a verified account control; it does not change provider settings and may be set only after account evidence and the required legal/privacy review exist. This layered refusal prevents a credential-only configuration from processing child data while keeping local mock development deterministic.

## Pending owner/pre-production decisions

These do not block configurable implementation or synthetic testing, but they block public processing of real child data or commercial release:

| ID        | Decision required                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `DEC-P01` | Initial public launch jurisdiction(s), controller/legal entity, and approved legal review                                |
| `DEC-P02` | Production verifiable parental-consent provider, method, scopes, expiry, and dispute process                             |
| `DEC-P03` | Final processor contracts/configuration for child data, ZDR/private output, deletion, retention, region, and no-training |
| `DEC-P04` | Final retention, backup, export, and audit schedule                                                                      |
| `DEC-P05` | Apple/Google app category, age rating, privacy/data disclosures, and account access                                      |
| `DEC-P06` | Subscription catalogue, prices, trials, refunds, taxes, and paid retention                                               |
| `DEC-P07` | Support/privacy contact and incident owner                                                                               |
| `DEC-P08` | Adult eligibility/age assurance, guardian authority evidence, custody/dispute policy, and approved-adult limits          |
| `DEC-P09` | Age-appropriate child notice, assent/stop/help controls, and what happens when a child wants recording to stop           |
| `DEC-P10` | Safety incident disclosure/escalation, content review authority, mandatory-reporting analysis, and family notice         |
| `DEC-P11` | Necessity and final retention of raw child audio/video after verified replay                                             |

## Decision protocol

A material decision entry records:

- context and evidence;
- decision and status;
- alternatives rejected;
- product/security/privacy consequences;
- migration/rollback;
- owner and date.

Statuses:

- `Provisional`: implementation may proceed with synthetic data behind configuration; named approval is pending.
- `Source-derived`: directly reconciled from supplied evidence; still not an owner/legal approval.
- `Accepted`: explicit owner/required reviewer approval is recorded with date and evidence.
- `Superseded`: replaced by a later decision with migration/rollback notes.

Owner approval is required to change child access, consent/recording boundary, family role authority, deletion semantics, safety policy, public sharing, data use/training, launch jurisdiction, or commercial commitment.
