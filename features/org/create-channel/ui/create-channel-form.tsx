"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Hash, X } from "lucide-react";
import { useCreateChannel } from "@/entities/channel";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

const schema = z.object({
  name: z.string().trim().min(1, "Channel name is required").max(50, "Keep it under 50 characters"),
});
type FormData = z.infer<typeof schema>;

interface CreateChannelFormProps {
  slug: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateChannelForm({ slug, onSuccess, onCancel }: CreateChannelFormProps) {
  const createChannel = useCreateChannel(slug);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    createChannel.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-border bg-surface p-3 space-y-2.5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Hash size={13} className="text-primary" />
          <span className="text-[12px] font-semibold text-text-primary">New channel</span>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Input */}
      <div>
        <Input
          autoFocus
          placeholder="e.g. cohort-2026"
          error={!!errors.name}
          {...register("name")}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel?.();
          }}
          className="h-8 text-[13px] py-0"
        />
        {errors.name?.message && (
          <p className="mt-1 text-[11px] text-error">{errors.name.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className="flex-1" loading={createChannel.isPending}>
          Create
        </Button>
      </div>
    </form>
  );
}
