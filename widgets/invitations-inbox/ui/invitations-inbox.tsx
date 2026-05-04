"use client";

import { Building2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { PageSpinner } from "@/shared/ui/spinner";
import { useMyInvitations, useAcceptInvitation, useDeclineInvitation } from "@/entities/invitation";

export function InvitationsInbox() {
  const router = useRouter();
  const { data: invitations, isLoading } = useMyInvitations();
  const accept  = useAcceptInvitation();
  const decline = useDeclineInvitation();

  if (isLoading) return <PageSpinner />;

  if (!invitations?.length) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-[14px] text-text-muted">No pending invitations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((inv) => (
        <Card key={inv.id}>
          <CardContent className="py-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="h-10 w-10 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary">{inv.organization?.name ?? "Unknown organization"}</p>
              <p className="text-[12px] text-text-muted">
                Invited by {inv.invitedBy?.firstName} {inv.invitedBy?.lastName} · Expires {new Date(inv.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline">{inv.role}</Badge>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" leftIcon={<Check size={13} />} loading={accept.isPending}
                onClick={() => accept.mutate(inv.id, { onSuccess: () => router.push(`/orgs/${inv.organization?.slug ?? ""}`) })}>
                Accept
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<X size={13} />} loading={decline.isPending}
                onClick={() => decline.mutate(inv.id)}>
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
