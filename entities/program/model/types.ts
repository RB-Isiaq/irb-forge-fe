export type ProgramStatus = "draft" | "active" | "completed" | "cancelled";

export interface Program {
  id: string;
  organizationId: string;
  createdById: string | null;
  name: string;
  description: string | null;
  status: ProgramStatus;
  capacity: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramPayload {
  name: string;
  description?: string;
  status?: ProgramStatus;
  capacity?: number;
  startDate?: string;
  endDate?: string;
}

export type UpdateProgramPayload = Partial<CreateProgramPayload>;
