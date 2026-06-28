import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const ts = v.number();
const profileAge = v.union(v.literal("6-8"), v.literal("9-10"), v.literal("11-12"));
const seed = v.object({ character: v.string(), setting: v.string(), problem: v.string(), tone: v.string(), visualFormat: v.string() });

export default defineSchema({
  users: defineTable({
    email: v.string(),
    displayName: v.optional(v.string()),
    authProvider: v.union(v.literal("apple"), v.literal("google"), v.literal("email"), v.literal("mock")),
    role: v.literal("adult"),
    status: v.union(v.literal("active"), v.literal("disabled"), v.literal("deleted")),
    createdAt: ts,
    updatedAt: ts
  }).index("by_email", ["email"]).index("by_status", ["status"]),

  profiles: defineTable({
    ownerUserId: v.id("users"),
    displayName: v.string(),
    ageBand: profileAge,
    avatarKey: v.optional(v.string()),
    replayAllowedForProfile: v.boolean(),
    status: v.union(v.literal("active"), v.literal("archived"), v.literal("deleted")),
    createdAt: ts,
    updatedAt: ts
  }).index("by_owner", ["ownerUserId"]).index("by_status", ["status"]),

  accessGrants: defineTable({
    profileId: v.id("profiles"),
    adultUserId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("co_parent"), v.literal("grandparent"), v.literal("guardian")),
    status: v.union(v.literal("active"), v.literal("invited"), v.literal("revoked")),
    invitedBy: v.optional(v.id("users")),
    createdAt: ts,
    updatedAt: ts
  }).index("by_profile", ["profileId"]).index("by_adult", ["adultUserId"]).index("by_profile_adult", ["profileId", "adultUserId"]),

  consentRecords: defineTable({
    userId: v.id("users"),
    profileId: v.optional(v.id("profiles")),
    status: v.union(v.literal("not_started"), v.literal("pending"), v.literal("verified"), v.literal("rejected"), v.literal("revoked"), v.literal("expired")),
    method: v.union(v.literal("mock"), v.literal("payment_card"), v.literal("government_id"), v.literal("platform_vpc"), v.literal("provider_hosted")),
    provider: v.union(v.literal("mock"), v.literal("stripe_identity"), v.literal("kws"), v.literal("other")),
    providerReference: v.optional(v.string()),
    noticeVersion: v.string(),
    privacyPolicyVersion: v.string(),
    termsVersion: v.string(),
    verifiedAt: v.optional(ts),
    revokedAt: v.optional(ts),
    expiresAt: v.optional(ts),
    createdAt: ts,
    updatedAt: ts
  }).index("by_user", ["userId"]).index("by_profile", ["profileId"]).index("by_status", ["status"]),

  campaigns: defineTable({
    ownerUserId: v.id("users"),
    profileId: v.id("profiles"),
    title: v.string(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("completed"), v.literal("archived"), v.literal("deleted")),
    storySeed: v.optional(seed),
    campaignSummary: v.optional(v.string()),
    visualContinuityNotes: v.optional(v.string()),
    lastPlayedAt: v.optional(ts),
    createdAt: ts,
    updatedAt: ts
  }).index("by_owner", ["ownerUserId"]).index("by_profile", ["profileId"]).index("by_status", ["status"]),

  sessions: defineTable({
    campaignId: v.id("campaigns"),
    profileId: v.id("profiles"),
    startedByUserId: v.id("users"),
    nearbyAdultUserId: v.optional(v.id("users")),
    status: v.string(),
    currentPhase: v.union(v.literal("waiting"), v.literal("adult_connect"), v.literal("handoff"), v.literal("setup"), v.literal("story"), v.literal("checkpoint"), v.literal("ending"), v.literal("done")),
    livekitRoomName: v.string(),
    activeSpeakerParticipantId: v.optional(v.string()),
    batonHolderParticipantId: v.optional(v.string()),
    checkpointIntervalMinutes: v.number(),
    nextCheckpointAt: v.optional(ts),
    startedAt: v.optional(ts),
    storyStartedAt: v.optional(ts),
    endedAt: v.optional(ts),
    failureReason: v.optional(v.string()),
    createdAt: ts,
    updatedAt: ts
  }).index("by_campaign", ["campaignId"]).index("by_profile", ["profileId"]).index("by_started_by", ["startedByUserId"]).index("by_status", ["status"]).index("by_room", ["livekitRoomName"])
});
