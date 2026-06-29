import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function ReplayDetail() {
  const { recordingId } = useLocalSearchParams<{ recordingId: string }>();
  const id = recordingId ?? "demo-recording";

  return (
    <Screen>
      <Text variant="label">Replay vault</Text>
      <Text variant="title">Chapter replay</Text>
      <Text>Recording {id} is ready to review, download, or remove from the family vault.</Text>
      <Button>Play replay</Button>
      <Button tone="secondary">Download</Button>
      <Button tone="danger">Request removal</Button>
    </Screen>
  );
}
