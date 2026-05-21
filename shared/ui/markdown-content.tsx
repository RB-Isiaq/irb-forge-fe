"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/shared/lib";

export function MarkdownContent({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("markdown", className)}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
