"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Building2, UserCheck } from "lucide-react";
import { useAuth } from "@/entities/user";
import { invitationApi } from "@/entities/invitation";
import { useAcceptInvitation, useDeclineInvitation } from "@/entities/invitation";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { PageSpinner } from "@/shared/ui/spinner";
import type { InvitationPreview } from "@/entities/invitation";

function InvitationPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const accept  = useAcceptInvitation();
  const decline = useDeclineInvitation();

  useEffect(() => {
    if (!token) { setError(true); setLoading(false); return; }
    invitationApi.preview(token).then(setPreview).catch(() => setError(true)).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="flex items-center justify-center min-h-75"><PageSpinner /></div>;

  if (error || !preview) {
    return (
      <Card className="w-full max-w-100">
        <CardContent className="pt-6 text-center">
          <p className="text-[15px] font-medium text-text-primary mb-2">Invalid invitation</p>
          <p className="text-[13px] text-text-muted mb-5">This link has expired, been used, or is invalid.</p>
          <Link href="/dashboard"><Button variant="secondary" size="sm">Go to dashboard</Button></Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-105">
      <CardContent className="pt-6 text-center">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Building2 size={26} className="text-primary" strokeWidth={1.8} />
        </div>
        <p className="text-[14px] text-text-muted mb-1">You&apos;ve been invited to join</p>
        <h1 className="text-[22px] font-bold text-text-primary mb-1">{preview.organization.name}</h1>
        {preview.organization.description && <p className="text-[13px] text-text-muted mb-3">{preview.organization.description}</p>}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-[13px] text-text-muted">Role:</span>
          <Badge variant="primary">{preview.role}</Badge>
        </div>
        <p className="text-[12px] text-text-muted mb-6">
          Invited by <strong className="text-text-primary">{preview.invitedBy.firstName} {preview.invitedBy.lastName}</strong>
          {" · "}Expires {new Date(preview.expiresAt).toLocaleDateString()}
        </p>
        <div className="flex flex-col gap-2.5">
          <Button size="lg" className="w-full" leftIcon={<UserCheck size={16} />} loading={accept.isPending}
            onClick={() => {
              if (!isAuthenticated) { router.push(`/login?redirect=/invitations/preview?token=${token}`); return; }
              accept.mutate(token, { onSuccess: () => router.push(`/orgs/${preview.organization.slug}`) });
            }}>
            {isAuthenticated ? "Accept invitation" : "Sign in to accept"}
          </Button>
          <Button variant="secondary" size="lg" className="w-full" loading={decline.isPending}
            onClick={() => {
              if (!isAuthenticated) { router.push(`/login?redirect=/invitations/preview?token=${token}`); return; }
              decline.mutate(token, { onSuccess: () => router.push("/dashboard") });
            }}>
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InvitationPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg">
      <a href="/" className="mb-8 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-sm bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-[16px]">F</span>
        </div>
        <span className="text-[18px] font-bold text-text-primary">IRB Forge</span>
      </a>
      <Suspense fallback={<PageSpinner />}>
        <InvitationPreviewContent />
      </Suspense>
    </div>
  );
}
