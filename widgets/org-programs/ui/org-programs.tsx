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
import { PageSpinner } from "@/shared/ui/spinner";
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
    <Link href={`/orgs/${slug}/programs/${program.id}`}>
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
  const { data: programs, isLoading } = usePrograms(slug);
  const { data: myEnrollments } = useMyEnrollmentsInOrg(slug);
  const myRole = useMyRole(slug);
  const canManage = myRole === "owner" || myRole === "admin" || myRole === "mentor";

  const enrollmentMap = useMemo(
    () => Object.fromEntries((myEnrollments ?? []).map((e) => [e.programId, e.status])),
    [myEnrollments]
  );

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-5">
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

      {!programs?.length ? (
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
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              slug={slug}
              myEnrollmentStatus={enrollmentMap[program.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
