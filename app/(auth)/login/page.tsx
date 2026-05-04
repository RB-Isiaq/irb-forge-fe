"use client";

import { Suspense } from "react";
import { PageSpinner } from "@/shared/ui/spinner";
import { LoginForm } from "@/features/auth/login/ui/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
