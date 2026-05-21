"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/entities/user";
import { invitationApi } from "@/entities/invitation";
import type { InvitationPreview } from "@/entities/invitation";
import { Card, CardContent } from "@/shared/ui/card";
import { Logo } from "@/shared/ui/logo";
import { Button } from "@/shared/ui/button";
import { PageSpinner } from "@/shared/ui/spinner";
import { extractApiError } from "@/shared/api";

type State = "loading-preview" | "confirming" | "declining" | "success" | "error";

function DeclineContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [errorMsg, setErrorMsg] = useState("This invitation has expired or is no longer valid.");

  // Derive initial state from token presence — avoids synchronous setState inside effect
  const [state, setState] = useState<State>(token ? "loading-preview" : "error");

  useEffect(() => {
    if (!token) return;
    invitationApi
      .preview(token)
      .then((p) => {
        setPreview(p);
        setState("confirming");
      })
      .catch(() => setState("error"));
  }, [token]);

  if (state === "loading-preview") {
    return (
      <div className="flex items-center justify-center min-h-75">
        <PageSpinner />
      </div>
    );
  }

  if (state === "success") {
    return (
      <Card className="w-full max-w-100">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 size={40} className="text-success mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-[15px] font-medium text-text-primary mb-2">Invitation declined</p>
          <p className="text-[13px] text-text-muted mb-5">
            {preview
              ? `You've declined the invitation to ${preview.organization.name}.`
              : "Invitation declined."}
          </p>
          <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard")}>
            Go to dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state === "error") {
    return (
      <Card className="w-full max-w-100">
        <CardContent className="pt-6 text-center">
          <XCircle size={40} className="text-error mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-[15px] font-medium text-text-primary mb-2">Invalid invitation</p>
          <p className="text-[13px] text-text-muted mb-5">{errorMsg}</p>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              Go to dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-100">
      <CardContent className="pt-6 text-center">
        <p className="text-[15px] font-medium text-text-primary mb-1">Decline this invitation?</p>
        {preview && (
          <p className="text-[13px] text-text-muted mb-5">
            You&apos;re declining to join{" "}
            <strong className="text-text-primary">{preview.organization.name}</strong> as{" "}
            <strong className="text-text-primary">{preview.role}</strong>.
          </p>
        )}
        <div className="flex gap-2.5 justify-center">
          <Button
            variant="danger"
            loading={state === "declining"}
            onClick={() => {
              if (!isAuthenticated) {
                router.push(`/login?redirect=/invitations/decline?token=${token}`);
                return;
              }
              setState("declining");
              invitationApi
                .decline({ token })
                .then(() => setState("success"))
                .catch((err) => {
                  setErrorMsg(extractApiError(err, "Could not decline the invitation."));
                  setState("error");
                });
            }}
          >
            {!isAuthenticated && isInitialized ? "Sign in to decline" : "Yes, decline"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DeclineInvitationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg">
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <Logo markSize={32} />
      </Link>
      <Suspense fallback={<PageSpinner />}>
        <DeclineContent />
      </Suspense>
    </div>
  );
}
