export type OrgRole = "owner" | "admin" | "mentor" | "member";

/** Returned by GET /organizations/:slug/members — includes embedded user. */
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

/** Returned by GET /organizations/:slug/members/me — no embedded user field. */
export interface MyMembership {
  id: string;
  userId: string;
  organizationId: string;
  role: OrgRole;
  joinedAt: string;
}

export interface UpdateMemberRolePayload {
  role: Exclude<OrgRole, "owner">;
}
