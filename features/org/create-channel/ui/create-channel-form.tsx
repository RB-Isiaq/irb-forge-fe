"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
}

export function CreateChannelForm({ slug, onSuccess }: CreateChannelFormProps) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2">
      <div className="flex-1">
        <Input
          id="channel-name"
          placeholder="e.g. cohort-2026"
          error={!!errors.name}
          {...register("name")}
        />
        {errors.name?.message ? (
          <p className="mt-1.5 text-[12px] text-error">{errors.name.message}</p>
        ) : null}
      </div>
      <Button type="submit" size="sm" loading={createChannel.isPending}>
        Create
      </Button>
    </form>
  );
}
