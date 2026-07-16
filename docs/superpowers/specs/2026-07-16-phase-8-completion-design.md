# StoryTime Phase 8 Completion Design

| Field               | Value                                                                            |
| ------------------- | -------------------------------------------------------------------------------- |
| Status              | Approved execution design                                                        |
| Target              | Fully working, production-capable beta candidate through Phase 8                 |
| Excludes            | Household beta evidence, commercial billing, store submission, and public launch |
| Canonical authority | `PRD.md` and its normative extensions                                            |
| Date                | 2026-07-16                                                                       |

## 1. Objective

Complete StoryTime through every Phase 0–8 work package and private-beta P0 acceptance gate.

The resulting release candidate must let an authorized synthetic/adult-only family use real web,
iOS, and Android clients to:

1. establish trusted adult identity, family membership, a consent-first child profile, and current
   consent;
2. deliver and accept a two-device call;
3. enter an explicitly unrecorded adult lobby;
4. commit recording acceptance and child handoff before any child publication or capture;
5. complete a server-authoritative five-choice, alternating-baton chapter;
6. process only sealed submitted-turn intervals through production-capable STT, story, safety, and
   image adapters;
7. record separate participant tracks and a monotonic ordered ledger;
8. compose and verify a private deterministic replay;
9. replay and continue it through the Memory Vault;
10. quarantine and delete it across every primary, derived, cached, analytical, and processor
    target;
11. reconcile entitlements, storage, usage, and chapter cost;
12. recover safely from client, network, provider, worker, webhook, storage, and deployment
    failures.

No production path may silently use mock identity, consent, LiveKit, recording, storage, AI,
safety, deletion, or entitlement authority.

## 2. Truthful Phase 8 boundary

Phase 8 yields a deployed and signed beta candidate, not an activated real-family beta.

Completion requires:

- production-deployed web, Convex control plane, LiveKit media plane, private R2 media path,
  long-running worker, media gateway, and privacy-safe monitoring;
- signed iOS and Android candidates;
- physical-device and required browser/network evidence;
- real production-capable integrations exercised with synthetic or adult-only content;
- no mock fallback in production;
- successful end-to-end chapter, replay, recovery, deletion, and cost scenarios;
- passing private-beta P0 tests, rollback evidence, and a release evidence bundle.

Phase 8 does not include:

- real-child-data activation;
- five-household or twenty-household evidence;
- RevenueCat or Stripe commercial billing;
- approved public pricing;
- App Store or Play Store submission/release;
- public web launch.

Those actions remain Phase 9 or explicit owner-authorized launch work. Until the required owner,
legal, provider, region, account, signing, and device gates close, the product must fail closed for
real child data.

## 3. Execution authority

The five milestones below are reporting umbrellas only. Work selection, implementation order,
testing, review, and completion claims remain governed by the individual packages and exit scenarios
in `IMPLEMENTATION_PLAN.md`.

Within each package:

1. orient to code, dependencies, current evidence, and the canonical Linear issue;
2. define the smallest vertical behavior and proof;
3. write negative tests first for authorization, consent, state, idempotency, media, safety, and
   deletion;
4. implement loading, empty, denied, degraded, retryable, recovery, terminal, quarantined, and
   accessibility states where applicable;
5. run focused verification and the affected workspace/root gates;
6. review the complete user-to-provider-to-storage-to-audit failure path;
7. update current state, decisions, migrations, rollback notes, GitHub, and Linear;
8. publish one focused reviewable package;
9. fix CI and review findings before advancing;
10. clean temporary data, media, containers, worktrees, and external test resources.

Unmerged or externally unverified work remains `IN_REVIEW` or `BLOCKED_EXTERNAL`; it never becomes
`DONE_VERIFIED` from local tests alone.

## 4. Milestone architecture

### 4.1 Foundation and trusted family — Phases 0–1

Close or truthfully preserve the remaining baseline gates:

- reviewed integration history and protected merge path;
- durable archival references for canonical source evidence;
- real Node/pnpm/CI gates;
- production capability model and secret/repository protection;
- account inventory;
- LiveKit, complete AI-turn, and composition spikes;
- launch-region and native compatibility decisions.

Then implement:

- trusted Clerk subject binding and lifecycle synchronization;
- family tenancy and additive migration;
- centralized owner/guardian/approved-adult authorization;
- consent-first provisional child slots and protected profiles;
- hashed, expiring, recipient/role/profile-scoped invitations;
- trusted devices and environment-scoped push records;
- versioned consent lifecycle and per-chapter recording acceptance;
- cross-family and action authorization negatives;
- content-free high-risk audit evidence;
- web/mobile authentication, onboarding, roles, consent, child-route boundaries, local adult
  re-authentication, versioned trust/legal notices, and child stop/help controls.

Exit proof: two synthetic adults share one consent-valid synthetic profile through a safe
invitation; revocation immediately denies protected access; every invalid consent state fails
closed; no cross-family access succeeds.

### 4.2 Authorized connected call — Phase 2

Implement:

- typed, versioned, idempotent call lifecycle;
- entitlement, consent, access, conflict, and first-valid-accept checks;
- minimal expiring push/deep-link and web notification delivery;
- server-scoped LiveKit tokens;
- web and native LiveKit adapters;
- explicit unrecorded adult lobby;
- trusted caller confirmation and recent nearby-adult authentication;
- committed handoff where the supervisor unpublishes/leaves before a distinct child identity joins;
- recording authority before setup;
- truthful reconnect, audio-first degradation, duplicate-client handling, and cleanup;
- content-free call metrics.

Exit proof: mobile↔mobile, web↔mobile, and supported web↔web synthetic calls complete the lobby,
handoff, reconnect, and end path, with instrumented proof that no child participant, media, AI, or
recording exists before authority.

### 4.3 Atomic story, then live-safe AI — Phases 3–4

Phase 3 first proves the chapter without live-provider complexity:

- separate chapter, adventure, recording, and composition state;
- immutable five-part seed;
- atomic versioned baton and bounded turn capture;
- monotonic ordered timeline ledger;
- checkpoints, pause/save, ending, and hard limit;
- accessible web/native primitives and authoritative dashboard/story surfaces;
- deterministic Story Director fixtures, version convergence, and approved fallback;
- an eight-turn web/iOS/Android mock-provider E2E.

Only after that exit passes, Phase 4 adds:

- durable typed jobs with claim, lease, heartbeat, retry, cancellation, and dead-letter handling;
- private bounded turn-audio delivery;
- production-capable STT, structured story, moderation, image, and image-safety adapters;
- validation and safety at every child-visible or reused artifact boundary;
- one displayed scene per logical turn under duplicate, stale, timeout, and restart conditions;
- circuit breakers and exact provider capability refusal;
- versioned fallback catalogue and safety evaluation;
- attempt-level usage and cost;
- latency, privacy, and client-bundle/network verification.

Exit proof: one sealed synthetic turn produces one safe synchronized scene; unsafe, malformed, or
unavailable providers produce an approved fallback without ending the human call or leaking raw
content.

### 4.4 Replayable, deletable private memory — Phases 5–6

Phase 5 implements:

- recording start/degraded/stop/recover/store/purge state;
- four logical participant streams using post-authority per-track egress;
- verified, replay-protected, idempotent LiveKit webhooks;
- reconnect segment manifests and authoritative recording timebase;
- private R2 storage and opaque keys;
- recording-boundary integration and recovery;
- asset retention/quarantine;
- immutable deterministic composition manifests;
- a bounded non-root Node/FFmpeg worker;
- verified 720p H.264/AAC replay with captions and degraded intervals;
- atomic final-object publication;
- visible retry/dead-letter recovery;
- authorized Vault, continuation, thumbnails, captions, and per-request media gateway access.

Phase 6 then implements:

- complete deletion target inventory;
- recent-authenticated authorization, immediate quarantine, purge, processor confirmation, and
  reconciliation;
- deletion precedence over AI, composition, export, retry, and retention;
- provider deletion/expiry adapters and backup tombstones;
- free privacy-rights export distinct from commercial media download;
- centralized retention;
- shared redaction;
- web/API security controls and webhook security;
- content-blind support, break-glass controls, monitoring, incident runbooks, threat review, and
  deletion E2E.

Exit proof: a real two-client synthetic chapter produces separate tracks and a verified private
replay after worker recovery; revocation blocks playback; deletion during active work quarantines
immediately, prevents recreation, reconciles absence, and preserves only content-free evidence.

### 4.5 Full beta product and hardened release candidate — Phases 7–8

Phase 7 completes:

- public home, how-it-works, trust, safety, privacy, terms, support, and authentication surfaces;
- full authenticated adult web parity;
- authoritative storage reconciliation;
- idempotent credit ledger;
- provider-independent manual/zero-cost beta entitlements;
- audited time-bounded beta grants;
- server denial of commercial-only archive/download/remaster capabilities;
- devices, notifications, privacy, account, deletion, and plan settings;
- content-free product analytics and unit economics.

Phase 8 proves and deploys:

- complete truthful CI;
- Playwright and Maestro critical paths;
- physical iOS/Android and required browser/device/network matrix;
- WCAG, VoiceOver, TalkBack, keyboard, zoom/dynamic text, and reduced-motion evidence;
- performance/load, chaos/recovery, security, and pinned AI release evaluation;
- production Vercel, Convex, LiveKit, R2, worker, monitoring, and environment isolation;
- EAS profiles and signed iOS/Android candidates;
- incident, deletion, recovery, credential rotation, support, and rollback rehearsals;
- one synthetic post-deploy chapter through replay, deletion, and cost;
- a release evidence bundle tied to one release SHA.

Exit proof: all private-beta P0 tests pass on the release commit, rollback works, and no unresolved
critical/high launch-path defect remains.

## 5. Cross-cutting architecture

### 5.1 Control, media, and worker planes

- Convex remains the authoritative control plane for identities, family authority, consent, calls,
  chapters, turns, events, jobs, entitlements, audit, and deletion state.
- LiveKit transports realtime media and emits track/egress events; it never determines product
  state.
- Private R2-compatible storage holds media and artifacts.
- Clients receive media only through a gateway that re-authorizes each manifest, range, segment,
  caption, and thumbnail request and exposes no origin URL.
- One long-running Node 22 worker initially processes typed AI, composition, export, deletion,
  retention, and reconciliation jobs with separate concurrency and least-privilege credentials.

### 5.2 Authoritative command model

Every critical mutation carries a request/idempotency key, expected resource version, strict payload
version, and trusted actor or service identity. Accepted transitions atomically compare state and
version, apply once, increment version, emit one event, and write high-risk audit metadata.
Unauthorized, stale, duplicate, or invalid commands have no partial side effects.

Deletion and authority loss outrank lower-priority client, provider, billing, composition, export,
and retry events.

### 5.3 Child-media boundary

The adult lobby uses only authenticated adult participant identities and has no egress or AI.
Committed handoff requires current consent, both adult acceptances, recent local adult
authentication, and trusted caller confirmation. The nearby supervisor unpublishes and leaves;
only then may the backend issue a distinct child-mode identity and recording authority.

The recording boundary must be visible, spoken/assistive, and acknowledged at or before the first
captured byte. Setup cannot accept its first choice before recording is confirmed or an explicitly
approved degraded-recording state is active.

### 5.4 AI boundary

Only a sealed submitted-baton interval reaches STT. Story context is bounded to the immutable seed,
age band, approved continuity summary, recent approved beats, and submitted transcript. All
provider output is untrusted until strict schema, safety, de-identification, and publication checks
pass.

OpenAI ZDR approval, STT minimum/zero retention, and image private/no-store controls require real
account evidence; credentials or environment attestations alone do not establish them.

### 5.5 UI and accessibility

Every beta surface in `docs/screen-state-inventory.md` must use authoritative data and implement its
applicable loading, empty, validation-denied, unauthorized, recent-auth, offline/degraded,
retryable, terminal, quarantined/deleted, and accessibility states.

Web and mobile share contracts, validators, state machines, prompts, analytics schemas, and semantic
tokens, but use platform-appropriate components. Mobile is canonical for child handoff. Adult web
and desktop adult call participation remain complete Phase 8 scope.

## 6. Verification design

Each package uses the smallest relevant subset during development, followed by all affected
workspace gates and the root merge gate.

Release evidence must include:

- clean frozen install and real format/lint/type gates;
- unit, property, contract, Convex integration/migration, web E2E, mobile E2E, AI, media,
  security/privacy, and build results;
- authorization negatives for every protected entity;
- state, concurrency, replay, stale, and idempotency tests;
- provider timeout, malformed, outage, privacy, and safety tests;
- two-client reconnect, egress, recording, composition, replay, and deletion evidence;
- browser, physical-device, accessibility, performance, and chaos matrices;
- deployment health and post-deploy synthetic chapter smoke;
- release SHA, build/image identifiers, schema/migration versions, provider/model/prompt/policy
  versions, accepted risks, and rollback instructions.

Screenshots, fixture-only adapters, static demo routes, placeholder commands, successful web builds,
or typecheck-only native code are never completion evidence.

## 7. External and owner gates

Independent implementation continues when these gates are absent, but their exact packages remain
blocked:

- independent protected-branch review and merges;
- durable private archival of canonical source evidence;
- Clerk/Convex linkage, region, schema generation, migrations, backups, indexes, and limits;
- hosted LiveKit project, region, credentials, webhooks, egress, quotas, and device proof;
- Cloudflare/R2 authorization, buckets, policies, lifecycle, gateway, and deletion proof;
- selected worker host, region, secrets, rollout, and rollback;
- OpenAI/Groq/fal credentials, contractual controls, regions, retention/deletion, and real account
  evidence;
- selected production VPC provider and legally approved method;
- privacy-safe Sentry/PostHog projects;
- Vercel production environment/domain authorization;
- EAS, Apple Developer/App Store Connect, and Google Play access, signing credentials, identifiers,
  manifests, disclosures, and signed builds;
- physical iOS/Android hardware or a credentialed device lab;
- owner decisions `DEC-P01`–`DEC-P05` and `DEC-P07`–`DEC-P11` before real child activation.

`DEC-P06` commercial pricing does not block Phase 8 manual or zero-cost beta entitlements.

## 8. Current starting point

The implementation resumes at `ST-102` on `codex/ST-102-family-rbac`.

Current facts that remain below `DONE_VERIFIED`:

- canonical integration PR #2 requires independent review and merge;
- ST-100 and ST-101 are stacked draft PRs with local verification but missing linked/deployed
  Convex evidence;
- the LiveKit and complete AI-turn spikes remain blocked;
- region/native compatibility and physical-device evidence remain open;
- most production services and signing accounts are unconfigured or disconnected;
- ST-102 has in-progress local changes that must be completed, reviewed, verified, and published
  without claiming repo-wide authorization closure.

The first execution step is to finish ST-102 truthfully, then continue through the first ready
canonical package while tracking unresolved earlier external gates explicitly.

## 9. Completion statement

StoryTime may be described as fully working through Phase 8 only after the release commit:

- is deployed to the documented production topology;
- has signed iOS and Android candidates;
- passes the complete synthetic/adult-only chapter, replay, deletion, recovery, and cost path;
- passes every private-beta P0 acceptance gate;
- has no production mock fallback or critical/high launch-path defect;
- has verified monitoring, operations, rollback, and evidence;
- leaves real-child activation blocked until the Phase 9 owner/legal/provider gates are approved.
