import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireGrant } from "./guards";
import { assert } from "./lib/errors";

export const getJoinInfo = query({
  args: { sessionId: v.id("sessions"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    assert(session, "session_missing", "Session not found");
    await requireGrant(ctx, args.userId, session.profileId);
    return {
      sessionId: args.sessionId,
      profileId: session.profileId,
      campaignId: session.campaignId,
      name: session.livekitRoomName,
      phase: session.currentPhase,
      status: session.status,
      batonHolderParticipantId: session.batonHolderParticipantId,
      activeSpeakerParticipantId: session.activeSpeakerParticipantId
    };
  }
});
