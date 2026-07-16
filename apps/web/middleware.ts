import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth) => {
  await auth.protect();
});

export const config = {
  matcher: ["/app/:path*", "/record-preview/:path*", "/api/livekit/:path*"],
};
