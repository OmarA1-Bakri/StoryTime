type AppEnv = "development" | "preview" | "production";

const appEnv = (process.env.APP_ENV ?? "development") as AppEnv;
const isProduction = appEnv === "production";

const requiredProductionVariables = [
  "CONVEX_DEPLOYMENT",
  "NEXT_PUBLIC_CONVEX_URL",
  "R2_BUCKET_MEDIA",
  "R2_BUCKET_PRIVATE",
  "LIVEKIT_URL",
  "LIVEKIT_API_KEY",
  "LIVEKIT_API_SECRET"
];

const mockProviderVariables = [
  "VPC_PROVIDER",
  "AI_MODE",
  "STT_PROVIDER",
  "STORY_PROVIDER",
  "IMAGE_PROVIDER",
  "SAFETY_PROVIDER",
  "BILLING_PROVIDER"
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
}

console.log(`StoryTime environment guard passed for ${appEnv}.`);
