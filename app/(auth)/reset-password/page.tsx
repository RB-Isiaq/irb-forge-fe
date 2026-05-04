"use client";

import { Suspense } from "react";
import { PageSpinner } from "@/shared/ui/spinner";
import { ResetPasswordForm } from "@/features/auth/reset-password/ui/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
