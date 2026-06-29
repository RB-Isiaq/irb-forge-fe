"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SendHorizontal } from "lucide-react";
import { useSendChannelMessage } from "@/entities/channel";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { MarkdownContent } from "@/shared/ui/markdown-content";
import {
  MarkdownToolbar,
  MARKDOWN_TOOLS,
  applyMarkdownTool,
  type MarkdownToolName,
} from "@/shared/ui/markdown-toolbar";
import { EmojiPickerButton } from "@/shared/ui/emoji-picker";
import { cn } from "@/shared/lib";
import { useMediaQuery } from "@/shared/lib/use-media-query";

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

function insertEmojiAtCursor(
  el: HTMLTextAreaElement | HTMLInputElement | null,
  emoji: string,
  setValue: (val: string) => void
) {
  if (!el) return;
  const { selectionStart: s, selectionEnd: e, value } = el;
  const start = s ?? value.length;
  const end = e ?? value.length;
  const newValue = value.slice(0, start) + emoji + value.slice(end);
  el.value = newValue;
  setValue(newValue);
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(start + emoji.length, start + emoji.length);
  });
}

export function SendChannelMessageForm({ slug, channelId }: SendChannelMessageFormProps) {
  const sendMessage = useSendChannelMessage(slug, channelId);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // `sendMessage.isPending` only flips after a re-render, which isn't fast enough to
  // stop a second Enter press fired in the same tick — this ref blocks synchronously.
  const isSendingRef = useRef(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const content = useWatch({ control, name: "content" }) ?? "";

  // Destructure once; the ref is merged with our DOM refs below.
  const { ref: registerRef, ...registerRest } = register("content");

  function tool(name: MarkdownToolName) {
    const el = textareaRef.current;
    if (!el) return;
    applyMarkdownTool(el, MARKDOWN_TOOLS[name], (val) =>
      setValue("content", val, { shouldValidate: true, shouldDirty: true })
    );
  }

  function onEmojiSelect(emoji: string) {
    const el = isDesktop ? textareaRef.current : inputRef.current;
    insertEmojiAtCursor(el, emoji, (val) =>
      setValue("content", val, { shouldValidate: true, shouldDirty: true })
    );
  }

  function onSubmit(data: FormData) {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    sendMessage.mutate(data, {
      onSuccess: () => {
        reset();
        setTab("write");
      },
      onSettled: () => {
        isSendingRef.current = false;
      },
    });
  }

  function submitForm() {
    void handleSubmit(onSubmit)();
  }

  function onTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isSendingRef.current) return;
      submitForm();
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isSendingRef.current) return;
      submitForm();
    }
  }

  // Mobile: bring the composer above the virtual keyboard once it opens.
  function onTextareaFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    // jsdom doesn't implement scrollIntoView — guard so tests don't crash on focus.
    e.currentTarget.scrollIntoView?.({ block: "end", behavior: "smooth" });
  }

  function onInputFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.scrollIntoView?.({ block: "end", behavior: "smooth" });
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitForm();
  }

  const sendBtn = (
    <button
      type="submit"
      disabled={sendMessage.isPending}
      aria-label="Send message"
      className="shrink-0 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      <SendHorizontal size={16} />
    </button>
  );

  return (
    <form onSubmit={onFormSubmit} className="space-y-2">
      {isDesktop ? (
        <>
          {/* Write / Preview tab bar */}
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
            <div className="flex items-end gap-1.5">
              {/* `min-w-0` lets the flex item shrink below the toolbar's intrinsic width */}
              <div className="flex-1 min-w-0 rounded-md border border-border overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-colors">
                <MarkdownToolbar onTool={tool} />
                <Textarea
                  rows={2}
                  placeholder="Message this channel… Markdown is supported."
                  error={!!errors.content}
                  onKeyDown={onTextareaKeyDown}
                  onFocus={onTextareaFocus}
                  ref={(el) => {
                    registerRef(el);
                    (textareaRef as React.RefObject<HTMLTextAreaElement | null>).current = el;
                  }}
                  {...registerRest}
                  className="border-0 rounded-none focus:ring-0 focus:border-0"
                />
              </div>
              <div className="shrink-0 flex flex-col gap-1">
                <EmojiPickerButton onEmojiSelect={onEmojiSelect} />
                {sendBtn}
              </div>
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
        </>
      ) : (
        /* Mobile: single-line input + emoji button + send — no toolbar or tabs */
        <div className="flex items-center gap-1.5">
          <Input
            placeholder="Message…"
            error={!!errors.content}
            onKeyDown={onInputKeyDown}
            onFocus={onInputFocus}
            ref={(el) => {
              registerRef(el);
              (inputRef as React.RefObject<HTMLInputElement | null>).current = el;
            }}
            {...registerRest}
            className="flex-1 min-w-0 h-9 py-0 text-[14px]"
          />
          <EmojiPickerButton onEmojiSelect={onEmojiSelect} className="shrink-0" />
          {sendBtn}
        </div>
      )}

      {errors.content?.message && (
        <p className="text-[12px] text-error">{errors.content.message}</p>
      )}
    </form>
  );
}
