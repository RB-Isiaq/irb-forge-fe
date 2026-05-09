"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageSpinner } from "@/shared/ui/spinner";
import { useOrgInvitations, useCancelInvitation } from "@/entities/invitation";
import { InviteMemberForm } from "@/features/org/invite-member/ui/invite-member-form";

export function InvitationsTable({ slug }: { slug: string }) {
  const [showForm, setShowForm] = useState(false);
  const { data: invitations, isLoading } = useOrgInvitations(slug);
  const cancel = useCancelInvitation(slug);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-5">
      {showForm ? (
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
      )}

      {!invitations?.length ? (
        <div className="rounded-[12px] border border-border bg-surface px-6 py-12 text-center">
          <p className="text-[14px] text-text-muted">No pending invitations.</p>
        </div>
      ) : (
        <div className="rounded-[12px] border border-border bg-surface overflow-hidden">
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
              <button
                onClick={() => cancel.mutate(inv.id)}
                disabled={cancel.isPending}
                className="p-1.5 rounded-[6px] text-text-muted hover:text-error hover:bg-error/5 transition-colors disabled:opacity-40"
                aria-label="Cancel invitation"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
