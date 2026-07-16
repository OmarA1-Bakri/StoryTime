# StoryTime Autonomous Build Prompt

Use this prompt to start a full implementation run after the canonical documentation PR is available.

## Prompt

```text
Build StoryTime to verified completion from the canonical repository and Linear project.

Canonical assets:
- GitHub: OmarA1-Bakri/StoryTime
- Linear: StoriTime MVP Build (legacy project-name typo)

First clone or open the repository and read AGENTS.md plus every canonical document in its required order. Inspect the current repository, branches, PRs, CI, deployments, connected services, and Linear state before changing anything. Preserve and review origin/agent/live-foundation; do not discard or assume it is merged.

Execute IMPLEMENTATION_PLAN.md in dependency order, one verified work package at a time. Use the connected GitHub, Linear, and Composio capabilities for scoped work. Reconcile stale Linear state, create focused branches and PRs, implement production code and tests, observe/fix CI, update current-state and decision records, and proceed to the next ready package.

The outcome is a complete public/adult web product plus production-capable iOS and Android apps, authoritative Convex backend, trusted adult/child consent boundary, reliable two-device LiveKit call, safe submitted-turn AI story loop, separate raw-track recording, ordered ledger, deterministic FFmpeg composition, private Memory Vault, recovery, deletion, entitlements, privacy-safe observability, deployed web/worker/backend, signed native builds, and full release evidence.

Do not report completion for mocked screens, placeholder scripts, typecheck-only mobile code, unmerged branches, pending CI, unverified deployments, or missing recording/replay/deletion/cost proof. Production must never silently fall back to mock identity, consent, AI, recording, storage, safety, or deletion. Keep nearby-supervisor and child media identities distinct, issue no child grant before committed authority, and start recording before story setup. Fail closed for real child data unless OpenAI ZDR, STT retention/ZDR, and image no-store/private-output capabilities are verified.

Take normal reversible implementation actions without asking for routine choices already bounded by the canonical documents. Continue through independent work when an external account or decision blocks one package. Ask only when you need missing credentials/account authority, a purchase or contract, an owner/legal/jurisdiction/VPC/retention/pricing decision, an app-store/public-launch submission, a destructive production action, or resolution of a genuine canonical contradiction.

Do not expose or commit secrets or family content. Use synthetic data until the real-child-data launch gates are approved. Never purchase, accept legal terms, publicly launch, submit store releases, merge destructive migrations, or process real child data without the required explicit authority.

Keep working until either:
1. the deployed/signed product passes every definition-of-completion item and the repository, CI, deployments, Linear, documents, monitoring, rollback, and release evidence agree; or
2. a genuine blocker remains after all independent work is complete, in which case return one precise blocker report with completed evidence and the minimum required owner action.

Clean up temporary worktrees, media, containers, test resources, and branches after each package. Be exact and truthful.
```
