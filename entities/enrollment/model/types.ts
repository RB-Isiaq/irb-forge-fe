export type EnrollmentStatus = "active" | "completed" | "dropped";

export interface Enrollment {
  id: string;
  userId: string;
  programId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  program?: {
    id: string;
    name: string;
    description: string | null;
    status: "draft" | "active" | "completed" | "cancelled";
    startDate: string | null;
    endDate: string | null;
  };
}

export interface UpdateEnrollmentStatusPayload {
  status: "completed" | "dropped";
}
