"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { userApi } from "../api";
import { useAuthStore } from "./store";
import type { User, ChangePasswordPayload } from "./types";

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Pick<User, "firstName" | "lastName">>) =>
      userApi.updateProfile(data),
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.setQueryData(queryKeys.me(), updated);
      toast.success("Profile updated.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not update profile.")),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => userApi.changePassword(data),
    onSuccess: () =>
      toast.success("Password changed. You may need to sign in again on other devices."),
    onError: (err) => {
      const msg = extractApiError(err);
      if (msg.toLowerCase().includes("google")) {
        toast.error("This account uses Google Sign-In. Use forgot password to set a password.");
      } else {
        toast.error(msg);
      }
    },
  });
}
