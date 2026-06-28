import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function AudioFallback() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Connection fallback</Text><Text variant="title">The connection is a little wobbly.</Text><Text>We’ll keep session {sessionId} going with voices and story pictures.</Text><Button>Continue adventure</Button></Screen>;
}
