import { apiGet, apiPost, apiDelete } from "@/shared/api";
import type {
  AddChannelMemberPayload,
  Channel,
  ChannelMember,
  ChannelMessage,
  CreateChannelPayload,
  CursorPaginatedMessages,
  SendChannelMessagePayload,
} from "../model/types";

export const channelApi = {
  list: (slug: string) => apiGet<Channel[]>(`/organizations/${slug}/channels`),
  create: (slug: string, data: CreateChannelPayload) =>
    apiPost<Channel>(`/organizations/${slug}/channels`, data),
  delete: (slug: string, channelId: string) =>
    apiDelete<void>(`/organizations/${slug}/channels/${channelId}`),
  listMembers: (slug: string, channelId: string) =>
    apiGet<ChannelMember[]>(`/organizations/${slug}/channels/${channelId}/members`),
  addMember: (slug: string, channelId: string, data: AddChannelMemberPayload) =>
    apiPost<void>(`/organizations/${slug}/channels/${channelId}/members`, data),
  removeMember: (slug: string, channelId: string, userId: string) =>
    apiDelete<void>(`/organizations/${slug}/channels/${channelId}/members/${userId}`),
};

export const channelMessageApi = {
  list: (slug: string, channelId: string, before?: string) =>
    apiGet<CursorPaginatedMessages>(
      `/organizations/${slug}/channels/${channelId}/messages${before ? `?before=${encodeURIComponent(before)}` : ""}`
    ),
  send: (slug: string, channelId: string, data: SendChannelMessagePayload) =>
    apiPost<ChannelMessage>(`/organizations/${slug}/channels/${channelId}/messages`, data),
};
