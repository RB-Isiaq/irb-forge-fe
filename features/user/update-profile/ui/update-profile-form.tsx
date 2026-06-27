"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, useUpdateProfile } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/ui/form-field";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
});
type FormData = z.infer<typeof schema>;

export function UpdateProfileForm() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) reset({ firstName: user.firstName ?? "", lastName: user.lastName ?? "" });
  }, [user, reset]);

  useEffect(() => {
    if (updateProfile.isSuccess) reset(undefined, { keepValues: true });
  }, [updateProfile.isSuccess, reset]);

  return (
    <form onSubmit={handleSubmit((data) => updateProfile.mutate(data))} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input
            id="firstName"
            autoComplete="given-name"
            error={!!errors.firstName}
            {...register("firstName")}
          />
        </FormField>
        <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input
            id="lastName"
            autoComplete="family-name"
            error={!!errors.lastName}
            {...register("lastName")}
          />
        </FormField>
      </div>

      <FormField label="Email">
        <Input value={user?.email ?? ""} disabled className="opacity-60 cursor-not-allowed" />
        <p className="mt-1.5 text-[12px] text-text-muted">Email cannot be changed.</p>
      </FormField>

      <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  );
}
