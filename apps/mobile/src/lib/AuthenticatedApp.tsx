import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AdultIdentityBootstrap } from "./AdultIdentityBootstrap";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function AuthenticatedApp({ children }: PropsWithChildren) {
  if (!publishableKey || !convex)
    return (
      <View style={styles.missing}>
        <Text style={styles.title}>StoryTime setup required</Text>
        <Text style={styles.copy}>
          Configure Clerk and Convex public environment variables to run the protected mobile
          application.
        </Text>
      </View>
    );
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <AdultIdentityBootstrap>{children}</AdultIdentityBootstrap>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, justifyContent: "center", padding: 28, backgroundColor: "#fbf7ef", gap: 12 },
  title: { color: "#2a1c35", fontSize: 28, fontWeight: "900" },
  copy: { color: "#65566f", fontSize: 16, lineHeight: 24 },
});
