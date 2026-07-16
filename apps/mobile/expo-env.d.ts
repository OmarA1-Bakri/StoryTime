declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_STORYTIME_API_URL?: string;
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    EXPO_PUBLIC_CONVEX_URL?: string;
  }
}

declare const process: { env: NodeJS.ProcessEnv };
