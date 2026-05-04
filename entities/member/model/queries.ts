"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { memberApi } from "../api";
import type { UpdateMemberRolePayload } from "./types";

export function useMembers(slug: string) {
  return useQuery({
    queryKey: queryKeys.members.list(slug),
    queryFn:  () => memberApi.list(slug),
    enabled:  !!slug,
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
