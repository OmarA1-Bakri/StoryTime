# StoryTime Account and Capability Inventory

Snapshot: 2026-07-16. This inventory records names, linkage, and capability state only. It contains no credential values and is not authorization to create production resources, accept terms, purchase services, process real child data, or launch publicly.

## Status vocabulary

- `Verified`: connected and exercised with read or preview evidence.
- `Local only`: usable for synthetic/local work but not linked to a hosted environment.
- `Connection broken`: a connector exists but its API call fails authentication or response validation.
- `Not configured`: no usable project, environment, credential, or CLI was found.
- `Decision blocked`: owner/legal/commercial approval is required before activation.

## Delivery systems

| Capability     | Status            | Evidence                                                                                                                                                                                                               | Remaining gate                                                                                                    |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| GitHub         | Verified          | Public `OmarA1-Bakri/StoryTime` repository; draft PR #2; required `workspace` check; review/conversation protection; force-push/deletion blocked; secret scanning and push protection enabled; zero open secret alerts | Independent approval and merge of PR #2                                                                           |
| Linear         | Verified          | `StoryTime MVP Delivery`; owner assigned; project in progress; 60/60 legacy issues reconciled; canonical Phase 0–9 milestones                                                                                          | Keep evidence synchronized at package boundaries                                                                  |
| Vercel         | Verified preview  | Project `storytime`, root `apps/web`, Node 22; pnpm workspace install/build; preview deployment `dpl_2U9tJj5kaRdsC7KMS6xfKuMasZUc` is ready                                                                            | Environment-variable review, domain/security headers, rollback drill, production authorization                    |
| Convex         | Connection broken | Two active connector records exist, including alias `storytime`, but both token-detail calls return `MissingAccessToken`; no local Convex CLI or deployment variables are configured                                   | Reauthorize/select the intended account, then inventory dev/preview/prod without creating or mutating deployments |
| Worker hosting | Local only        | Docker 29.4.2 and the worker Dockerfile are available locally                                                                                                                                                          | Select/link a long-running runtime, secrets, region, health, rollout, and rollback                                |

## Realtime, storage, and identity

| Capability           | Status            | Evidence                                                                                                                                                                                                   | Remaining gate                                                                                                                                                                      |
| -------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LiveKit              | Local only        | Local Docker configuration and client/token foundations exist; no hosted credentials, CLI, booted native device, or egress proof                                                                           | Hosted project/region, webhooks, per-track egress, quotas, two-device physical spike                                                                                                |
| Cloudflare/R2        | Connection broken | A Cloudflare connector record exists, but account enumeration fails with invalid authentication-header formatting; Wrangler and R2 variables are absent                                                    | Reauthorize with correct scoped token, inventory/create private buckets only under an approved package, verify CORS/ACL/lifecycle/deletion                                          |
| Clerk                | Not configured    | Verified-token bootstrap, official signed-webhook verification, normalized private Convex sync, replay/stale/terminal policy, and regression tests exist; no Clerk or Convex account linkage was exercised | Link isolated instances, configure signing/sync secrets and the three user lifecycle events, generate/deploy Convex functions, and run synthetic create/update/disable/delete proof |
| Consent/VPC provider | Decision blocked  | Only the mock provider contract/variables exist                                                                                                                                                            | Owner/legal selects provider, method, scopes, evidence, expiry, webhook, withdrawal, and dispute policy                                                                             |

## AI and child-data processors

| Capability              | Status                                   | Evidence                                                                                                                                                                                                  | Remaining gate                                                                                                               |
| ----------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| OpenAI story/moderation | Local credential present, policy blocked | Adapters use structured Responses plus moderation and now require `OPENAI_ZDR_APPROVED=true`; the account approval is not verified and no real child data was sent                                        | Verify approved ZDR in the intended project, region/terms/deletion, pinned model/prompt/policy, and synthetic benchmark      |
| Groq STT                | Not configured                           | Adapter and model default exist, require `GROQ_ZDR_ENABLED=true`, and have no configured credential name                                                                                                  | Verify account ZDR and private submitted-clip controls, deletion/retention, credential, quality/latency/cost spike           |
| fal image               | Not configured                           | Adapter and endpoint variables exist, require private-output and retention attestations, and have no configured credential name                                                                           | Verify private ACL and selected endpoint retention/deletion, immediate private ingest, credential, latency/cost/safety spike |
| Full AI-turn spike      | Blocked                                  | Runtime constructors, the central capability registry, and production web prebuild fail closed on missing control attestations; the bounded audio→STT→story→safety→private image/fallback flow cannot run | Close Groq/fal capability gates or approve equivalent providers; use synthetic media only                                    |

## Monitoring, analytics, billing, and release accounts

| Capability                        | Status                              | Evidence                                                                                            | Remaining gate                                                                                         |
| --------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Sentry                            | Connected, no StoryTime project     | Connected organization is readable; its only visible project is an unrelated Python/aiohttp project | Create/link a dedicated privacy-safe StoryTime project under ST-613/ST-816                             |
| PostHog                           | Connection broken                   | Connector is active, but organization/project listing returns HTML or an unparseable 200 response   | Reauthorize/fix endpoint before deciding whether PostHog is the approved content-free analytics system |
| Billing/entitlements              | Not configured and decision blocked | RevenueCat/Stripe variables are placeholders; no active account or price catalogue was verified     | Owner approves catalogue/prices/refunds/tax; then link sandbox accounts and signed webhooks            |
| EAS/Expo account                  | Not configured                      | Android/iOS JS bundle exports pass; EAS CLI/account and signed development builds are absent        | Link account, device credentials, development builds, native LiveKit matrix, then store builds         |
| Apple Developer/App Store Connect | Not configured and decision blocked | No account/team/app/store evidence                                                                  | Owner authority, agreements, identifiers, signing, privacy disclosures, review submission              |
| Google Play Console               | Not configured and decision blocked | No account/app/signing/store evidence                                                               | Owner authority, agreements, identifiers, signing, data safety, review submission                      |

## Local toolchain

Verified locally: Node 22.23.1, pnpm 9.15.9, Docker/Compose 29.4.2, FFmpeg/ffprobe 8.1.1, GitHub CLI, and Vercel CLI. Missing or unusable for required evidence: Convex CLI, EAS CLI, Wrangler, Maestro, LiveKit server/CLI, booted iOS/Android devices, and signed native development builds.

## Safe next actions

1. Reauthorize the existing Convex and Cloudflare connections; inventory only before creating resources.
2. Obtain LiveKit, Groq, and fal synthetic-development capability/credentials after the named privacy controls are confirmed.
3. Select or create dedicated privacy-safe Sentry/analytics projects only in their canonical packages.
4. Do not activate production, submit stores, accept terms, purchase services, or process real child data without the required owner/legal authority.
