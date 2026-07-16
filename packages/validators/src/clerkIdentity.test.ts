import { describe, expect, it } from "vitest";
import { decideClerkIdentityTransition, normalizeClerkIdentityEvent } from "./clerkIdentity";

const activeUserEvent = {
  type: "user.updated",
  timestamp: 1_720_000_000_000,
  instance_id: "ins_storytime_dev",
  data: {
    id: "user_clerk_123",
    primary_email_address_id: "email_primary",
    email_addresses: [
      { id: "email_secondary", email_address: "old@example.com" },
      { id: "email_primary", email_address: " Adult@Example.com " },
    ],
    first_name: "  Ada ",
    last_name: " Lovelace  ",
    banned: false,
    locked: false,
  },
};

describe("Clerk identity synchronization", () => {
  it("normalizes only the trusted provider event fields", () => {
    expect(normalizeClerkIdentityEvent(activeUserEvent, "event_123", "ins_storytime_dev")).toEqual({
      eventId: "event_123",
      eventType: "user.updated",
      subject: "user_clerk_123",
      email: "adult@example.com",
      displayName: "Ada Lovelace",
      accountStatus: "active",
      occurredAt: 1_720_000_000_000,
    });
  });

  it("maps provider suspension and deletion without inventing identity data", () => {
    expect(
      normalizeClerkIdentityEvent(
        { ...activeUserEvent, data: { ...activeUserEvent.data, banned: true } },
        "event_disabled",
      ).accountStatus,
    ).toBe("disabled");

    expect(
      normalizeClerkIdentityEvent(
        {
          type: "user.deleted",
          timestamp: 1_720_000_000_100,
          instance_id: "ins_storytime_dev",
          data: { id: "user_clerk_123", deleted: true },
        },
        "event_deleted",
      ),
    ).toEqual({
      eventId: "event_deleted",
      eventType: "user.deleted",
      subject: "user_clerk_123",
      accountStatus: "deleted",
      occurredAt: 1_720_000_000_100,
    });
  });

  it("rejects unsupported, malformed, or synthetic provider identities", () => {
    expect(() => normalizeClerkIdentityEvent({ type: "session.created" }, "event_1")).toThrow();
    expect(() => normalizeClerkIdentityEvent(activeUserEvent, " ")).toThrow();
    expect(() =>
      normalizeClerkIdentityEvent(
        { ...activeUserEvent, data: { ...activeUserEvent.data, id: "" } },
        "event_2",
      ),
    ).toThrow();
    expect(() =>
      normalizeClerkIdentityEvent(activeUserEvent, "event_3", "ins_storytime_prod"),
    ).toThrow("Clerk instance does not match");
  });

  it("makes replay, stale delivery, and deletion terminal", () => {
    const current = {
      identityStatus: "active" as const,
      identityUpdatedAt: 1_720_000_000_000,
      lastIdentityEventId: "event_current",
    };
    expect(
      decideClerkIdentityTransition(current, {
        ...normalizeClerkIdentityEvent(activeUserEvent, "event_current"),
      }),
    ).toBe("duplicate");
    expect(
      decideClerkIdentityTransition(current, {
        ...normalizeClerkIdentityEvent(activeUserEvent, "event_old"),
        occurredAt: current.identityUpdatedAt - 1,
      }),
    ).toBe("stale");
    expect(
      decideClerkIdentityTransition(
        { ...current, identityStatus: "deleted" },
        normalizeClerkIdentityEvent(activeUserEvent, "event_late_update"),
      ),
    ).toBe("terminal");
    expect(
      decideClerkIdentityTransition(
        current,
        normalizeClerkIdentityEvent(
          {
            type: "user.deleted",
            timestamp: current.identityUpdatedAt,
            instance_id: "ins_storytime_dev",
            data: { id: "user_clerk_123" },
          },
          "event_delete",
        ),
      ),
    ).toBe("apply");
    expect(
      decideClerkIdentityTransition(
        { ...current, identityUpdatedAt: current.identityUpdatedAt + 10_000 },
        normalizeClerkIdentityEvent(
          {
            type: "user.deleted",
            timestamp: current.identityUpdatedAt - 10_000,
            instance_id: "ins_storytime_dev",
            data: { id: "user_clerk_123" },
          },
          "event_delayed_delete",
        ),
      ),
    ).toBe("apply");
  });

  it("uses restrictive account-state precedence for equal provider timestamps", () => {
    const disabled = normalizeClerkIdentityEvent(
      { ...activeUserEvent, data: { ...activeUserEvent.data, locked: true } },
      "event_disabled",
    );
    const active = normalizeClerkIdentityEvent(activeUserEvent, "event_active");

    expect(
      decideClerkIdentityTransition(
        { identityStatus: "disabled", identityUpdatedAt: disabled.occurredAt },
        active,
      ),
    ).toBe("stale");
    expect(
      decideClerkIdentityTransition(
        { identityStatus: "active", identityUpdatedAt: active.occurredAt },
        disabled,
      ),
    ).toBe("apply");
  });
});
