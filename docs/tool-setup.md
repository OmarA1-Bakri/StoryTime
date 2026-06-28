# Tool Setup

Status: setup-phase notes.

## Composio availability matrix

| Tool | Available? | Exact actions/tool names found | Intended use | Setup blocker? |
|---|---|---|---|---|
| GitHub | Yes — active | `GITHUB_CREATE_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER`, `GITHUB_GET_A_REPOSITORY`, `GITHUB_COMMIT_MULTIPLE_FILES`, `GITHUB_CREATE_A_LABEL`, `GITHUB_UPDATE_BRANCH_PROTECTION` | Private repo, labels, branch protection, scaffold commits | No |
| Linear | Yes — active | `LINEAR_LIST_LINEAR_TEAMS`, `LINEAR_LIST_LINEAR_PROJECTS`, `LINEAR_CREATE_LINEAR_PROJECT`, `LINEAR_CREATE_LINEAR_ISSUE`, `LINEAR_RUN_QUERY_OR_MUTATION` | Project tracking, setup tickets, phase milestones where supported | No |
| Mem0 | Yes — active | `MEM0_ADD_NEW_MEMORY_RECORDS`, `MEM0_SEARCH_MEMORIES_WITH_QUERY_FILTERS`, `MEM0_RETRIEVE_MEMORY_LIST`, `MEM0_CREATE_A_NEW_AGENT` | Canonical project memory and delivery state | No |
| Vercel | Yes — active | `VERCEL_CREATE_PROJECT2`, `VERCEL_GET_PROJECT2`, `VERCEL_GET_TEAMS`, `VERCEL_CREATE_NEW_DEPLOYMENT` | Web project setup and future deployment linkage | No |
| Convex | Yes — active | `CONVEX_CREATE_PROJECT`, `CONVEX_CREATE_DEPLOYMENT`, `CONVEX_GET_PROJECT_BY_SLUG`, `CONVEX_LIST_PROJECTS` | Backend project/deployment linkage | No |
| Codacy | Yes — active | `CODACY_GET_HEALTH`, `CODACY_LIST_PROJECTS`, `CODACY_LIST_ANALYSIS_ORGANIZATIONS_REPOSITORIES`, `CODACY_LIST_LANGUAGES_TOOLS` | Quality tooling verification; repository import may require manual UI if no create/link action is available | No — manual fallback if linking unavailable |
| Cloudflare | Yes — active | `CLOUDFLARE_LIST_ACCOUNTS`, `CLOUDFLARE_LIST_ZONES`, `CLOUDFLARE_LIST_DNS_RECORDS`; R2-specific action not discovered | Future R2 media storage setup | No — optional for setup |
| Sentry | Yes — active | `SENTRY_ACCESS_PROJECT_INFORMATION`, `SENTRY_RETRIEVE_PROJECT_ISSUES_LIST`, `SENTRY_GET_PROJECT_EVENTS` | Future runtime monitoring | No — optional |
| PostHog | Yes — active | `POSTHOG_WHOAMI`, `POSTHOG_LIST_ALL_PROJECTS_ACROSS_ORGANIZATIONS`, `POSTHOG_RETRIEVE_ORGANIZATION_PROJECT_DETAILS` | Future product analytics | No — optional |
| Slack | No active connection | `SLACK_SEND_MESSAGE`, `SLACK_FIND_CHANNELS` discovered but not connected | Future project notifications | No — optional |
| Figma | No active connection | `FIGMA_DISCOVER_FIGMA_RESOURCES`, `FIGMA_GET_FILE_JSON`, `FIGMA_GET_FILE_NODES` discovered but not connected | Future design ingestion | No — optional |
| Stripe | No active connection | `STRIPE_LIST_SUBSCRIPTIONS`, `STRIPE_CREATE_SUBSCRIPTION`, `STRIPE_UPDATE_SUBSCRIPTION` discovered but not connected | Future billing/entitlement experiments | No — optional |

## Fallbacks

- Codacy: if repository import/linking cannot be performed through available actions, configure manually in Codacy and record the result in Linear.
- Cloudflare R2: no R2-specific bucket action was discovered; document manual R2 setup when media storage work begins.
- Slack, Figma, Stripe: discovered but not actively connected. Treat as optional and do not block setup.
- Do not store secrets or production credentials in source control.
