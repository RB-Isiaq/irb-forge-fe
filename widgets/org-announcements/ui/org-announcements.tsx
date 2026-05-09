"use client";

import { Megaphone } from "lucide-react";
import { useMessages } from "@/entities/message";
import { useMyRole } from "@/entities/member";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageSpinner } from "@/shared/ui/spinner";
import { getDisplayName } from "@/shared/lib";
import { SendMessageForm } from "@/features/org/send-message/ui/send-message-form";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function OrgAnnouncements({ slug }: { slug: string }) {
  const { data: messages, isLoading } = useMessages(slug);
  const myRole = useMyRole(slug);
  const canPost = myRole === "owner" || myRole === "admin" || myRole === "mentor";

  if (isLoading) return <PageSpinner />;

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

      {!messages?.length ? (
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
          {messages.map((msg) => {
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
                  <p className="text-[14px] text-text-primary whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
