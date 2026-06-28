import { Link } from "expo-router";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

export default function Onboarding() {
  return <Screen><Text variant="label">Adult setup</Text><Text variant="title">Create a protected family space.</Text><Text>Adults authenticate and manage profiles, access, replay permissions, storage, and deletion.</Text><Link href="/(auth)/protected-gate" asChild><Button>Continue</Button></Link></Screen>;
}
