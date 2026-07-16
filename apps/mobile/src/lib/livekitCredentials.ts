export type StoryParticipantType = "remote_adult" | "nearby_adult";

export type LiveKitCredentials = {
  serverUrl: string;
  token: string;
  expiresInSeconds: number;
};

export type LiveKitCredentialRequest = {
  sessionId: string;
  displayName: string;
  participantType: StoryParticipantType;
};

export async function fetchLiveKitCredentials(
  input: LiveKitCredentialRequest,
  sessionToken?: string | null,
): Promise<LiveKitCredentials> {
  const apiBaseUrl = process.env.EXPO_PUBLIC_STORYTIME_API_URL;
  if (!apiBaseUrl) throw new Error("EXPO_PUBLIC_STORYTIME_API_URL is not configured");

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/livekit/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(sessionToken ? { authorization: `Bearer ${sessionToken}` } : {}),
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(failure?.error ?? `Unable to join StoryTime room (${response.status})`);
  }
  return response.json() as Promise<LiveKitCredentials>;
}
