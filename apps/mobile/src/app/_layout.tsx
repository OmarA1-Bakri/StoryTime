import { registerGlobals } from "@livekit/react-native";
import { AuthenticatedApp } from "../lib/AuthenticatedApp";
import { AuthRouter } from "../lib/AuthRouter";

registerGlobals();

export default function RootLayout() {
  return (
    <AuthenticatedApp>
      <AuthRouter />
    </AuthenticatedApp>
  );
}
