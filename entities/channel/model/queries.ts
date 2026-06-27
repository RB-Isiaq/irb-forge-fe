"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { channelApi, channelMessageApi } from "../api";
import type { CreateChannelPayload, SendChannelMessagePayload } from "./types";

export function useChannels(slug: string) {
  return useQuery({
    queryKey: queryKeys.channels.byOrg(slug),
    queryFn: () => channelApi.list(slug),
    enabled: !!slug,
  });
}

export function useCreateChannel(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChannelPayload) => channelApi.create(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.byOrg(slug) });
      toast.success("Channel created.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not create channel.")),
  });
}

export function useDeleteChannel(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelId: string) => channelApi.delete(slug, channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.byOrg(slug) });
      toast.success("Channel deleted.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not delete channel.")),
  });
}

export function useChannelMessages(slug: string, channelId: string | null) {
  return useQuery({
    queryKey: queryKeys.channels.messages(slug, channelId ?? ""),
    queryFn: () => channelMessageApi.list(slug, channelId as string),
    enabled: !!slug && !!channelId,
    refetchInterval: 5_000,
    refetchOnWindowFocus: true,
  });
}

export function useSendChannelMessage(slug: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendChannelMessagePayload) => channelMessageApi.send(slug, channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.channels.messages(slug, channelId),
      });
    },
    onError: (err) => toast.error(extractApiError(err, "Could not send message.")),
  });
}
