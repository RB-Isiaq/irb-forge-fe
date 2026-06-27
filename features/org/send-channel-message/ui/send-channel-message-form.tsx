"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SendHorizontal } from "lucide-react";
import { useSendChannelMessage } from "@/entities/channel";
import { Textarea } from "@/shared/ui/textarea";

const schema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters"),
});
type FormData = z.infer<typeof schema>;

interface SendChannelMessageFormProps {
  slug: string;
  channelId: string;
}

export function SendChannelMessageForm({ slug, channelId }: SendChannelMessageFormProps) {
  const sendMessage = useSendChannelMessage(slug, channelId);
  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    sendMessage.mutate(data, { onSuccess: () => reset() });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
      <Textarea
        rows={1}
        placeholder="Message this channel…"
        className="resize-none"
        onKeyDown={onKeyDown}
        {...register("content")}
      />
      <button
        type="submit"
        disabled={sendMessage.isPending}
        aria-label="Send message"
        className="shrink-0 p-2.5 rounded-md bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        <SendHorizontal size={16} />
      </button>
    </form>
  );
}
