"use client";

import { Building2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";
import {
  useMyInvitations,
  useAcceptInvitationById,
  useDeclineInvitationById,
} from "@/entities/invitation";
import { getDisplayName } from "@/shared/lib";

export function InvitationsInbox() {
  const router = useRouter();
  const { data: invitations, isLoading, isError, refetch } = useMyInvitations();

  /*
   * ID-based hooks — require backend endpoints:
   *   PATCH /invitations/:id/accept
   *   PATCH /invitations/:id/decline
   * See entities/invitation/api/index.ts for the expected contract.
   */
  const accept = useAcceptInvitationById();
  const decline = useDeclineInvitationById();

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface px-5 py-4 flex items-center gap-4"
          >
            <Skeleton className="h-10 w-10 rounded-[10px] shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    );

  if (isError)
    return (
      <Card>
        <ErrorState message="Couldn't load your invitations." onRetry={refetch} />
      </Card>
    );

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
      {invitations.map((inv) => {
        const inviterName = getDisplayName(inv.invitedBy?.firstName, inv.invitedBy?.lastName);

        return (
          <Card key={inv.id}>
            <CardContent className="py-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <div className="h-10 w-10 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary">
                  {inv.organization?.name ?? "Unknown organization"}
                </p>
                <p className="text-[12px] text-text-muted">
                  Invited by {inviterName} · Expires {new Date(inv.expiresAt).toLocaleDateString()}
                </p>
              </div>

              <Badge variant="outline">{inv.role}</Badge>

              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  leftIcon={<Check size={13} />}
                  loading={accept.isPending}
                  onClick={() =>
                    accept.mutate(inv.id, {
                      onSuccess: () => router.push(`/orgs/${inv.organization?.slug ?? ""}`),
                    })
                  }
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<X size={13} />}
                  loading={decline.isPending}
                  onClick={() => decline.mutate(inv.id)}
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
