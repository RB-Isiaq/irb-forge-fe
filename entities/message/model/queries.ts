"use client";

import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { messageApi } from "../api";
import type { SendMessagePayload } from "./types";

export function useMessages(slug: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.messages.byOrg(slug),
    queryFn: ({ pageParam }) => messageApi.list(slug, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    enabled: !!slug,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useSendMessage(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessagePayload) => messageApi.send(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.byOrg(slug) });
      toast.success("Announcement sent.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not send announcement.")),
  });
}
