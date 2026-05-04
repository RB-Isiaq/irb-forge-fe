import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Label } from "./label";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12px] text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
