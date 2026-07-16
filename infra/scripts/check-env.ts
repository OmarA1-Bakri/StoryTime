import { summarizeReadiness } from "../../packages/config/src/capabilities";

type AppEnv = "development" | "preview" | "production";

const appEnv = (process.env.APP_ENV ?? "development") as AppEnv;
const isProduction = appEnv === "production";

const requiredProductionVariables = [
  "CONVEX_DEPLOYMENT",
  "NEXT_PUBLIC_CONVEX_URL",
  "STORYTIME_DATA_REGION",
  "R2_BUCKET_MEDIA",
  "R2_BUCKET_PRIVATE",
  "LIVEKIT_URL",
  "LIVEKIT_API_KEY",
  "LIVEKIT_API_SECRET",
];

const mockProviderVariables = [
  "VPC_PROVIDER",
  "AI_MODE",
  "STT_PROVIDER",
  "STORY_PROVIDER",
  "IMAGE_PROVIDER",
  "SAFETY_PROVIDER",
  "BILLING_PROVIDER",
];

function fail(message: string): never {
  throw new Error(`[StoryTime env check] ${message}`);
}

if (isProduction) {
  const missing = requiredProductionVariables.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    fail(`Missing production environment variables: ${missing.join(", ")}`);
  }

  const mockProviders = mockProviderVariables.filter((key) => process.env[key] === "mock");
  if (mockProviders.length > 0) {
    fail(`Production cannot use mock providers: ${mockProviders.join(", ")}`);
  }

  if (process.env.R2_PUBLIC_BASE_URL && process.env.R2_PUBLIC_BASE_URL.includes("public")) {
    fail("R2 public base URL must not imply public write access");
  }

  if (process.env.STORYTIME_DATA_REGION === "local") {
    fail("Production family data region must be an explicit hosted region");
  }

  const readiness = summarizeReadiness(process.env);
  if (!readiness.ready) {
    const missing = readiness.capabilities
      .filter((capability) => capability.state !== "live" && capability.name !== "billing")
      .flatMap((capability) => capability.missingVariables)
      .filter((name, index, variables) => variables.indexOf(name) === index);
    const detail = missing.length > 0 ? `; missing or unverified: ${missing.join(", ")}` : "";
    fail(`Production capabilities are not live: ${readiness.blockers.join(", ")}${detail}`);
  }
}

console.log(`StoryTime environment guard passed for ${appEnv}.`);
