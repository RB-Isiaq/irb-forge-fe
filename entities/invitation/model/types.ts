import type { OrgRole } from "@/entities/member";

export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

export interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  role: OrgRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  invitedBy?: { firstName: string | null; lastName: string | null };
  organization?: { name: string; slug: string; description: string | null };
}

export interface InvitationPreview {
  organization: { name: string; slug: string; description: string | null };
  invitedBy: { firstName: string | null; lastName: string | null };
  role: OrgRole;
  expiresAt: string;
}

export interface SendInvitationPayload {
  email: string;
  role?: Exclude<OrgRole, "owner">;
}
export interface AcceptInvitationPayload {
  token: string;
}
export interface DeclineInvitationPayload {
  token: string;
}
