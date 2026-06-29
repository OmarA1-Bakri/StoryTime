export function canRunAttempt(attempt: number, maxAttempts = 3): boolean {
  return attempt < maxAttempts;
}

export function attemptDelayMs(attempt: number, baseDelayMs = 500): number {
  return baseDelayMs * Math.max(1, attempt + 1);
}
