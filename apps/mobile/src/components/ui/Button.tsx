import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function Button({ children, onPress, tone = "primary" }: { children: ReactNode; onPress?: () => void; tone?: "primary" | "secondary" | "danger" }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button, styles[tone]]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 999, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginTop: 12 },
  primary: { backgroundColor: "#f4c979" },
  secondary: { backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  danger: { backgroundColor: "#fca5a5" },
  text: { color: "#170f20", fontWeight: "900" }
});
