"use client";

import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Heading2,
  Bold,
  Italic,
  Quote,
  Code,
  Link,
  ListOrdered,
  List,
  CheckSquare,
} from "lucide-react";
import { useSendMessage } from "@/entities/message";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { FormField } from "@/shared/ui/form-field";
import { MarkdownContent } from "@/shared/ui/markdown-content";
import { cn } from "@/shared/lib";

/* ── Markdown toolbar logic ──────────────────────────────────── */

type WrapTool = { kind: "wrap"; before: string; after: string; placeholder: string };
type PrefixTool = { kind: "prefix"; prefix: string };
type ToolDef = WrapTool | PrefixTool;

const TOOLS = {
  heading: { kind: "prefix", prefix: "## " },
  bold: { kind: "wrap", before: "**", after: "**", placeholder: "bold text" },
  italic: { kind: "wrap", before: "_", after: "_", placeholder: "italic text" },
  quote: { kind: "prefix", prefix: "> " },
  code: { kind: "wrap", before: "`", after: "`", placeholder: "code" },
  link: { kind: "wrap", before: "[", after: "](url)", placeholder: "link text" },
  orderedList: { kind: "prefix", prefix: "1. " },
  unorderedList: { kind: "prefix", prefix: "- " },
  taskList: { kind: "prefix", prefix: "- [ ] " },
} satisfies Record<string, ToolDef>;

function applyTool(textarea: HTMLTextAreaElement, tool: ToolDef, setValue: (val: string) => void) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.slice(s, e);

  let newValue: string;
  let nextStart: number;
  let nextEnd: number;

  if (tool.kind === "wrap") {
    const inner = selected || tool.placeholder;
    newValue = value.slice(0, s) + tool.before + inner + tool.after + value.slice(e);
    nextStart = s + tool.before.length;
    nextEnd = nextStart + inner.length;
  } else {
    // Expand to full line(s) covered by the selection
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const rawEnd = s === e ? value.indexOf("\n", e) : e;
    const lineEnd = rawEnd === -1 ? value.length : rawEnd;
    const block = value.slice(lineStart, lineEnd);
    const prefixed = block
      .split("\n")
      .map((l) => (l.trim() ? tool.prefix + l : l))
      .join("\n");
    newValue = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
    nextStart = lineStart + tool.prefix.length;
    nextEnd = lineStart + prefixed.length;
  }

  // Sync DOM value and RHF value together
  textarea.value = newValue;
  setValue(newValue);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(nextStart, nextEnd);
  });
}

/* ── Toolbar button ──────────────────────────────────────────── */

function ToolBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
}

/* ── Schema ──────────────────────────────────────────────────── */

const schema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters")
    .trim(),
});
type FormData = z.infer<typeof schema>;

/* ── Component ───────────────────────────────────────────────── */

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

  function tool(name: keyof typeof TOOLS) {
    const el = textareaRef.current;
    if (!el) return;
    applyTool(el, TOOLS[name], (val) =>
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
          <div className="rounded-[8px] border border-border overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-colors">
            {/* Toolbar */}
            <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-border bg-gray-50">
              <ToolBtn label="Heading" onClick={() => tool("heading")}>
                <Heading2 size={15} />
              </ToolBtn>
              <ToolBtn label="Bold" onClick={() => tool("bold")}>
                <Bold size={15} />
              </ToolBtn>
              <ToolBtn label="Italic" onClick={() => tool("italic")}>
                <Italic size={15} />
              </ToolBtn>
              <ToolBtn label="Quote" onClick={() => tool("quote")}>
                <Quote size={15} />
              </ToolBtn>
              <ToolBtn label="Code" onClick={() => tool("code")}>
                <Code size={15} />
              </ToolBtn>
              <ToolBtn label="Link" onClick={() => tool("link")}>
                <Link size={15} />
              </ToolBtn>

              <div className="w-px h-4 bg-border mx-1" />

              <ToolBtn label="Ordered list" onClick={() => tool("orderedList")}>
                <ListOrdered size={15} />
              </ToolBtn>
              <ToolBtn label="Unordered list" onClick={() => tool("unorderedList")}>
                <List size={15} />
              </ToolBtn>
              <ToolBtn label="Task list" onClick={() => tool("taskList")}>
                <CheckSquare size={15} />
              </ToolBtn>
            </div>

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
