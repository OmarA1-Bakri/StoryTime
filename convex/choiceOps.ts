import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assert } from "./lib/errors";
import { now } from "./lib/time";

const category = v.union(v.literal("character"), v.literal("setting"), v.literal("problem"), v.literal("tone"), v.literal("visual_format"));

export const listForSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => await ctx.db.query("storyChoices").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect()
});

export const addChoiceSet = mutation({
  args: { sessionId: v.id("sessions"), category, options: v.array(v.string()) },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    assert(session, "session_missing", "Session not found");
    assert(args.options.length > 0, "options_missing", "At least one option is required");
    return await ctx.db.insert("storyChoices", { sessionId: args.sessionId, campaignId: session.campaignId, profileId: session.profileId, roundIndex: 0, category: args.category, options: args.options, createdAt: now() });
  }
});

export const selectChoice = mutation({
  args: { choiceId: v.id("storyChoices"), selectedValue: v.string(), selectedByParticipantId: v.string() },
  handler: async (ctx, args) => {
    const choice = await ctx.db.get(args.choiceId);
    assert(choice, "choice_missing", "Choice set not found");
    assert(choice.options.includes(args.selectedValue), "choice_invalid", "Selected value must be one of the options");
    await ctx.db.patch(args.choiceId, { selectedValue: args.selectedValue, selectedByParticipantId: args.selectedByParticipantId, lockedAt: now() });
  }
});
