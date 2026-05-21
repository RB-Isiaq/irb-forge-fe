import { cn } from "@/shared/lib";

function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="irb-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <path
        d="M0 0 L100 0 L100 26 L27 26 L27 43 L70 43 L70 62 L27 62 L27 100 L0 100 Z"
        fill="url(#irb-g)"
      />
    </svg>
  );
}

/** Full logo: mark + wordmark. Use `variant="light"` on dark backgrounds. */
export function Logo({
  variant = "dark",
  className,
  markSize = 28,
}: {
  variant?: "dark" | "light";
  className?: string;
  markSize?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <LogoMark size={markSize} />
      <span
        className={cn(
          "font-bold leading-none",
          markSize >= 28 ? "text-[17px]" : "text-[14px]",
          variant === "light" ? "text-white" : "text-text-primary"
        )}
      >
        IRB Forge
      </span>
    </span>
  );
}

/** Just the mark — for tight spaces or favicon-like contexts. */
export { LogoMark };
