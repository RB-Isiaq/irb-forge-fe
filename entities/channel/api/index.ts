import { apiGet, apiPost, apiDelete } from "@/shared/api";
import type { PaginatedData } from "@/shared/lib";
import type {
  Channel,
  ChannelMessage,
  CreateChannelPayload,
  SendChannelMessagePayload,
} from "../model/types";

export const channelApi = {
  list: (slug: string) => apiGet<Channel[]>(`/organizations/${slug}/channels`),
  create: (slug: string, data: CreateChannelPayload) =>
    apiPost<Channel>(`/organizations/${slug}/channels`, data),
  delete: (slug: string, channelId: string) =>
    apiDelete<void>(`/organizations/${slug}/channels/${channelId}`),
};

export const channelMessageApi = {
  list: (slug: string, channelId: string) =>
    apiGet<PaginatedData<ChannelMessage>>(`/organizations/${slug}/channels/${channelId}/messages`),
  send: (slug: string, channelId: string, data: SendChannelMessagePayload) =>
    apiPost<ChannelMessage>(`/organizations/${slug}/channels/${channelId}/messages`, data),
};
