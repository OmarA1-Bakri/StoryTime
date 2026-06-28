import { Link } from "expo-router";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

export default function ProtectedGate() {
  return <Screen><Text variant="label">Protected gate</Text><Text variant="title">Before StoryTime records</Text><Text>StoryTime records voice/video during story setup and storytelling, stores private replay chapters, and uses provider adapters only when configured.</Text><Link href="/(adult)/dashboard" asChild><Button>Continue to parent verification</Button></Link></Screen>;
}
