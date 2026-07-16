import { useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text as NativeText, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";

type Consent = {
  status: "pending" | "verified" | "rejected" | "revoked" | "expired" | "not_started";
} | null;
const getCurrent = makeFunctionReference<"query", Record<string, never>, Consent>(
  "consentOps:getCurrent",
);
const acceptNotices = makeFunctionReference<"mutation">("consentOps:acceptCurrentNotices");
const notices = [
  [
    "recording",
    "I understand StoryTime records adult and child voice/video during story setup and storytelling.",
  ],
  [
    "ai",
    "I understand submitted story turns are transcribed and processed to create story beats and illustrations.",
  ],
  [
    "deletion",
    "I understand family media is stored for private replay and can be deleted by the controlling adult.",
  ],
] as const;

export default function ProtectedGate() {
  const current = useQuery(getCurrent, {});
  const accept = useMutation(acceptNotices);
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const allAccepted = notices.every(([key]) => checked[key]);

  async function continueSetup() {
    if (!allAccepted) return;
    setSaving(true);
    try {
      await accept({
        noticeVersion: "2026-07-10",
        privacyPolicyVersion: "2026-07-10",
        termsVersion: "2026-07-10",
        acceptedRecordingNotice: true,
        acceptedAiProcessingNotice: true,
        acceptedDeletionNotice: true,
      });
      router.replace("/(adult)/dashboard");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Text variant="label">Protected gate</Text>
      <Text variant="title">Before StoryTime records</Text>
      <Text>
        Only an authorized adult may continue. Public launch also requires the configured
        parental-verification provider; accepting these notices does not replace that verification.
      </Text>
      {current?.status === "verified" ? (
        <View style={styles.verified}>
          <NativeText style={styles.verifiedText}>Adult verification is current.</NativeText>
        </View>
      ) : null}
      {notices.map(([key, copy]) => (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: Boolean(checked[key]) }}
          key={key}
          onPress={() => setChecked((value) => ({ ...value, [key]: !value[key] }))}
          style={styles.notice}
        >
          <View style={[styles.box, checked[key] && styles.boxChecked]}>
            <NativeText style={styles.tick}>{checked[key] ? "✓" : ""}</NativeText>
          </View>
          <NativeText style={styles.noticeText}>{copy}</NativeText>
        </Pressable>
      ))}
      <Button disabled={!allAccepted || saving} onPress={continueSetup}>
        {saving ? "Saving…" : "Accept and continue"}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 16,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#9d7cff",
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: { backgroundColor: "#6d4aff", borderColor: "#6d4aff" },
  tick: { color: "white", fontWeight: "900" },
  noticeText: { flex: 1, color: "#3b2c46", lineHeight: 20 },
  verified: { backgroundColor: "#dff8ec", borderRadius: 14, padding: 12 },
  verifiedText: { color: "#166145", fontWeight: "800" },
});
