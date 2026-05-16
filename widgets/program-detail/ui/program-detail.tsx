"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useProgram, useDeleteProgram, type ProgramStatus } from "@/entities/program";
import {
  useMyEnrollment,
  useEnrollments,
  useEnroll,
  useDropEnrollment,
  useUpdateEnrollmentStatus,
} from "@/entities/enrollment";
import { useMyRole } from "@/entities/member";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar } from "@/entities/user/ui/avatar";
import { PageSpinner } from "@/shared/ui/spinner";
import { getDisplayName } from "@/shared/lib";
import { UpdateProgramForm } from "@/features/org/update-program/ui/update-program-form";

const statusBadge: Record<ProgramStatus, "outline" | "success" | "default" | "warning"> = {
  draft: "outline",
  active: "success",
  completed: "default",
  cancelled: "warning",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ProgramDetail({ slug, programId }: { slug: string; programId: string }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const { data: program, isLoading } = useProgram(slug, programId);
  const myRole = useMyRole(slug);
  const canManage = myRole === "owner" || myRole === "admin" || myRole === "mentor";
  const isOwnerOrAdmin = myRole === "owner" || myRole === "admin";
  const isMember = myRole === "member";

  const { data: myEnrollment } = useMyEnrollment(slug, programId);
  const { data: enrollments } = useEnrollments(slug, programId);
  const enroll = useEnroll(slug, programId);
  const drop = useDropEnrollment(slug, programId);
  const updateStatus = useUpdateEnrollmentStatus(slug, programId);
  const deleteProgram = useDeleteProgram(slug);

  if (isLoading) return <PageSpinner />;
  if (!program) return null;

  const isEnrolled = myEnrollment?.status === "active";
  const canEnroll = isMember && program.status === "active" && !myEnrollment;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/orgs/${slug}/programs`}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={14} />
        Back to programs
      </Link>

      {/* Program header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[22px] font-bold text-text-primary">{program.name}</h1>
                <Badge variant={statusBadge[program.status]}>{program.status}</Badge>
              </div>
              {program.description && (
                <p className="text-[14px] text-text-muted mb-3">{program.description}</p>
              )}
              <div className="flex items-center gap-4 text-[13px] text-text-muted flex-wrap">
                {(program.startDate || program.endDate) && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(program.startDate)}
                    {program.endDate && ` — ${formatDate(program.endDate)}`}
                  </span>
                )}
                {program.capacity && (
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {program.capacity} capacity
                  </span>
                )}
              </div>
            </div>

            {canManage && (
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Pencil size={13} />}
                  onClick={() => setShowEditForm((v) => !v)}
                >
                  {showEditForm ? "Cancel" : "Edit"}
                </Button>
                {isOwnerOrAdmin && (
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<Trash2 size={13} />}
                    loading={deleteProgram.isPending}
                    onClick={() => {
                      if (confirm(`Delete "${program.name}"? This cannot be undone.`))
                        deleteProgram.mutate(program.id);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>

          {showEditForm && (
            <div className="mt-5 pt-5 border-t border-border">
              <UpdateProgramForm
                slug={slug}
                program={program}
                onSuccess={() => setShowEditForm(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member enrollment section */}
      {isMember && (
        <Card>
          <CardContent className="pt-5 flex items-center justify-between gap-4">
            <div>
              {myEnrollment ? (
                <>
                  <p className="text-[14px] font-medium text-text-primary">
                    {myEnrollment.status === "active"
                      ? "You're enrolled in this program"
                      : myEnrollment.status === "completed"
                        ? "You've completed this program"
                        : "You've left this program"}
                  </p>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    Enrolled {new Date(myEnrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[14px] font-medium text-text-primary">
                    {program.status === "active"
                      ? "Join this program"
                      : `Program is ${program.status}`}
                  </p>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    {program.status === "active"
                      ? "Enroll to participate in this program."
                      : "Enrollment is currently closed."}
                  </p>
                </>
              )}
            </div>
            {canEnroll && (
              <Button size="sm" loading={enroll.isPending} onClick={() => enroll.mutate()}>
                Enroll
              </Button>
            )}
            {isEnrolled && (
              <Button
                size="sm"
                variant="secondary"
                loading={drop.isPending}
                onClick={() => {
                  if (confirm("Leave this program?")) drop.mutate();
                }}
              >
                Leave program
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enrollment roster (manager view) */}
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Enrolled members</CardTitle>
            <CardDescription>
              {enrollments?.length
                ? `${enrollments.filter((e) => e.status === "active").length} active, ${enrollments.filter((e) => e.status === "completed").length} completed`
                : "No enrollments yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!enrollments?.length ? (
              <p className="text-[13px] text-text-muted">No members have enrolled yet.</p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                {enrollments.map((enrollment, i) => {
                  const name = getDisplayName(
                    enrollment.user?.firstName,
                    enrollment.user?.lastName,
                    enrollment.user?.email
                  );
                  return (
                    <div
                      key={enrollment.id}
                      className={`flex items-center gap-3 px-5 py-3 ${i < enrollments.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <Avatar
                        firstName={enrollment.user?.firstName}
                        lastName={enrollment.user?.lastName}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-text-primary">{name}</p>
                        <p className="text-[12px] text-text-muted">
                          {enrollment.user?.email ?? ""}
                        </p>
                      </div>
                      <Badge
                        variant={
                          enrollment.status === "active"
                            ? "primary"
                            : enrollment.status === "completed"
                              ? "success"
                              : "outline"
                        }
                      >
                        {enrollment.status}
                      </Badge>
                      {enrollment.status === "active" && (
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            title="Mark completed"
                            onClick={() =>
                              updateStatus.mutate({
                                userId: enrollment.userId,
                                data: { status: "completed" },
                              })
                            }
                            disabled={updateStatus.isPending}
                            className="p-1.5 rounded-md text-text-muted hover:text-success hover:bg-success/5 transition-colors disabled:opacity-40"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                          <button
                            type="button"
                            title="Mark dropped"
                            onClick={() =>
                              updateStatus.mutate({
                                userId: enrollment.userId,
                                data: { status: "dropped" },
                              })
                            }
                            disabled={updateStatus.isPending}
                            className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/5 transition-colors disabled:opacity-40"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
