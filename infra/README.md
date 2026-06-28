# StoryTime Infrastructure

Local services:

- Redis for LiveKit coordination and future queues.
- LiveKit for realtime audio/video development.
- MinIO for local S3-compatible storage.

Start local infrastructure:

```bash
bash infra/scripts/setup-local.sh
```

No production credentials belong in this repository.
