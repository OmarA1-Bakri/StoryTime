const childSafeRoutePrefixes = [
  "/call/handoff",
  "/story/setup",
  "/story/room",
  "/story/audio-fallback",
  "/story/paused",
  "/story/ending"
];

const adultOnlyRoutePrefixes = [
  "/app",
  "/pricing",
  "/privacy",
  "/terms",
  "/child-privacy",
  "/record-preview",
  "/call/connect",
  "/call/confirm",
  "/call/waiting",
  "/story/checkpoint"
];

export function isChildSafeRoute(pathname: string): boolean {
  return childSafeRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isAdultOnlyRoute(pathname: string): boolean {
  return adultOnlyRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function requireChildSafeRoute(pathname: string): void {
  if (!isChildSafeRoute(pathname)) {
    throw new Error(`Route is not allowed in child-safe mode: ${pathname}`);
  }
}
