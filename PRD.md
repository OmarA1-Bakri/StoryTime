# StoriTime PRD v0.5

Status: v0.5 implementation specification ingested.

The canonical source is the user-provided document: `StoriTime — Codex-Ready Product Requirements Document and Technical Specification`, version v0.5.

Current repository priority: complete Phase 0 repo bootstrap against v0.5 before starting product implementation.

Build phases:

0. Repo Bootstrap
1. UI Shell
2. Convex Domain Model
3. LiveKit Call MVP
4. Story Loop with Mock AI
5. Provider Integrations
6. Recording Pipeline
7. Protected Verification, Deletion, Entitlements
8. Beta Hardening

Hard gates:

- Local repo gates must pass.
- Protected access gates must block unsafe session starts.
- Recording uses Track Egress plus composition ledger plus async composition.
- Mock external providers remain the default for local development and tests.
- Production must reject unsafe mock provider configuration.
- Private media access must use expiring signed URLs.
