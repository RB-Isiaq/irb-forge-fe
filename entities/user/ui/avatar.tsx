import { cn, getInitials } from "@/shared/lib";

interface AvatarProps {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const sizeClasses = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-[13px]",
  lg: "h-11 w-11 text-[15px]",
};

export function Avatar({ firstName, lastName, size = "md", className, style }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-primary/10 text-primary font-semibold select-none",
        sizeClasses[size],
        className
      )}
      style={style}
      aria-hidden="true"
    >
      {getInitials(firstName, lastName)}
    </span>
  );
}
