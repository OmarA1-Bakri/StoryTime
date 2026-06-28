# StoryTime

Mobile-first AI-assisted family story-call memory product.

This repository is in Phase 0: repo bootstrap.

## Canonical naming

- Product and app display name: StoryTime
- Repository: StoryTime
- Root package: storytime
- Workspace packages: @storytime/*

## Current status

- Product implementation has not started.
- PRD v0.5 has been ingested as the implementation source.
- This scaffold establishes the repo, workspace structure, documentation placeholders, environment guard, and delivery gates before product work begins.

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

## Safety note

Do not commit secrets. Use `.env.example` for placeholders only.
