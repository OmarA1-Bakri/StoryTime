import { useLocalSearchParams } from "expo-router";
import { useAuth, useUser } from "@clerk/expo";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StoryCall } from "../../../components/live/StoryCall";
import { fetchLiveKitCredentials, type LiveKitCredentials } from "../../../lib/livekitCredentials";
import { useStorySession } from "../../../lib/useStorySession";

export default function StoryRoomScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const id = sessionId ?? "demo-session";
  const session = useStorySession(id);
  const { getToken } = useAuth();
  const { user } = useUser();
  const [credentials, setCredentials] = useState<LiveKitCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  async function joinRoom() {
    setJoining(true);
    setError(null);
    try {
      const sessionToken = await getToken();
      const result = await fetchLiveKitCredentials(
        {
          sessionId: id,
          displayName:
            user?.fullName || user?.primaryEmailAddress?.emailAddress || "StoryTime adult",
          participantType: "remote_adult",
        },
        sessionToken,
      );
      setCredentials(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to join the story room");
    } finally {
      setJoining(false);
    }
  }

  if (credentials) {
    return (
      <StoryCall
        credentials={credentials}
        onConnected={session.join}
        onDisconnected={session.leave}
        onError={setError}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Story room</Text>
        <Text style={styles.title}>Shared adventure session</Text>
        <Text style={styles.body}>
          Session {id} is {session.status}.
        </Text>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            style={styles.button}
            onPress={joinRoom}
            disabled={joining}
          >
            <Text style={styles.buttonText}>{joining ? "Joining…" : "Join live room"}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={session.leave}>
            <Text style={styles.secondaryButtonText}>Leave</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 24, justifyContent: "center" },
  card: { backgroundColor: "#111827", borderRadius: 24, padding: 24, gap: 12 },
  eyebrow: { color: "#93c5fd", fontSize: 13, fontWeight: "700", textTransform: "uppercase" },
  title: { color: "white", fontSize: 28, fontWeight: "800" },
  body: { color: "#cbd5e1", fontSize: 16, lineHeight: 24 },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  button: {
    backgroundColor: "#f8fafc",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: { color: "#111827", fontWeight: "800" },
  secondaryButton: {
    borderColor: "#475569",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryButtonText: { color: "#f8fafc", fontWeight: "800" },
  error: { color: "#fda4af", fontSize: 14, lineHeight: 20 },
});
