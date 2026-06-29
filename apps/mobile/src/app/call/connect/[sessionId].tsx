import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { useSessionLink } from "../../../lib/useSessionLink";

export default function Connect() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const id = sessionId ?? "demo-session";
  const link = useSessionLink(id);

  return (
    <Screen>
      <Text variant="label">Connect</Text>
      <Text variant="title">Host is visible</Text>
      <Text>Session: {id}. Status: {link.status}. Confirm the host before handoff.</Text>
      <Button onPress={link.open}>Open session</Button>
      <Link href={`/call/handoff/${id}`} asChild>
        <Button tone="secondary">Continue</Button>
      </Link>
    </Screen>
  );
}
