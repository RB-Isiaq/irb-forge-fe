"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/shared/lib";

/* ── Helpers ─────────────────────────────────────────────────── */

function parseDate(str: string | undefined): Date | undefined {
  if (!str) return undefined;
  const [y, m, d] = str.split("-").map(Number);
  // Construct in local time to avoid UTC-offset day shifts
  return new Date(y, m - 1, d);
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Component ───────────────────────────────────────────────── */

interface DatePickerProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  error,
  disabled,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = parseDate(value);
  const [month, setMonth] = useState<Date>(() => parseDate(value) ?? new Date());

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-lg border bg-surface",
          "px-3.5 py-2.5 text-[14px] text-left transition-colors outline-none",
          "focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
          error
            ? "border-error focus:border-error focus:ring-error/15"
            : open
              ? "border-primary ring-2 ring-primary/15"
              : "border-border hover:border-primary/40 focus:border-primary focus:ring-primary/15",
          selected ? "text-text-primary" : "text-text-muted"
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          <CalendarIcon
            size={15}
            className={cn("shrink-0", selected ? "text-primary" : "text-text-muted")}
          />
          <span className="truncate">{selected ? formatDisplay(selected) : placeholder}</span>
        </span>

        {selected && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange(undefined);
              }
            }}
            className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={13} />
          </span>
        )}
      </button>

      {/* Calendar popover */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? toISODate(date) : undefined);
              setOpen(false);
            }}
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />,
            }}
            classNames={{
              months: "p-3 select-none",
              month: "space-y-2",
              month_caption: "flex items-center justify-between px-1 pb-2",
              caption_label: "text-[13px] font-semibold text-text-primary",
              nav: "flex items-center gap-0.5",
              button_previous: cn(
                "flex items-center justify-center h-7 w-7 rounded-md transition-colors",
                "text-text-muted hover:text-text-primary hover:bg-border outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/30"
              ),
              button_next: cn(
                "flex items-center justify-center h-7 w-7 rounded-md transition-colors",
                "text-text-muted hover:text-text-primary hover:bg-border outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/30"
              ),
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday:
                "w-9 h-8 flex items-center justify-center text-[11px] text-text-muted font-medium",
              weeks: "",
              week: "flex mt-0.5",
              day: "p-0 relative",
              day_button: cn(
                "h-9 w-9 rounded-lg text-[13px] font-normal transition-colors outline-none",
                "hover:bg-primary/10 hover:text-primary",
                "focus-visible:ring-2 focus-visible:ring-primary/30"
              ),
              selected: "bg-primary! text-white! rounded-lg! hover:bg-primary! hover:text-white!",
              today: "font-semibold text-primary",
              outside: "text-text-muted opacity-40",
              disabled: "opacity-25 pointer-events-none",
              hidden: "invisible",
            }}
          />
        </div>
      )}
    </div>
  );
}
