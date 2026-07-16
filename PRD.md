# StoryTime Product Requirements Document

| Field             | Value                                           |
| ----------------- | ----------------------------------------------- |
| Document status   | Canonical implementation baseline               |
| Product release   | Private beta, then commercial v1                |
| Version           | 1.0                                             |
| Accountable owner | Omar Al-Bakri; v1 approval not yet recorded     |
| Last updated      | 2026-07-16                                      |
| Repository        | `OmarA1-Bakri/StoryTime`                        |
| Delivery project  | Linear: `StoriTime MVP Build` (legacy spelling) |

This document is the product source of truth for StoryTime. It supersedes the attached **StoryTime MVP PRD v0.4**, the **StoryTime MVP Blueprint**, the static **StoriTime UX Prototype**, the repository's former PRD v0.5 stub, and any Linear ticket that conflicts with it.

The implementation details in [docs/architecture.md](docs/architecture.md), state invariants in [docs/state-machines.md](docs/state-machines.md), release evidence in [docs/acceptance-test-plan.md](docs/acceptance-test-plan.md), and delivery order in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) are normative extensions of this PRD.

## 1. Executive decision

StoryTime turns a live video call between a child and a trusted remote adult into a guided, co-created story chapter and then into a private replayable family memory.

The atomic unit of value is:

> One safely completed, recorded, privately replayable story chapter that the child wants to watch again and the adults feel comfortable preserving.

The human relationship is the product. AI is constrained stage crew: it transcribes submitted turns, advances the shared story, creates safe scene art, and helps assemble the replay. It must never become an autonomous child companion, replace the adult, or dominate authorship.

## 2. Product strategy

### 2.1 Customer problem

Remote parents, grandparents, and trusted family members often rely on generic video calls that are passive, repetitive, and hard for children to sustain. The moments are meaningful but usually disappear when the call ends.

StoryTime provides a repeatable shared activity with a clear beginning, turn-taking ritual, ending, and durable result. It creates both immediate engagement and a growing private family archive.

### 2.2 Initial market

- English-speaking families with children aged 6–10.
- Travelling parents, separated or dual-household families, grandparents, and other trusted remote adults.
- Families using modern iOS, Android, or desktop web devices with stable Wi-Fi or 4G/5G.
- Invite-only private beta before public acquisition.

The `11–12` age band may remain in the data model for forward compatibility, but it is not part of initial positioning or beta acceptance testing.

### 2.3 Value proposition

- For the child: a playful live adventure made with someone they know.
- For the remote adult: a structured way to create genuine connection rather than fill call time.
- For the household owner: an adult-controlled, private, replayable record with clear consent and deletion controls.
- For the business: a recurring family ritual with measurable replay, retention, storage, and premium archive value.

### 2.4 Commercial hypothesis

Families that successfully complete and replay chapters may value more chapter credits, longer private retention, higher-quality replay, convenience media download/original archival, and continuity across adventures.

The private beta uses manual or zero-cost entitlements. Commercial v1 adds centrally managed cross-platform subscriptions after the beta proves chapter completion and replay retention. Prices remain configuration, not hard-coded product logic.

### 2.5 North-star and supporting metrics

The north-star metric is **completed chapters per active family per week**.

Supporting product metrics:

- invited family to first completed chapter conversion;
- consent, notification, handoff, setup, and chapter completion rates;
- successful two-device connection rate;
- median turns and chapter duration;
- seven-day chapter replay rate;
- families completing a second chapter within 14 days;
- baton submission to caption and scene latency;
- recording recovery and composition success;
- deletion completion;
- safety fallback rate;
- cost per completed and replayed chapter;
- subscription conversion and retained paid families after commercial launch.

Analytics must never contain raw child audio, video, transcript, prompt, generated image, full name, or other unnecessary child content.

## 3. Product principles

1. **The relationship stays central.** Both people remain visible or audibly present; generated content supports their interaction.
2. **Adults establish the boundary.** Identity, family trust, consent, recording acceptance, handoff, privacy, deletion, and payment remain adult-controlled.
3. **Child mode stays focused.** It exposes the call, story canvas, constrained choices, baton, safe status, and permitted replay only.
4. **Recording is obvious.** Adults see and accept the boundary; an age-appropriate visible/spoken indicator precedes the first captured byte and remains truthful throughout capture.
5. **Recorded is not the same as sent to AI.** The replay may contain the shared chapter, but STT and LLM processing receive only explicitly submitted baton intervals.
6. **AI failure must not end the relationship.** Safe cached scenes, captions, audio-first mode, and manual continuation preserve the call.
7. **Private by construction.** There is no public profile, search, stranger discovery, feed, advertising, or social sharing.
8. **A chapter must finish.** Work is prioritised vertically until one real chapter can be created, composed, replayed, deleted, and costed on all supported platforms.

## 4. Goals and non-goals

### 4.1 Release goals

- Deliver a complete public website and authenticated adult web application.
- Deliver signed, production-capable iOS and Android applications from the shared mobile codebase.
- Support a trusted remote adult joining from web or mobile.
- Support the child-side supervising adult and child handoff on mobile; responsive web handoff is supported where the browser/device matrix passes.
- Complete the end-to-end chapter loop: invite, consent, call, setup, turns, recording, ending, composition, vault, replay, deletion, and cost ledger.
- Keep state server-authoritative and recoverable through disconnects, duplicate requests, retries, and worker failure.
- Validate all human and AI content before it reaches child mode.
- Prove the experience with at least five internal/test households and then 20 invited beta households.

### 4.2 Explicit non-goals for v1

- General-purpose video calling.
- Independent child accounts or autonomous child use.
- Open-ended child chatbot or AI companion.
- Public child profiles, public stories, social feed, stranger discovery, comments, likes, or public sharing.
- Advertising or behavioural targeting.
- Voice cloning, face generation, or digital replicas.
- Complex 3D worlds, avatars, games, or real-time game engines.
- Physical book fulfilment.
- Group calls with more than two story participants.
- Offline use or a marketing promise of support for unstable low-bandwidth markets.
- Training first-party or provider models on family content.

Basic audio-first degradation and reconnect are reliability requirements, even though low-bandwidth market support is not a v1 promise.

## 5. People, roles, and authority

StoryTime has no child user account. A child profile is a protected record controlled by authenticated adults.

| Role                  | Core permissions                                                                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Family owner          | Create family and child profiles; invite/revoke adults; manage consent evidence; start/supervise chapters; access Vault; request free rights export; use paid media download where entitled; request deletion; manage subscription |
| Guardian              | Manage assigned child profiles and consent; invite only if delegated; start/supervise chapters; access vault; request chapter/profile deletion                                                                                     |
| Approved adult        | Start or receive chapters for assigned child profiles; participate in calls; access permitted replays; no family ownership, consent administration, or account deletion                                                            |
| Nearby supervisor     | Per-session role held by an authenticated owner, guardian, or approved adult on the child's device; confirms remote caller, recording boundary, and handoff                                                                        |
| Child participant     | Uses child mode after handoff; chooses story inputs, holds/submits baton, and views permitted content; no account, settings, billing, invitations, export/download, or deletion controls                                           |
| Support operator      | Content-blind operational diagnostics by default; cannot browse family media                                                                                                                                                       |
| Privacy administrator | Processes scoped privacy requests and processor confirmations; can see metadata required for the request, not unrestricted family content                                                                                          |

All family access is derived on the server from active grants. A client-supplied `familyId`, `profileId`, role, or entitlement is never sufficient authorization.

High-risk actions require recent adult authentication: changing family roles, withdrawing consent, rights export, media download, deletion, billing changes, and exiting child mode.

## 6. Platform scope

### 6.1 Public website

The website must include:

- home and product explanation;
- how the private chapter flow works;
- trust, safety, recording, AI, and privacy explanations;
- pricing/plan presentation driven by configuration;
- support/contact;
- privacy notice, child privacy notice, terms, processor list, retention summary, and deletion instructions;
- authenticated sign-in/sign-up entry points;
- no fake metrics, fake customer logos, or unverified legal claims.

### 6.2 Authenticated web application

The responsive web app must support:

- adult onboarding and family setup;
- child profiles and approved-adult invitations;
- consent status and renewal;
- dashboard/presence and chapter initiation;
- desktop remote-adult call participation;
- supported-browser nearby-supervisor flow;
- Memory Vault, processing/recovery state, replay, continuation, deletion, free rights export, entitled media download, storage, credits, billing, notifications, and privacy settings;
- privacy-safe operational status for the account's own chapters.

### 6.3 iOS and Android

The mobile app must support the full adult and child experience:

- adult authentication and onboarding;
- push/deep-link call delivery;
- family, child, invitation, consent, storage, and subscription management;
- incoming/outgoing calls;
- local adult verification and child handoff;
- camera, microphone, notification, local biometric, and recording permission flows;
- live story room, fallback, checkpoint, pause, ending, and recovery;
- Vault, replay, continuation, deletion, free rights export, media-download entitlement, and settings.

Mobile remains the canonical child-side client. Expo development builds/prebuild are acceptable; Expo Go compatibility is not a requirement.

## 7. Core journeys

### 7.1 First family setup

1. Adult creates or signs into an account.
2. Adult creates a family and accepts current adult terms/privacy notices without supplying child personal data.
3. Adult supplies only the jurisdiction/age-band eligibility input required to complete verifiable parental consent for an expiring provisional child slot.
4. After consent is verified, the adult creates the protected child profile using display name, age band, avatar, and bounded story preferences.
5. Adult optionally invites another trusted adult with an explicit role and expiry.
6. Invited adult authenticates and accepts the grant.
7. The dashboard shows readiness and clearly explains any missing gate. An abandoned provisional slot expires without becoming a named child profile.

### 7.2 Start and hand off an Adventure Call

1. An approved remote adult chooses the child profile and available supervising adult/device.
2. The server validates access, consent, entitlement, session limits, and conflicting calls.
3. StoryTime creates the pending session and sends an expiring push/deep link.
4. The nearby adult accepts and authenticates locally.
5. Both adults enter an unrecorded adult-only lobby under adult participant identities and confirm each other's trusted identity.
6. Both accept the per-session recording notice; the nearby adult confirms the child handoff.
7. The nearby-supervisor participant stops publishing and leaves. The same device enters locked child mode under a distinct, server-authorized child participant identity.
8. The server issues scoped child publication and recording authority and begins the visible recording boundary before the first story-setup choice.

Declined, missed, cancelled, expired, already-answered, permissions-denied, and reconnect paths must be explicit.

### 7.3 Build and play a chapter

1. Participants alternate choosing character, setting, problem, tone, and visual format.
2. The server locks one immutable, versioned seed for the chapter.
3. The server opens the first baton.
4. The holder speaks while both participants remain connected.
5. The holder submits the turn. Only that bounded audio interval is sent to STT/AI.
6. StoryTime acknowledges immediately, transcribes, moderates, directs the story, generates/moderates the scene, persists it, and publishes one versioned update to both clients.
7. A safe theatrical loading state appears during processing; timeout yields an approved fallback without blocking the next turn.
8. The baton passes atomically.
9. A private adult checkpoint offers continue, pause and save, create an ending, or end now.

### 7.4 Finish, compose, replay, and continue

1. An adult chooses pause/save, ending, or end.
2. New turns close; recording stops once; raw tracks and the event ledger are finalised.
3. A durable, idempotent composition job is queued.
4. The Vault shows processing, recoverable failure, or ready status.
5. The worker builds the canonical replay from raw tracks, approved scenes, captions, and ordered events.
6. Verification checks duration, decodability, checksums, and audio/video sync before publication.
7. Authorized adults and permitted child mode can replay the private chapter.
8. A later chapter may continue the adventure using a bounded continuity summary, never the entire raw transcript by default.

### 7.5 Delete

1. Authorized adult re-authenticates and selects chapter, child profile, family, or account scope.
2. StoryTime shows the exact effects and any statutory/minimal audit data that will remain.
3. The server quarantines the resource immediately: new authorization, new playback sessions, and unfetched media ranges/segments are denied while an idempotent deletion job starts. Bytes already delivered to an authorized device cannot be recalled.
4. Active database content, raw tracks, generated assets, replay assets, cached URLs, search/analytics content, and downstream processor copies are purged or expiry-confirmed.
5. A content-free audit record stores request identity, scope, timestamps, result, and failure code.
6. The user sees completion or a supportable partial-failure state.

## 8. Functional requirements

### 8.1 Identity, families, and invitations

- **ST-ID-001:** Only authenticated adults can create or access a family.
- **ST-ID-002:** Adult identity is mapped from the configured identity provider to one internal user record; duplicate webhook/retry delivery is idempotent.
- **ST-ID-003:** Every protected query and mutation verifies active family/profile access server-side.
- **ST-ID-004:** Invitations are single-use, hashed at rest, role-scoped, expiring, revocable, and auditable.
- **ST-ID-005:** Removing an adult invalidates active sessions, room-token refresh, media playback access, and future replay access. During an active chapter it stops new turns/AI publication, ends the call, and stops recording.
- **ST-ID-006:** Child profiles cannot authenticate, receive general app navigation, or be publicly addressable.
- **ST-ID-007:** Local biometric/device authentication confirms the nearby adult; it does not identify the remote caller.
- **ST-ID-008:** Production does not persist a named child profile before verified parental consent. A consent attempt uses a content-minimized provisional slot with an expiry and no reusable public identifier.
- **ST-ID-009:** Production adult enrollment enforces the owner-approved adult eligibility/age-assurance and guardian-authority policy; unresolved custody/authority disputes block affected child sessions and enter the support process.

### 8.2 Consent and recording authority

- **ST-CN-001:** Consent is a separate, versioned domain record; account authentication is not consent.
- **ST-CN-002:** The consent record includes guardian, child profile, scope, method/provider, evidence reference, notice/terms versions, jurisdiction configuration, verification time, expiry, withdrawal, and status.
- **ST-CN-003:** Production child-facing sessions fail closed when consent is missing, pending, expired, revoked, rejected, superseded, or supplied by a mock provider.
- **ST-CN-004:** Each participating adult accepts the current recording notice for each chapter before capture.
- **ST-CN-005:** No child media is published, persisted, transcribed, or sent to AI before the consent and handoff boundary.
- **ST-CN-006:** Consent expiry, withdrawal, or supersession blocks new sessions and, during an active chapter, atomically stops new turns/AI publication, revokes room-token refresh, ends the call, stops recording, and starts the configured retention/deletion workflow.
- **ST-CN-007:** Recording indicators remain visible and screen-reader accessible while recording is active.
- **ST-CN-008:** Before capture, child mode presents an age-appropriate recording/AI explanation and a persistent stop/help control. A child stop request blocks new turns/AI, stops recording through the server state machine, ends or pauses safely, and alerts the participating adults.

### 8.3 Call delivery and real-time media

- **ST-CL-001:** A call targets one child profile, one remote adult, and one nearby supervisor/device.
- **ST-CL-002:** Push/deep links expire, deduplicate, and resolve already-answered/cancelled state safely.
- **ST-CL-003:** Live room tokens are server-signed, short-lived, session/room/identity scoped, and grant only the participant's required publish/subscribe permissions.
- **ST-CL-004:** The server atomically controls accept, join, handoff, start-recording, and end transitions.
- **ST-CL-005:** Clients expose joining, permission denied, reconnecting, participant lost, audio-first, retrying, ended, and recoverable failure states.
- **ST-CL-006:** Audio is prioritised. Under degraded conditions, StoryTime may suspend video and reduce image cadence while clearly reporting the change.
- **ST-CL-007:** Duplicate clients or stale session versions cannot create duplicate participants, recordings, or chapters.
- **ST-CL-008:** A remote adult can participate from supported web, iOS, or Android clients.
- **ST-CL-009:** The nearby adult may publish adult media in the explicitly adult-only, unrecorded lobby. No child-mode participant or child publication grant exists before authority. After the committed handoff transition, the supervisor participant unpublishes/leaves and the backend issues a distinct, scoped child participant identity; adult-lobby media is never included in chapter recording.

### 8.4 Setup, baton, and turns

- **ST-ST-001:** Setup captures exactly five required categories: character, setting, problem, tone, and visual format.
- **ST-ST-002:** Seed choices are attributable, validated against an approved catalogue or moderated custom value, and immutable after server lock.
- **ST-ST-003:** Baton ownership and version are server-authoritative.
- **ST-ST-004:** Only the current holder can open, submit, cancel, or pass a turn.
- **ST-ST-005:** Submission is idempotent and binds speaker, chapter version, server sequence, and recording-relative audio interval.
- **ST-ST-006:** Live transport may remain open, but only the submitted interval is provided to STT and downstream AI.
- **ST-ST-007:** Both clients receive the same ordered scene version; late and duplicate updates are ignored.
- **ST-ST-008:** Checkpoint, pause, ending, hard end, participant departure, and timeout behaviour follow the canonical state machines.

### 8.5 AI story pipeline

- **ST-AI-001:** Provider calls occur only from trusted server/worker contexts; provider keys never ship to clients.
- **ST-AI-002:** STT receives one bounded baton audio asset/interval and returns transcript, language, confidence where available, duration, provider, and model/version.
- **ST-AI-003:** Transcript safety runs before story generation.
- **ST-AI-004:** Story Director input is limited to the locked seed, age band, approved continuity summary, recent approved beats, and the submitted transcript.
- **ST-AI-005:** Story Director output is schema-validated and includes story beat, child-safe caption, image prompt, next-turn prompt, bounded continuity summary, and safety disposition.
- **ST-AI-006:** Transcript, story beat, caption, next-turn prompt, image prompt, continuity summary, and generated image pass their applicable safety and de-identification gates before child publication or later reuse.
- **ST-AI-007:** Invalid, unsafe, unavailable, or timed-out output is replaced by an approved fallback; raw provider errors and blocked content are never shown in child mode.
- **ST-AI-008:** Prompt, policy, provider, and model versions are recorded with the artifact without logging unnecessary child content.
- **ST-AI-009:** The AI must not claim sentience, request secrecy, solicit personal information, move the child off-platform, provide adult themes, or act as a therapist/authority.
- **ST-AI-010:** Family content is not used for first-party or provider model training.
- **ST-AI-011:** A provider that may receive personal data from a child under 13 is disabled until its child-data eligibility, contractual terms, region, retention, deletion, and zero-data-retention configuration are approved and verified. For OpenAI, `store: false` is necessary but does not replace approved Zero Data Retention.
- **ST-AI-012:** Submitted-turn audio is delivered to STT as a bounded closed clip through a private upload or very short-lived signed URL; provider retention is minimized and Zero Data Retention is enabled where supported.
- **ST-AI-013:** Image prompts are de-identified. Image generation uses no-store/private settings, accepted output is copied immediately into private StoryTime storage, and no provider CDN URL is exposed to a client.
- **ST-AI-014:** The safety gateway computes the authoritative allow/replace/block result from validated policy checks; model-produced `safetyDisposition` is advisory input and cannot approve itself.

### 8.6 Recording, ledger, and recovery

- **ST-RC-001:** StoryTime targets four logical raw streams during the recorded chapter: remote-adult audio, remote-adult video, child audio, and child video. Each track/reconnect segment is captured separately and recorded in a deterministic manifest with explicit ownership and timing metadata.
- **ST-RC-002:** The pre-handoff adult lobby is not recorded; the chapter boundary begins at setup after all gates.
- **ST-RC-003:** The event ledger uses a monotonically increasing server sequence, recording-relative timestamp, wall-clock timestamp, event version, idempotency key, actor, and minimal validated payload.
- **ST-RC-004:** Required events include recording start/stop, participant join/leave/reconnect, handoff, seed choice/lock, baton open/submit/pass, transcript complete, scene/fallback published, network mode change, checkpoint, pause/end, track finalised, composition state, replay ready/failure, and deletion state.
- **ST-RC-005:** Track and webhook processing is idempotent and tolerates late/out-of-order delivery.
- **ST-RC-006:** A crash, process restart, or transient disconnect leaves enough durable state to finalise or retry the completed portion.
- **ST-RC-007:** Raw media bytes live in private object storage; Convex stores metadata and access state, not large media blobs.
- **ST-RC-008:** No stable or origin-signed media URL is exposed to a client. An authorization-checking media gateway serves manifests and range/segment requests through short-lived audience/resource-bound playback sessions and rechecks quarantine/revocation on every request.

### 8.7 Composition and Memory Vault

- **ST-MV-001:** Composition jobs have deterministic input manifests, versioned render templates, atomic claims, bounded retry, heartbeat/lease expiry, cancellation, and dead-letter/recovery state.
- **ST-MV-002:** The canonical beta rendition is a landscape replay showing the approved story scene, both participant tracks where available, speaker identity, captions, and recording/network state changes without pretending missing media exists.
- **ST-MV-003:** Composition verification checks file decode, expected duration tolerance, audio presence, audio/video sync, checksum, and private storage before marking ready.
- **ST-MV-004:** The Vault lists adventure, chapter number, duration, participants, scene count, processing/recovery status, storage, created date, and available actions.
- **ST-MV-005:** Processing failure remains visible and retryable; it never silently discards raw inputs.
- **ST-MV-006:** Replay authorization and resource state are rechecked on every manifest, media range, or segment request; quarantine denies unfetched bytes immediately.
- **ST-MV-007:** Continuation uses a safe bounded summary and selected continuity metadata.
- **ST-MV-008:** Download, original-quality archive, extended retention, and remaster actions are entitlement-gated; basic private cloud replay is part of beta.
- **ST-MV-009:** Replays preserve human provenance: recorded voices and reactions remain primary, generated scenes/captions are labelled as AI-assisted, no voice is cloned, and the edit does not imply a participant said or did something absent from the source tracks and ledger.

### 8.8 Notifications, settings, entitlements, and support

- **ST-OP-001:** Device push tokens are per adult/device, revocable, environment-scoped, and excluded from client analytics.
- **ST-OP-002:** Notification preferences cannot disable legally or operationally required consent, privacy, security, recording, or deletion messages.
- **ST-OP-003:** Entitlements are server-authoritative and converge mobile-store, web-billing, promotional, and manual beta grants.
- **ST-OP-004:** Credit debit and restoration are idempotent and tied to a chapter lifecycle.
- **ST-OP-005:** Storage usage is calculated from authoritative assets and reconciled periodically.
- **ST-OP-006:** The system records provider units, price version, estimated/actual cost where available, storage, composition compute, and replay bandwidth per chapter.
- **ST-OP-007:** Operational tooling exposes metadata, job state, retries, and redacted error codes without default access to child content.
- **ST-OP-008:** Public legal/trust pages and in-product notices share version identifiers with stored consent records.
- **ST-OP-009:** A critical unsafe-output or safeguarding incident disables affected capability/cohort, preserves content-minimized evidence, and follows the approved adult disclosure, review, escalation, and reporting runbook before re-enable.

### 8.9 Privacy rights

- **ST-PR-001:** Authorized adults can view their data, request a legally required data-access/portability export without a paid entitlement, withdraw consent, and request deletion from web and mobile.
- **ST-PR-002:** Deletion propagates across database records, private objects, derivatives, caches, analytics, and configured processors.
- **ST-PR-003:** The chapter ledger is append-only while retained but is deleted with the chapter; only content-free compliance evidence survives.
- **ST-PR-004:** Failed or partial deletion is visible to operators and the requester and is retried/reconciled.
- **ST-PR-005:** Retention rules are configuration with safe defaults and policy versioning, not scattered constants.
- **ST-PR-006:** A privacy-rights export is separate from a convenience media download, original-quality archive, or remaster. Commercial media capabilities may be entitlement-gated; required rights access may not be paywalled.

## 9. UX and content requirements

The canonical visual direction is the supplied warm cream/violet prototype:

- adult surfaces: warm cream base, white panels, violet primary actions;
- live story: night/violet environment, persistent red recording indicator;
- wonder accents: gold, rose, mint, and sky;
- large rounded cards, full-width pill actions, expressive but controlled illustration;
- theatrical child-safe loading language such as “The storybook is painting your idea.”

Production UI must:

- use semantic shared tokens, with separate native and web components;
- meet WCAG 2.2 AA on adult web surfaces;
- support dynamic type, screen readers, keyboard navigation on web, visible focus, reduced motion, and non-colour-only state;
- maintain at least 44×44pt touch targets;
- use explicit disabled/loading/retry/destructive-confirmation states;
- avoid manually drawn OS chrome and meaning-bearing emoji as production icons;
- never label local biometric confirmation as remote-person identity verification;
- avoid frightening, blaming, or technical child-facing error text.

The complete required inventory is [docs/screen-state-inventory.md](docs/screen-state-inventory.md), with proof in the implementation and acceptance plans. Static prototype HTML is visual evidence only and is not production code.

## 10. Non-functional requirements and service objectives

These are beta targets and release gates, not vendor guarantees.

| Area                        | Target                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Supported mobile            | iOS 16+ and Android 10+ on a maintained real-device matrix                                                                             |
| Supported web               | Latest two stable major versions of Chrome, Safari, and Edge; Firefox best effort until certified                                      |
| Connection success          | ≥98% of valid two-device attempts on the supported network/device matrix                                                               |
| Join latency                | P95 from accept to subscribed media ≤10 seconds                                                                                        |
| Interaction acknowledgement | P95 local submit acknowledgement ≤300 ms                                                                                               |
| AI text latency             | P95 submitted turn to approved caption/story beat ≤5 seconds                                                                           |
| Scene latency               | P95 submitted turn to approved scene or safe fallback ≤12 seconds                                                                      |
| Composition                 | ≥99% automated success for valid manifests; P95 ready within 5 minutes                                                                 |
| Replay sync                 | Audio/video alignment within ±250 ms                                                                                                   |
| Recording recovery          | A client disconnect of ≤60 seconds or worker restart does not lose already finalised segments                                          |
| Availability                | 99.5% monthly for the beta control plane, excluding announced maintenance                                                              |
| Private playback            | No origin URL in clients; session ≤5 minutes; authorization on every manifest/range/segment; no public bucket/object access            |
| Deletion                    | New access and unfetched playback bytes denied immediately; active systems/processors complete within 24 hours; backup expiry ≤30 days |
| Cost accounting             | Monthly provider reconciliation within ±5%                                                                                             |
| Accessibility               | Zero critical automated violations and completion of the manual assistive-technology checklist                                         |

Default product limits, configurable by entitlement:

- target chapter duration: 10–15 minutes;
- first adult checkpoint: 15 minutes; subsequent continuation in 5-minute increments;
- hard chapter duration: 30 minutes;
- maximum submitted turn: 60 seconds;
- maximum two active human participants;
- basic beta vault: 10 GB per family;
- raw tracks retained for seven days after verified replay, or up to 30 days for a recoverable failure, before policy-driven purge.

The final public-launch jurisdiction, consent provider, retention schedule, price points, and provider contractual settings require owner approval and appropriate legal review. They do not block building the configurable mechanisms or running synthetic/internal testing; they do block collecting real child data in public production.

## 11. Security, privacy, and safeguarding invariants

- Fail closed on identity, access, consent, entitlement, recording authority, signed-media access, and child-content safety.
- Encrypt transport and provider connections; use private encrypted storage and least-privilege service identities.
- Verify Clerk, LiveKit, billing, storage, and consent-provider webhook signatures and make handlers idempotent.
- Never expose provider, storage, database, signing, or service credentials to web/mobile clients.
- Never log bearer tokens, signed URLs, raw transcripts, prompts, family media, or unnecessary personal information.
- Isolate development, preview, and production identities, rooms, buckets, Convex deployments, billing, push credentials, and analytics.
- Use synthetic families and media in automated tests.
- Require short-lived authorization for support break-glass access, with owner-visible audit.
- Maintain an incident path for unauthorized access, unsafe output, lost media, deletion failure, and provider compromise.

The full control set and retention/data map are in [docs/security-privacy.md](docs/security-privacy.md).

## 12. Analytics and unit economics

Required funnel events use stable IDs and enumerated properties:

- account/family/child setup;
- invitation sent/accepted/revoked;
- consent started/verified/failed/withdrawn;
- call created/notified/accepted/joined/handoff/recording/ended;
- seed locked;
- turn submitted/caption published/scene published/fallback;
- checkpoint action;
- composition queued/retried/ready/failed;
- Vault replay/continue/rights-export/media-download/delete;
- entitlement/credit/storage state;
- deletion requested/completed/failed.

Required chapter cost ledger:

- STT seconds and provider/model;
- LLM input/output tokens or billable units;
- moderation calls;
- image calls and output size/tier;
- LiveKit participant and egress minutes;
- raw/replay storage byte-days;
- composition CPU/GPU seconds;
- replay egress bandwidth;
- notification delivery count;
- total estimated and reconciled cost.

No raw family content is an analytics property.

## 13. Release definitions

### 13.1 Walking-skeleton complete

Two authenticated adults can create a synthetic child profile, satisfy a test consent gate, join the same unrecorded room, confirm handoff, complete one mock turn, end, and see a placeholder chapter record with authoritative state.

### 13.2 Feature-complete private beta

- Real web, iOS, and Android builds complete the chapter journey.
- Production-capable identity, LiveKit, storage, STT, Story Director, image, safety, and worker adapters are integrated without mock fallback in production.
- Production provider data controls pass the under-13 eligibility gate, including approved OpenAI Zero Data Retention before any child transcript/story processing, STT minimum-retention configuration, and private/no-store image generation.
- Raw recording, ledger, verified composition, private replay, recovery, deletion, and cost accounting work end-to-end.
- All P0 release tests pass.
- Legal/trust surfaces are implemented but marked pending final jurisdiction/provider review where appropriate.
- Internal synthetic and adult-only pilot passes before any child data.
- Manual or zero-cost beta entitlements enforce credits/storage/capabilities; RevenueCat, Stripe, paid pricing, and checkout are not private-beta blockers.

### 13.3 Beta-ready

- Five internal/test households complete the device/network matrix.
- No open critical/high security, consent, recording, deletion, child-safety, or data-loss defect.
- Operational alerts, runbooks, rollback, backups, processor inventory, and support path are verified.
- Owner approves launch jurisdiction, VPC method, notices, processor terms, retention, app-store privacy disclosures, and beta cohort.

### 13.4 Commercial v1 complete

- 20 invited beta households complete the defined observation period.
- Subscription and entitlement paths work across web, iOS, and Android.
- Conversion, replay retention, reliability, safety, and unit economics meet owner-approved thresholds.
- App Store, Play Store, web production, worker, Convex, LiveKit, storage, monitoring, and support are production operational.

## 14. Dependencies and owner decisions

The implementation proceeds using the defaults in this document. The following are explicit pre-production decisions rather than excuses to leave code incomplete:

1. Initial public launch jurisdiction(s) and legal entity/controller details.
2. Production verifiable parental-consent provider and evidence method.
3. Provider contracts/settings for child data, retention, training prohibition, deletion, and region, including approved OpenAI Zero Data Retention, Groq Zero Data Retention, and fal private/no-store behavior before those adapters receive real child data.
4. Final retention and backup schedule.
5. Apple Developer and Google Play Console access, app category, age rating, and privacy disclosures.
6. Final subscription catalogue, prices, trials, refunds, and tax handling.
7. Support contact, incident owner, and privacy request contact.
8. Adult eligibility/age assurance, guardian-authority evidence, approved-adult limits, and custody/dispute escalation.
9. Age-appropriate child notice, assent/stop/help behavior, and adult response when a child wants recording to stop.
10. Safety-incident disclosure/escalation, content-review authority, mandatory-reporting analysis, and family notification.
11. Whether retaining raw child audio/video after verified replay remains necessary and proportionate.

If an owner decision is unavailable, the implementation must remain configurable, use synthetic data, document the blocked public-launch gate, and continue all independent work.

## 15. Source reconciliation decisions

| Conflict                                          | Canonical decision                                                                                                          |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| StoryTime vs StoriTime                            | `StoryTime` everywhere; the existing Linear project name is a legacy typo                                                   |
| Mobile-only sources vs requested complete product | Mobile is canonical for child handoff; full public/adult web and desktop adult call participation are in scope              |
| Low-bandwidth deferred vs fallback prototype      | Basic audio-first degradation/reconnect is required; low-bandwidth market support is not promised                           |
| “Video never stops” vs real failure               | UI reports actual video/recording state; audio is prioritised                                                               |
| Live recorder mockup vs raw-track requirement     | Mockup defines asynchronous replay layout; live RoomComposite is not the default recording method                           |
| Immutable ledger vs deletion                      | Append-only while retained; chapter content/ledger are deletable; only content-free audit evidence survives                 |
| Cloud backup “later” vs cloud Vault               | Capped private cloud replay is core; convenience download/original archive/remaster are entitlements; rights export is free |
| AI listens only to baton vs full recording        | The shared chapter may be recorded; only submitted baton intervals go to STT/LLM                                            |
| Face ID wording                                   | Local biometric confirms the nearby guardian, not the remote adult                                                          |
| Repo PRD v0.5 vs supplied PRD v0.4                | This v1.0 document supersedes both                                                                                          |

## 16. Requirement precedence and change control

Precedence is:

1. this PRD;
2. security/privacy invariants and state machines;
3. architecture and API/data contracts;
4. acceptance test plan;
5. implementation plan;
6. current Linear issues;
7. historical PDFs, prototype, old notes, and comments.

A change that affects child data, recording boundary, role authority, deletion, safety, external sharing, public scope, or commercial commitment requires a decision-log entry and owner approval. Routine implementation choices within these boundaries do not.
