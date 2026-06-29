import { createContext, useContext, type PropsWithChildren } from "react";
import { useStorySession } from "./useStorySession";

type StorySessionContextValue = ReturnType<typeof useStorySession>;

const StorySessionContext = createContext<StorySessionContextValue | null>(null);

export function StorySessionProvider({ sessionId, children }: PropsWithChildren<{ sessionId: string }>) {
  const value = useStorySession(sessionId);
  return <StorySessionContext.Provider value={value}>{children}</StorySessionContext.Provider>;
}

export function useStorySessionContext() {
  const value = useContext(StorySessionContext);
  if (!value) throw new Error("StorySessionProvider is required");
  return value;
}
