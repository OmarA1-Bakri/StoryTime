import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { assert } from "./lib/errors";

export async function requireGrant(ctx: QueryCtx | MutationCtx, userId: Id<"users">, profileId: Id<"profiles">) {
  const grant = await ctx.db.query("accessGrants").withIndex("by_profile_adult", (q) => q.eq("profileId", profileId).eq("adultUserId", userId)).unique();
  assert(grant && grant.status === "active", "grant_missing", "Required grant is missing");
  return grant;
}

export async function hasVerifiedRecord(ctx: QueryCtx | MutationCtx, userId: Id<"users">, profileId: Id<"profiles">) {
  const records = await ctx.db.query("consentRecords").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  return records.some((record) => record.status === "verified" && (!record.profileId || record.profileId === profileId));
}
