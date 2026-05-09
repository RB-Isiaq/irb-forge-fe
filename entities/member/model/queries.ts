"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { memberApi } from "../api";
import type { OrgRole, UpdateMemberRolePayload } from "./types";

export function useMembers(slug: string) {
  return useQuery({
    queryKey: queryKeys.members.list(slug),
    queryFn: () => memberApi.list(slug),
    enabled: !!slug,
  });
}

export function useUpdateMemberRole(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateMemberRolePayload }) =>
      memberApi.updateRole(slug, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.list(slug) });
      toast.success("Role updated.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not update role.")),
  });
}

export function useRemoveMember(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => memberApi.remove(slug, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.list(slug) });
      toast.success("Member removed.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not remove member.")),
  });
}

/*
 * Derives the current user's role in an org from the cached members list.
 * Accepts userId as a parameter to avoid a cross-entity import of useAuth.
 * Callers: widgets/features that already have user from useAuth().
 */
export function useMyRole(slug: string, userId: string | null | undefined): OrgRole | null {
  const { data: members } = useMembers(slug);
  if (!userId || !members) return null;
  return members.find((m) => m.userId === userId)?.role ?? null;
}

export function useLeaveOrg(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => memberApi.leave(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all() });
      queryClient.removeQueries({ queryKey: queryKeys.orgs.detail(slug) });
      toast.success("You have left the organization.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not leave organization.")),
  });
}
