import { z } from "zod";

export const accessRoleSchema = z.enum(["owner", "co_parent", "grandparent", "guardian"]);

export const accessStatusSchema = z.enum(["active", "pending", "revoked"]);

export const createAccessGrantSchema = z.object({
  profileId: z.string().min(1),
  requestedByUserId: z.string().min(1),
  targetUserId: z.string().min(1),
  role: z.enum(["co_parent", "grandparent", "guardian"])
});

export const revokeAccessGrantSchema = z.object({
  profileId: z.string().min(1),
  requesterUserId: z.string().min(1),
  targetUserId: z.string().min(1)
});
