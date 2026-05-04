"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { userApi } from "@/entities/user";
import { extractApiError } from "@/shared/api";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/ui/form-field";

const schema = z.object({
  password: z.string().min(8, "At least 8 characters").max(64)
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});
type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit({ password }: FormData) {
    try {
      await userApi.resetPassword({ token, password });
      toast.success("Password reset. Sign in with your new password.");
      router.push("/login");
    } catch (err) {
      toast.error(extractApiError(err, "This link has expired or is invalid."));
    }
  }

  if (!token) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-[14px] text-text-muted mb-4">Invalid reset link.</p>
          <Link href="/forgot-password" className="text-[13px] text-primary hover:underline">Request a new one</Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-[22px] font-semibold text-text-primary mb-1">Set new password</h1>
        <p className="text-[14px] text-text-muted mb-6">Choose a strong password. You&apos;ll be signed out everywhere else.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="New password" htmlFor="password" error={errors.password?.message} hint="8+ characters, at least one letter and one number" required>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" error={!!errors.password} className="pr-10" {...register("password")} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary" tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Reset password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
