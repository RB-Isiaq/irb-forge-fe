import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5",
        "text-[14px] text-text-primary placeholder:text-text-muted",
        "outline-none transition-colors duration-150",
        "focus:border-primary focus:ring-2 focus:ring-primary/15",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error && "border-error focus:border-error focus:ring-error/15",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
