import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./guards";
import { now } from "./lib/time";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuthenticatedUser(ctx);
    const records = await ctx.db
      .query("consentRecords")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return records.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;
  },
});

export const acceptCurrentNotices = mutation({
  args: {
    noticeVersion: v.string(),
    privacyPolicyVersion: v.string(),
    termsVersion: v.string(),
    acceptedRecordingNotice: v.boolean(),
    acceptedAiProcessingNotice: v.boolean(),
    acceptedDeletionNotice: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (
      !args.acceptedRecordingNotice ||
      !args.acceptedAiProcessingNotice ||
      !args.acceptedDeletionNotice
    )
      throw new Error("all_notices_required");
    const user = await requireAuthenticatedUser(ctx);
    const developmentVerification =
      process.env.APP_ENV !== "production" && process.env.VPC_PROVIDER === "mock";
    return ctx.db.insert("consentRecords", {
      userId: user._id,
      status: developmentVerification ? "verified" : "pending",
      method: developmentVerification ? "mock" : "provider_hosted",
      provider: developmentVerification ? "mock" : "kws",
      noticeVersion: args.noticeVersion,
      privacyPolicyVersion: args.privacyPolicyVersion,
      termsVersion: args.termsVersion,
      verifiedAt: developmentVerification ? now() : undefined,
      createdAt: now(),
      updatedAt: now(),
    });
  },
});
