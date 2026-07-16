# StoryTime Security, Privacy, and Safeguarding Specification

| Field        | Value                                                         |
| ------------ | ------------------------------------------------------------- |
| Status       | Normative engineering baseline; legal approval still required |
| Version      | 1.0                                                           |
| Last updated | 2026-07-16                                                    |

StoryTime processes recordings and generated content involving children. Privacy and safeguarding are product invariants, not a post-launch compliance task.

This document defines the technical minimum. It is not a substitute for jurisdiction-specific legal advice, contracts, privacy notices, app-store disclosures, or an approved incident process.

## 1. Launch posture

- Private, invite-only beta.
- One approved launch jurisdiction/configuration at a time.
- No real child data until the production consent method, notices, provider terms, retention configuration, and owner launch checklist are approved.
- Synthetic or adult-only test media before that gate.
- No public profiles, public sharing, stranger discovery, ads, behavioural targeting, or training on family content.
- Production fails closed if identity, consent, recording, storage, AI safety, or deletion capabilities are missing or configured as mock.
- Production also fails closed if a child-data processor's required zero-retention/private-output capability is absent, expired, or unverified.

## 2. Data classification

| Class                           | Examples                                                                                                                     | Rules                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Restricted child/family content | Child/adult audio/video, submitted-turn audio, transcripts, names in story content, generated images tied to a child, replay | Private encrypted storage; least privilege; per-request gateway access; never general logs/analytics; deletion propagation |
| Restricted credentials          | Clerk/Convex/LiveKit/R2/provider/billing/push secrets, signing keys, tokens, signed URLs                                     | Secret manager only; never clients/repo/logs; rotate and scope by environment                                              |
| Confidential identity/consent   | Adult email/identity ID, family roles, child profile, consent evidence reference, push token                                 | Field minimization; server authorization; encrypted transport/storage; audited high-risk access                            |
| Confidential operational        | Provider attempt IDs, job errors, room/track IDs, device ID, IP/security events                                              | Redact/minimize; retention limit; role-scoped support access                                                               |
| Internal product telemetry      | Enumerated funnel/state/latency/cost events with opaque IDs                                                                  | No raw content or direct child identity; aggregate access                                                                  |
| Public                          | Marketing, approved legal/trust pages, non-sensitive product documentation                                                   | Review before publish; no secrets/customer data                                                                            |

Generated content remains restricted when it is associated with a family/chapter.

## 3. Data minimization

Collect only what is required for the chapter, authorization, safety, replay, support, billing, or a documented legal obligation.

- Before verified VPC, retain only an expiring provisional child slot with the minimum jurisdiction/age-band eligibility fields needed for the consent workflow; no name, avatar, story preference, reusable public ID, or media.
- After verified VPC, the child profile uses display name or nickname, age band, avatar key, and bounded preferences; date of birth is not required for v1.
- Do not collect a child email, phone number, social handle, advertising ID, precise location, contacts, or independent credentials.
- Story prompts should not solicit real addresses, school, medical details, secrets, or contact information.
- AI context uses approved recent beats and a bounded continuity summary, not the entire family archive by default.
- Support and analytics use opaque IDs, state, timestamps, versions, latency, cost, and redacted error code.
- Consent evidence details stay with the selected provider where possible; StoryTime stores reference, method, scopes, status, versions, and timestamps.

## 4. Retention baseline

Retention is centrally configured and versioned. These beta defaults require legal/owner ratification before real child data:

| Data                                                         | Default                                                                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Pending call/session without recording                       | Purge after 24 hours, except content-free abuse/security evidence                                                         |
| Submitted turn temporary audio                               | Purge after approved transcript/scene and replay verification, no later than raw-track policy                             |
| Raw participant tracks after verified replay                 | 7 days                                                                                                                    |
| Raw tracks for recoverable/failed composition                | Up to 30 days while an active recovery case exists                                                                        |
| Verified replay, approved scenes, captions, chapter metadata | Until user deletion, consent-driven policy, or entitlement retention expiry                                               |
| Full transcript                                              | Retain only if required for replay/continuity and disclosed; otherwise derive approved summary then purge with raw window |
| Provider request/response content                            | Minimum provider-supported retention; no training; contract/configuration verified                                        |
| General application logs                                     | 30 days, content-free                                                                                                     |
| Security/audit metadata                                      | Configured legal/security period; content-free                                                                            |
| Backups                                                      | Encrypted; expiry ≤30 days; deleted content not restored to active systems                                                |
| Failed deletion diagnostics                                  | Until resolved plus the content-free audit period; no family media copied into the ticket/log                             |

Retention jobs produce counts and exceptions. Expired data is quarantined before purge and cannot receive new playback sessions or media-gateway ranges/segments.

## 5. Authorization

### 5.1 Server-side policy

Every protected operation checks:

1. authenticated internal adult identity;
2. active family membership/access grant;
3. capability for the adult role;
4. resource belongs to the authorized family/profile;
5. recent authentication for high-risk actions;
6. current consent and per-session acceptance where child media is involved;
7. state-machine precondition;
8. entitlement only after authorization;
9. rate/risk control.

Clients cannot grant themselves roles, family IDs, consent, child mode, room grants, replay access, credits, or deletion authority.

### 5.2 High-risk actions

Require recent authentication and audit:

- family ownership/role change or adult revocation;
- consent grant/withdrawal;
- child-profile deletion;
- chapter/family/account deletion;
- export/download;
- billing/refund;
- exit from child mode into adult controls;
- support break-glass access.

### 5.3 Revocation

Revocation denies:

- new Convex/BFF requests;
- room-token issue/refresh;
- pending call acceptance;
- new playback sessions and every unfetched media range/segment;
- push delivery where no longer authorized;
- future replay and export.

The client never receives an origin-presigned media URL. Gateway playback sessions expire in ≤5 minutes, and authorization/resource state is checked for every request so quarantine denies unfetched bytes immediately. Bytes already delivered to an authorized device cannot be recalled. Critical incidents may rotate playback/signing/provider keys and quarantine objects.

## 6. Consent and recording

- Adult login is not verifiable parental consent.
- Consent is scoped to child profile and processing purposes and stores policy/notice versions.
- Both participating adults accept a per-chapter recording notice.
- Nearby adult authenticates, confirms the trusted caller, and confirms handoff.
- The adult lobby is unrecorded.
- No child media is published, persisted, transcribed, or sent to AI before server-derived recording authority.
- A persistent visible and assistive recording indicator remains active; recording failure/degradation is reported truthfully.
- Consent expiry, withdrawal, or supersession blocks new sessions. During a live chapter it also revokes token refresh, stops new turns and AI publication, transitions the call toward ending, stops recording, and starts the configured data workflow.
- Provider callbacks are verified and idempotent.
- Mock consent is prohibited in production.

Custody/authority disputes cannot be solved purely in code. The public beta requires an owner-approved policy and support escalation path before accepting real families.

## 7. Child mode

Child mode permits only:

- current trusted call;
- setup choices;
- baton capture/submit/cancel;
- approved story scene and prompt;
- age-appropriate connection/recording/fallback status;
- private checkpoint outcome relevant to the child;
- permitted replay.

It blocks:

- account/family/profile management;
- invitations and adult identities;
- consent evidence;
- settings, billing, storage, export, deletion, support diagnostics;
- external links, public sharing, unrestricted text input, or provider error detail.

Adult re-authentication is required to exit. Navigation guards exist at route, component, and server API layers.

## 8. Media security

- Buckets deny public access and object listing.
- Environment-specific least-privilege service identities.
- TLS for all upload/download/provider paths.
- Signed read URLs are single-resource or narrowly scoped and live ≤15 minutes.
- Signed URLs, storage keys containing sensitive names, and credentials are never logged.
- Object keys are opaque and contain no family/child display name.
- Upload metadata validates expected owner, content type, size, checksum, and state.
- Replay publication is atomic only after verification.
- Deletion quarantines access before purge.
- Worker scratch is isolated per job, size-bounded, not backed up, and cleaned in success/failure.
- Media parsers/FFmpeg run with bounded resources and untrusted-input precautions.

## 9. AI safety and privacy

### 9.1 Input/output boundary

- Only the submitted baton interval goes to STT/Story Director.
- Provider keys and calls are server-side.
- Context is minimized and length-bounded.
- All provider output is untrusted until schema validation and safety approval.
- Next-turn prompts and continuity summaries are safety-checked and de-identified before persistence or reuse; model self-declared safety is never authoritative.
- Generated images are held private and not shown until approved.
- Raw blocked content is not copied to ordinary logs, analytics, Linear, GitHub, or support chat.

Provider-specific launch controls, verified against current primary documentation:

- **OpenAI:** approved Zero Data Retention is required before personal data from a child under 13 is sent. Set the request's non-storage option too, but do not treat it as a substitute for ZDR.
- **Groq STT:** enable Zero Data Retention, send only a sealed baton clip through a private upload or very short-lived URL, and delete temporary delivery objects promptly.
- **fal image generation:** remove names and other direct identifiers from prompts; disable provider I/O storage, use private/hidden file access, copy approved output to private R2 immediately, and never expose a provider media URL.
- Re-verify processor terms, sub-processors, regions, deletion, breach notice, and training/data-use settings before activation and at a configured interval.

### 9.2 Prohibited behaviour

The product and prompts prevent:

- sexual, violent, self-harm, hateful, exploitative, frightening, or adult content;
- grooming patterns, requests for secrecy, off-platform contact, personal data, or real-world meetings;
- claims of being a human/friend/parent/therapist/authority;
- manipulation, shame, harsh correction, diagnosis, or dangerous instructions;
- imitation/voice cloning of a real person;
- exposing moderation language or blocked details to the child.

### 9.3 Safe failure

Every live turn has a pre-approved fallback scene/caption. Timeout, invalid schema, provider outage, safety block, or image failure must resolve to:

- approved replacement and continued baton;
- age-appropriate audio/story-only continuation; or
- gentle adult-controlled ending.

There is no raw “try another model until something passes” loop.

### 9.4 Evaluation

Maintain versioned synthetic evaluation sets covering:

- common child speech and transcription noise;
- prompt injection and attempts to change system role;
- personal-information disclosure;
- adult themes, violence, self-harm, hate, bullying, fear, medical/legal/financial requests;
- images with unsafe or ambiguous output;
- multilingual/unknown language and nonsensical input;
- long context, duplicate turn, stale baton, and provider malformed output.

Release records the model/prompt/policy versions and eval result. Real family content is not automatically added to evals.

## 10. Secrets and configuration

- `.env.example` contains names and safe local placeholders only.
- Local secrets use uncommitted environment files or approved secret storage.
- CI/CD secrets use GitHub/Vercel/EAS/worker secret stores.
- No secret is transferred into a prompt, issue, PR comment, log, screenshot, or client bundle.
- Production configuration is validated at startup and deploy.
- Capability checks verify live identity, consent, storage, recording, safety, AI, push, and deletion before enabling child sessions.
- Rotate leaked/suspected secrets immediately and document affected environments.

Secret-scanning and push protection should be enabled on the GitHub repository before production credentials are used.

## 11. Web and API controls

- Secure, HTTP-only, same-site session cookies where applicable.
- Origin/CSRF controls for state-changing web routes.
- Strict input schemas and output encoding.
- Content Security Policy, frame-ancestor restriction, MIME sniffing protection, referrer policy, and least-permissive CORS.
- Rate limits by identity, family, device, IP risk signal, and action sensitivity.
- Webhook signature and replay-window verification.
- Idempotency for calls, turns, recording, jobs, billing, invitations, consent, deletion, and webhook processing.
- Do not expose stack traces or provider messages to clients.
- Dependency updates and security audit in CI.
- File/media type, size, duration, and decode validation.

## 12. Mobile controls

- Sensitive tokens in platform secure storage, not AsyncStorage.
- Never store raw child media in general photo/library storage without an explicit authorized export.
- Permission prompts occur in adult context with clear purpose.
- Deep links validate host, scheme, environment, expiry, session, and authenticated recipient.
- Push payloads contain minimal information and no child name/story content on the lock screen by default.
- Screenshots/app switcher previews are obscured on high-risk adult/privacy surfaces where practical.
- Root/jailbreak detection may inform risk but is not the sole authorization control.
- Device loss can revoke trusted device and push token.

## 13. Logging and observability

Allowed:

- opaque resource IDs;
- enum state/transition/error code;
- provider/model/version and attempt ID;
- duration, count, bytes, tokens, cost;
- build SHA, platform, environment;
- redacted security decision.

Prohibited:

- raw audio/video/image bytes;
- transcripts, prompts, story text, full names, emails in general logs;
- auth tokens, cookies, API keys, webhook signatures;
- signed URLs or bucket credentials;
- consent evidence payloads;
- payment details;
- unrestricted provider response/error bodies.

Create a shared redaction utility and tests. Sentry breadcrumbs, request bodies, session replay, and PostHog autocapture are disabled or explicitly allow-listed on child/live/media surfaces.

## 14. Threat model priorities

| Threat                                   | Primary controls                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| Unauthorized adult accesses child/replay | Server family RBAC, revocation, recent auth, per-request media gateway, audit      |
| Client forges consent/role/baton         | Server auth context, state/version compare-and-set, typed commands                 |
| Child media captured too early           | Adult lobby boundary, recording authority capability, negative E2E tests           |
| Provider retains child content           | ZDR/private-output capability gate, minimized clips/prompts, contract/config audit |
| Public or cross-family media exposure    | Private buckets, opaque keys, per-resource authorization, short URLs               |
| Webhook replay duplicates effects        | Signature/time verification, provider event idempotency                            |
| Unsafe AI reaches child                  | Bounded context, structured schema, multi-stage safety, approved fallback          |
| Prompt injection changes role            | Fixed system policy, no tool access, schema, safety/evals                          |
| Worker compromise exposes library        | Least-privilege job-scoped access, outbound limits, scratch cleanup, rotation      |
| Deletion misses derived/provider data    | Resource inventory, deletion state machine, processor confirmation, reconciliation |
| Analytics/logs leak content              | Allow-list telemetry, redaction tests, disabled autocapture/session replay         |
| Cost abuse/denial of wallet              | Entitlements, quotas, rate limit, provider budgets, anomaly alert                  |
| Malicious media crashes compositor       | Validate/probe, resource/container limits, pinned FFmpeg, isolated scratch         |
| Stale client corrupts chapter            | Expected version, idempotency, authoritative event ordering                        |

## 15. Deletion and export

Deletion follows [state-machines.md](state-machines.md):

- re-authenticate and authorize;
- quarantine immediately;
- cancel AI/composition/export and token refresh;
- enumerate primary, derived, cache, analytics, and processor targets;
- purge idempotently;
- reconcile absence;
- retain content-free request/result audit only;
- expose/retry partial failures until resolved.

Backups are expiry-based. A restore process must reapply deletion tombstones before restored data can become active.

Two export classes are distinct:

- **Privacy-rights export:** adult-only, recent-authenticated, scoped to the requester's authorized data, available without a paid entitlement, and shaped by the applicable legal right/configuration.
- **Commercial media download/archive:** an optional convenience rendition, original-quality archive, or remaster that may require an entitlement but never replaces required rights access.

Both are rate-limited, auditable, private, encrypted where appropriate, and delivered through expiring access. Export archives are deleted after a short configured window.

## 16. Incident classes

P0/P1 response paths are required for:

- suspected unauthorized child/family media access;
- recording before valid authority;
- unsafe content shown to a child;
- public bucket or signed-URL scope error;
- credentials or provider keys exposed;
- deletion overdue/irreconcilable;
- unrecoverable widespread recording loss;
- provider breach or policy change affecting family data.

Minimum runbook:

1. contain capability/provider/environment;
2. preserve content-free forensic evidence;
3. rotate/revoke credentials/tokens;
4. identify affected families/resources;
5. execute approved notification/escalation;
6. purge or recover safely;
7. document root cause and regression tests;
8. owner approves re-enable.

## 17. Security release gates

No beta launch with real child data until:

- threat model reviewed against implemented architecture;
- production identity, VPC, notices, and recording boundary verified;
- adult eligibility/guardian-authority policy and child notice/stop/help behavior approved and verified;
- repository secret scanning/push protection and environment separation enabled;
- family authorization negative tests pass for every protected entity;
- webhook replay/signature tests pass;
- buckets are private and signed-read tests prove cross-family denial;
- logging/analytics redaction tests pass;
- AI safety eval has no critical escape;
- OpenAI ZDR, STT ZDR/minimum retention, and image no-store/private-output controls are verified in the production capability registry;
- recording/recovery/composition/deletion E2E passes;
- dependency/container scan has no unresolved critical/high exploitable finding;
- incident, deletion, support, and rollback runbooks are exercised;
- safeguarding/unsafe-output disclosure, review, escalation, and re-enable authority are exercised with synthetic evidence;
- jurisdiction/provider/app-store/privacy decisions in the PRD are approved.
