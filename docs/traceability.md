# StoryTime Delivery Traceability

| Field        | Value                                |
| ------------ | ------------------------------------ |
| Status       | Canonical requirement-to-proof index |
| Version      | 1.0                                  |
| Last updated | 2026-07-16                           |

Every `ST-*` requirement in [../PRD.md](../PRD.md) maps to implementation work, acceptance evidence, and a release stage. `Beta` means private-beta P0. `Both` means beta enforces the safe/manual form and commercial v1 additionally proves paid capability. A future docs CI check must fail when a PRD ID is absent/duplicated here or a referenced package/test ID does not exist.

## Identity, consent, and calls

| Requirement | Work package(s)                        | Acceptance test(s)                                 | Stage |
| ----------- | -------------------------------------- | -------------------------------------------------- | ----- |
| `ST-ID-001` | `ST-100`–`ST-102`                      | `AT-ID-001`, `AT-ID-002`                           | Beta  |
| `ST-ID-002` | `ST-100`                               | `AT-ID-009`                                        | Beta  |
| `ST-ID-003` | `ST-102`, `ST-108`                     | `AT-ID-001`, `AT-ID-002`, `AT-ID-006`              | Beta  |
| `ST-ID-004` | `ST-104`, `ST-112`                     | `AT-ID-003`                                        | Beta  |
| `ST-ID-005` | `ST-102`, `ST-112`, `ST-213`, `ST-515` | `AT-ID-004`, `AT-ID-007`                           | Beta  |
| `ST-ID-006` | `ST-103`, `ST-114`                     | `AT-ID-005`                                        | Beta  |
| `ST-ID-007` | `ST-115`, `ST-209`, `ST-210`           | `AT-ID-010`                                        | Beta  |
| `ST-ID-008` | `ST-103`, `ST-106`, `ST-113`           | `AT-ID-008`                                        | Beta  |
| `ST-ID-009` | `ST-102`, `ST-113`, `ST-610`, `ST-612` | `AT-ID-011`                                        | Beta  |
| `ST-CN-001` | `ST-106`, `ST-113`                     | `AT-CN-001`, `AT-CN-002`                           | Beta  |
| `ST-CN-002` | `ST-106`, `ST-113`                     | `AT-CN-002`                                        | Beta  |
| `ST-CN-003` | `ST-006`, `ST-106`, `ST-113`, `ST-201` | `AT-CN-001`                                        | Beta  |
| `ST-CN-004` | `ST-107`, `ST-210`                     | `AT-CN-005`                                        | Beta  |
| `ST-CN-005` | `ST-107`, `ST-210`, `ST-505`           | `AT-CN-003`, `AT-CN-004`, `AT-RC-009`              | Beta  |
| `ST-CN-006` | `ST-106`, `ST-213`, `ST-601`           | `AT-CN-007`, `AT-CN-008`                           | Beta  |
| `ST-CN-007` | `ST-505`, `ST-804`                     | `AT-CN-006`, `AT-RC-011`                           | Beta  |
| `ST-CN-008` | `ST-117`, `ST-210`, `ST-213`, `ST-505` | `AT-CN-009`                                        | Beta  |
| `ST-CL-001` | `ST-200`, `ST-201`                     | `AT-CL-001`                                        | Beta  |
| `ST-CL-002` | `ST-202`–`ST-204`                      | `AT-CL-002`, `AT-CL-003`                           | Beta  |
| `ST-CL-003` | `ST-205`                               | `AT-CL-004`                                        | Beta  |
| `ST-CL-004` | `ST-200`, `ST-201`, `ST-210`, `ST-213` | `AT-CL-001`, `AT-CL-002`                           | Beta  |
| `ST-CL-005` | `ST-206`–`ST-208`, `ST-211`            | `AT-CL-005`, `AT-CL-006`, `AT-CL-007`, `AT-CL-008` | Beta  |
| `ST-CL-006` | `ST-211`                               | `AT-CL-008`                                        | Beta  |
| `ST-CL-007` | `ST-212`                               | `AT-CL-002`                                        | Beta  |
| `ST-CL-008` | `ST-207`, `ST-208`, `ST-215`           | `AT-CL-001`, `AT-CL-009`, `AT-CL-010`              | Beta  |
| `ST-CL-009` | `ST-205`, `ST-209`, `ST-210`, `ST-505` | `AT-CN-004`, `AT-RC-009`, `AT-RC-011`              | Beta  |

## Story and AI

| Requirement | Work package(s)                        | Acceptance test(s)                    | Stage |
| ----------- | -------------------------------------- | ------------------------------------- | ----- |
| `ST-ST-001` | `ST-300`, `ST-301`                     | `AT-ST-001`                           | Beta  |
| `ST-ST-002` | `ST-302`, `ST-303`                     | `AT-ST-001`, `AT-ST-002`              | Beta  |
| `ST-ST-003` | `ST-304`                               | `AT-ST-003`, `AT-ST-004`              | Beta  |
| `ST-ST-004` | `ST-305`, `ST-306`                     | `AT-ST-003`, `AT-ST-007`              | Beta  |
| `ST-ST-005` | `ST-306`, `ST-400`                     | `AT-ST-004`, `AT-ST-005`              | Beta  |
| `ST-ST-006` | `ST-307`, `ST-402`, `ST-403`           | `AT-ST-005`, `AT-AI-012`              | Beta  |
| `ST-ST-007` | `ST-308`, `ST-311`                     | `AT-ST-006`                           | Beta  |
| `ST-ST-008` | `ST-309`, `ST-310`, `ST-313`, `ST-318` | `AT-ST-007`, `AT-ST-008`, `AT-CL-007` | Beta  |
| `ST-AI-001` | `ST-403`–`ST-408`                      | `AT-AI-001`                           | Beta  |
| `ST-AI-002` | `ST-402`, `ST-403`                     | `AT-ST-005`, `AT-AI-012`              | Beta  |
| `ST-AI-003` | `ST-404`                               | `AT-AI-003`, `AT-AI-006`              | Beta  |
| `ST-AI-004` | `ST-405`                               | `AT-AI-004`                           | Beta  |
| `ST-AI-005` | `ST-405`, `ST-409`                     | `AT-AI-002`                           | Beta  |
| `ST-AI-006` | `ST-404`, `ST-406`, `ST-408`           | `AT-AI-003`, `AT-AI-014`              | Beta  |
| `ST-AI-007` | `ST-411`, `ST-413`                     | `AT-AI-002`, `AT-AI-005`, `AT-AI-006` | Beta  |
| `ST-AI-008` | `ST-409`                               | `AT-AI-007`, `AT-AI-010`              | Beta  |
| `ST-AI-009` | `ST-406`, `ST-414`                     | `AT-AI-003`, `AT-AI-004`, `AT-AI-007` | Beta  |
| `ST-AI-010` | `ST-014`, `ST-416`                     | `AT-AI-010`                           | Beta  |
| `ST-AI-011` | `ST-014`, `ST-417`                     | `AT-AI-011`                           | Beta  |
| `ST-AI-012` | `ST-403`, `ST-418`                     | `AT-AI-012`                           | Beta  |
| `ST-AI-013` | `ST-407`, `ST-419`                     | `AT-AI-013`                           | Beta  |
| `ST-AI-014` | `ST-406`, `ST-408`, `ST-414`           | `AT-AI-014`                           | Beta  |

## Recording, replay, and Vault

| Requirement | Work package(s)              | Acceptance test(s)                                                           | Stage |
| ----------- | ---------------------------- | ---------------------------------------------------------------------------- | ----- |
| `ST-RC-001` | `ST-501`, `ST-503`           | `AT-RC-001`, `AT-RC-010`                                                     | Beta  |
| `ST-RC-002` | `ST-500`, `ST-505`           | `AT-CN-003`, `AT-RC-009`, `AT-RC-011`                                        | Beta  |
| `ST-RC-003` | `ST-310`, `ST-503`           | `AT-RC-003`                                                                  | Beta  |
| `ST-RC-004` | `ST-310`, `ST-503`, `ST-508` | `AT-RC-003`, `AT-MV-001`                                                     | Beta  |
| `ST-RC-005` | `ST-502`, `ST-506`           | `AT-RC-002`, `AT-RC-010`                                                     | Beta  |
| `ST-RC-006` | `ST-506`, `ST-513`           | `AT-RC-004`, `AT-RC-005`, `AT-RC-006`                                        | Beta  |
| `ST-RC-007` | `ST-504`, `ST-507`           | `AT-RC-007`                                                                  | Beta  |
| `ST-RC-008` | `ST-504`, `ST-515`           | `AT-RC-007`, `AT-RC-008`, `AT-PR-006`                                        | Beta  |
| `ST-MV-001` | `ST-508`, `ST-509`, `ST-513` | `AT-MV-001`, `AT-MV-002`, `AT-MV-003`, `AT-MV-012`                           | Beta  |
| `ST-MV-002` | `ST-508`, `ST-510`           | `AT-MV-004`, `AT-MV-005`, `AT-MV-011`                                        | Beta  |
| `ST-MV-003` | `ST-511`, `ST-512`           | `AT-MV-004`, `AT-MV-005`, `AT-MV-006`, `AT-MV-007`, `AT-MV-012`              | Beta  |
| `ST-MV-004` | `ST-514`                     | `AT-MV-008`, `AT-OP-005`                                                     | Beta  |
| `ST-MV-005` | `ST-513`, `ST-514`           | `AT-MV-002`, `AT-MV-003`                                                     | Beta  |
| `ST-MV-006` | `ST-515`                     | `AT-RC-008`, `AT-PR-006`                                                     | Beta  |
| `ST-MV-007` | `ST-516`                     | `AT-MV-009`, `AT-AI-014`                                                     | Beta  |
| `ST-MV-008` | `ST-704`, `ST-706`, `ST-915` | `AT-EN-005`, `AT-PR-011`, `AT-CM-001`, `AT-CM-002`, `AT-CM-003`, `AT-CM-004` | Both  |
| `ST-MV-009` | `ST-508`, `ST-510`, `ST-517` | `AT-MV-011`                                                                  | Beta  |

## Operations, entitlements, and privacy

| Requirement | Work package(s)                        | Acceptance test(s)                                                                        | Stage |
| ----------- | -------------------------------------- | ----------------------------------------------------------------------------------------- | ----- |
| `ST-OP-001` | `ST-105`, `ST-202`, `ST-707`           | `AT-OP-001`                                                                               | Beta  |
| `ST-OP-002` | `ST-707`                               | `AT-OP-002`                                                                               | Beta  |
| `ST-OP-003` | `ST-704`, `ST-705`, `ST-914`           | `AT-EN-003`, `AT-CM-001`, `AT-CM-002`, `AT-CM-003`                                        | Both  |
| `ST-OP-004` | `ST-703`                               | `AT-EN-001`, `AT-EN-002`                                                                  | Beta  |
| `ST-OP-005` | `ST-702`                               | `AT-EN-004`                                                                               | Beta  |
| `ST-OP-006` | `ST-412`, `ST-709`                     | `AT-EN-006`, `AT-EN-007`                                                                  | Beta  |
| `ST-OP-007` | `ST-610`, `ST-611`, `ST-613`           | `AT-OP-003`                                                                               | Beta  |
| `ST-OP-008` | `ST-116`, `ST-700`                     | `AT-OP-004`, `AT-OP-006`                                                                  | Beta  |
| `ST-OP-009` | `ST-612`, `ST-614`, `ST-808`, `ST-818` | `AT-OP-007`                                                                               | Beta  |
| `ST-PR-001` | `ST-605`, `ST-701`, `ST-707`           | `AT-PR-001`, `AT-PR-010`, `AT-OP-005`                                                     | Beta  |
| `ST-PR-002` | `ST-600`–`ST-604`, `ST-615`            | `AT-PR-002`, `AT-PR-003`, `AT-PR-004`, `AT-PR-005`, `AT-PR-006`, `AT-PR-007`, `AT-PR-008` | Beta  |
| `ST-PR-003` | `ST-600`, `ST-601`                     | `AT-PR-003`, `AT-PR-005`                                                                  | Beta  |
| `ST-PR-004` | `ST-601`, `ST-603`, `ST-610`, `ST-615` | `AT-PR-004`, `AT-PR-007`, `AT-PR-009`                                                     | Beta  |
| `ST-PR-005` | `ST-606`                               | `AT-MV-010`, `AT-PR-008`                                                                  | Beta  |
| `ST-PR-006` | `ST-605`, `ST-706`, `ST-915`           | `AT-PR-010`, `AT-PR-011`, `AT-EN-005`                                                     | Both  |

## Surface and release proof

| Contract                                            | Work package(s)                                                                                         | Acceptance test(s)                                                                                     | Stage      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| [Screen/state inventory](screen-state-inventory.md) | `ST-110`–`ST-116`, `ST-203`–`ST-211`, `ST-300`–`ST-319`, `ST-514`–`ST-517`, `ST-610`, `ST-700`–`ST-710` | `AT-OP-005`, `AT-OP-006`, accessibility §5, pilot §10                                                  | Beta       |
| PRD §10 service objectives                          | `ST-214`, `ST-215`, `ST-415`, `ST-519`, `ST-805`                                                        | `AT-CL-009`, `AT-CL-010`, `AT-AI-008`, `AT-AI-009`, `AT-MV-005`, `AT-MV-006`, `AT-MV-007`, `AT-EN-007` | Beta       |
| Commercial surfaces                                 | `ST-911`–`ST-916`                                                                                       | `AT-CM-001`, `AT-CM-002`, `AT-CM-003`, `AT-CM-004`, `AT-CM-005`, `AT-CM-006`, `AT-OP-005`              | Commercial |

## Maintenance rule

A change to a PRD requirement is incomplete until this map, the implementation package acceptance, and the named test are updated in the same PR. A test may prove multiple requirements, but a requirement cannot rely only on a screenshot, issue status, or manual claim when a deterministic automated test is feasible.
