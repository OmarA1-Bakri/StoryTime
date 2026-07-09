import { useAuth } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { AdultSignIn } from "../../components/auth/AdultSignIn";
import { Button } from "../../components/ui/Button";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";

export default function Onboarding() {
  const { isLoaded, isSignedIn } = useAuth();
  if (isLoaded && isSignedIn) return <Redirect href="/(auth)/protected-gate" />;
  return <Screen><Text variant="label">Adult sign in</Text><Text variant="title">Create a protected family space.</Text><Text>Only authenticated adults can manage child profiles, trusted family access, recording, replay and deletion.</Text><AdultSignIn /><Link href="/" asChild><Button tone="secondary">Back</Button></Link></Screen>;
}
