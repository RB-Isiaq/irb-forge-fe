"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { invitationApi } from "../api";
import type { SendInvitationPayload } from "./types";

export function useOrgInvitations(slug: string) {
  return useQuery({
    queryKey: queryKeys.invitations.byOrg(slug),
    queryFn: () => invitationApi.listPending(slug),
    enabled: !!slug,
  });
}

export function useMyInvitations() {
  return useQuery({ queryKey: queryKeys.invitations.mine(), queryFn: invitationApi.mine });
}

export function useInvitationPreview(token: string) {
  return useQuery({
    queryKey: queryKeys.invitations.preview(token),
    queryFn: () => invitationApi.preview(token),
    enabled: !!token,
    retry: false,
  });
}

export function useSendInvitation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendInvitationPayload) => invitationApi.send(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.byOrg(slug) });
      toast.success("Invitation sent.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not send invitation.")),
  });
}

export function useCancelInvitation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitationApi.cancel(slug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.byOrg(slug) });
      toast.success("Invitation cancelled.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not cancel invitation.")),
  });
}

/* Token-based — used when accepting from an email link (invitation preview page) */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => invitationApi.accept({ token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all() });
      toast.success("You've joined the organization.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not accept invitation.")),
  });
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => invitationApi.decline({ token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.mine() });
      toast.success("Invitation declined.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not decline invitation.")),
  });
}

/*
 * ID-based — used from the in-app inbox.
 * Backend must implement: PATCH /invitations/:id/accept and PATCH /invitations/:id/decline
 * These endpoints should verify req.user.email === invitation.email before accepting.
 */
export function useAcceptInvitationById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitationApi.acceptById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all() });
      toast.success("You've joined the organization.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not accept invitation.")),
  });
}

export function useDeclineInvitationById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitationApi.declineById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.mine() });
      toast.success("Invitation declined.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not decline invitation.")),
  });
}
