import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { useReplayActions } from "../../../lib/useReplayActions";

export default function ReplayDetail() {
  const { recordingId } = useLocalSearchParams<{ recordingId: string }>();
  const id = recordingId ?? "demo-recording";
  const actions = useReplayActions(id);

  return (
    <Screen>
      <Text variant="label">Replay vault</Text>
      <Text variant="title">Chapter replay</Text>
      <Text>Recording {id} is ready to review, download, or remove from the family vault.</Text>
      <Text>Status: {actions.status}</Text>
      <Button onPress={actions.play}>Play replay</Button>
      <Button tone="secondary" onPress={actions.requestDownload}>Download</Button>
      <Button tone="danger" onPress={actions.requestRemoval}>Request removal</Button>
    </Screen>
  );
}
