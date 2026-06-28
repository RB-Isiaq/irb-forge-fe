import { apiGet, apiPost, apiPatch, apiDelete } from "@/shared/api";
import type { PaginatedData } from "@/shared/lib";
import type {
  Program,
  ProgramStatus,
  CreateProgramPayload,
  UpdateProgramPayload,
} from "../model/types";

export const programApi = {
  list: (slug: string, page = 1, limit = 20) =>
    apiGet<PaginatedData<Program>>(`/organizations/${slug}/programs?page=${page}&limit=${limit}`),
  // Separate from `list` — used only to read `.total` for the "active programs"
  // dashboard stat via the backend's `?status=` filter, never to render rows.
  countByStatus: (slug: string, status: ProgramStatus) =>
    apiGet<PaginatedData<Program>>(`/organizations/${slug}/programs?status=${status}&limit=1`),
  get: (slug: string, id: string) => apiGet<Program>(`/organizations/${slug}/programs/${id}`),
  create: (slug: string, data: CreateProgramPayload) =>
    apiPost<Program>(`/organizations/${slug}/programs`, data),
  update: (slug: string, id: string, data: UpdateProgramPayload) =>
    apiPatch<Program>(`/organizations/${slug}/programs/${id}`, data),
  delete: (slug: string, id: string) => apiDelete(`/organizations/${slug}/programs/${id}`),
};
