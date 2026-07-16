# StoryTime Source Register

| Source                                                     | Evidence ID                                                                         | Role in v1 synthesis                                                                                            |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| StoryTime MVP PRD v0.4, 9-page PDF                         | `sha256:e05f2aaf2e0b8832b3a52ba6f29f95807722b9155a5bd2b39a51bacae6812d43`           | Original product thesis, scope, journey, safety, recording, economics, and release intent                       |
| HTML UI/UX prototype, 590 lines                            | `sha256:64a5836c013f39434889fb222680c8451dd1ddd856ef99040603e13357f3e0fb`           | Visual direction, mobile screen hierarchy, wording, fallback, checkpoint, replay, and recorder-layout reference |
| StoryTime MVP Blueprint, 15-page PDF                       | `sha256:8312b819d8dc134c1912f72cd53291915d0ba45825a7574a1f7dd9d611ab862b`           | Atomic unit, architecture, raw-track ledger/composition, launch boundaries, metrics, and gates                  |
| Turning video calls into AI adventures, 17:58 audio        | `sha256:c38a09a6347f12355889af4be2c552268e775ab96a74d125306fe8f825cf897e`           | Narrative product rationale and experience constraints                                                          |
| Deconstructing the Atomic Unit / state machine, 6:20 video | `sha256:1bc66355d16aa92a9ecc2889db80bde84e706104dba023944b2563927a799240`           | Atomic-unit lifecycle and completion-state reasoning                                                            |
| GitHub `OmarA1-Bakri/StoryTime`                            | `main@6b57b46057b10f90a8ca40d06c3bed28c8c3ae2b` and `agent/live-foundation@c343667` | Actual scaffold, code, branch, and documentation state                                                          |
| Linear `StoriTime MVP Build`                               | Project `c9e2832c-1f25-4111-87f1-79bee3be1075`, 60 issues on 2026-07-16             | Historical delivery intent and stale/current work evidence                                                      |

## Current technical references

These primary references were checked on 2026-07-16 for feasibility-sensitive decisions. They are not product authorities and must be rechecked before production enablement because provider and SDK constraints change.

| Area                     | Primary references                                                                                                                                                                                                                                                               | Decision informed                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Expo/LiveKit             | [LiveKit Expo SDK](https://docs.livekit.io/transport/sdk-platforms/expo/), [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)                                                                                                             | Development builds/prebuild; no Expo Go requirement; physical-device compatibility spike              |
| LiveKit grants/recording | [Tokens and grants](https://docs.livekit.io/frontends/reference/tokens-grants/), [Track Egress](https://docs.livekit.io/transport/media/ingress-egress/egress/track/), [Egress outputs](https://docs.livekit.io/transport/media/ingress-egress/egress/outputs/)                  | Subscribe-only lobby, post-authority per-track egress, reconnect segment manifests, private R2 output |
| OpenAI                   | [Under-18 API guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance), [API data controls](https://developers.openai.com/api/docs/guides/your-data), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) | Approved ZDR gate for under-13 personal data, strict schema, non-storage request behavior             |
| Groq                     | [Speech to text](https://console.groq.com/docs/speech-to-text), [Data controls](https://console.groq.com/docs/your-data)                                                                                                                                                         | Closed baton clips, ZDR, minimum-duration cost/latency test                                           |
| fal                      | [Media expiration](https://fal.ai/docs/documentation/model-apis/media-expiration), [Common parameters](https://fal.ai/docs/documentation/model-apis/common-parameters), [File access controls](https://fal.ai/docs/documentation/model-apis/file-access-controls)                | De-identified prompt, no-store/private output, immediate copy to R2                                   |
| Convex                   | [Limits](https://docs.convex.dev/production/state/limits), [Regions](https://docs.convex.dev/production/regions), [Actions](https://docs.convex.dev/functions/actions)                                                                                                           | Metadata-only documents, pre-data region choice, container worker for FFmpeg                          |

## Authority

These sources are preserved as evidence, not equal authorities. After 2026-07-16 the precedence in [../PRD.md](../PRD.md) applies:

1. canonical PRD;
2. security/privacy and state machines;
3. architecture/contracts;
4. acceptance plan;
5. implementation plan;
6. current Linear issues;
7. historical source artefacts.

## Resolved source conflicts

- `StoryTime` replaces legacy `StoriTime` spelling.
- Complete adult web and desktop adult participation extend the mobile-only source scope.
- Adult lobby is unrecorded and precedes child handoff/recording authority.
- Raw tracks and a ledger feed asynchronous composition; the recorder mockup is the output layout.
- Audio-first fallback is reliability, not a low-bandwidth market promise.
- Capped private cloud replay and rights export are core; convenience media download/original archive/remaster are entitlements.
- The ledger is append-only while retained, not exempt from parent deletion.
- Local biometric verifies the nearby adult, not the remote caller.
- Full shared call recording is distinct from baton-limited AI processing.
- No-training and request-level non-storage flags do not replace provider-required ZDR/private-output approval.

## Preservation

The uploaded source files are not committed by this documentation change and their conversation-upload location is not a durable independent audit location. `ST-000` cannot become `DONE_VERIFIED` until an authorized owner archives them in private project document storage and records the durable object/revision locator beside each hash. Do not put family data or large binary media into normal git history.

When archived:

- preserve the exact hashes above;
- avoid storing media in normal git history if repository size/privacy policy argues for release assets or private document storage;
- do not treat the static prototype or appended stray text as production code;
- do not copy any credential into the archive.

Derived synthesis locations:

| Evidence area                                              | Canonical derivation                                                              |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Product scope, journeys, requirements, release definitions | [../PRD.md](../PRD.md)                                                            |
| Media, ledger, provider, and system design                 | [architecture.md](architecture.md)                                                |
| Atomic-unit lifecycle and failure precedence               | [state-machines.md](state-machines.md)                                            |
| Privacy/safety conflict resolutions                        | [security-privacy.md](security-privacy.md) and [decision-log.md](decision-log.md) |
| Source-to-build proof                                      | [traceability.md](traceability.md)                                                |
