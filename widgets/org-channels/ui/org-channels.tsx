"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Hash, Plus, Trash2, Lock, Users } from "lucide-react";
import {
  useChannels,
  useChannelMessages,
  useDeleteChannel,
  type Channel,
} from "@/entities/channel";
import { useMyRole } from "@/entities/member";
import { useOrgSubscription } from "@/entities/subscription";
import { useAuth } from "@/entities/user";
import { CreateChannelForm } from "@/features/org/create-channel/ui/create-channel-form";
import { SendChannelMessageForm } from "@/features/org/send-channel-message/ui/send-channel-message-form";
import { ManageChannelMembersPanel } from "@/features/org/manage-channel-members/ui/manage-channel-members-panel";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Spinner } from "@/shared/ui/spinner";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ErrorState } from "@/shared/ui/error-state";
import { MarkdownContent } from "@/shared/ui/markdown-content";
import { cn, getDisplayName, timeAgo } from "@/shared/lib";

const NEAR_TOP_PX = 80;

export function OrgChannels({ slug }: { slug: string }) {
  const { data: channels, isLoading, isError, refetch } = useChannels(slug);
  const myRole = useMyRole(slug);
  const { user } = useAuth();
  const { data: subscription } = useOrgSubscription(slug);
  const deleteChannel = useDeleteChannel(slug);
  const isOwnerOrAdmin = myRole === "owner" || myRole === "admin";
  const canCreateChannel = isOwnerOrAdmin || myRole === "mentor";
  const isPro = subscription?.plan === "pro" && subscription?.status === "active";
  const atFreeLimit = !isPro && (channels === undefined || channels.length >= 1);

  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const [showMembersPanel, setShowMembersPanel] = useState(false);

  // Default to the first channel until the user explicitly picks one.
  const activeChannelId = selectedChannelId ?? channels?.[0]?.id ?? null;
  const activeChannel = channels?.find((c) => c.id === activeChannelId) ?? null;
  const canManageMembers =
    !!activeChannel &&
    !activeChannel.isDefault &&
    (isOwnerOrAdmin || activeChannel.createdById === user?.id);

  const {
    data: messagePages,
    isLoading: messagesLoading,
    isError: messagesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChannelMessages(slug, activeChannelId);

  // Pages arrive newest-batch-first, each batch itself newest-first — flatten in
  // that order, then reverse once so the feed reads oldest-to-newest top-to-bottom.
  const messages = useMemo(
    () => [...(messagePages?.pages.flatMap((p) => p.items) ?? [])].reverse(),
    [messagePages]
  );

  const feedRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const isPrependingRef = useRef(false);
  const prevScrollHeightRef = useRef(0);

  // Switching channels: always land on the newest message.
  useLayoutEffect(() => {
    isNearBottomRef.current = true;
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeChannelId]);

  // New message appended (and user was already at the bottom) → follow it down.
  // Older page prepended (scrolled-to-top "load more") → hold the visual position.
  useLayoutEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    if (isPrependingRef.current) {
      el.scrollTop = el.scrollHeight - prevScrollHeightRef.current + el.scrollTop;
      isPrependingRef.current = false;
    } else if (isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  function handleFeedScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_TOP_PX;
    if (el.scrollTop < NEAR_TOP_PX && hasNextPage && !isFetchingNextPage) {
      isPrependingRef.current = true;
      prevScrollHeightRef.current = el.scrollHeight;
      fetchNextPage();
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-[200px_1fr] gap-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <ErrorState message="Couldn't load channels." onRetry={refetch} />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4">
      {/* Channel list */}
      <Card className="p-2 h-fit">
        <div className="space-y-0.5">
          {channels?.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannelId(channel.id)}
              className={cn(
                "group w-full flex items-center gap-1.5 rounded-[7px] px-2.5 py-2 text-[13px] font-medium text-left transition-colors",
                activeChannelId === channel.id
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-white/5"
              )}
            >
              <Hash size={14} className="shrink-0" />
              <span className="flex-1 truncate">{channel.name}</span>
              {isOwnerOrAdmin && !channel.isDefault && (
                <Trash2
                  size={13}
                  className="shrink-0 opacity-0 group-hover:opacity-100 hover:text-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChannelToDelete(channel);
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {canCreateChannel && (
          <div className="mt-2 pt-2 border-t border-border">
            {showCreateForm ? (
              <CreateChannelForm slug={slug} onSuccess={() => setShowCreateForm(false)} />
            ) : atFreeLimit ? (
              <a
                href={`/orgs/${slug}/billing`}
                className="flex items-center gap-1.5 rounded-[7px] px-2.5 py-2 text-[12px] font-medium text-text-muted hover:text-primary transition-colors"
              >
                <Lock size={13} />
                Upgrade to Pro for more channels
              </a>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center gap-1.5 rounded-[7px] px-2.5 py-2 text-[13px] font-medium text-text-muted hover:bg-gray-100 hover:text-text-primary dark:hover:bg-white/5 transition-colors"
              >
                <Plus size={14} />
                New channel
              </button>
            )}
          </div>
        )}
      </Card>

      {/* Active channel feed */}
      <Card className="flex flex-col h-150">
        {!activeChannel ? (
          <CardContent className="flex-1 flex items-center justify-center text-[13px] text-text-muted">
            No channel selected.
          </CardContent>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <Hash size={15} className="text-text-muted shrink-0" />
                <h2 className="text-[14px] font-semibold text-text-primary truncate">
                  {activeChannel.name}
                </h2>
              </div>
              {canManageMembers && (
                <button
                  type="button"
                  onClick={() => setShowMembersPanel(true)}
                  aria-label="Manage members"
                  className="shrink-0 flex items-center gap-1 text-[12px] font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  <Users size={14} />
                  Members
                </button>
              )}
            </div>

            <div
              ref={feedRef}
              onScroll={handleFeedScroll}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
              {messagesLoading ? (
                <>
                  <Skeleton className="h-10 w-2/3" />
                  <Skeleton className="h-10 w-1/2" />
                </>
              ) : messagesError ? (
                <ErrorState message="Couldn't load messages." className="py-6" />
              ) : (
                <>
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-1">
                      <Spinner size={16} />
                    </div>
                  )}
                  {!messages.length ? (
                    <p className="text-[13px] text-text-muted text-center py-10">
                      No messages yet. Say hello!
                    </p>
                  ) : (
                    messages.map((msg) => {
                      const authorName = msg.author
                        ? getDisplayName(msg.author.firstName, msg.author.lastName)
                        : "Deleted user";
                      return (
                        <div key={msg.id}>
                          <div className="flex items-baseline gap-2">
                            <span className="text-[13px] font-semibold text-text-primary">
                              {authorName}
                            </span>
                            <time className="text-[11px] text-text-muted">
                              {timeAgo(msg.createdAt)}
                            </time>
                          </div>
                          <MarkdownContent content={msg.content} />
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>

            <div className="px-4 py-3 border-t border-border">
              <SendChannelMessageForm slug={slug} channelId={activeChannel.id} />
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!channelToDelete}
        onOpenChange={(open) => !open && setChannelToDelete(null)}
        title={`Delete #${channelToDelete?.name}?`}
        description="This permanently deletes the channel and all its messages."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteChannel.isPending}
        onConfirm={() => {
          if (!channelToDelete) return;
          deleteChannel.mutate(channelToDelete.id, {
            onSuccess: () => {
              if (activeChannelId === channelToDelete.id) setSelectedChannelId(null);
              setChannelToDelete(null);
            },
          });
        }}
      />

      <ManageChannelMembersPanel
        open={showMembersPanel}
        onOpenChange={setShowMembersPanel}
        slug={slug}
        channel={activeChannel}
      />
    </div>
  );
}
