# Hard Gates

Status: placeholder until PRD ingestion.

## Repository Gates

- format
- lint
- typecheck
- unit tests
- build

## Safety Gates

- no child session without verified consent
- no child access to billing/settings/download/delete
- no public sharing
- no stranger discovery
- no ads

## Recording Gates

- Track Egress default
- composition ledger required
- async composition required
- RoomComposite not default

## AI Gates

- mock providers work offline
- structured outputs
- safety fallback
- usage ledger

## Security Gates

- no committed secrets
- private media only
- signed URLs
- authorization checks
- deletion audit logs

## Deployment Gates

- Vercel build succeeds
- env guard passes
- Codacy quality status reviewed
