"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/entities/user";
import { invitationApi } from "@/entities/invitation";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";
import { PageSpinner } from "@/shared/ui/spinner";
import { extractApiError } from "@/shared/api";

type ApiState = "idle" | "success" | "error";

function AcceptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const token = searchParams.get("token") ?? "";

  // Only track the async result — auth/init state is read directly from the hook
  const [apiState, setApiState] = useState<ApiState>("idle");
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("This invitation has expired or is no longer valid.");
  const hasStarted = useRef(false);

  useEffect(() => {
    // Only run once, only when auth is resolved, only when authenticated
    if (hasStarted.current || !isInitialized || !token || !isAuthenticated) return;
    hasStarted.current = true;
    // Defer so setState in the async callback is never synchronous inside the effect body
    setTimeout(async () => {
      try {
        const preview = await invitationApi.preview(token);
        setOrgSlug(preview.organization.slug);
        setOrgName(preview.organization.name);
        await invitationApi.accept({ token });
        setApiState("success");
      } catch (err) {
        setErrorMsg(extractApiError(err, "This invitation has expired or is no longer valid."));
        setApiState("error");
      }
    }, 0);
  }, [isInitialized, isAuthenticated, token]);

  if (!token || apiState === "error") {
    return (
      <Card className="w-full max-w-100">
        <CardContent className="pt-6 text-center">
          <XCircle size={40} className="text-error mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-[15px] font-medium text-text-primary mb-2">
            {!token ? "Invalid link" : "Could not accept"}
          </p>
          <p className="text-[13px] text-text-muted mb-5">
            {!token ? "No invitation token was found." : errorMsg}
          </p>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              Go to dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (apiState === "success") {
    return (
      <Card className="w-full max-w-100">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 size={40} className="text-success mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-[15px] font-medium text-text-primary mb-2">
            {orgName ? `You've joined ${orgName}!` : "Invitation accepted!"}
          </p>
          <p className="text-[13px] text-text-muted mb-5">
            You now have access to this organization.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push(orgSlug ? `/orgs/${orgSlug}` : "/dashboard")}
          >
            {orgSlug ? "Go to organization" : "Go to dashboard"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // apiState === "idle"
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <PageSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-100">
        <CardContent className="pt-6 text-center">
          <p className="text-[15px] font-medium text-text-primary mb-2">Sign in to accept</p>
          <p className="text-[13px] text-text-muted mb-5">
            You need to be signed in to accept this invitation.
          </p>
          <Link href={`/login?redirect=/invitations/accept?token=${token}`}>
            <Button className="w-full">Sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Authenticated + idle → effect is running
  return (
    <div className="flex flex-col items-center gap-3 min-h-75 justify-center">
      <PageSpinner />
      <p className="text-[13px] text-text-muted">Accepting invitation…</p>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg">
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <Logo markSize={32} />
      </Link>
      <Suspense fallback={<PageSpinner />}>
        <AcceptContent />
      </Suspense>
    </div>
  );
}
