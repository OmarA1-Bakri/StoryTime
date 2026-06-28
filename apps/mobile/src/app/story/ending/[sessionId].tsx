import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function Ending() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Create ending</Text><Text variant="title">How should this chapter end?</Text><Text>Session {sessionId} will save the final scene and queue replay processing.</Text><Link href="/(adult)/memory-vault" asChild><Button>Save ending</Button></Link></Screen>;
}
