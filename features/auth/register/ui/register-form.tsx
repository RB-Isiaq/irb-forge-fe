"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useAuth } from "@/entities/user";
import { extractApiError } from "@/shared/api";
import { cn } from "@/shared/lib";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/ui/form-field";
import { AuthDivider } from "@/shared/ui/auth-divider";
import { GoogleSignInButton } from "@/features/auth/google-sign-in/ui/google-sign-in-button";

const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Contains a letter", test: (v: string) => /[a-zA-Z]/.test(v) },
  { label: "Contains a number", test: (v: string) => /[0-9]/.test(v) },
];

const schema = z.object({
  firstName: z.string().min(1, "First name is required").max(50).trim(),
  lastName: z.string().min(1, "Last name is required").max(50).trim(),
  email: z.string().email("Enter a valid email address").trim(),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(64)
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});
type FormData = z.infer<typeof schema>;

function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  return (
    <ul className="mt-2 space-y-1">
      {passwordRules.map(({ label, test }) => {
        const pass = test(value);
        return (
          <li
            key={label}
            className={cn(
              "flex items-center gap-1.5 text-[12px]",
              pass ? "text-success" : "text-text-muted"
            )}
          >
            {pass ? <Check size={12} /> : <X size={12} />}
            {label}
          </li>
        );
      })}
    </ul>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await registerUser(data);
      toast.success("Account created — check your email for a verification code.");
      router.push("/verify-email");
    } catch (err) {
      const msg = extractApiError(err);
      if (msg.toLowerCase().includes("already")) {
        toast.error("An account with this email already exists. Try signing in.");
      } else {
        toast.error(msg || "Registration failed. Try again.");
      }
    }
  }

  return (
    <Card>
      <CardContent className="pt-7 pb-6">
        <h1 className="text-[22px] font-semibold text-text-primary mb-1">Create your account</h1>
        <p className="text-[14px] text-text-muted mb-6">
          Join IRB Forge and start building your community.
        </p>

        {/* Google Sign-In — primary CTA */}
        <div className="flex justify-center">
          <GoogleSignInButton
            text="signup_with"
            onSuccess={() => router.push("/dashboard")}
            onError={(msg) => toast.error(msg)}
          />
        </div>

        <AuthDivider />

        {/* Email registration */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
              <Input
                id="firstName"
                autoComplete="given-name"
                placeholder="Jane"
                error={!!errors.firstName}
                {...register("firstName")}
              />
            </FormField>
            <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
              <Input
                id="lastName"
                autoComplete="family-name"
                placeholder="Smith"
                error={!!errors.lastName}
                {...register("lastName")}
              />
            </FormField>
          </div>

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
                autoComplete="new-password"
                placeholder="Create a password"
                error={!!errors.password}
                className="pr-10"
                {...register("password", {
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
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
            <PasswordStrength value={passwordValue} />
          </FormField>

          <Button type="submit" size="lg" className="w-full mt-2" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-[12px] text-text-muted">
          By signing up, you agree to our{" "}
          <span className="text-text-secondary">Terms of Service</span> and{" "}
          <span className="text-text-secondary">Privacy Policy</span>.
        </p>

        <p className="mt-3 text-center text-[13px] text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
