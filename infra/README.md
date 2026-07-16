# StoryTime Local Infrastructure

Local services:

- LiveKit for realtime audio/video development.
- MinIO for local S3-compatible private media storage.
- Redis only where the local LiveKit configuration needs it or a measured
  future use is approved. Convex job tables are the canonical beta queue.

Start local infrastructure:

```bash
bash infra/scripts/setup-local.sh
```

Use synthetic media locally. No production credential or family content
belongs in this repository.

Production topology and environment isolation are defined in
[../docs/architecture.md](../docs/architecture.md).
