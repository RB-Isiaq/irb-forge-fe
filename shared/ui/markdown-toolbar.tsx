"use client";

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

type WrapTool = { kind: "wrap"; before: string; after: string; placeholder: string };
type PrefixTool = { kind: "prefix"; prefix: string };
type ToolDef = WrapTool | PrefixTool;

export const MARKDOWN_TOOLS = {
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

export type MarkdownToolName = keyof typeof MARKDOWN_TOOLS;

export function applyMarkdownTool(
  textarea: HTMLTextAreaElement,
  tool: ToolDef,
  setValue: (val: string) => void
) {
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
      // Always prefix the first line (even if empty — cursor is there);
      // only prefix subsequent lines if non-empty to avoid orphan prefixes.
      .map((l, idx) => (idx === 0 || l.trim() ? tool.prefix + l : l))
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
      className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-border transition-colors"
    >
      {children}
    </button>
  );
}

export function MarkdownToolbar({ onTool }: { onTool: (name: MarkdownToolName) => void }) {
  return (
    <div className="flex items-center flex-nowrap gap-0.5 px-2 py-1.5 border-b border-border bg-bg overflow-x-auto">
      <ToolBtn label="Heading" onClick={() => onTool("heading")}>
        <Heading2 size={15} />
      </ToolBtn>
      <ToolBtn label="Bold" onClick={() => onTool("bold")}>
        <Bold size={15} />
      </ToolBtn>
      <ToolBtn label="Italic" onClick={() => onTool("italic")}>
        <Italic size={15} />
      </ToolBtn>
      <ToolBtn label="Quote" onClick={() => onTool("quote")}>
        <Quote size={15} />
      </ToolBtn>
      <ToolBtn label="Code" onClick={() => onTool("code")}>
        <Code size={15} />
      </ToolBtn>
      <ToolBtn label="Link" onClick={() => onTool("link")}>
        <Link size={15} />
      </ToolBtn>

      <div className="w-px h-4 bg-border mx-1 shrink-0" />

      <ToolBtn label="Ordered list" onClick={() => onTool("orderedList")}>
        <ListOrdered size={15} />
      </ToolBtn>
      <ToolBtn label="Unordered list" onClick={() => onTool("unorderedList")}>
        <List size={15} />
      </ToolBtn>
      <ToolBtn label="Task list" onClick={() => onTool("taskList")}>
        <CheckSquare size={15} />
      </ToolBtn>
    </div>
  );
}
