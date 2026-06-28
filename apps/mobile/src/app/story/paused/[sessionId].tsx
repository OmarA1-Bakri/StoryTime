import { Link } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function Paused() {
  return <Screen><Text variant="label">Saved</Text><Text variant="title">The chapter is processing.</Text><Text>Raw tracks and timeline events are preserved for async composition.</Text><Link href="/(adult)/memory-vault" asChild><Button>Open Memory Vault</Button></Link></Screen>;
}
