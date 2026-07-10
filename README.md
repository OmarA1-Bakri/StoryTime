# StoryTime

Mobile-first AI-assisted family story-call memory product.

This repository contains the functional StoryTime scaffold and is now entering launch-critical integration work.

## Canonical naming

- Product and app display name: StoryTime
- Repository: StoryTime
- Root package: storytime
- Workspace packages: @storytime/*

## Current status

- The mobile, web, Convex, worker and shared-package foundations are implemented.
- Adult identity, child-profile ownership, consent capture, native LiveKit rooms, provider readiness,
  and the guarded live AI provider layer are implemented.
- The active delivery target is a real two-device chapter: protected join, LiveKit call, story turns, recording, replay and deletion.
- Readiness is derived from configured provider capabilities; demo routes must not be treated as release evidence.

## Web / Next.js

The Next.js app lives in `apps/web`.

For local development:

```bash
pnpm install
pnpm dev:web
```

For Vercel, use:

```text
Root Directory: apps/web
Framework Preset: Next.js
Install Command: pnpm install
Build Command: pnpm build
```

## Stack defaults

- Package manager: pnpm
- Monorepo tooling: Turborepo
- Language: TypeScript
- Mobile: React Native / Expo development build pending media reliability spike
- Web: Next.js
- Backend: Convex
- Deployment: Vercel
- Quality target: local format/lint/typecheck/test/build plus Codacy review

Live AI setup and its fail-closed behavior are documented in `docs/ai-providers.md`.

## Safety note

Do not commit secrets. Use `.env.example` for placeholders only.
