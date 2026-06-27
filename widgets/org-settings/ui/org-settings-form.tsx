"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";
import { Skeleton } from "@/shared/ui/skeleton";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ErrorState } from "@/shared/ui/error-state";
import { useOrg, useUpdateOrg, useDeleteOrg } from "@/entities/org";
import { useMyRole } from "@/entities/member";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

export function OrgSettingsForm({ slug }: { slug: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: org, isLoading, isError, refetch } = useOrg(slug);
  const updateOrg = useUpdateOrg(slug);
  const deleteOrg = useDeleteOrg(slug);
  const myRole = useMyRole(slug);
  const isOwner = myRole === "owner";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (org) reset({ name: org.name, description: org.description ?? "" });
  }, [org, reset]);

  useEffect(() => {
    if (updateOrg.isSuccess && org) reset({ name: org.name, description: org.description ?? "" });
  }, [updateOrg.isSuccess, org, reset]);

  if (isLoading)
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3.5 w-64" />
          <div className="space-y-3 pt-1">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <Card>
        <ErrorState message="Couldn't load organization settings." onRetry={refetch} />
      </Card>
    );

  if (!org) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update your organization name and description.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => updateOrg.mutate(data))} className="space-y-4">
            <FormField label="Name" htmlFor="name" error={errors.name?.message} required>
              <Input id="name" error={!!errors.name} {...register("name")} />
            </FormField>
            <FormField
              label="Description"
              htmlFor="description"
              error={errors.description?.message}
            >
              <Textarea
                id="description"
                rows={3}
                error={!!errors.description}
                {...register("description")}
              />
            </FormField>
            <Button type="submit" loading={updateOrg.isPending} disabled={!isDirty}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {isOwner && (
        <Card className="border-error/30">
          <CardHeader className="border-error/20">
            <CardTitle className="text-error">Danger zone</CardTitle>
            <CardDescription>
              Permanently delete this organization. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
              Delete organization
            </Button>

            <ConfirmDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              title={`Delete "${org.name}"?`}
              description="This cannot be undone. All members, programs, and data will be permanently removed."
              confirmLabel="Delete organization"
              variant="danger"
              loading={deleteOrg.isPending}
              onConfirm={() =>
                deleteOrg.mutate(undefined, { onSettled: () => setDeleteOpen(false) })
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
