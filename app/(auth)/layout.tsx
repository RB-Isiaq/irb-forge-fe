import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s | IRB Forge",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-bg px-4 py-12">
      {/* Logo */}
      <a href="/" className="mb-8 flex items-center gap-2.5 group">
        <div className="h-8 w-8 rounded-[6px] bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-[16px] leading-none">F</span>
        </div>
        <span className="text-[18px] font-bold text-text-primary group-hover:text-primary transition-colors">
          IRB Forge
        </span>
      </a>

      {/* Card container */}
      <div className="w-full max-w-[420px]">{children}</div>

      <p className="mt-8 text-[12px] text-text-muted text-center">
        © {new Date().getFullYear()} IRB Forge. All rights reserved.
      </p>
    </div>
  );
}
