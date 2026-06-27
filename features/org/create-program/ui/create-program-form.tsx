"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProgram } from "@/entities/program";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";
import { DatePicker } from "@/shared/ui/date-picker";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  capacity: z
    .string()
    .optional()
    .refine((v) => !v || (Number.isInteger(Number(v)) && Number(v) > 0), {
      message: "Capacity must be a positive whole number",
    }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
] as const;

interface CreateProgramFormProps {
  slug: string;
  onSuccess?: () => void;
}

export function CreateProgramForm({ slug, onSuccess }: CreateProgramFormProps) {
  const createProgram = useCreateProgram(slug);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft" },
  });

  function onSubmit(data: FormData) {
    const payload = {
      name: data.name,
      status: data.status,
      ...(data.description && { description: data.description }),
      ...(data.capacity && { capacity: Number(data.capacity) }),
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
    };
    createProgram.mutate(payload, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Program name" htmlFor="prog-name" error={errors.name?.message} required>
        <Input
          id="prog-name"
          placeholder="Backend Engineering Bootcamp"
          error={!!errors.name}
          {...register("name")}
        />
      </FormField>

      <FormField label="Description" htmlFor="prog-desc" error={errors.description?.message}>
        <Textarea
          id="prog-desc"
          rows={3}
          placeholder="Brief overview of this program…"
          error={!!errors.description}
          {...register("description")}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status" htmlFor="prog-status" error={errors.status?.message} required>
          <select
            id="prog-status"
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[14px] text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            {...register("status")}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Capacity (optional)"
          htmlFor="prog-capacity"
          error={errors.capacity?.message}
        >
          <Input
            id="prog-capacity"
            type="number"
            placeholder="Unlimited"
            min={1}
            error={!!errors.capacity}
            {...register("capacity")}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start date" htmlFor="prog-start" error={errors.startDate?.message}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="prog-start"
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick start date"
                error={!!errors.startDate}
              />
            )}
          />
        </FormField>
        <FormField label="End date" htmlFor="prog-end" error={errors.endDate?.message}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="prog-end"
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick end date"
                error={!!errors.endDate}
              />
            )}
          />
        </FormField>
      </div>

      <Button type="submit" loading={createProgram.isPending}>
        Create program
      </Button>
    </form>
  );
}
