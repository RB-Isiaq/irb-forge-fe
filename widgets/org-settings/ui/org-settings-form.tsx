"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";
import { PageSpinner } from "@/shared/ui/spinner";
import { useOrg, useUpdateOrg, useDeleteOrg } from "@/entities/org";

const schema = z.object({
  name:        z.string().min(2).max(80).trim(),
  description: z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

export function OrgSettingsForm({ slug }: { slug: string }) {
  const { data: org, isLoading } = useOrg(slug);
  const updateOrg = useUpdateOrg(slug);
  const deleteOrg = useDeleteOrg(slug);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (org) reset({ name: org.name, description: org.description ?? "" });
  }, [org, reset]);

  useEffect(() => {
    if (updateOrg.isSuccess && org) reset({ name: org.name, description: org.description ?? "" });
  }, [updateOrg.isSuccess, org, reset]);

  if (isLoading) return <PageSpinner />;
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
            <FormField label="Description" htmlFor="description" error={errors.description?.message}>
              <Textarea id="description" rows={3} error={!!errors.description} {...register("description")} />
            </FormField>
            <Button type="submit" loading={updateOrg.isPending} disabled={!isDirty}>Save changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-error/30">
        <CardHeader className="border-error/20">
          <CardTitle className="text-error">Danger zone</CardTitle>
          <CardDescription>Permanently delete this organization. This cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="danger" size="sm" loading={deleteOrg.isPending}
            onClick={() => { if (confirm(`Delete "${org.name}"? This cannot be undone.`)) deleteOrg.mutate(); }}>
            Delete organization
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
