import { z } from "zod";

const clerkEmailSchema = z.object({
  id: z.string().min(1),
  email_address: z.string().trim().email(),
});

const clerkUserSchema = z.object({
  id: z.string().min(1),
  primary_email_address_id: z.string().min(1).nullable().optional(),
  email_addresses: z.array(clerkEmailSchema).optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  banned: z.boolean().optional(),
  locked: z.boolean().optional(),
});

const clerkIdentityEventSchema = z.object({
  type: z.enum(["user.created", "user.updated", "user.deleted"]),
  timestamp: z.number().int().nonnegative(),
  instance_id: z.string().trim().min(1),
  data: clerkUserSchema,
});

export type ClerkIdentityEvent = {
  eventId: string;
  eventType: "user.created" | "user.updated" | "user.deleted";
  subject: string;
  email?: string;
  displayName?: string;
  accountStatus: "active" | "disabled" | "deleted";
  occurredAt: number;
};

export const clerkIdentitySyncEventSchema = z.object({
  eventId: z.string().trim().min(1),
  eventType: z.enum(["user.created", "user.updated", "user.deleted"]),
  subject: z.string().trim().min(1),
  email: z.string().trim().email().optional(),
  displayName: z.string().trim().min(1).optional(),
  accountStatus: z.enum(["active", "disabled", "deleted"]),
  occurredAt: z.number().int().nonnegative(),
});

export type CurrentIdentityBinding = {
  identityStatus: "active" | "disabled" | "deleted";
  identityUpdatedAt?: number;
  lastIdentityEventId?: string;
};

export type ClerkIdentityTransition = "apply" | "duplicate" | "stale" | "terminal";

function normalizeOptionalText(value: string | null | undefined): string | undefined {
  const normalized = value?.trim().replace(/\s+/g, " ");
  return normalized || undefined;
}

export function normalizeClerkIdentityEvent(
  input: unknown,
  eventIdInput: string,
  expectedInstanceId?: string,
): ClerkIdentityEvent {
  const event = clerkIdentityEventSchema.parse(input);
  const eventId = z.string().trim().min(1).parse(eventIdInput);
  if (expectedInstanceId !== undefined && event.instance_id !== expectedInstanceId) {
    throw new Error("Clerk instance does not match this environment");
  }
  const primaryEmail = event.data.email_addresses?.find(
    (candidate) => candidate.id === event.data.primary_email_address_id,
  );
  const email = primaryEmail?.email_address.trim().toLowerCase();
  const displayName =
    normalizeOptionalText(
      [event.data.first_name, event.data.last_name]
        .map(normalizeOptionalText)
        .filter((part): part is string => Boolean(part))
        .join(" "),
    ) ?? normalizeOptionalText(event.data.username);
  const accountStatus =
    event.type === "user.deleted"
      ? "deleted"
      : event.data.banned || event.data.locked
        ? "disabled"
        : "active";

  return clerkIdentitySyncEventSchema.parse({
    eventId,
    eventType: event.type,
    subject: event.data.id,
    ...(email ? { email } : {}),
    ...(displayName ? { displayName } : {}),
    accountStatus,
    occurredAt: event.timestamp,
  });
}

export function decideClerkIdentityTransition(
  current: CurrentIdentityBinding | null,
  event: ClerkIdentityEvent,
): ClerkIdentityTransition {
  if (!current) return "apply";
  if (current.lastIdentityEventId === event.eventId) return "duplicate";
  if (current.identityStatus === "deleted") return "terminal";
  if (event.accountStatus === "deleted") return "apply";
  if (current.identityUpdatedAt !== undefined && event.occurredAt < current.identityUpdatedAt) {
    return "stale";
  }
  if (current.identityUpdatedAt === event.occurredAt) {
    const precedence = { active: 0, disabled: 1, deleted: 2 } as const;
    if (precedence[event.accountStatus] < precedence[current.identityStatus]) return "stale";
  }
  return "apply";
}
