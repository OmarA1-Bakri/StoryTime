# StoryTime

StoryTime turns trusted family video calls into guided, co-created story chapters and private replayable memories.

The repository is an active TypeScript monorepo with a partial web/mobile/backend/worker scaffold. It is **not yet a complete MVP**. The verified state and critical branch warning are in [docs/current-state.md](docs/current-state.md).

## Canonical documents

Read in order:

1. [PRD.md](PRD.md) — product scope and release contract
2. [docs/security-privacy.md](docs/security-privacy.md) — child/family data invariants
3. [docs/state-machines.md](docs/state-machines.md) — authoritative lifecycles
4. [docs/architecture.md](docs/architecture.md) — target system design
5. [docs/acceptance-test-plan.md](docs/acceptance-test-plan.md) — required evidence
6. [docs/screen-state-inventory.md](docs/screen-state-inventory.md) — required product surfaces and states
7. [docs/traceability.md](docs/traceability.md) — requirement-to-package-to-test map
8. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — phased work packages
9. [AGENTS.md](AGENTS.md) — autonomous delivery protocol
10. [docs/current-state.md](docs/current-state.md) — evidence snapshot
11. [docs/decision-log.md](docs/decision-log.md) — decisions and pending approvals
12. [docs/source-register.md](docs/source-register.md) — reconciled source evidence
13. [docs/autonomous-build-prompt.md](docs/autonomous-build-prompt.md) — full-build kickoff prompt

Historical PDFs, prototypes, previous stub documents, and legacy Linear tickets are supporting evidence only when they conflict with this pack.

## Repository shape

```text
apps/
  web/       Next.js public site, adult app, and browser call
  mobile/    Expo/React Native iOS and Android app
  worker/    AI, media, composition, deletion, and reconciliation jobs
convex/      Authoritative data, authorization, state, jobs, and realtime events
packages/    Shared config, prompts, types, validators, and UI tokens
infra/       Local LiveKit/MinIO and deployment/setup support
docs/        Product, architecture, security, tests, and delivery evidence
```

## Create the local repository

WSL2 or Linux is recommended for web/backend/worker and Android-oriented development. Local iOS compilation, Simulator, signing, and native debugging require macOS with Xcode; EAS can build remotely but does not replace physical-iOS verification. Install:

- Git;
- Node 22;
- Corepack;
- Docker with Compose;
- FFmpeg/ffprobe;
- Android Studio/SDK for local Android work;
- on macOS, Xcode and CocoaPods for local iOS work, or the EAS CLI/account path for remote builds.

Then:

```bash
git clone https://github.com/OmarA1-Bakri/StoryTime.git
cd StoryTime
git fetch --all --prune
corepack enable
corepack prepare pnpm@9.15.9 --activate
```

Current-state caveat: the audited `main` branch did not yet contain the lockfile; `origin/agent/live-foundation` does. Complete Phase 0 branch reconciliation and confirm that the resulting integration branch contains the reviewed lockfile. Then install reproducibly:

```bash
test -f pnpm-lock.yaml
corepack pnpm install --frozen-lockfile
```

Do not generate and commit a second lockfile on `main` without first reviewing the live-foundation lockfile and dependency changes.

## Configuration

`.env.example` is the inventory of environment variable names. It contains no production secret.

Rules:

- use local uncommitted environment files or approved secret stores;
- keep dev, preview, and production credentials isolated;
- never paste or commit credentials, tokens, signed URLs, or child/family content;
- run the capability/environment guard before a live session;
- production must fail when a required provider is mock or missing.
- real child data must also fail closed unless required zero-retention/private-output provider controls are verified.

The final bootstrap will materialize app-specific environment files from the central validated configuration without copying secret values into source control.

## Local development

Start local infrastructure:

```bash
bash infra/scripts/setup-local.sh
```

Run the Convex development deployment and applications in separate terminals:

```bash
corepack pnpm convex:dev
corepack pnpm dev
```

Targeted commands:

```bash
corepack pnpm dev:web
corepack pnpm dev:mobile
corepack pnpm dev:worker
corepack pnpm env:check
```

Local development uses synthetic families/media and mock providers by default. That is not a valid production configuration.

## Quality gates

The target root gate is:

```bash
corepack pnpm check
```

It must cover real formatting, lint, types, unit/integration/E2E/AI/media tests, and builds as Phase 0–8 implement them. A placeholder `echo` command is not a passing gate.

See [docs/acceptance-test-plan.md](docs/acceptance-test-plan.md) for the complete evidence model.

## Delivery

Work follows [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). The first critical path is:

1. merge the canonical documentation;
2. preserve and review `origin/agent/live-foundation`;
3. establish Node/pnpm/lockfile/CI reproducibility;
4. migrate identity, family, consent, and critical state models;
5. prove the two-device unrecorded lobby and recording boundary;
6. complete one synthetic chapter vertically before broad polish.

Use focused branches and PRs. Keep GitHub, Linear, code, and [docs/current-state.md](docs/current-state.md) aligned.

## Product safety

StoryTime is adult-mediated and trusted-family only. A child has no independent account. The adult-only lobby is unrecorded; the nearby supervisor leaves before the same device joins under a distinct child-mode identity. Child media cannot be published, recorded, transcribed, or sent to AI before valid server-derived consent and handoff authority. Family media is private, not used for model training, subject to verified zero-retention/private-output processor controls, and deletable end-to-end.

Do not weaken these constraints to make a demo easier.

## Links

- [GitHub repository](https://github.com/OmarA1-Bakri/StoryTime)
- [Linear project](https://linear.app/leadscout/project/storitime-mvp-build-11d86b03b18e)
- Repository homepage metadata: [storytime-roan.vercel.app](https://storytime-roan.vercel.app) — verify the actual deployment before treating it as current
