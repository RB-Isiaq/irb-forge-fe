"use client";

import { useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageSpinner } from "@/shared/ui/spinner";
import { useOrgInvitations, useCancelInvitation, useResendInvitation } from "@/entities/invitation";
import { useMyRole } from "@/entities/member";
import { InviteMemberForm } from "@/features/org/invite-member/ui/invite-member-form";

export function InvitationsTable({ slug }: { slug: string }) {
  const [showForm, setShowForm] = useState(false);
  const { data: invitations, isLoading } = useOrgInvitations(slug);
  const cancel = useCancelInvitation(slug);
  const resend = useResendInvitation(slug);
  const myRole = useMyRole(slug);
  const canManage = myRole === "owner" || myRole === "admin";

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-5">
      {canManage &&
        (showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Invite a member</CardTitle>
            </CardHeader>
            <CardContent>
              <InviteMemberForm slug={slug} onSuccess={() => setShowForm(false)} />
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-text-muted"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex justify-end">
            <Button size="sm" leftIcon={<Plus size={15} />} onClick={() => setShowForm(true)}>
              Invite member
            </Button>
          </div>
        ))}

      {!invitations?.length ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-[14px] text-text-muted">No pending invitations.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          {invitations.map((inv, i) => (
            <div
              key={inv.id}
              className={`flex items-center gap-3 px-5 py-3.5 ${i < invitations.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary truncate">{inv.email}</p>
                <p className="text-[12px] text-text-muted">
                  Expires {new Date(inv.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline">{inv.role}</Badge>
              {canManage && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => resend.mutate(inv.id)}
                    disabled={resend.isPending}
                    className="p-1.5 rounded-md text-text-muted hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                    aria-label="Resend invitation"
                    title="Resend invitation"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => cancel.mutate(inv.id)}
                    disabled={cancel.isPending}
                    className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/5 transition-colors disabled:opacity-40"
                    aria-label="Cancel invitation"
                    title="Cancel invitation"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
