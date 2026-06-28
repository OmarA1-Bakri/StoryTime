# StoryTime Implementation Plan

Status: PRD v0.5 ingested.

## Canonical naming

- Product name: StoryTime
- Repository: StoryTime
- Root package: storytime
- Workspace namespace: @storytime/*

## First implementation target

Start with Phase 0 repo bootstrap. The next practical task is to make the monorepo installable, buildable, typed, and deployable.

## Required first checks

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Vercel web target

The Next.js app lives in `apps/web`.

Use this deployment shape:

```text
Root Directory: apps/web
Framework Preset: Next.js
Install Command: pnpm install
Build Command: pnpm build
```
