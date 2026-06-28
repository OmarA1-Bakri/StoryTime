# StoriTime

Mobile-first AI-assisted family story-call memory product.

This repository is in **Phase 0 — Setup Operating System**.

## Current status

- Product implementation has not started.
- Full PRD/spec ingestion is pending.
- This scaffold establishes the repo, workspace structure, documentation placeholders, environment guard, and delivery gates before product work begins.

## Stack defaults

- Package manager: pnpm
- Monorepo tooling: Turborepo
- Language: TypeScript
- Mobile: React Native / Expo development build pending media reliability spike
- Web: Next.js
- Backend: Convex
- Deployment: Vercel
- Quality target: local format/lint/typecheck/test/build plus Codacy review

## Setup commands

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

## Safety note

Do not commit secrets. Use `.env.example` for placeholders only.
