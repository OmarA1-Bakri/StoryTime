import type { ReactNode } from "react";
import { StyleSheet, Text as NativeText } from "react-native";

export function Text({ children, variant = "body" }: { children: ReactNode; variant?: "title" | "body" | "label" }) {
  return <NativeText style={[styles.base, styles[variant]]}>{children}</NativeText>;
}

const styles = StyleSheet.create({
  base: { color: "#f7ead0" },
  title: { fontSize: 34, fontWeight: "800", lineHeight: 38 },
  body: { fontSize: 17, lineHeight: 24, color: "#c7b8d7" },
  label: { fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: "#f4c979", fontWeight: "800" }
});
