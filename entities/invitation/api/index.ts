import { apiGet, apiPost, apiDelete, apiPatch } from "@/shared/api";
import type {
  Invitation,
  InvitationPreview,
  SendInvitationPayload,
  AcceptInvitationPayload,
  DeclineInvitationPayload,
} from "../model/types";

export const invitationApi = {
  send: (slug: string, data: SendInvitationPayload) =>
    apiPost<Invitation>(`/organizations/${slug}/invitations`, data),

  listPending: (slug: string) => apiGet<Invitation[]>(`/organizations/${slug}/invitations`),

  cancel: (slug: string, id: string) => apiDelete(`/organizations/${slug}/invitations/${id}`),

  preview: (token: string) => apiGet<InvitationPreview>(`/invitations/preview?token=${token}`),

  mine: () => apiGet<Invitation[]>("/invitations/me"),

  /* Token-based: used when accepting directly from the email link */
  accept: (data: AcceptInvitationPayload) => apiPost<null>("/invitations/accept", data),

  decline: (data: DeclineInvitationPayload) => apiPost<null>("/invitations/decline", data),

  /*
   * ID-based: used when accepting from the in-app inbox.
   * Requires backend to implement:
   *   PATCH /invitations/:id/accept
   *   PATCH /invitations/:id/decline
   * These should verify that the current user's email matches the invitation email.
   */
  acceptById: (id: string) => apiPatch<null>(`/invitations/${id}/accept`),
  declineById: (id: string) => apiPatch<null>(`/invitations/${id}/decline`),

  /*
   * Resend: re-sends the invitation email for a pending invitation.
   * Requires backend to implement:
   *   POST /organizations/:slug/invitations/:id/resend
   */
  resend: (slug: string, id: string) =>
    apiPost<null>(`/organizations/${slug}/invitations/${id}/resend`),
};
