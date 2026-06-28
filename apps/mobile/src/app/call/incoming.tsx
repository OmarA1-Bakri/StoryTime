import { Link } from "expo-router";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

export default function IncomingCall() {
  return <Screen><Text variant="label">Adventure Call Alert</Text><Text variant="title">An approved adult wants to start a story</Text><Link href="/call/connect/demo-session" asChild><Button>Connect</Button></Link><Button tone="secondary">Not now</Button></Screen>;
}
