# StoryTime Codex Installation Package

This package contains the committed StoryTime repository at commit `61ad4f3`,
the canonical product and delivery documents, and the five original source
artifacts in `project_sources/`.

## Start Codex with this instruction

> Open this folder, read `START_HERE.md` and `AGENTS.md`, then execute
> `docs/autonomous-build-prompt.md` to develop StoryTime to the documented
> completion gates.

## Canonical reading order

1. `AGENTS.md`
2. `PRD.md`
3. `docs/security-privacy.md`
4. `docs/state-machines.md`
5. `docs/architecture.md`
6. `docs/acceptance-test-plan.md`
7. `docs/screen-state-inventory.md`
8. `docs/traceability.md`
9. `IMPLEMENTATION_PLAN.md`
10. `docs/current-state.md`
11. `docs/decision-log.md`
12. `docs/source-register.md`

The original PDFs, prototype, audio, and video are supporting evidence. When a
source conflicts with a canonical document, follow the precedence rules in
`AGENTS.md` and record the decision in `docs/decision-log.md`.

## Repository setup

This ZIP intentionally excludes `.git`, secrets, dependencies, caches, and
build output. Use either setup path:

### Recommended: connect to the canonical GitHub repository

1. Clone `https://github.com/OmarA1-Bakri/StoryTime`.
2. Preserve and review `origin/agent/live-foundation` before replacing or
   rewriting overlapping implementation work.
3. Copy this package's contents over the clone, preserving the canonical docs
   and `project_sources/`.
4. Create a feature branch and commit the imported baseline before development.

### Offline/local-only

1. Extract the ZIP.
2. Run `git init` inside the `StoryTime` directory.
3. Create an initial commit before implementation begins.

## Safety boundary

Do not use real child data or production credentials until the privacy,
security, consent, retention, and deletion gates in the canonical documents are
implemented and approved. No credentials or secrets are included in this ZIP.

