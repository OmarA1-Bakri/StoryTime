# StoryTime Acceptance and Test Plan

| Field        | Value                      |
| ------------ | -------------------------- |
| Status       | Normative release evidence |
| Version      | 1.0                        |
| Last updated | 2026-07-16                 |

Passing a unit test is not proof that StoryTime is complete. Release requires automated gates, real-client integration, device/media evidence, privacy/safety verification, and deployed smoke tests.

## 1. Test strategy

| Layer              | Purpose                                                        | Default tools                                            |
| ------------------ | -------------------------------------------------------------- | -------------------------------------------------------- |
| Static             | Formatting, lint, types, dependency/config validation          | Prettier, ESLint, TypeScript, environment scripts        |
| Unit               | Pure policy, state, schemas, layouts, retries, redaction, cost | Vitest, React Testing Library                            |
| Property/state     | Invalid transitions, idempotency, ordering, duplicate commands | fast-check or equivalent + Vitest                        |
| Contract           | Provider adapters, webhooks, normalized errors, schemas        | Recorded/synthetic fixtures; network disabled by default |
| Convex integration | Authorization, atomic transitions, indexes, jobs, migrations   | Convex test harness                                      |
| Web E2E            | Public/adult/call/vault/privacy flows                          | Playwright                                               |
| Mobile E2E         | Adult/child navigation, permissions, call flow, recovery       | Maestro on EAS/dev builds                                |
| Realtime/media     | Two-client call, reconnect, egress, track alignment            | LiveKit test project + synthetic media                   |
| AI evaluation      | Structured output, safety, fallback, latency, cost             | Versioned synthetic eval runner                          |
| Composition        | Deterministic manifest and replay correctness                  | FFmpeg/ffprobe + golden synthetic assets                 |
| Security/privacy   | Authz, tokens, media gateway, logs, deletion, webhook replay   | Automated negative suites + manual review                |
| Deployment         | Production-like preview and post-deploy smoke                  | Vercel/EAS/worker/Convex health checks                   |
| Pilot              | Human usability and trust                                      | Scripted adult/internal, then invited households         |

Tests use synthetic identities and media unless an approved beta protocol explicitly permits real family data.

## 2. Required root commands

The repository must make these commands real; placeholder `echo` success is a failure:

```bash
corepack pnpm install --frozen-lockfile
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

CI may split these jobs, but `pnpm check` must represent the documented merge gate. Mobile signed builds may run as a separate credentialed gate.

## 3. Platform matrix

### 3.1 Beta minimum

| Surface           | Required                                                                              |
| ----------------- | ------------------------------------------------------------------------------------- |
| iOS               | iOS 16, 17, and current stable; one lower/mid device and one current device           |
| Android           | Android 10, 12, and current stable; one constrained/mid device and one current device |
| Web desktop       | Latest two Chrome, Safari, and Edge majors                                            |
| Web responsive    | iPhone-sized Safari and common Android Chrome viewports                               |
| Networks          | Stable Wi-Fi, 4G/5G, latency/jitter/loss simulation, disconnect/reconnect             |
| Participant pairs | mobile↔mobile, web remote adult↔mobile child side, supported web↔web               |

Firefox is best effort until explicitly certified. Simulator/emulator results do not replace at least one physical iOS and Android run for camera, microphone, push, backgrounding, and reconnect.

### 3.2 Media fixtures

Maintain synthetic:

- two distinct participant video/audio tracks;
- silence, overlap, background noise, interruption, and reconnect segments;
- variable frame rates and device rotation metadata;
- short/maximum chapter;
- missing/degraded video with valid audio;
- malformed/truncated media for negative compositor tests;
- known sync markers for ±250 ms verification.

## 4. Product acceptance

`P0` means a failure blocks the release stage to which the test applies. Sections 4.1–4.9 are required for the private-beta release except explicitly commercial-only rows. Section 4.10 becomes P0 only for commercial v1; unfinished payment integrations do not block a manual/zero-cost private beta.

### 4.1 Identity and family

| ID          | Test                                                                                                              | Evidence                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `AT-ID-001` | Unauthenticated clients cannot read/write any family resource                                                     | Automated Convex/BFF negative matrix                                                |
| `AT-ID-002` | Adult in Family A cannot enumerate/access Family B profiles, sessions, assets, replay, jobs, or playback sessions | Cross-tenant integration suite                                                      |
| `AT-ID-003` | Invitation is expiring, single-use, recipient/role scoped, revocable                                              | Unit + integration + E2E                                                            |
| `AT-ID-004` | Adult revocation blocks future query, token refresh, push target, replay, and export                              | Integration + E2E                                                                   |
| `AT-ID-005` | Child mode cannot open adult routes/actions through navigation, deep link, or direct API                          | Web/mobile E2E + server negatives                                                   |
| `AT-ID-006` | Recent auth is required for role, consent, export, deletion, billing, and child-mode exit                         | E2E                                                                                 |
| `AT-ID-007` | Relevant adult access revoked during lobby or active chapter                                                      | Token refresh denied; participant removed; turns/AI/recording stop; call ends       |
| `AT-ID-008` | Abandoned or pre-consent onboarding                                                                               | No named child profile; provisional slot expires and is purged                      |
| `AT-ID-009` | Clerk create/update/disable/delete webhook duplicates and reordering                                              | One internal adult identity; disabled user denied; family ownership resolved safely |
| `AT-ID-010` | Local biometric/passcode handoff                                                                                  | Confirms nearby guardian only; remote caller identity comes from trusted account    |
| `AT-ID-011` | Adult eligibility/authority check fails or custody dispute is flagged                                             | Affected child session blocked; no child media; content-blind support state created |

### 4.2 Consent and recording boundary

| ID          | Test                                                                                                                    | Evidence                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `AT-CN-001` | Missing, pending, rejected, expired, revoked, superseded, and mock production consent all block child session/recording | State + integration matrix                                                                  |
| `AT-CN-002` | Notice/terms version change supersedes the relevant grant                                                               | Integration                                                                                 |
| `AT-CN-003` | Adult lobby permits trusted adult confirmation but records/persists no child media                                      | Two-device media E2E                                                                        |
| `AT-CN-004` | No child mic/camera publication, recording, STT, LLM, image, or persistent asset before authority                       | Instrumented negative E2E                                                                   |
| `AT-CN-005` | Both adults' per-session acceptance and local handoff are required                                                      | Integration + E2E                                                                           |
| `AT-CN-006` | Recording indicator is persistent, truthful, screen-reader accessible, and changes on degradation/stop                  | Web/mobile manual + automated UI                                                            |
| `AT-CN-007` | Consent withdrawal blocks pending/new calls and starts configured data action                                           | Integration                                                                                 |
| `AT-CN-008` | Consent expires, withdraws, or is superseded during an active turn                                                      | No new provider/publication; call ends; recording finalizes; data workflow starts           |
| `AT-CN-009` | Child uses stop/help before setup, during capture, or while AI is pending                                               | New work blocked; recording/call pauses or ends safely; adults alerted; late output ignored |

### 4.3 Call and network

| ID          | Test                                                     | Target                                                                     |
| ----------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| `AT-CL-001` | Valid call create→notify→accept→lobby→handoff→active→end | All participant-pair combinations                                          |
| `AT-CL-002` | Simultaneous accept on two devices                       | Exactly one wins; other shows already answered                             |
| `AT-CL-003` | Declined, missed, cancelled, expired, and unavailable    | Correct terminal state; no orphan room/chapter                             |
| `AT-CL-004` | Scoped token attempts wrong room/identity/admin grant    | Denied                                                                     |
| `AT-CL-005` | Permission denied then settings/retry                    | Safe recoverable UX                                                        |
| `AT-CL-006` | 5/15/30/60-second network loss                           | Reconnect within grace or save/recover; no duplicate participant/recording |
| `AT-CL-007` | Background/foreground and device interruption            | Accurate state and recovery                                                |
| `AT-CL-008` | Degraded network                                         | Audio prioritised; video/image cadence may reduce; status visible          |
| `AT-CL-009` | Connection success benchmark                             | ≥98% supported attempts                                                    |
| `AT-CL-010` | Join latency benchmark                                   | P95 ≤10 seconds                                                            |

### 4.4 Setup, baton, and scene

| ID          | Test                                                                                          | Evidence                    |
| ----------- | --------------------------------------------------------------------------------------------- | --------------------------- |
| `AT-ST-001` | All five categories required; invalid/custom unsafe input rejected/replaced                   | Unit + E2E                  |
| `AT-ST-002` | Locked seed cannot be edited and has one version                                              | Property + integration      |
| `AT-ST-003` | Only current holder and expected version can submit                                           | Concurrency/property test   |
| `AT-ST-004` | Duplicate/stale submit produces one turn, one cost debit, one scene                           | Integration                 |
| `AT-ST-005` | STT receives only sealed submitted interval, not full open call                               | Provider fixture inspection |
| `AT-ST-006` | Both clients converge on identical ordered scene versions under duplicate/out-of-order events | Realtime integration        |
| `AT-ST-007` | Timeout/cancel/pass/checkpoint/end cannot strand baton                                        | State/property suite        |
| `AT-ST-008` | Child sees immediate acknowledgement and safe loading/fallback                                | UI + latency test           |

### 4.5 AI and safety

| ID          | Test                                                                   | Target                                                                                 |
| ----------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `AT-AI-001` | Provider keys absent from client bundles/network payloads              | Build inspection                                                                       |
| `AT-AI-002` | Malformed/extra/oversized structured output                            | Repaired once or safe fallback; never published raw                                    |
| `AT-AI-003` | Unsafe transcript/beat/caption/prompt/image                            | Approved replacement; blocked content never child-visible                              |
| `AT-AI-004` | Prompt injection/tool request/system-role change                       | Policy remains fixed; safe output/fallback                                             |
| `AT-AI-005` | Provider timeout/429/5xx/outage                                        | Bounded retry/circuit; fallback within experience budget                               |
| `AT-AI-006` | Unknown language/noise/empty turn                                      | Safe repeat/fallback; no invented alarming content                                     |
| `AT-AI-007` | Versioned safety eval                                                  | No critical escape; owner-approved high-risk threshold                                 |
| `AT-AI-008` | Text latency                                                           | P95 approved caption/beat ≤5s                                                          |
| `AT-AI-009` | Scene latency                                                          | P95 approved scene or fallback ≤12s                                                    |
| `AT-AI-010` | Logs/analytics after blocked test                                      | No raw input/output, prompt, signed URL, or token                                      |
| `AT-AI-011` | OpenAI capability missing/expired or only `store:false`                | Real child-data job fails closed; approved fallback remains available                  |
| `AT-AI-012` | STT delivery inspection                                                | Only sealed baton clip; private short URL/object; ZDR active; temporary input deleted  |
| `AT-AI-013` | Image provider request/client inspection                               | Prompt de-identified; no-store/private ACL; output copied to R2; no provider URL leaks |
| `AT-AI-014` | Model self-labels blocked or identifying continuity content as allowed | Gateway overrides; output is replaced/blocked and unsafe summary is not reused         |

### 4.6 Recording and ledger

| ID          | Test                                                                                    | Evidence                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `AT-RC-001` | Adult/child audio/video logical streams captured with correct opaque ownership metadata | LiveKit integration                                                                                          |
| `AT-RC-002` | Start/stop repeated/reordered webhooks                                                  | One recording boundary and final state                                                                       |
| `AT-RC-003` | Ledger sequence monotonic; idempotency; late events retained without reordering history | Property/integration                                                                                         |
| `AT-RC-004` | Crash during start, active, stop, and track finalization                                | Recoverable/failed truth; no false ready                                                                     |
| `AT-RC-005` | Disconnect ≤60s and worker restart                                                      | Completed portion retained                                                                                   |
| `AT-RC-006` | Missing video with valid audio                                                          | Explicit degraded manifest and viable replay/failure policy                                                  |
| `AT-RC-007` | Object access/list/public probes                                                        | Denied                                                                                                       |
| `AT-RC-008` | Playback session/range cross-family, expired, revoked, quarantined                      | Denied; no origin URL exposed                                                                                |
| `AT-RC-009` | Pre-authority lobby and room-level egress probes                                        | Child publishes no mic/camera; no child track/object/AI request exists                                       |
| `AT-RC-010` | Participant reconnect republishes a new track ID                                        | New segment appends to manifest; timing/gap is explicit; replay remains deterministic                        |
| `AT-RC-011` | Recording boundary timing                                                               | Visible/spoken indicator and ledger boundary at or before earliest captured byte; setup follows confirmation |

### 4.7 Composition and Vault

| ID          | Test                                                                       | Target                                                                                    |
| ----------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `AT-MV-001` | Same manifest rendered twice                                               | Functionally deterministic layout/timing; no duplicate published chapter                  |
| `AT-MV-002` | Worker dies before/during/after upload                                     | Lease retry; at most one final asset                                                      |
| `AT-MV-003` | Retryable error and attempts exhausted                                     | Retry wait then visible recoverable/dead-letter state                                     |
| `AT-MV-004` | Output probe                                                               | Decodes; expected streams; duration tolerance; checksum                                   |
| `AT-MV-005` | Known sync fixture                                                         | Within ±250ms                                                                             |
| `AT-MV-006` | Composition success benchmark                                              | ≥99% valid manifests                                                                      |
| `AT-MV-007` | Completion latency benchmark                                               | P95 ready ≤5 minutes                                                                      |
| `AT-MV-008` | Vault authorization/status/actions                                         | Web and mobile parity                                                                     |
| `AT-MV-009` | Continuation                                                               | New chapter, bounded approved summary, prior chapter unchanged                            |
| `AT-MV-010` | Raw-track retention job after verified replay                              | Purges on schedule without breaking replay                                                |
| `AT-MV-011` | Replay provenance fixture                                                  | Voices map to source tracks; generated elements labelled; no invented quote/action        |
| `AT-MV-012` | Failure after temp upload, final copy, final verification, or metadata CAS | Never `READY` before verified immutable final object; orphan temp/final object reconciled |

### 4.8 Deletion and privacy

| ID          | Test                                                                     | Target                                                                                  |
| ----------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `AT-PR-001` | Unauthorized/stale-auth deletion                                         | No effect                                                                               |
| `AT-PR-002` | Chapter deletion while AI/composition/export active                      | Quarantine wins; work cancels; no recreated asset                                       |
| `AT-PR-003` | Complete target inventory                                                | Convex, raw, scene, replay, caption, cache, analytics content, processor request        |
| `AT-PR-004` | Partial provider/storage failure                                         | Visible partial state, alert, idempotent retry                                          |
| `AT-PR-005` | Reconciliation after complete                                            | No active content/object; content-free audit remains                                    |
| `AT-PR-006` | New and already-issued playback session used after quarantine/revocation | New session and next unfetched range/segment denied; delivered-buffer caveat documented |
| `AT-PR-007` | Active deletion SLA                                                      | Quarantine immediate; completion ≤24h in controlled test                                |
| `AT-PR-008` | Backup restore rehearsal                                                 | Deletion tombstones reapplied before activation                                         |
| `AT-PR-009` | Telemetry/log scan                                                       | No prohibited data classes                                                              |
| `AT-PR-010` | Authorized privacy-rights export with no paid plan                       | Available, correctly scoped, private, expiring, audited; no cross-family data           |
| `AT-PR-011` | Paid media download without entitlement                                  | Denied without blocking basic replay or privacy-rights export                           |

### 4.9 Entitlements and cost

| ID          | Test                                                        | Evidence                                                 |
| ----------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| `AT-EN-001` | Concurrent chapter starts with one credit                   | One reservation succeeds                                 |
| `AT-EN-002` | Cancel/retry/complete                                       | Correct release/consume; no double charge                |
| `AT-EN-003` | Manual beta grant/revoke/extend events reordered/duplicated | One canonical outcome; no double credit                  |
| `AT-EN-004` | Storage derived from authoritative assets                   | Reconciliation correct                                   |
| `AT-EN-005` | Download/archive/remaster without capability                | Denied server-side                                       |
| `AT-EN-006` | Completed chapter usage                                     | Every provider/media/storage/worker category represented |
| `AT-EN-007` | Monthly cost reconciliation                                 | Within ±5%                                               |

### 4.10 Commercial v1 billing (not a private-beta gate)

| ID          | Test                                                          | Evidence                                      |
| ----------- | ------------------------------------------------------------- | --------------------------------------------- |
| `AT-CM-001` | RevenueCat purchase/renew/refund/expiry duplicates/reordering | One canonical mobile entitlement              |
| `AT-CM-002` | Stripe checkout/renew/refund/cancel duplicates/reordering     | One canonical web entitlement                 |
| `AT-CM-003` | Manual, mobile, and web grants overlap                        | Deterministic precedence; no double credit    |
| `AT-CM-004` | Purchase then immediate chapter start/refund                  | Correct reserve/consume/restore policy        |
| `AT-CM-005` | Price/product/store configuration drift                       | Deployment refuses unknown/unapproved mapping |
| `AT-CM-006` | Commercial analytics/log scan                                 | No child content or payment secret            |

### 4.11 Operations, notices, and surface coverage

| ID          | Test                                                                                           | Evidence                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `AT-OP-001` | Push token add/rotate/revoke/environment isolation and disabled preference                     | Correct target only; no child/story content in lock-screen payload                                                   |
| `AT-OP-002` | Adult disables optional notifications                                                          | Required consent, privacy, security, recording, and deletion notices remain enabled                                  |
| `AT-OP-003` | Operator investigates/retries synthetic failed call, AI, composition, and deletion             | Metadata/redacted codes only by default; break-glass separately authorized/audited                                   |
| `AT-OP-004` | Public legal/trust copy and in-product notice version drift                                    | Build/deploy fails or consent capability blocks until versions match                                                 |
| `AT-OP-005` | Every required surface and state in [screen-state-inventory.md](screen-state-inventory.md)     | Web/mobile route E2E or explicit manual evidence; no dead/static-demo action                                         |
| `AT-OP-006` | Public website navigation, metadata, responsive layout, accessibility, and legal/support links | Browser matrix, axe, link checker, SEO metadata inspection                                                           |
| `AT-OP-007` | Critical unsafe-output/safeguarding tabletop and synthetic trigger                             | Capability/cohort contained; approved adult escalation/disclosure path; evidence minimized; owner re-enable required |

## 5. Accessibility acceptance

### 5.1 Automated

- axe on every public/adult web route and critical state;
- React Native accessibility queries/roles for critical screens;
- colour contrast and token checks;
- lint rules for labels/roles where supported.

### 5.2 Manual

- VoiceOver on iOS critical journey;
- TalkBack on Android critical journey;
- keyboard-only web adult journey;
- 200% browser zoom and large/dynamic text;
- reduced motion;
- high contrast/dark live room;
- recording/network/baton status without colour;
- focus order after modal, error, reconnect, and route transition;
- 44×44pt targets and destructive-action confirmation.

Release target: zero critical automated violation and no blocking manual issue.

## 6. Security acceptance

- secret scan of git history/current tree and client bundles;
- dependency/container vulnerability review;
- authorization matrix for every protected query/mutation/route;
- object bucket policy, internal operation-URL, and media-gateway negative tests;
- media-gateway tests for origin-URL concealment and authorization on every manifest/range/segment;
- webhook invalid signature, old timestamp, replay, duplicate, wrong environment;
- rate limit and cost-abuse tests;
- CSRF/origin/CORS/security-header verification;
- prompt/log/analytics redaction;
- worker scratch cleanup and least-privilege credential test;
- production capability guard refuses mock/missing providers;
- capability guard refuses OpenAI without approved ZDR, STT without approved retention, and image generation without private/no-store output;
- network inspection proves no provider media URL or child content appears in a client bundle/payload;
- incident and credential rotation tabletop.

No unresolved critical/high exploitable finding on the launch path.

## 7. CI workflow

Required pull-request jobs:

1. docs/source-of-truth link check and Markdown lint;
2. install with Node 22, Corepack, pinned pnpm, frozen lockfile;
3. format and lint;
4. TypeScript;
5. unit/property/contract;
6. Convex integration/migration;
7. web build and Playwright smoke;
8. mobile type/config/unit bundle check;
9. worker build, media fixtures, container scan;
10. AI synthetic eval in mock/recorded mode;
11. secret/dependency scan.

Required protected deployment jobs:

- Vercel preview smoke;
- Convex preview migration/capability;
- worker image build and health;
- EAS preview builds on release candidates;
- production capability check before deploy;
- post-deploy synthetic chapter smoke without child data.

PRs cannot merge when a required job is skipped, placeholder-only, or silently allowed to fail.

## 8. Release evidence bundle

Each release candidate records:

- commit SHA and dependency lock hash;
- web/worker/mobile build identifiers;
- Convex schema/migration version;
- provider/model/prompt/safety policy versions;
- automated test reports and coverage;
- AI eval report;
- media/reconnect/device matrix;
- security/privacy checklist;
- accessibility checklist;
- deployment/capability smoke;
- open accepted risks with owner and expiry;
- rollback version and recovery instructions.

Evidence contains synthetic data and no secrets.

## 9. Quality thresholds

- 100% branch coverage for authorization policy, state-transition guards, consent/recording authority, signed-media authorization, credit ledger, deletion orchestration, and production capability guard.
- ≥90% statement coverage for shared domain/validator packages.
- Coverage elsewhere is trend-gated and risk-based; generated/config files are excluded explicitly.
- Zero flaky test accepted as “pass on retry” on critical consent, media, state, or deletion paths.
- Performance baselines fail on statistically meaningful regression beyond the recorded budget.

## 10. Pilot scripts

### 10.1 Internal/adult-only

Use synthetic child profiles and adult actors to complete:

- new family and invitation;
- consent sandbox;
- mobile↔mobile and web↔mobile calls;
- setup, eight turns, fallback, checkpoint, ending;
- composition/replay/continue;
- revocation and deletion;
- all permission/network/interruption variants.

### 10.2 Five-household readiness

Only after the real-child-data launch gate:

- informed private protocol and support contact;
- at least two iOS and two Android device families;
- observe first setup without coaching, incoming call, handoff, chapter, replay, deletion understanding;
- record content-free usability findings and defects;
- stop cohort on any critical consent, unsafe output, unauthorized access, or recording boundary failure.

### 10.3 Twenty-household beta

Track:

- first chapter and second-chapter conversion;
- weekly completed chapters;
- replay within seven days;
- support demand;
- completion/latency/recovery/safety/cost;
- deletion/consent understanding;
- willingness to pay through explicit research or configured checkout.

## 11. Exit criteria

Private-beta “done” requires:

- all private-beta P0 tests pass on the release commit;
- deployed web and worker smoke pass;
- signed iOS/Android builds pass the device matrix;
- no production path uses mock fallback;
- recovery, deletion, and cost evidence exist;
- no critical/high launch-path defect;
- docs/current state and Linear match the repository;
- owner-required public launch decisions are approved.

Commercial-v1 “done” additionally requires `AT-CM-001`–`AT-CM-006`, the evidence-backed pricing decision, real cross-platform entitlement verification, and owner-authorized store/web release.

A demo route, static screen, mock provider, typecheck-only mobile package, placeholder test script, or successful web build is not product completion.
