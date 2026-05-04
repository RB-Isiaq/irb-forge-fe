"use client";

import { Suspense } from "react";
import { PageSpinner } from "@/shared/ui/spinner";
import { RegisterForm } from "@/features/auth/register/ui/register-form";

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
