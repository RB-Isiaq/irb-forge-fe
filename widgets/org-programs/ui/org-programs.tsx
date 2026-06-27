"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, BookOpen, Calendar, Users } from "lucide-react";
import { usePrograms, type Program, type ProgramStatus } from "@/entities/program";
import { useMyEnrollmentsInOrg } from "@/entities/enrollment";
import { useMyRole } from "@/entities/member";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";
import { CreateProgramForm } from "@/features/org/create-program/ui/create-program-form";

const statusBadge: Record<ProgramStatus, "outline" | "success" | "default" | "warning"> = {
  draft: "outline",
  active: "success",
  completed: "default",
  cancelled: "warning",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProgramCard({
  program,
  slug,
  myEnrollmentStatus,
}: {
  program: Program;
  slug: string;
  myEnrollmentStatus?: string | null;
}) {
  return (
    <Link href={`/orgs/${slug}/programs/${program.id}`} className="block">
      <div className="flex items-start gap-4 px-5 py-4 rounded-xl border border-border bg-surface hover:border-primary/40 hover:bg-primary/[0.02] transition-colors cursor-pointer">
        <div className="h-10 w-10 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen size={18} className="text-primary" strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-semibold text-text-primary">{program.name}</p>
            <Badge variant={statusBadge[program.status]}>{program.status}</Badge>
            {myEnrollmentStatus === "active" && <Badge variant="primary">Enrolled</Badge>}
            {myEnrollmentStatus === "completed" && <Badge variant="success">Completed</Badge>}
          </div>

          {program.description && (
            <p className="text-[13px] text-text-muted mt-0.5 line-clamp-1">{program.description}</p>
          )}

          <div className="flex items-center gap-3 mt-1.5 text-[12px] text-text-muted flex-wrap">
            {(program.startDate || program.endDate) && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(program.startDate)}{" "}
                {program.endDate ? `→ ${formatDate(program.endDate)}` : ""}
              </span>
            )}
            {program.capacity && (
              <span className="flex items-center gap-1">
                <Users size={12} />
                {program.capacity} capacity
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function OrgPrograms({ slug }: { slug: string }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: programs, isLoading, isError, refetch } = usePrograms(slug);
  const { data: myEnrollments } = useMyEnrollmentsInOrg(slug);
  const myRole = useMyRole(slug);
  const canManage = myRole === "owner" || myRole === "admin" || myRole === "mentor";
  const isMember = myRole === "member";

  const programItems = useMemo(() => programs?.items ?? [], [programs?.items]);

  const enrollmentMap = useMemo(
    () => Object.fromEntries((myEnrollments ?? []).map((e) => [e.programId, e.status])),
    [myEnrollments]
  );

  const myPrograms = useMemo(
    () => programItems.filter((p) => enrollmentMap[p.id]),
    [programItems, enrollmentMap]
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 px-5 py-4 rounded-xl border border-border bg-surface"
          >
            <Skeleton className="h-10 w-10 rounded-[10px] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <ErrorState message="Couldn't load programs." onRetry={refetch} />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Create form — managers only */}
      {canManage &&
        (showCreateForm ? (
          <Card>
            <CardHeader>
              <CardTitle>New program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CreateProgramForm slug={slug} onSuccess={() => setShowCreateForm(false)} />
              <Button
                variant="ghost"
                size="sm"
                className="text-text-muted"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex justify-end">
            <Button size="sm" leftIcon={<Plus size={15} />} onClick={() => setShowCreateForm(true)}>
              Create program
            </Button>
          </div>
        ))}

      {/* My programs — members with at least one enrollment */}
      {isMember && myPrograms.length > 0 && (
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-text-muted uppercase tracking-wide">
            My programs
          </p>
          {myPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              slug={slug}
              myEnrollmentStatus={enrollmentMap[program.id]}
            />
          ))}
          <div className="border-t border-border" />
        </div>
      )}

      {/* All programs */}
      {!programItems.length ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen size={36} className="mx-auto text-text-muted mb-3" strokeWidth={1.5} />
            <p className="text-[14px] font-medium text-text-primary mb-1">No programs yet</p>
            <p className="text-[13px] text-text-muted">
              {canManage
                ? "Create your first program to get started."
                : "Programs will appear here once they're created."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {isMember && myPrograms.length > 0 && (
            <p className="text-[13px] font-semibold text-text-muted uppercase tracking-wide">
              All programs
            </p>
          )}
          {programItems.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              slug={slug}
              myEnrollmentStatus={enrollmentMap[program.id]}
            />
          ))}
          {programs && programs.total > programItems.length && (
            <p className="text-[12px] text-text-muted text-center pt-1">
              Showing {programItems.length} of {programs.total} programs
            </p>
          )}
        </div>
      )}
    </div>
  );
}
