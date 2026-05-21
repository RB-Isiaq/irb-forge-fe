"use client";

import { useEffect } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/shared/lib";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "primary",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, loading, onOpenChange]);

  if (!open) return null;

  const Icon = variant === "danger" ? AlertTriangle : HelpCircle;
  const iconBg = variant === "danger" ? "bg-error/10" : "bg-primary/10";
  const iconColor = variant === "danger" ? "text-error" : "text-primary";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !loading && onOpenChange(false)}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-sm",
          "animate-in fade-in-0 zoom-in-95 duration-150"
        )}
      >
        <div className="p-6">
          {/* Icon */}
          <div
            className={cn("h-10 w-10 rounded-full flex items-center justify-center mb-4", iconBg)}
          >
            <Icon size={18} className={iconColor} />
          </div>

          <h2
            id="confirm-dialog-title"
            className="text-[16px] font-semibold text-text-primary mb-1.5"
          >
            {title}
          </h2>
          {description && (
            <p className="text-[13px] text-text-muted leading-relaxed">{description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end px-6 pb-5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant={variant === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
