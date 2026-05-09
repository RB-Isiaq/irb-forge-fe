"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth, useChangePassword } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/ui/form-field";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "At least 8 characters")
    .max(64)
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});
type FormData = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const { isGoogleAccount } = useAuth();
  const changePassword = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (isGoogleAccount) {
    return (
      <div className="rounded-[10px] bg-gray-100 border border-border px-5 py-4">
        <p className="text-[13px] text-text-secondary">
          Your account uses Google Sign-In and has no password.{" "}
          <Link href="/forgot-password" className="text-primary hover:underline font-medium">
            Set a password
          </Link>{" "}
          to enable this option.
        </p>
      </div>
    );
  }

  function onSubmit(data: FormData) {
    changePassword.mutate(data, { onSuccess: () => reset() });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Current password"
        htmlFor="currentPassword"
        error={errors.currentPassword?.message}
      >
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your current password"
            error={!!errors.currentPassword}
            className="pr-10"
            {...register("currentPassword")}
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            aria-label={showCurrent ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            tabIndex={-1}
          >
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </FormField>

      <FormField
        label="New password"
        htmlFor="newPassword"
        error={errors.newPassword?.message}
        hint="8+ characters, at least one letter and one number"
      >
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a new password"
            error={!!errors.newPassword}
            className="pr-10"
            {...register("newPassword")}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            aria-label={showNew ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            tabIndex={-1}
          >
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </FormField>

      <Button type="submit" loading={changePassword.isPending}>
        Update password
      </Button>
    </form>
  );
}
