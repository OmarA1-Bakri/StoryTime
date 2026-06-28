import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";

export default function Waiting() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Waiting room</Text><Text variant="title">Story session is waiting</Text><Text>Session {sessionId} is ready to accept.</Text></Screen>;
}
