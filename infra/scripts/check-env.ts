type AppEnv = "development" | "preview" | "production";

const env = process.env.APP_ENV as AppEnv | undefined;
const isProduction = env === "production";

const requiredProductionVariables = [
  "CONVEX_DEPLOYMENT",
  "NEXT_PUBLIC_CONVEX_URL",
  "R2_BUCKET_MEDIA",
  "R2_BUCKET_PRIVATE"
];

const mockProviderVariables = [
  "VPC_PROVIDER",
  "AI_MODE",
  "STT_PROVIDER",
  "STORY_PROVIDER",
  "IMAGE_PROVIDER",
  "SAFETY_PROVIDER"
];

if (isProduction) {
  const missing = requiredProductionVariables.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing production environment variables: ${missing.join(", ")}`);
  }

  const mockProviders = mockProviderVariables.filter((key) => process.env[key] === "mock");
  if (mockProviders.length > 0) {
    throw new Error(`Production cannot use mock providers: ${mockProviders.join(", ")}`);
  }
}

console.log("Environment guard placeholder passed.");
