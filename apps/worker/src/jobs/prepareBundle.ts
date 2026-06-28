export function prepareBundle(sessionId: string): string {
  return `bundles/${sessionId}/manifest.json`;
}
