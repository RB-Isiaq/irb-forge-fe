"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { programApi } from "../api";
import type { CreateProgramPayload, UpdateProgramPayload } from "./types";

export function usePrograms(slug: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.programs.list(slug),
    queryFn: ({ pageParam }) => programApi.list(slug, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    enabled: !!slug,
  });
}

export function useProgram(slug: string, id: string) {
  return useQuery({
    queryKey: queryKeys.programs.detail(slug, id),
    queryFn: () => programApi.get(slug, id),
    enabled: !!slug && !!id,
  });
}

export function useCreateProgram(slug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: CreateProgramPayload) => programApi.create(slug, data),
    onSuccess: (program) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.list(slug) });
      toast.success(`"${program.name}" created.`);
      router.push(`/orgs/${slug}/programs/${program.id}`);
    },
    onError: (err) => toast.error(extractApiError(err, "Could not create program.")),
  });
}

export function useUpdateProgram(slug: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProgramPayload) => programApi.update(slug, id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.programs.detail(slug, id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.list(slug) });
      toast.success("Program updated.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not update program.")),
  });
}

export function useDeleteProgram(slug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => programApi.delete(slug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.list(slug) });
      toast.success("Program deleted.");
      router.push(`/orgs/${slug}/programs`);
    },
    onError: (err) => toast.error(extractApiError(err, "Could not delete program.")),
  });
}
