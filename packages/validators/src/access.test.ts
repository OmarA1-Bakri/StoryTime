import { describe, expect, it } from "vitest";
import { accessRoleSchema, createAccessGrantSchema, revokeAccessGrantSchema } from "./access";

describe("access validators", () => {
  it("allows approved roles", () => {
    expect(accessRoleSchema.parse("grandparent")).toBe("grandparent");
  });

  it("validates grant input", () => {
    expect(
      createAccessGrantSchema.parse({
        profileId: "profile_1",
        requestedByUserId: "user_1",
        targetUserId: "user_2",
        role: "guardian"
      })
    ).toMatchObject({ targetUserId: "user_2" });
  });

  it("rejects owner grants through this path", () => {
    expect(() =>
      createAccessGrantSchema.parse({
        profileId: "profile_1",
        requestedByUserId: "user_1",
        targetUserId: "user_2",
        role: "owner"
      })
    ).toThrow();
  });

  it("validates revoke input", () => {
    expect(
      revokeAccessGrantSchema.parse({
        profileId: "profile_1",
        requesterUserId: "user_1",
        targetUserId: "user_2"
      })
    ).toMatchObject({ requesterUserId: "user_1" });
  });
});
