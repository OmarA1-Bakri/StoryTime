# StoryTime Hard Gates

This summary is normative only when read with [acceptance-test-plan.md](acceptance-test-plan.md), [security-privacy.md](security-privacy.md), and [state-machines.md](state-machines.md).

## Merge

- Clean frozen install with Node 22 and pinned pnpm.
- Format, lint, strict types, relevant unit/property/contract/integration tests, and builds pass.
- No placeholder gate, secret, prohibited content, or silent allow-failure.
- Authorization, consent, state, idempotency, privacy, and recovery tests accompany affected code.

## Child session

- Authenticated trusted adults and active server-derived family access.
- Current non-mock production consent.
- Both adult recording acceptances.
- Nearby-adult re-authentication and handoff; supervisor and child transport identities remain distinct.
- No child media/AI/recording before authority.
- Age-appropriate child notice and stop/help control.
- Persistent truthful recording indicator is acknowledged before the first captured byte.

## AI publication

- Submitted baton interval only.
- Strict schema and length validation.
- Applicable transcript/text/prompt/image safety passed.
- Approved fallback exists.
- Required OpenAI/STT/image zero-retention/private-output capabilities are verified before real child data.
- Provider/model/prompt/policy and usage recorded without raw content in telemetry.

## Replay

- Separate raw tracks and ordered ledger durable.
- Deterministic manifest.
- Immutable final composition output exists and verifies before metadata becomes `READY`.
- Private gateway re-authorizes every manifest/range/segment and exposes no origin URL.
- Failure is visible/recoverable; no false `READY`.

## Privacy

- Family isolation and per-request media access verified.
- Privacy-rights export remains available without a paid media entitlement.
- Retention and deletion inventory active.
- Deletion quarantines immediately and reconciles every target.
- Logs/analytics contain no child/family content, prompt, transcript, token, secret, or signed URL.

## Beta/public release

- Deployed web and worker verified.
- Signed iOS/Android builds pass physical-device/network matrix.
- Production capability check refuses all mock/missing critical providers.
- No critical/high launch-path security, consent, safety, recording, deletion, or data-loss defect.
- Owner approves jurisdiction, VPC, notices, processor terms, retention, app-store disclosures, support, and beta cohort.
