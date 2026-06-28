export function assertNonEmptyString(value: string, fieldName: string): string {
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} must not be empty`);
  }

  return value;
}
