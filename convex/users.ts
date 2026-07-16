import { decideClerkIdentityTransition } from "@storytime/validators";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { now } from "./lib/time";

export const upsertMockAdult = mutation({
  args: { email: v.string(), displayName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (process.env.APP_ENV === "production") throw new Error("mock_identity_disabled");
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        displayName: args.displayName ?? existing.displayName,
        updatedAt: now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("users", {
      email: args.email,
      displayName: args.displayName,
      authProvider: "mock",
      role: "adult",
      status: "active",
      createdAt: now(),
      updatedAt: now(),
    });
  },
});

export const ensureCurrentAdult = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("authentication_required");
    const email =
      typeof identity.email === "string" && identity.email.trim()
        ? identity.email.trim().toLowerCase()
        : undefined;
    const displayName =
      typeof identity.name === "string" && identity.name.trim()
        ? identity.name.trim().replace(/\s+/g, " ")
        : undefined;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", identity.subject))
      .unique();
    if (existing) {
      if (existing.status !== "active" || existing.identityStatus === "disabled") {
        throw new Error("adult_identity_inactive");
      }
      if (existing.identityStatus === "deleted") throw new Error("adult_identity_deleted");
      await ctx.db.patch(existing._id, {
        ...(email ? { email } : {}),
        ...(displayName ? { displayName } : {}),
        updatedAt: now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("users", {
      email,
      displayName,
      authSubject: identity.subject,
      authProvider: "clerk",
      role: "adult",
      status: "active",
      identityStatus: "active",
      createdAt: now(),
      updatedAt: now(),
    });
  },
});

export const applyClerkIdentityEvent = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.union(
      v.literal("user.created"),
      v.literal("user.updated"),
      v.literal("user.deleted"),
    ),
    subject: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    accountStatus: v.union(v.literal("active"), v.literal("disabled"), v.literal("deleted")),
    occurredAt: v.number(),
  },
  handler: async (ctx, event) => {
    const replay = await ctx.db
      .query("identitySyncEvents")
      .withIndex("by_event_id", (q) => q.eq("eventId", event.eventId))
      .unique();
    if (replay) return replay.userId;

    const processedAt = now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", event.subject))
      .unique();
    const transition = decideClerkIdentityTransition(
      existing
        ? {
            identityStatus:
              existing.identityStatus ?? (existing.status === "deleted" ? "deleted" : "active"),
            identityUpdatedAt: existing.identityUpdatedAt,
            lastIdentityEventId: existing.lastIdentityEventId,
          }
        : null,
      event,
    );

    let userId = existing?._id;
    if (transition === "apply") {
      if (existing) {
        await ctx.db.patch(existing._id, {
          ...(event.accountStatus === "deleted"
            ? { email: undefined, displayName: undefined }
            : {
                ...(event.email ? { email: event.email } : {}),
                ...(event.displayName ? { displayName: event.displayName } : {}),
              }),
          status: event.accountStatus === "deleted" ? "deleted" : existing.status,
          identityStatus: event.accountStatus,
          identityUpdatedAt: event.occurredAt,
          lastIdentityEventId: event.eventId,
          disabledAt: event.accountStatus === "disabled" ? event.occurredAt : undefined,
          deletedAt: event.accountStatus === "deleted" ? event.occurredAt : undefined,
          updatedAt: processedAt,
        });
      } else {
        userId = await ctx.db.insert("users", {
          ...(event.email ? { email: event.email } : {}),
          ...(event.displayName ? { displayName: event.displayName } : {}),
          authSubject: event.subject,
          authProvider: "clerk",
          role: "adult",
          status: event.accountStatus === "deleted" ? "deleted" : "active",
          identityStatus: event.accountStatus,
          identityUpdatedAt: event.occurredAt,
          lastIdentityEventId: event.eventId,
          disabledAt: event.accountStatus === "disabled" ? event.occurredAt : undefined,
          deletedAt: event.accountStatus === "deleted" ? event.occurredAt : undefined,
          createdAt: processedAt,
          updatedAt: processedAt,
        });
      }
    }

    if (!userId) throw new Error("identity_sync_user_missing");
    await ctx.db.insert("identitySyncEvents", {
      provider: "clerk",
      eventId: event.eventId,
      eventType: event.eventType,
      userId,
      outcome:
        transition === "apply" ? "applied" : transition === "terminal" ? "terminal" : "stale",
      occurredAt: event.occurredAt,
      processedAt,
    });
    return userId;
  },
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", identity.subject))
      .unique();
    if (
      !user ||
      user.status !== "active" ||
      user.identityStatus === "disabled" ||
      user.identityStatus === "deleted"
    ) {
      return null;
    }
    return user;
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (process.env.APP_ENV === "production") throw new Error("email_lookup_disabled");
    return ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});
