declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_STORYTIME_API_URL?: string;
    EXPO_PUBLIC_STORYTIME_BETA_ACCESS_KEY?: string;
  }
}

declare const process: { env: NodeJS.ProcessEnv };
