"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { orgApi } from "../api";
import type { CreateOrganizationPayload, UpdateOrganizationPayload } from "./types";

export function useOrgs() {
  return useQuery({ queryKey: queryKeys.orgs.all(), queryFn: orgApi.list });
}

export function useOrg(slug: string) {
  return useQuery({
    queryKey: queryKeys.orgs.detail(slug),
    queryFn:  () => orgApi.get(slug),
    enabled:  !!slug,
  });
}

export function useCreateOrg() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: CreateOrganizationPayload) => orgApi.create(data),
    onSuccess: (org) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all() });
      toast.success(`"${org.name}" created.`);
      router.push(`/orgs/${org.slug}`);
    },
    onError: (err) => toast.error(extractApiError(err, "Could not create organization.")),
  });
}

export function useUpdateOrg(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrganizationPayload) => orgApi.update(slug, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.orgs.detail(slug), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all() });
      toast.success("Organization updated.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not update organization.")),
  });
}

export function useDeleteOrg(slug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => orgApi.delete(slug),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.orgs.detail(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all() });
      toast.success("Organization deleted.");
      router.push("/orgs");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not delete organization.")),
  });
}
