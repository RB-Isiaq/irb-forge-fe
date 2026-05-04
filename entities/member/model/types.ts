import type { User } from "@/entities/user";

export type OrgRole = "owner" | "admin" | "mentor" | "member";

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: OrgRole;
  joinedAt: string;
  user: Pick<User, "id" | "email" | "firstName" | "lastName">;
}

export interface UpdateMemberRolePayload {
  role: Exclude<OrgRole, "owner">;
}
