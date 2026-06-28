import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function Connect() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Adult connect</Text><Text variant="title">Dad is visible</Text><Text>Session: {sessionId}. Confirm the remote adult before handoff.</Text><Link href={`/call/handoff/${sessionId}`} asChild><Button>Confirm Dad</Button></Link></Screen>;
}
