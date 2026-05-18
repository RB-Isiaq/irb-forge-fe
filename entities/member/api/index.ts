import { apiGet, apiPatch, apiDelete } from "@/shared/api";
import type { PaginatedData } from "@/shared/lib";
import type { Membership, MyMembership, UpdateMemberRolePayload } from "../model/types";

export const memberApi = {
  list: (slug: string) => apiGet<PaginatedData<Membership>>(`/organizations/${slug}/members`),
  updateRole: (slug: string, userId: string, data: UpdateMemberRolePayload) =>
    apiPatch<Membership>(`/organizations/${slug}/members/${userId}/role`, data),
  remove: (slug: string, userId: string) => apiDelete(`/organizations/${slug}/members/${userId}`),
  getMe: (slug: string) => apiGet<MyMembership>(`/organizations/${slug}/members/me`),
  leave: (slug: string) => apiDelete(`/organizations/${slug}/members/me`),
};
