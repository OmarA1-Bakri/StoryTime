export function isStrongServiceSecret(value: string | undefined): value is string {
  return typeof value === "string" && value.length >= 32;
}

export function normalizeConvexSiteUrl(
  value: string | undefined,
  options: { allowLocal?: boolean } = {},
): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const localAllowed =
      options.allowLocal === true &&
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1");
    const hostedAllowed = url.protocol === "https:" && url.hostname.endsWith(".convex.site");
    if (
      (!localAllowed && !hostedAllowed) ||
      url.username ||
      url.password ||
      (url.pathname !== "/" && url.pathname !== "") ||
      url.search ||
      url.hash
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}
