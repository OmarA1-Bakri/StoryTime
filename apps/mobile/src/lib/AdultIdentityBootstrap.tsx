import { useAuth } from "@clerk/expo";
import { useConvexAuth, useMutation } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useEffect, useRef, type PropsWithChildren } from "react";

const ensureCurrentAdult = makeFunctionReference<"mutation">("users:ensureCurrentAdult");

export function AdultIdentityBootstrap({ children }: PropsWithChildren) {
  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const ensure = useMutation(ensureCurrentAdult);
  const attempted = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !isAuthenticated || attempted.current) return;
    attempted.current = true;
    void ensure({}).catch(() => {
      attempted.current = false;
    });
  }, [ensure, isAuthenticated, isSignedIn]);
  return children;
}
