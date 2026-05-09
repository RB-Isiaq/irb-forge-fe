"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/entities/user";
import { extractApiError } from "@/shared/api";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/ui/form-field";
import { AuthDivider } from "@/shared/ui/auth-divider";
import { GoogleSignInButton } from "@/features/auth/google-sign-in/ui/google-sign-in-button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await login(data);
      router.push(redirect);
    } catch (err) {
      const msg = extractApiError(err);
      if (msg.toLowerCase().includes("google")) {
        toast.error("This account uses Google Sign-In. Click 'Continue with Google' below.");
      } else {
        toast.error("Incorrect email or password.");
      }
    }
  }

  return (
    <Card>
      <CardContent className="pt-7 pb-6">
        <h1 className="text-[22px] font-semibold text-text-primary mb-1">Welcome back</h1>
        <p className="text-[14px] text-text-muted mb-6">Sign in to your IRB Forge account.</p>

        {/* Google Sign-In — primary CTA */}
        <div className="flex justify-center">
          <GoogleSignInButton
            onSuccess={() => router.push(redirect)}
            onError={(msg) => toast.error(msg)}
          />
        </div>

        <AuthDivider />

        {/* Email + password */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={!!errors.email}
              {...register("email")}
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                error={!!errors.password}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <div className="flex justify-end -mt-1">
            <Link href="/forgot-password" className="text-[13px] text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-[13px] text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Create one — it&apos;s free
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
