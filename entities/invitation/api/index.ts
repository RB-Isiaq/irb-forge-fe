import { apiGet, apiPost, apiDelete } from "@/shared/api";
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
  accept: (data: AcceptInvitationPayload) => apiPost<null>("/invitations/accept", data),
  decline: (data: DeclineInvitationPayload) => apiPost<null>("/invitations/decline", data),
};
