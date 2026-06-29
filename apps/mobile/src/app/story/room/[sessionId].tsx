import { useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useStorySession } from "../../../lib/useStorySession";

export default function StoryRoomScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const id = sessionId ?? "demo-session";
  const session = useStorySession(id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Story room</Text>
        <Text style={styles.title}>Shared adventure session</Text>
        <Text style={styles.body}>Session {id} is {session.status}.</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={session.join}>
            <Text style={styles.buttonText}>Join</Text>
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
  button: { backgroundColor: "#f8fafc", borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12 },
  buttonText: { color: "#111827", fontWeight: "800" },
  secondaryButton: { borderColor: "#475569", borderWidth: 1, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12 },
  secondaryButtonText: { color: "#f8fafc", fontWeight: "800" }
});
