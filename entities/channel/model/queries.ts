"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { channelApi, channelMessageApi } from "../api";
import type {
  AddChannelMemberPayload,
  CreateChannelPayload,
  SendChannelMessagePayload,
} from "./types";

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
  return useInfiniteQuery({
    queryKey: queryKeys.channels.messages(slug, channelId ?? ""),
    queryFn: ({ pageParam }) => channelMessageApi.list(slug, channelId as string, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // Caps how much history a long session keeps polling/refetching at once.
    maxPages: 10,
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

export function useChannelMembers(slug: string, channelId: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.channels.members(slug, channelId ?? ""),
    queryFn: () => channelApi.listMembers(slug, channelId as string),
    enabled: !!slug && !!channelId && enabled,
  });
}

export function useAddChannelMember(slug: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddChannelMemberPayload) => channelApi.addMember(slug, channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.members(slug, channelId) });
      toast.success("Member added.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not add member.")),
  });
}

export function useRemoveChannelMember(slug: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => channelApi.removeMember(slug, channelId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.members(slug, channelId) });
      toast.success("Member removed.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not remove member.")),
  });
}
