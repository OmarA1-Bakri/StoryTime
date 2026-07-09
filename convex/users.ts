import { mutation, query } from "./_generated/server";
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
      typeof identity.email === "string" ? identity.email : `${identity.subject}@clerk.invalid`;
    const displayName = typeof identity.name === "string" ? identity.name : undefined;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", identity.subject))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email,
        displayName: displayName ?? existing.displayName,
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
      createdAt: now(),
      updatedAt: now(),
    });
  },
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return ctx.db
      .query("users")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", identity.subject))
      .unique();
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
