# Testing

The canonical test and release-evidence specification is [acceptance-test-plan.md](acceptance-test-plan.md).

The root target is `corepack pnpm check`, backed by real format, lint, type, unit, integration, web/mobile E2E, AI, media, security, and build gates as the implementation phases add them.

Placeholder `echo` scripts are not tests and cannot satisfy a merge or release gate.
