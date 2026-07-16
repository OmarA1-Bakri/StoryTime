# StoryTime Screen and State Inventory

| Field        | Value                           |
| ------------ | ------------------------------- |
| Status       | Canonical UI delivery inventory |
| Version      | 1.0                             |
| Last updated | 2026-07-16                      |

Every listed surface needs real routing, authoritative data, permission/authorization handling, accessibility, analytics allow-listing, and the applicable states below. A static prototype or disconnected gallery does not satisfy an item.

## 1. Universal states

Each data-backed/action surface implements only applicable states and proves the exclusions:

| State                | Required behavior                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Loading              | Skeleton/progress with no false success; cancellable where work is user-controlled         |
| Empty                | Explains why empty and gives one safe next action                                          |
| Ready                | Authoritative current data and enabled actions only                                        |
| Validation denied    | Field-level, non-blaming recovery; no raw provider detail                                  |
| Unauthorized         | No protected-data flash; re-auth/request-access path                                       |
| Recent auth required | Returns to the intended high-risk action after successful adult re-auth                    |
| Offline/degraded     | Truthful cached scope, retry, audio-first/network/recording distinction                    |
| Retryable failure    | Stable safe code, bounded retry, state preserved                                           |
| Terminal failure     | No false ready state; support path and content-free correlation ID                         |
| Quarantined/deleted  | Playback/actions denied immediately; deletion progress or completion                       |
| Accessibility        | Keyboard/focus or screen-reader order, dynamic type/zoom, reduced motion, non-colour state |

## 2. Public web

| ID           | Surface                      | Required content/actions                                                                  | Stage      |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------- | ---------- |
| `UI-PUB-001` | Home                         | Human connection value, adult-mediated positioning, platform CTAs                         | Beta       |
| `UI-PUB-002` | How StoryTime works          | Consent→adult lobby→handoff→setup→baton→private replay; no misleading AI/E2EE claim       | Beta       |
| `UI-PUB-003` | Trust and safety             | Trusted family only, recording/AI boundary, safety fallback, reporting/support            | Beta       |
| `UI-PUB-004` | Privacy and child privacy    | Data classes, purposes, processor list, retention, rights, deletion, contacts, version    | Beta       |
| `UI-PUB-005` | Terms and recording notice   | Current adult terms, child-use/recording/AI/storage notices and version IDs               | Beta       |
| `UI-PUB-006` | Support and service status   | Safe support intake, incident/privacy route, operational status link                      | Beta       |
| `UI-PUB-007` | Pricing                      | Owner-approved plans/limits/refunds only; hidden or research-only before pricing decision | Commercial |
| `UI-PUB-008` | Auth entry/callback/recovery | Sign in/up, verified callback, account recovery, safe redirect/deep-link errors           | Beta       |

## 3. Authenticated adult web

| ID           | Surface                   | Required content/actions                                                                         | Stage      |
| ------------ | ------------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| `UI-WEB-001` | Family onboarding         | Adult terms, minimal provisional child slot, VPC, then named child profile                       | Beta       |
| `UI-WEB-002` | Consent workflow/status   | Start/resume/verified/rejected/expired/revoked/superseded; notices/scopes/evidence reference     | Beta       |
| `UI-WEB-003` | Dashboard                 | Readiness, family/child selector, call CTA, pending calls, recent memories, limits               | Beta       |
| `UI-WEB-004` | Family and roles          | Owner/guardian/approved-adult capabilities, invitations, expiry/revoke, recent auth              | Beta       |
| `UI-WEB-005` | Child profile             | Adult-only bounded profile/preferences, consent status, delete; no child credentials/public ID   | Beta       |
| `UI-WEB-006` | Devices and notifications | Device/push status, revoke, optional preferences, required-message explanation                   | Beta       |
| `UI-WEB-007` | Start/cancel call         | Recipient/device availability, preflight gates, notify/ringing/declined/missed/cancelled/expired | Beta       |
| `UI-WEB-008` | Adult lobby and handoff   | Adult identities/media, unrecorded status, notices, local-supervisor instructions, handoff state | Beta       |
| `UI-WEB-009` | Remote-adult live room    | Network/recording/baton/scene/checkpoint/end with truthful degraded/reconnect states             | Beta       |
| `UI-WEB-010` | Vault list                | Empty/processing/recoverable/ready/deleting chapters, storage and continuation                   | Beta       |
| `UI-WEB-011` | Replay detail             | Private gateway playback, captions, AI provenance, continuation, delete, permitted actions       | Beta       |
| `UI-WEB-012` | Privacy center            | Consent history/withdrawal, free rights export, deletion status, retention/processor disclosures | Beta       |
| `UI-WEB-013` | Account/settings          | Profile, security, devices, notifications, plan/limits, sign-out, account deletion               | Beta       |
| `UI-WEB-014` | Beta grant/credits        | Manual grant, credit/storage usage and limits; no checkout                                       | Beta       |
| `UI-WEB-015` | Checkout/customer portal  | Approved Stripe catalogue, checkout/portal/refund states                                         | Commercial |

## 4. iOS and Android adult mode

| ID           | Surface                       | Required content/actions                                                                  | Stage      |
| ------------ | ----------------------------- | ----------------------------------------------------------------------------------------- | ---------- |
| `UI-MOB-A01` | Auth and recovery             | Native sign-in/up/callback/recovery with secure token storage                             | Beta       |
| `UI-MOB-A02` | Onboarding/VPC/profile        | Consent-first family flow equivalent to web                                               | Beta       |
| `UI-MOB-A03` | Adult dashboard               | Presence, call CTA, readiness, recent memories, limits                                    | Beta       |
| `UI-MOB-A04` | Incoming call                 | OS-policy-compliant alert plus declined/missed/expired/cancelled/already-answered         | Beta       |
| `UI-MOB-A05` | Permission preflight          | Adult-context camera/mic/notification/local-auth purpose, deny/settings/retry             | Beta       |
| `UI-MOB-A06` | Adult-only lobby              | Nearby/remote adult media and identity, explicit unrecorded status                        | Beta       |
| `UI-MOB-A07` | Recording notice/handoff      | Both acceptances, local guardian re-auth, supervisor unpublish/leave, child identity join | Beta       |
| `UI-MOB-A08` | Adult live participant        | Same authoritative live/checkpoint/end/reconnect states as web                            | Beta       |
| `UI-MOB-A09` | Family/profile/invites        | Mobile parity for trusted-family management and revocation                                | Beta       |
| `UI-MOB-A10` | Vault/replay/privacy/settings | Replay, continuation, rights export, deletion, devices, notices, limits                   | Beta       |
| `UI-MOB-A11` | Store purchase/manage         | Approved RevenueCat catalogue/purchase/restore/refund/expiry states                       | Commercial |

## 5. iOS and Android child mode

| ID           | Surface                  | Required content/actions                                                                                 | Stage |
| ------------ | ------------------------ | -------------------------------------------------------------------------------------------------------- | ----- |
| `UI-MOB-C01` | Child join/preflight     | Locked navigation, trusted adult present, age-appropriate recording/AI explanation and stop/help control | Beta  |
| `UI-MOB-C02` | Recording boundary       | Visible, spoken/assistive indicator acknowledged before first captured byte                              | Beta  |
| `UI-MOB-C03` | Five-choice setup        | Character, setting, problem, tone, visual format; alternate attribution; validation; seed lock           | Beta  |
| `UI-MOB-C04` | Live story room          | Human video/audio, scene, baton, recording/network status, accessible controls                           | Beta  |
| `UI-MOB-C05` | Turn capture/submit      | Open/capturing/maximum-time/cancel/submit/sealed/duplicate/stale/reconnect states                        | Beta  |
| `UI-MOB-C06` | AI waiting/fallback      | Immediate theatrical acknowledgement, safe timeout/fallback, no raw policy/provider error                | Beta  |
| `UI-MOB-C07` | Adult checkpoint outcome | Child sees only continue/pause/ending outcome; private adult controls remain hidden                      | Beta  |
| `UI-MOB-C08` | Ending/pause/call loss   | Gentle ending, truthful recording stop, recoverable saved-state explanation                              | Beta  |
| `UI-MOB-C09` | Permitted replay         | Private authorized replay with captions/provenance; no adult management actions                          | Beta  |
| `UI-MOB-C10` | Adult exit gate          | Recent local adult re-auth before leaving child mode or opening protected routes                         | Beta  |

## 6. Operational/support surfaces

| ID           | Surface                          | Required content/actions                                                         | Stage      |
| ------------ | -------------------------------- | -------------------------------------------------------------------------------- | ---------- |
| `UI-OPS-001` | Content-blind session/job search | Opaque IDs, state, build/provider version, redacted errors, retry eligibility    | Beta       |
| `UI-OPS-002` | Composition/deletion recovery    | Idempotent retry/reconcile, target state, SLA alert; no default media access     | Beta       |
| `UI-OPS-003` | Break-glass request/audit        | Reason, approver, scope, expiry, actions, revoke; disabled until policy approved | Beta       |
| `UI-OPS-004` | Capability/release dashboard     | Identity/VPC/ZDR/media/storage/push/build/migration/rollback status              | Beta       |
| `UI-OPS-005` | Billing reconciliation           | Product mapping, webhook/reconciliation state, redacted customer IDs             | Commercial |

## 7. Proof

`AT-OP-005` traces every beta row to a route/component, authoritative backend state, and automated or explicit manual evidence. Commercial rows become required only for commercial v1. Screenshots alone are insufficient; actions and failure states must work.
