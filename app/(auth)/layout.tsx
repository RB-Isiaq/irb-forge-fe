import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/shared/ui/logo";
import { RedirectIfAuthed } from "./_redirect-if-authed";

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s | IRB Forge",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-bg px-4 py-12">
      <RedirectIfAuthed />
      {/* Logo */}
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <Logo markSize={32} />
      </Link>

      {/* Card container */}
      <div className="w-full max-w-105">{children}</div>

      <p className="mt-8 text-[12px] text-text-muted text-center">
        © {new Date().getFullYear()} IRB Forge. All rights reserved.
      </p>
    </div>
  );
}
