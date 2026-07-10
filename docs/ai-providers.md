# Live AI providers

StoryTime keeps local development deterministic with `AI_MODE=mock`. A release environment must set
`AI_MODE=live`; the worker then fails closed when credentials are absent and never silently produces
mock content.

## Production flow

1. Groq transcribes the private, short-lived audio URL with `whisper-large-v3-turbo`.
2. OpenAI Moderation checks the incoming transcript and bounded story context.
3. OpenAI Responses generates a strict JSON story beat with storage disabled (`store: false`).
4. OpenAI Moderation checks all generated text and the illustration prompt.
5. Flagged input or output becomes a deterministic, child-safe continuation.
6. FAL generates one safety-checked WebP illustration from the approved prompt.

Provider response bodies and credentials must not be written to application logs. Audio URLs should be
short-lived signed URLs and should expire immediately after transcription.

## Required release configuration

```dotenv
AI_MODE=live
STT_PROVIDER=groq
GROQ_API_KEY=...
GROQ_STT_MODEL=whisper-large-v3-turbo
STORY_PROVIDER=openai
SAFETY_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_STORY_MODEL=gpt-5-mini
OPENAI_MODERATION_MODEL=omni-moderation-latest
IMAGE_PROVIDER=fal
FAL_KEY=...
FAL_IMAGE_ENDPOINT=...
```

`FAL_IMAGE_ENDPOINT` is explicit because model endpoints and payload contracts can change. Pin and test
the selected FAL model in staging before promoting it to production.
