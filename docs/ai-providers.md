# Live AI providers

StoryTime keeps local development deterministic with `AI_MODE=mock`. A release environment must set
`AI_MODE=live`; the worker then fails closed when credentials or verified child-data controls are
absent and never silently produces mock content.

## Production flow

1. Groq transcribes the private, short-lived audio URL with `whisper-large-v3-turbo` after Zero Data
   Retention (ZDR) is verified on the account.
2. OpenAI Moderation checks the incoming transcript and bounded story context.
3. OpenAI Responses generates a strict JSON story beat with storage disabled (`store: false`) on a
   project approved and configured for ZDR.
4. OpenAI Moderation checks all generated text and the illustration prompt.
5. Flagged input or output becomes a deterministic, child-safe continuation.
6. fal generates one safety-checked WebP illustration from the approved prompt using private output
   access and an explicitly verified media-retention policy.

Provider response bodies and credentials must not be written to application logs. Audio URLs should be
short-lived signed URLs and should expire immediately after transcription.

## Fail-closed control matrix

| Provider | Data sent                                                              | Required release attestation                                               | Why it is required                                                                                                                                                                                                         |
| -------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI   | Transcript, bounded story context, generated text, illustration prompt | `OPENAI_ZDR_APPROVED=true`                                                 | API data is not used for training by default, but default abuse-monitoring logs can be retained for up to 30 days. ZDR is approval-gated, and `store: false` alone is not a ZDR guarantee.                                 |
| Groq     | Private audio input and transcript result                              | `GROQ_ZDR_ENABLED=true`                                                    | Inference data is not retained by default, while reliability or abuse logs can otherwise be retained for up to 30 days. The project must verify ZDR before child audio is sent.                                            |
| fal      | Approved illustration prompt and generated media                       | `FAL_PRIVATE_OUTPUT_VERIFIED=true` and `FAL_MEDIA_RETENTION_VERIFIED=true` | Generated media URLs are public by default and retained for at least seven days by default. Production must use private ACLs, ingest into private storage, and verify the selected endpoint's deletion/retention behavior. |

The flags are deployment attestations, not switches that configure a provider. They must stay `false`
until the control has been verified in the real provider account and captured in release evidence. Mock
mode remains the only allowed mode while any attestation is false. The web prebuild runs the central
environment guard; an `APP_ENV=production` build fails if a provider, credential, or attestation is
mock, missing, or unverified. Worker constructors independently repeat the AI-control checks before a
live provider can be created.

Provider references: [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data#default-usage-policies-by-endpoint),
[Groq data controls](https://console.groq.com/docs/your-data),
[fal file access](https://fal.ai/docs/documentation/development/working-with-files), and
[fal retention FAQ](https://fal.ai/docs/documentation/model-apis/faq).

## Required release configuration

```dotenv
AI_MODE=live
STT_PROVIDER=groq
GROQ_API_KEY=...
GROQ_STT_MODEL=whisper-large-v3-turbo
GROQ_ZDR_ENABLED=true
STORY_PROVIDER=openai
SAFETY_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_STORY_MODEL=gpt-5-mini
OPENAI_MODERATION_MODEL=omni-moderation-latest
OPENAI_ZDR_APPROVED=true
IMAGE_PROVIDER=fal
FAL_KEY=...
FAL_IMAGE_ENDPOINT=...
FAL_PRIVATE_OUTPUT_VERIFIED=true
FAL_MEDIA_RETENTION_VERIFIED=true
```

`FAL_IMAGE_ENDPOINT` is explicit because model endpoints and payload contracts can change. Pin and test
the selected FAL model in staging before promoting it to production.
