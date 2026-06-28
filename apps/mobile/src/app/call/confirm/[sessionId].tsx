import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function ConfirmParticipant() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Confirm participant</Text><Text variant="title">Can you see the approved adult?</Text><Text>Confirm before moving into story mode.</Text><Link href={`/call/handoff/${sessionId}`} asChild><Button>Confirmed</Button></Link></Screen>;
}
