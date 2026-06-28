"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ErrorState } from "@/shared/ui/error-state";
import { Avatar } from "@/entities/user/ui/avatar";
import {
  useMembers,
  useMyMembership,
  useUpdateMemberRole,
  useRemoveMember,
  type OrgRole,
} from "@/entities/member";
import { getDisplayName } from "@/shared/lib";

const roleBadgeVariant: Record<OrgRole, "primary" | "success" | "default" | "outline"> = {
  owner: "primary",
  admin: "success",
  mentor: "default",
  member: "outline",
};

const ROLE_OPTIONS: Array<{ value: Exclude<OrgRole, "owner">; label: string }> = [
  { value: "admin", label: "Admin" },
  { value: "mentor", label: "Mentor" },
  { value: "member", label: "Member" },
];

export function MembersList({ slug }: { slug: string }) {
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const {
    data: membersPages,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMembers(slug);
  const { data: myMembership } = useMyMembership(slug);
  const updateRole = useUpdateMemberRole(slug);
  const remove = useRemoveMember(slug);

  const myRole = myMembership?.role ?? null;
  const myUserId = myMembership?.userId ?? null;
  const canManage = myRole === "owner" || myRole === "admin";

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-5 py-3.5 ${i < 3 ? "border-b border-border" : ""}`}
          >
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <ErrorState message="Couldn't load members." onRetry={refetch} />
      </div>
    );
  }

  const items = membersPages?.pages.flatMap((p) => p.items) ?? [];
  const total = membersPages?.pages[0]?.total ?? 0;

  if (!items.length) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="text-[14px] text-text-muted">No members yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {items.map((m, i) => {
        const isOwnerRow = m.role === "owner";
        const isSelf = m.userId === myUserId;
        const canActOnRow =
          canManage && !isOwnerRow && !isSelf && !(myRole === "admin" && m.role === "admin");
        const displayName = getDisplayName(m.user.firstName, m.user.lastName, m.user.email);

        return (
          <div
            key={m.id}
            className={`flex items-center gap-3 px-5 py-3.5 ${i < items.length - 1 ? "border-b border-border" : ""}`}
          >
            <Avatar firstName={m.user.firstName} lastName={m.user.lastName} size="sm" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[13px] font-medium text-text-primary">{displayName}</p>
                {isSelf && <span className="text-[11px] text-text-muted">(you)</span>}
              </div>
              <p className="text-[12px] text-text-muted truncate">{m.user.email}</p>
            </div>

            {canActOnRow ? (
              <select
                value={m.role}
                disabled={updateRole.isPending}
                aria-label={`Role for ${displayName}`}
                onChange={(e) =>
                  updateRole.mutate({
                    userId: m.userId,
                    data: { role: e.target.value as Exclude<OrgRole, "owner"> },
                  })
                }
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-[12px] text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50"
              >
                {ROLE_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <Badge variant={roleBadgeVariant[m.role]}>{m.role}</Badge>
            )}

            {canActOnRow && (
              <button
                type="button"
                onClick={() => setRemoveTarget({ id: m.userId, name: displayName })}
                className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/5 transition-colors shrink-0"
                aria-label="Remove member"
                title="Remove member"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        );
      })}
      {total > items.length && (
        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
          <p className="text-[12px] text-text-muted">
            Showing {items.length} of {total} members
          </p>
          {hasNextPage && (
            <Button
              size="sm"
              variant="secondary"
              loading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              Load more
            </Button>
          )}
        </div>
      )}

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title={`Remove ${removeTarget?.name ?? "member"}?`}
        description="They'll lose access to this organization immediately."
        confirmLabel="Remove member"
        variant="danger"
        loading={remove.isPending}
        onConfirm={() => {
          if (removeTarget) {
            remove.mutate(removeTarget.id, { onSettled: () => setRemoveTarget(null) });
          }
        }}
      />
    </div>
  );
}
