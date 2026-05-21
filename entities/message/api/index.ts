import { apiGet, apiPost } from "@/shared/api";
import type { PaginatedData } from "@/shared/lib";
import type { Message, SendMessagePayload } from "../model/types";

export const messageApi = {
  list: (slug: string) => apiGet<PaginatedData<Message>>(`/organizations/${slug}/messages`),
  send: (slug: string, data: SendMessagePayload) =>
    apiPost<Message>(`/organizations/${slug}/messages`, data),
};
