"use client";

import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSendMessage } from "@/entities/message";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";
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

interface SendMessageFormProps {
  slug: string;
  onSuccess?: () => void;
}

export function SendMessageForm({ slug, onSuccess }: SendMessageFormProps) {
  const sendMessage = useSendMessage(slug);
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
        onSuccess?.();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1.5 text-[13px] font-medium border-b-2 -mb-px capitalize transition-colors",
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
        <FormField label="Announcement" htmlFor="msg-content" error={errors.content?.message}>
          {/* Unified toolbar + textarea */}
          <div className="rounded-md border border-border overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-colors">
            <MarkdownToolbar onTool={tool} />

            {/* Textarea — borderless inside the unified wrapper */}
            <Textarea
              id="msg-content"
              rows={5}
              placeholder="Write your announcement… Markdown is supported."
              error={!!errors.content}
              ref={(el) => {
                registerRef(el);
                (textareaRef as React.RefObject<HTMLTextAreaElement | null>).current = el;
              }}
              {...registerRest}
              className="border-0 rounded-none focus:ring-0 focus:border-0"
            />
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            Markdown supported — use the toolbar or type directly
          </p>
        </FormField>
      ) : (
        <div className="min-h-32 rounded-lg border border-border bg-surface px-3 py-2.5">
          {content.trim() ? (
            <MarkdownContent content={content} />
          ) : (
            <p className="text-[13px] text-text-muted italic">Nothing to preview yet.</p>
          )}
        </div>
      )}

      <Button type="submit" size="sm" loading={sendMessage.isPending}>
        Send announcement
      </Button>
    </form>
  );
}
