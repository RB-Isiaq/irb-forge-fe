"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const schema = z.object({
  firstName: z.string().min(1, "Required").max(50).trim(),
  lastName:  z.string().min(1, "Required").max(50).trim(),
  email:     z.string().email("Enter a valid email").trim(),
  password:  z.string().min(8, "At least 8 characters").max(64)
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});
type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await registerUser(data);
      toast.success("Account created — check your email for the verification code.");
      router.push("/verify-email");
    } catch (err) {
      toast.error(extractApiError(err, "Registration failed."));
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-[22px] font-semibold text-text-primary mb-1">Create your account</h1>
        <p className="text-[14px] text-text-muted mb-6">Build. Connect. Scale.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message} required>
              <Input id="firstName" autoComplete="given-name" placeholder="Jane" error={!!errors.firstName} {...register("firstName")} />
            </FormField>
            <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message} required>
              <Input id="lastName" autoComplete="family-name" placeholder="Smith" error={!!errors.lastName} {...register("lastName")} />
            </FormField>
          </div>

          <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" error={!!errors.email} {...register("email")} />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message} hint="8+ characters, at least one letter and one number" required>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" error={!!errors.password} className="pr-10" {...register("password")} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary" tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Create account</Button>
        </form>

        <p className="mt-5 text-center text-[13px] text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
