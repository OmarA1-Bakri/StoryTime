export * from "./access";
export * from "./consent";
export * from "./recording";
export * from "./restrictedMode";
export * from "./schemas";
export * from "./sessionLifecycle";
export * from "./story";
export * from "./storyFlow";
export * from "./usage";

export function assertNonEmptyString(value: string, fieldName: string): string {
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} must not be empty`);
  }
  return value;
}
