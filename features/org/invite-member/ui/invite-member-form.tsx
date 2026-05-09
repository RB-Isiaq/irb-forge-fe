"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSendInvitation } from "@/entities/invitation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/ui/form-field";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["admin", "mentor", "member"]),
});
type FormData = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "mentor", label: "Mentor" },
  { value: "admin", label: "Admin" },
] as const;

interface InviteMemberFormProps {
  slug: string;
  onSuccess?: () => void;
}

export function InviteMemberForm({ slug, onSuccess }: InviteMemberFormProps) {
  const sendInvitation = useSendInvitation(slug);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { role: "member" } });

  function onSubmit(data: FormData) {
    sendInvitation.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email address" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          placeholder="colleague@example.com"
          error={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <FormField label="Role" htmlFor="role" error={errors.role?.message} required>
        <select
          id="role"
          className="w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-[14px] text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          {...register("role")}
        >
          {ROLE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>

      <Button type="submit" loading={sendInvitation.isPending} className="w-full">
        Send invitation
      </Button>
    </form>
  );
}
