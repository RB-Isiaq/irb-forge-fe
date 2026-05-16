"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { enrollmentApi } from "../api";
import type { UpdateEnrollmentStatusPayload } from "./types";

export function useEnrollments(slug: string, programId: string) {
  return useQuery({
    queryKey: queryKeys.enrollments.byProgram(slug, programId),
    queryFn: () => enrollmentApi.listByProgram(slug, programId),
    enabled: !!slug && !!programId,
  });
}

export function useMyEnrollment(slug: string, programId: string) {
  return useQuery({
    queryKey: queryKeys.enrollments.mine(slug, programId),
    queryFn: () => enrollmentApi.getMyEnrollment(slug, programId),
    enabled: !!slug && !!programId,
  });
}

export function useMyEnrollmentsInOrg(slug: string) {
  return useQuery({
    queryKey: queryKeys.enrollments.myInOrg(slug),
    queryFn: () => enrollmentApi.getMyEnrollmentsInOrg(slug),
    enabled: !!slug,
  });
}

export function useEnroll(slug: string, programId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => enrollmentApi.enroll(slug, programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.mine(slug, programId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.myInOrg(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(slug, programId) });
      toast.success("Enrolled! Welcome to the program.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not enroll.")),
  });
}

export function useDropEnrollment(slug: string, programId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => enrollmentApi.drop(slug, programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.mine(slug, programId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.myInOrg(slug) });
      toast.success("You've left the program.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not drop enrollment.")),
  });
}

export function useUpdateEnrollmentStatus(slug: string, programId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateEnrollmentStatusPayload }) =>
      enrollmentApi.updateStatus(slug, programId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.byProgram(slug, programId) });
      toast.success("Enrollment updated.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not update enrollment.")),
  });
}
