export type OrgRole = "owner" | "admin" | "mentor" | "member";

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: OrgRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface UpdateMemberRolePayload {
  role: Exclude<OrgRole, "owner">;
}
