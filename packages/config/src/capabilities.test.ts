import { describe, expect, it } from "vitest";
import { readProviderCapabilities, summarizeReadiness } from "./capabilities";

const liveEnv = {
  APP_ENV: "production",
  NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud",
  IDENTITY_PROVIDER: "clerk",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_example",
  CLERK_SECRET_KEY: "sk_test_example",
  CLERK_JWT_ISSUER_DOMAIN: "https://example.clerk.accounts.dev",
  CLERK_INSTANCE_ID: "ins_storytime_prod",
  CLERK_WEBHOOK_SIGNING_SECRET: "whsec_example",
  CLERK_SYNC_SECRET: "s".repeat(32),
  CONVEX_SITE_URL: "https://example.convex.site",
  LIVEKIT_URL: "wss://example.livekit.cloud",
  LIVEKIT_API_KEY: "key",
  LIVEKIT_API_SECRET: "secret",
  RECORDING_MODE: "live",
  STORAGE_MODE: "live",
  STORAGE_PROVIDER: "r2",
  R2_ENDPOINT: "https://r2.example.com",
  R2_ACCESS_KEY_ID: "key",
  R2_SECRET_ACCESS_KEY: "secret",
  R2_BUCKET_PRIVATE: "private",
  STT_PROVIDER: "groq",
  GROQ_API_KEY: "groq-key",
  GROQ_ZDR_ENABLED: "true",
  AI_MODE: "live",
  STORY_PROVIDER: "openai",
  OPENAI_API_KEY: "openai-key",
  OPENAI_ZDR_APPROVED: "true",
  IMAGE_PROVIDER: "fal",
  FAL_KEY: "fal-key",
  FAL_IMAGE_ENDPOINT: "https://fal.example.com/model",
  FAL_PRIVATE_OUTPUT_VERIFIED: "true",
  FAL_MEDIA_RETENTION_VERIFIED: "true",
  SAFETY_PROVIDER: "openai",
  VPC_PROVIDER: "kws",
  BILLING_PROVIDER: "disabled",
};

describe("provider capability registry", () => {
  it("reports a live launch-critical environment as ready", () => {
    const readiness = summarizeReadiness(liveEnv);
    expect(readiness.ready).toBe(true);
    expect(readiness.blockers).toEqual([]);
    expect(readiness.capabilities.find((item) => item.name === "billing")?.state).toBe("missing");
  });

  it("never treats mock providers as live", () => {
    const capabilities = readProviderCapabilities({ ...liveEnv, STORY_PROVIDER: "mock" });
    expect(capabilities.find((item) => item.name === "story")?.state).toBe("mock");
  });

  it("requires the server-only Clerk lifecycle sync boundary", () => {
    const capabilities = readProviderCapabilities({ ...liveEnv, CLERK_SYNC_SECRET: "too-short" });
    expect(capabilities.find((item) => item.name === "identity")).toMatchObject({
      state: "missing",
      missingVariables: ["CLERK_SYNC_SECRET"],
    });
  });

  it("exposes missing infrastructure without leaking values", () => {
    const readiness = summarizeReadiness({ APP_ENV: "preview", AI_MODE: "mock" });
    expect(readiness.ready).toBe(false);
    expect(readiness.blockers).toContain("realtimeCall");
    expect(
      readiness.capabilities.find((item) => item.name === "realtimeCall")?.missingVariables,
    ).toContain("LIVEKIT_API_SECRET");
  });

  it("requires explicit child-data control attestations for live AI providers", () => {
    const capabilities = readProviderCapabilities({
      ...liveEnv,
      OPENAI_ZDR_APPROVED: "false",
      GROQ_ZDR_ENABLED: "false",
      FAL_PRIVATE_OUTPUT_VERIFIED: "false",
      FAL_MEDIA_RETENTION_VERIFIED: "false",
    });

    expect(capabilities.find((item) => item.name === "story")).toMatchObject({
      state: "missing",
      missingVariables: ["OPENAI_ZDR_APPROVED"],
    });
    expect(capabilities.find((item) => item.name === "safety")).toMatchObject({
      state: "missing",
      missingVariables: ["OPENAI_ZDR_APPROVED"],
    });
    expect(capabilities.find((item) => item.name === "stt")).toMatchObject({
      state: "missing",
      missingVariables: ["GROQ_ZDR_ENABLED"],
    });
    expect(capabilities.find((item) => item.name === "image")).toMatchObject({
      state: "missing",
      missingVariables: ["FAL_PRIVATE_OUTPUT_VERIFIED", "FAL_MEDIA_RETENTION_VERIFIED"],
    });
  });
});
