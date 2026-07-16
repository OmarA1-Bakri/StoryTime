# StoryTime authentication

StoryTime uses Clerk for adult identity and Convex for authenticated domain authorization.

## Required Clerk setup

1. Create one Clerk application for StoryTime.
2. Enable Google sign-in and Apple sign-in for the iOS application.
3. Configure the `storytime://` mobile redirect scheme.
4. Activate the Clerk Convex integration or create a JWT template named `convex`.
5. Set `CLERK_JWT_ISSUER_DOMAIN` in the Convex deployment.
6. Configure the environment variables listed in `.env.example` for web and Expo builds.

## Trust boundaries

- Clerk owns adult authentication, sessions and account recovery.
- Convex validates the Clerk JWT and maps its immutable subject to one StoryTime adult record.
- Child profiles never receive Clerk accounts.
- LiveKit participant identity is derived server-side from the authenticated Clerk user. The mobile client cannot choose it.
- Profile ownership and queries are checked against the authenticated Convex identity.
- Mock identity functions are disabled in production.

## Remaining public-launch gate

The LiveKit token route currently proves authenticated identity, but the next media-security tranche must also validate the requested session and participant role against Convex grants before issuing a room token.
