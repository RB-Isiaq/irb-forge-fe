"use client";

import { useEffect, useRef, useState } from "react";
import { Smile } from "lucide-react";
import { EmojiPicker } from "frimousse";
import type {
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListEmojiProps,
  EmojiPickerListRowProps,
} from "frimousse";
import { cn } from "@/shared/lib";

function CategoryHeader({ category, ...props }: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="sticky top-0 z-10 bg-surface px-1 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted"
    >
      {category.label}
    </div>
  );
}

function EmojiRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} className="flex justify-around">
      {children}
    </div>
  );
}

function EmojiBtn({ emoji, ...props }: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded text-[20px] leading-none transition-colors",
        emoji.isActive ? "bg-primary/10" : "hover:bg-border"
      )}
    >
      {emoji.emoji}
    </button>
  );
}

export interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

export function EmojiPickerButton({ onEmojiSelect, className }: EmojiPickerButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Add emoji"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-border hover:text-text-primary",
          open && "bg-border text-text-primary"
        )}
      >
        <Smile size={16} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-50 mb-2 flex h-80 w-72 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          <EmojiPicker.Root
            onEmojiSelect={({ emoji }) => {
              onEmojiSelect(emoji);
              setOpen(false);
            }}
            columns={8}
            className="flex h-full flex-col"
          >
            <EmojiPicker.Search
              autoFocus
              placeholder="Search emoji…"
              className="w-full border-b border-border bg-transparent px-3 py-2 text-[13px] text-text-primary outline-none placeholder:text-text-muted focus:border-primary"
            />
            <EmojiPicker.Viewport className="flex-1 overflow-y-auto px-2 py-1">
              <EmojiPicker.Loading className="flex items-center justify-center p-4 text-[12px] text-text-muted">
                Loading…
              </EmojiPicker.Loading>
              <EmojiPicker.Empty>
                {({ search }) => (
                  <div className="flex items-center justify-center p-4 text-[12px] text-text-muted">
                    No emoji found for &ldquo;{search}&rdquo;
                  </div>
                )}
              </EmojiPicker.Empty>
              <EmojiPicker.List
                components={{
                  CategoryHeader,
                  Row: EmojiRow,
                  Emoji: EmojiBtn,
                }}
              />
            </EmojiPicker.Viewport>
          </EmojiPicker.Root>
        </div>
      )}
    </div>
  );
}
