"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrg } from "@/entities/org";
import { slugify } from "@/shared/lib";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";

const schema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(80),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

export function CreateOrgForm() {
  const router = useRouter();
  const createOrg = useCreateOrg();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const nameValue = useWatch({ control, name: "name" });
  useEffect(() => {
    if (!dirtyFields.slug) setValue("slug", slugify(nameValue ?? ""), { shouldValidate: false });
  }, [nameValue, dirtyFields.slug, setValue]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit((data) => createOrg.mutate(data))} className="space-y-4">
          <FormField label="Name" htmlFor="name" error={errors.name?.message} required>
            <Input
              id="name"
              placeholder="Acme Mentorship"
              error={!!errors.name}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Used in URLs — lowercase, hyphens only"
            required
          >
            <div
              className={`flex items-center rounded-[8px] border bg-surface overflow-hidden focus-within:ring-2 transition-colors ${errors.slug ? "border-error focus-within:ring-error/15" : "border-border focus-within:border-primary focus-within:ring-primary/15"}`}
            >
              <span className="px-3 py-2.5 text-[13px] text-text-muted border-r border-border bg-gray-100 shrink-0">
                irb-forge.com/
              </span>
              <input
                id="slug"
                className="flex-1 px-3 py-2.5 text-[14px] text-text-primary bg-transparent outline-none"
                placeholder="acme-mentorship"
                {...register("slug")}
              />
            </div>
          </FormField>

          <FormField label="Description" htmlFor="description" error={errors.description?.message}>
            <Textarea
              id="description"
              rows={3}
              placeholder="What is this community about?"
              error={!!errors.description}
              {...register("description")}
            />
          </FormField>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={createOrg.isPending}>
              Create organization
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
