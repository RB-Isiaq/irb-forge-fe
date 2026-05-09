"use client";

import { Badge } from "@/shared/ui/badge";
import { PageSpinner } from "@/shared/ui/spinner";
import { Avatar } from "@/entities/user/ui/avatar";
import { useMembers, type OrgRole } from "@/entities/member";

const roleBadgeVariant: Record<OrgRole, "primary" | "success" | "default" | "outline"> = {
  owner: "primary",
  admin: "success",
  mentor: "default",
  member: "outline",
};

export function MembersList({ slug }: { slug: string }) {
  const { data: members, isLoading } = useMembers(slug);

  if (isLoading) return <PageSpinner />;
  if (!members?.length) {
    return (
      <div className="rounded-[12px] border border-border bg-surface px-6 py-12 text-center">
        <p className="text-[14px] text-text-muted">No members yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-border bg-surface overflow-hidden">
      {members.map((m, i) => (
        <div
          key={m.id}
          className={`flex items-center gap-3 px-5 py-3.5 ${i < members.length - 1 ? "border-b border-border" : ""}`}
        >
          <Avatar firstName={m.user.firstName} lastName={m.user.lastName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-text-primary">
              {m.user.firstName} {m.user.lastName}
            </p>
            <p className="text-[12px] text-text-muted truncate">{m.user.email}</p>
          </div>
          <Badge variant={roleBadgeVariant[m.role]}>{m.role}</Badge>
        </div>
      ))}
    </div>
  );
}
