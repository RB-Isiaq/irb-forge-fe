"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  useAddChannelMember,
  useChannelMembers,
  useRemoveChannelMember,
  type Channel,
} from "@/entities/channel";
import { useMembers } from "@/entities/member";
import { useAuth } from "@/entities/user";
import { Spinner } from "@/shared/ui/spinner";
import { getDisplayName } from "@/shared/lib";

interface ManageChannelMembersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  channel: Channel | null;
}

export function ManageChannelMembersPanel({
  open,
  onOpenChange,
  slug,
  channel,
}: ManageChannelMembersPanelProps) {
  const { user } = useAuth();
  const channelId = channel?.id ?? null;
  const { data: channelMembers, isLoading: membersLoading } = useChannelMembers(
    slug,
    channelId,
    open
  );
  const {
    data: orgMembersPages,
    isLoading: orgMembersLoading,
    hasNextPage: orgMembersHasNextPage,
    isFetchingNextPage: orgMembersFetchingNextPage,
    fetchNextPage: fetchNextOrgMembersPage,
  } = useMembers(slug);
  const addMember = useAddChannelMember(slug, channelId ?? "");
  const removeMember = useRemoveChannelMember(slug, channelId ?? "");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  // The "candidates" list needs every org member, not just the first page —
  // keep pulling pages until there's nothing left, rather than surfacing a
  // second "Load more" inside this picker.
  useEffect(() => {
    if (open && orgMembersHasNextPage && !orgMembersFetchingNextPage) {
      fetchNextOrgMembersPage();
    }
  }, [open, orgMembersHasNextPage, orgMembersFetchingNextPage, fetchNextOrgMembersPage]);

  if (!open || !channel) return null;

  const orgMembers = orgMembersPages?.pages.flatMap((p) => p.items) ?? [];
  const memberIds = new Set((channelMembers ?? []).map((m) => m.userId));
  const candidates = orgMembers.filter((m) => !memberIds.has(m.userId));

  function handleAdd(userId: string) {
    setPendingUserId(userId);
    addMember.mutate({ userId }, { onSettled: () => setPendingUserId(null) });
  }

  function handleRemove(userId: string) {
    setPendingUserId(userId);
    removeMember.mutate(userId, { onSettled: () => setPendingUserId(null) });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-members-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
          <h2 id="manage-members-title" className="text-[16px] font-semibold text-text-primary">
            #{channel.name} members
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <section>
            <h3 className="text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-2">
              Members
            </h3>
            {membersLoading ? (
              <Spinner size={18} />
            ) : (
              <div className="space-y-1">
                {(channelMembers ?? []).map((m) => {
                  const name = m.user
                    ? getDisplayName(m.user.firstName, m.user.lastName, m.user.email)
                    : "Deleted user";
                  const isSelf = m.userId === user?.id;
                  const busy = pendingUserId === m.userId;
                  return (
                    <div key={m.id} className="flex items-center justify-between gap-2 py-1.5">
                      <span className="text-[13px] text-text-primary">
                        {name}
                        {isSelf ? " (you)" : ""}
                      </span>
                      {!isSelf && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleRemove(m.userId)}
                          className="text-[12px] font-medium text-error hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-2">
              Add members
            </h3>
            {orgMembersLoading || orgMembersHasNextPage ? (
              <Spinner size={18} />
            ) : candidates.length === 0 ? (
              <p className="text-[13px] text-text-muted">
                Everyone in the org is already in this channel.
              </p>
            ) : (
              <div className="space-y-1">
                {candidates.map((m) => {
                  const busy = pendingUserId === m.userId;
                  return (
                    <div key={m.id} className="flex items-center justify-between gap-2 py-1.5">
                      <span className="text-[13px] text-text-primary">
                        {getDisplayName(m.user.firstName, m.user.lastName, m.user.email)}
                      </span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleAdd(m.userId)}
                        className="text-[12px] font-medium text-primary hover:underline disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
