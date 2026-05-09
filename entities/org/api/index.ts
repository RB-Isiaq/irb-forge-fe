import { apiGet, apiPost, apiPatch, apiDelete } from "@/shared/api";
import type {
  Organization,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
} from "../model/types";

export const orgApi = {
  list: () => apiGet<Organization[]>("/organizations"),
  get: (slug: string) => apiGet<Organization>(`/organizations/${slug}`),
  create: (data: CreateOrganizationPayload) => apiPost<Organization>("/organizations", data),
  update: (slug: string, data: UpdateOrganizationPayload) =>
    apiPatch<Organization>(`/organizations/${slug}`, data),
  delete: (slug: string) => apiDelete(`/organizations/${slug}`),
};
