"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SendHorizontal } from "lucide-react";
import { useSendChannelMessage } from "@/entities/channel";
import { Textarea } from "@/shared/ui/textarea";
import { MarkdownContent } from "@/shared/ui/markdown-content";
import {
  MarkdownToolbar,
  MARKDOWN_TOOLS,
  applyMarkdownTool,
  type MarkdownToolName,
} from "@/shared/ui/markdown-toolbar";
import { cn } from "@/shared/lib";

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
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const content = useWatch({ control, name: "content" }) ?? "";

  // Merge the RHF ref with our DOM ref
  const { ref: registerRef, ...registerRest } = register("content");

  function tool(name: MarkdownToolName) {
    const el = textareaRef.current;
    if (!el) return;
    applyMarkdownTool(el, MARKDOWN_TOOLS[name], (val) =>
      setValue("content", val, { shouldValidate: true, shouldDirty: true })
    );
  }

  function onSubmit(data: FormData) {
    sendMessage.mutate(data, {
      onSuccess: () => {
        reset();
        setTab("write");
      },
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1 text-[12px] font-medium border-b-2 -mb-px capitalize transition-colors",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-primary"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "write" ? (
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-md border border-border overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-colors">
            <MarkdownToolbar onTool={tool} />
            <Textarea
              rows={2}
              placeholder="Message this channel… Markdown is supported."
              error={!!errors.content}
              onKeyDown={onKeyDown}
              ref={(el) => {
                registerRef(el);
                (textareaRef as React.RefObject<HTMLTextAreaElement | null>).current = el;
              }}
              {...registerRest}
              className="border-0 rounded-none focus:ring-0 focus:border-0"
            />
          </div>
          <button
            type="submit"
            disabled={sendMessage.isPending}
            aria-label="Send message"
            className="shrink-0 p-2.5 rounded-md bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      ) : (
        <div className="min-h-16 rounded-lg border border-border bg-surface px-3 py-2.5">
          {content.trim() ? (
            <MarkdownContent content={content} />
          ) : (
            <p className="text-[13px] text-text-muted italic">Nothing to preview yet.</p>
          )}
        </div>
      )}

      {errors.content?.message && (
        <p className="text-[12px] text-error">{errors.content.message}</p>
      )}
    </form>
  );
}
