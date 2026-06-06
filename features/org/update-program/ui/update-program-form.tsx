"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateProgram, type Program } from "@/entities/program";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";
import { DatePicker } from "@/shared/ui/date-picker";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200).trim(),
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
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

interface UpdateProgramFormProps {
  slug: string;
  program: Program;
  onSuccess?: () => void;
}

export function UpdateProgramForm({ slug, program, onSuccess }: UpdateProgramFormProps) {
  const updateProgram = useUpdateProgram(slug, program.id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({
      name: program.name,
      description: program.description ?? "",
      status: program.status,
      capacity: program.capacity != null ? String(program.capacity) : "",
      startDate: program.startDate ? program.startDate.split("T")[0] : "",
      endDate: program.endDate ? program.endDate.split("T")[0] : "",
    });
  }, [program, reset]);

  useEffect(() => {
    if (updateProgram.isSuccess) reset(undefined, { keepValues: true });
  }, [updateProgram.isSuccess, reset]);

  function onSubmit(data: FormData) {
    updateProgram.mutate(
      {
        name: data.name,
        status: data.status,
        description: data.description || undefined,
        capacity: data.capacity ? Number(data.capacity) : undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      },
      { onSuccess }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Program name" htmlFor="uprog-name" error={errors.name?.message} required>
        <Input id="uprog-name" error={!!errors.name} {...register("name")} />
      </FormField>

      <FormField label="Description" htmlFor="uprog-desc" error={errors.description?.message}>
        <Textarea
          id="uprog-desc"
          rows={3}
          error={!!errors.description}
          {...register("description")}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status" htmlFor="uprog-status" error={errors.status?.message} required>
          <select
            id="uprog-status"
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
          htmlFor="uprog-capacity"
          error={errors.capacity?.message}
        >
          <Input
            id="uprog-capacity"
            type="number"
            placeholder="Unlimited"
            min={1}
            error={!!errors.capacity}
            {...register("capacity")}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start date" htmlFor="uprog-start" error={errors.startDate?.message}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="uprog-start"
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick start date"
                error={!!errors.startDate}
              />
            )}
          />
        </FormField>
        <FormField label="End date" htmlFor="uprog-end" error={errors.endDate?.message}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="uprog-end"
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick end date"
                error={!!errors.endDate}
              />
            )}
          />
        </FormField>
      </div>

      <Button type="submit" loading={updateProgram.isPending} disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  );
}
