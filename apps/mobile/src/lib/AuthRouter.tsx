import { useAuth } from "@clerk/expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function AuthRouter() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const protectedRoute = ["(adult)", "call", "story"].includes(segments[0] ?? "");
    if (!isSignedIn && protectedRoute) router.replace("/(auth)/onboarding");
  }, [isLoaded, isSignedIn, router, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
