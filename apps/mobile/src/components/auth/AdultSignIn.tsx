import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export function AdultSignIn() {
  const { startSSOFlow } = useSSO();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(strategy: "oauth_google" | "oauth_apple") {
    setLoading(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/(adult)/dashboard"),
      });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.stack}>
      <Pressable
        accessibilityRole="button"
        style={styles.primary}
        disabled={loading}
        onPress={() => signIn("oauth_google")}
      >
        <Text style={styles.primaryText}>{loading ? "Connecting…" : "Continue with Google"}</Text>
      </Pressable>
      {Platform.OS === "ios" ? (
        <Pressable
          accessibilityRole="button"
          style={styles.secondary}
          disabled={loading}
          onPress={() => signIn("oauth_apple")}
        >
          <Text style={styles.secondaryText}>Continue with Apple</Text>
        </Pressable>
      ) : null}
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12, width: "100%" },
  primary: { backgroundColor: "#6d4aff", padding: 16, borderRadius: 999 },
  primaryText: { color: "white", textAlign: "center", fontWeight: "900" },
  secondary: { borderColor: "#6d4aff", borderWidth: 1, padding: 16, borderRadius: 999 },
  secondaryText: { color: "#6d4aff", textAlign: "center", fontWeight: "900" },
  error: { color: "#be123c", lineHeight: 20 },
});
