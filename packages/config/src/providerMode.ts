export type ProviderMode = "mock" | "live";

export function readProviderMode(value: string | undefined): ProviderMode {
  return value === "live" ? "live" : "mock";
}

export function isMockMode(value: string | undefined): boolean {
  return readProviderMode(value) === "mock";
}
