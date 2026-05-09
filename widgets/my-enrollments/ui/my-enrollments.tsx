"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useMyEnrollmentsInOrg, type EnrollmentStatus } from "@/entities/enrollment";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { PageSpinner } from "@/shared/ui/spinner";

const statusBadge: Record<EnrollmentStatus, "primary" | "success" | "outline"> = {
  active: "primary",
  completed: "success",
  dropped: "outline",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MyEnrollments({ slug }: { slug: string }) {
  const { data: enrollments, isLoading } = useMyEnrollmentsInOrg(slug);

  if (isLoading) return <PageSpinner />;

  if (!enrollments?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen size={32} className="mx-auto text-text-muted mb-3" strokeWidth={1.5} />
          <p className="text-[14px] font-medium text-text-primary mb-1">No programs yet</p>
          <p className="text-[13px] text-text-muted">
            Browse available programs and enroll to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {enrollments.map((enrollment) => (
        <Link key={enrollment.id} href={`/orgs/${slug}/programs/${enrollment.programId}`}>
          <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors cursor-pointer">
            <div className="h-9 w-9 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen size={16} className="text-primary" strokeWidth={1.8} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text-primary truncate">
                {enrollment.program?.name ?? "Program"}
              </p>
              <p className="text-[12px] text-text-muted">
                Enrolled {formatDate(enrollment.enrolledAt)}
                {enrollment.completedAt && ` · Completed ${formatDate(enrollment.completedAt)}`}
              </p>
            </div>

            <Badge variant={statusBadge[enrollment.status]}>{enrollment.status}</Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
