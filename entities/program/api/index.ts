import { apiGet, apiPost, apiPatch, apiDelete } from "@/shared/api";
import type { Program, CreateProgramPayload, UpdateProgramPayload } from "../model/types";

export const programApi = {
  list: (slug: string) => apiGet<Program[]>(`/organizations/${slug}/programs`),
  get: (slug: string, id: string) => apiGet<Program>(`/organizations/${slug}/programs/${id}`),
  create: (slug: string, data: CreateProgramPayload) =>
    apiPost<Program>(`/organizations/${slug}/programs`, data),
  update: (slug: string, id: string, data: UpdateProgramPayload) =>
    apiPatch<Program>(`/organizations/${slug}/programs/${id}`, data),
  delete: (slug: string, id: string) => apiDelete(`/organizations/${slug}/programs/${id}`),
};
