import { Link } from "expo-router";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

const demoRecordingId = "demo-recording";

export default function MemoryVault() {
  return (
    <Screen>
      <Text variant="label">Replay vault</Text>
      <Text variant="title">Rania and the Space Princess</Text>
      <Text>Duration: 14 minutes · Scenes: 8 · Storage: 320 MB · Status: Ready</Text>
      <Link href={`/(adult)/replay/${demoRecordingId}`} asChild>
        <Button>Watch</Button>
      </Link>
      <Button tone="secondary">Continue story</Button>
      <Button tone="danger">Request removal</Button>
    </Screen>
  );
}
