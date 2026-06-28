import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function Handoff() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Child-safe mode</Text><Text variant="title">Hand the phone to Rania</Text><Text>Recording begins when story setup starts.</Text><Link href={`/story/setup/${sessionId}`} asChild><Button>Start Child-Safe Mode</Button></Link></Screen>;
}
