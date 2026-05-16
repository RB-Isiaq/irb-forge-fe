"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSendMessage } from "@/entities/message";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";

const schema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters")
    .trim(),
});
type FormData = z.infer<typeof schema>;

interface SendMessageFormProps {
  slug: string;
  onSuccess?: () => void;
}

export function SendMessageForm({ slug, onSuccess }: SendMessageFormProps) {
  const sendMessage = useSendMessage(slug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    sendMessage.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FormField label="Announcement" htmlFor="msg-content" error={errors.content?.message}>
        <Textarea
          id="msg-content"
          rows={3}
          placeholder="Share an update with all members…"
          error={!!errors.content}
          {...register("content")}
        />
      </FormField>
      <Button type="submit" size="sm" loading={sendMessage.isPending}>
        Send announcement
      </Button>
    </form>
  );
}
