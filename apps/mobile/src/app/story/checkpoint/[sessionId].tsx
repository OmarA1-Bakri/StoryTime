import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function Checkpoint() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Adult-only checkpoint</Text><Text variant="title">You’ve been adventuring for 15 minutes.</Text><Text>Continue, pause, create ending, or save the chapter.</Text><Link href={`/story/paused/${sessionId}`} asChild><Button>Pause and save</Button></Link></Screen>;
}
