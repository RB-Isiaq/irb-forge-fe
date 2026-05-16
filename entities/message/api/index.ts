import { apiGet, apiPost } from "@/shared/api";
import type { Message, SendMessagePayload } from "../model/types";

export const messageApi = {
  list: (slug: string) => apiGet<Message[]>(`/organizations/${slug}/messages`),
  send: (slug: string, data: SendMessagePayload) =>
    apiPost<Message>(`/organizations/${slug}/messages`, data),
};
