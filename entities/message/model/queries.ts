"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { messageApi } from "../api";
import type { SendMessagePayload } from "./types";

export function useMessages(slug: string) {
  return useQuery({
    queryKey: queryKeys.messages.byOrg(slug),
    queryFn: () => messageApi.list(slug),
    enabled: !!slug,
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
