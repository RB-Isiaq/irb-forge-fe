"use client";

import { Megaphone } from "lucide-react";
import { useMessages } from "@/entities/message";
import { useMyRole } from "@/entities/member";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";
import { getDisplayName, timeAgo } from "@/shared/lib";
import { MarkdownContent } from "@/shared/ui/markdown-content";
import { SendMessageForm } from "@/features/org/send-message/ui/send-message-form";

export function OrgAnnouncements({ slug }: { slug: string }) {
  const {
    data: messagesPages,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(slug);
  const myRole = useMyRole(slug);
  const canPost = myRole === "owner" || myRole === "admin" || myRole === "mentor";

  const items = messagesPages?.pages.flatMap((p) => p.items) ?? [];
  const total = messagesPages?.pages[0]?.total ?? 0;

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <div className="flex justify-between mb-3">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-14" />
              </div>
              <Skeleton className="h-3 w-full mb-1.5" />
              <Skeleton className="h-3 w-5/6 mb-1.5" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );

  if (isError)
    return (
      <Card>
        <ErrorState message="Couldn't load announcements." onRetry={refetch} />
      </Card>
    );

  return (
    <div className="space-y-5">
      {canPost && (
        <Card>
          <CardHeader>
            <CardTitle>New announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <SendMessageForm slug={slug} />
          </CardContent>
        </Card>
      )}

      {!items.length ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Megaphone size={36} className="mx-auto text-text-muted mb-3" strokeWidth={1.5} />
            <p className="text-[14px] font-medium text-text-primary mb-1">No announcements yet</p>
            <p className="text-[13px] text-text-muted">
              {canPost
                ? "Send your first announcement to the team."
                : "Announcements from your organization will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((msg) => {
            const authorName = msg.author
              ? getDisplayName(msg.author.firstName, msg.author.lastName)
              : "Deleted user";
            return (
              <Card key={msg.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-[13px] font-semibold text-text-primary">{authorName}</p>
                    <time className="text-[12px] text-text-muted shrink-0">
                      {timeAgo(msg.createdAt)}
                    </time>
                  </div>
                  <MarkdownContent content={msg.content} />
                </CardContent>
              </Card>
            );
          })}
          {total > items.length && (
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-[12px] text-text-muted">
                Showing {items.length} of {total} announcements
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
        </div>
      )}
    </div>
  );
}
