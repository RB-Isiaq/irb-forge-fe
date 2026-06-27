import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/** Visual sibling of `ErrorBoundary` — for query-level `isError`, which never throws. */
export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 p-8 text-center", className)}
    >
      <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
        <AlertTriangle size={22} className="text-warning" />
      </div>
      <p className="text-[13px] text-text-muted max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-lg border border-border text-[13px] font-medium text-text-secondary hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
