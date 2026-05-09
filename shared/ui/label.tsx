import * as React from "react";
import { cn } from "@/shared/lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block text-[13px] font-medium text-text-primary mb-1.5", className)}
    {...props}
  />
));
Label.displayName = "Label";
