"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userApi } from "@/entities/user";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/ui/form-field";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

function SentState() {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-success/10 mx-auto">
          <span className="text-[22px]">✅</span>
        </div>
        <h1 className="text-[22px] font-semibold text-text-primary mb-2">Check your inbox</h1>
        <p className="text-[14px] text-text-muted mb-6">
          If that email is registered, a reset link has been sent. It expires in 15 minutes.
        </p>
        <Link href="/login" className="text-[13px] text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  );
}

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await userApi.forgotPassword(data);
    } catch {
      /* intentional */
    }
    setSent(true);
  }

  if (sent) return <SentState />;

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-[22px] font-semibold text-text-primary mb-1">Forgot password</h1>
        <p className="text-[14px] text-text-muted mb-6">
          Enter your email and we&apos;ll send a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={!!errors.email}
              {...register("email")}
            />
          </FormField>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Send reset link
          </Button>
        </form>

        <p className="mt-5 text-center text-[13px]">
          <Link href="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
