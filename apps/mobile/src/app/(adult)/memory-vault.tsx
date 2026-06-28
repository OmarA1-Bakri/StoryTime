import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

export default function MemoryVault() {
  return <Screen><Text variant="label">Replay vault</Text><Text variant="title">Rania and the Space Princess</Text><Text>Duration: 14 minutes · Scenes: 8 · Storage: 320 MB · Status: Ready</Text><Button>Watch</Button><Button tone="secondary">Continue Story</Button><Button tone="danger">Delete</Button></Screen>;
}
