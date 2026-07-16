export const providerCapabilityNames = [
  "backend",
  "identity",
  "realtimeCall",
  "recording",
  "storage",
  "stt",
  "story",
  "image",
  "safety",
  "consent",
  "billing",
] as const;

export type ProviderCapabilityName = (typeof providerCapabilityNames)[number];
export type ProviderCapabilityState = "live" | "mock" | "missing";

export type ProviderCapability = {
  name: ProviderCapabilityName;
  state: ProviderCapabilityState;
  provider: string | null;
  missingVariables: string[];
};

export type CapabilityEnvironment = Record<string, string | undefined>;

type CapabilityDefinition = {
  name: ProviderCapabilityName;
  modeVariable?: string;
  providerVariable?: string;
  requiredVariables: string[];
  requiredValues?: Record<string, string>;
};

const definitions: CapabilityDefinition[] = [
  { name: "backend", requiredVariables: ["NEXT_PUBLIC_CONVEX_URL"] },
  {
    name: "identity",
    providerVariable: "IDENTITY_PROVIDER",
    requiredVariables: [
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      "CLERK_SECRET_KEY",
      "CLERK_JWT_ISSUER_DOMAIN",
    ],
  },
  {
    name: "realtimeCall",
    requiredVariables: ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"],
  },
  {
    name: "recording",
    modeVariable: "RECORDING_MODE",
    requiredVariables: ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"],
  },
  {
    name: "storage",
    modeVariable: "STORAGE_MODE",
    providerVariable: "STORAGE_PROVIDER",
    requiredVariables: [
      "R2_ENDPOINT",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_PRIVATE",
    ],
  },
  {
    name: "stt",
    providerVariable: "STT_PROVIDER",
    requiredVariables: ["GROQ_API_KEY", "GROQ_ZDR_ENABLED"],
    requiredValues: { GROQ_ZDR_ENABLED: "true" },
  },
  {
    name: "story",
    modeVariable: "AI_MODE",
    providerVariable: "STORY_PROVIDER",
    requiredVariables: ["OPENAI_API_KEY", "OPENAI_ZDR_APPROVED"],
    requiredValues: { OPENAI_ZDR_APPROVED: "true" },
  },
  {
    name: "image",
    providerVariable: "IMAGE_PROVIDER",
    requiredVariables: [
      "FAL_KEY",
      "FAL_IMAGE_ENDPOINT",
      "FAL_PRIVATE_OUTPUT_VERIFIED",
      "FAL_MEDIA_RETENTION_VERIFIED",
    ],
    requiredValues: {
      FAL_PRIVATE_OUTPUT_VERIFIED: "true",
      FAL_MEDIA_RETENTION_VERIFIED: "true",
    },
  },
  {
    name: "safety",
    providerVariable: "SAFETY_PROVIDER",
    requiredVariables: ["OPENAI_API_KEY", "OPENAI_ZDR_APPROVED"],
    requiredValues: { OPENAI_ZDR_APPROVED: "true" },
  },
  { name: "consent", providerVariable: "VPC_PROVIDER", requiredVariables: [] },
  { name: "billing", providerVariable: "BILLING_PROVIDER", requiredVariables: [] },
];

function isLiveValue(value: string | undefined): boolean {
  return Boolean(value && value !== "mock" && value !== "local" && value !== "disabled");
}

export function readProviderCapabilities(env: CapabilityEnvironment): ProviderCapability[] {
  return definitions.map((definition) => {
    const provider = definition.providerVariable
      ? (env[definition.providerVariable] ?? null)
      : null;
    const mode = definition.modeVariable ? env[definition.modeVariable] : undefined;
    const missingVariables = definition.requiredVariables.filter((key) => {
      const requiredValue = definition.requiredValues?.[key];
      return requiredValue === undefined ? !env[key] : env[key] !== requiredValue;
    });
    const explicitlyMock = provider === "mock" || mode === "mock" || mode === "local";
    const providerConfigured = definition.providerVariable
      ? isLiveValue(provider ?? undefined)
      : true;
    const modeConfigured = definition.modeVariable ? mode === "live" : true;
    const state: ProviderCapabilityState = explicitlyMock
      ? "mock"
      : missingVariables.length === 0 && providerConfigured && modeConfigured
        ? "live"
        : "missing";

    return { name: definition.name, state, provider, missingVariables };
  });
}

export function summarizeReadiness(env: CapabilityEnvironment) {
  const capabilities = readProviderCapabilities(env);
  const required = capabilities.filter((item) => item.name !== "billing");
  const ready = required.every((item) => item.state === "live");
  return {
    ready,
    environment: env.APP_ENV ?? env.NODE_ENV ?? "development",
    capabilities,
    blockers: required.filter((item) => item.state !== "live").map((item) => item.name),
  };
}
