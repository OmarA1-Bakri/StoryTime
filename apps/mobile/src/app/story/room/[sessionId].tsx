import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

export default function StoryRoom() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">● Recording</Text><Text variant="title">The storybook is painting Dad’s idea...</Text><Text>The moon-cheese rocket starts to glow.</Text><Button>Pass baton</Button><Link href={`/story/checkpoint/${sessionId}`} asChild><Button tone="secondary">Adult checkpoint</Button></Link></Screen>;
}
