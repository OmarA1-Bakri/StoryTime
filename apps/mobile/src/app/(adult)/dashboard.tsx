import { Link } from "expo-router";
import { ProfileManager } from "../../components/profile/ProfileManager";
import { Button } from "../../components/ui/Button";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";

export default function Dashboard() {
  return (
    <Screen>
      <Text variant="label">Adult dashboard</Text>
      <Text variant="title">Your protected family space</Text>
      <Text>
        Create a child profile, approve trusted adults, then start a private Adventure Call.
      </Text>
      <ProfileManager />
      <Link href="/call/connect/demo-session" asChild>
        <Button>Start Adventure Call</Button>
      </Link>
      <Link href="/(adult)/memory-vault" asChild>
        <Button tone="secondary">Memory Vault</Button>
      </Link>
    </Screen>
  );
}
