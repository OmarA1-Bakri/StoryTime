import { Link } from "expo-router";
import { Screen } from "../components/ui/Screen";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";

export default function Index() {
  return (
    <Screen>
      <Text variant="label">StoryTime</Text>
      <Text variant="title">Private story calls for families apart.</Text>
      <Text>Start with adult sign-in and protected setup before any story session begins.</Text>
      <Link href="/(auth)/onboarding" asChild><Button>Begin adult setup</Button></Link>
    </Screen>
  );
}
