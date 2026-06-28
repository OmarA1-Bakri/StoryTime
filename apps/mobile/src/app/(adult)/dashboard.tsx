import { Link } from "expo-router";
import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

export default function Dashboard() {
  return <Screen><Text variant="label">Adult dashboard</Text><Text variant="title">Dad is waiting for Rania</Text><Text>Connect, confirm the remote adult, then start child-safe mode.</Text><Link href="/call/connect/demo-session" asChild><Button>Connect with Dad</Button></Link><Link href="/(adult)/memory-vault" asChild><Button tone="secondary">Memory Vault</Button></Link></Screen>;
}
