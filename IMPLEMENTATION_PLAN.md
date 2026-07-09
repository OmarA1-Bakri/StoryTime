# StoryTime Implementation Plan

Status: full launch end-state locked; launch-critical integration in progress.

## Canonical naming

- Product name: StoryTime
- Repository: StoryTime
- Root package: storytime
- Workspace namespace: @storytime/*

## End state

StoryTime must ship as a complete product across the public website, iOS and Android: adult identity and consent, approved-family access, realtime story calls, AI-assisted baton storytelling, recording and replay, private vault, deletion, notifications, entitlements, observability and store-ready operations.

## Delivery sequence

1. Truthful provider readiness and a real LiveKit media foundation.
2. Adult identity, child profiles, approved-adult invitations and consent enforcement.
3. Live STT, Story Director, safety and image providers wired into the baton loop.
4. Recording, composition, private replay, storage lifecycle and deletion.
5. Push notifications, entitlements, billing, support and operational controls.
6. Physical-device E2E, privacy/security review, TestFlight/Play testing and controlled public launch.

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
