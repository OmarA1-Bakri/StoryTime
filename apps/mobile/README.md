# @storytime/mobile

Expo/React Native application for StoryTime.

## Mobile E2E contract

`corepack pnpm --filter @storytime/mobile test:e2e` runs the synthetic Maestro flows in
`.maestro/flows`. The runner fails before the suite when Maestro is unavailable, no supported
target is booted, or `com.omarbakri.storytime` is not installed. It never converts a missing
device or skipped Maestro invocation into a passing gate.

The installed development/EAS build must contain valid
`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `EXPO_PUBLIC_CONVEX_URL` values. The flows use a cleared
application state and synthetic route identifiers; they do not sign in, require credentials, or
use real child data. They cover launch into adult authentication and verify that direct child-side
and adult protected-route entry remains behind that authentication boundary.

Optional selection variables:

- `MAESTRO_PLATFORM=android|ios`
- `MAESTRO_DEVICE_ID=<adb serial or simulator UDID>`
- `MAESTRO_APP_ID=<installed application id>`

Adding this contract is not physical-device evidence. A successful report requires the runner to
execute Maestro against an installed build.
