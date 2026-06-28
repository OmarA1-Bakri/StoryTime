import { Screen } from "../../components/ui/Screen";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

export default function Settings() {
  return <Screen><Text variant="label">Settings</Text><Text variant="title">Management controls</Text><Text>Manage profiles, storage, plan status, and account preferences.</Text><Button>Manage account</Button></Screen>;
}
