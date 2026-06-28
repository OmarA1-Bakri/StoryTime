import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

const choices = ["Space princess", "Moon garden", "Lost starlight", "Silly and brave", "Warm storybook"];

export default function StorySetup() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  return <Screen><Text variant="label">Story dice</Text><Text variant="title">Lock the adventure seed</Text>{choices.map((choice) => <Text key={choice}>{choice}</Text>)}<Link href={`/story/room/${sessionId}`} asChild><Button>Lock seed</Button></Link></Screen>;
}
