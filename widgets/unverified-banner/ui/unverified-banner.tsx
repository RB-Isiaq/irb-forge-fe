"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth, userApi } from "@/entities/user";

export function UnverifiedBanner() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user || user.isVerified) return null;

  async function resend() {
    if (!user) return;
    setLoading(true);
    try {
      await userApi.resendVerification({ email: user.email });
      toast.success("Verification code sent — check your inbox.");
    } catch {
      toast.error("Could not resend. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-warning/10 border-b border-warning/20 px-4 py-2.5 flex items-center gap-3 text-[13px]">
      <AlertCircle size={15} className="text-warning shrink-0" />
      <p className="text-text-secondary">Your email is not verified. Some features are locked.</p>
      <button
        onClick={resend}
        disabled={loading}
        className="ml-auto text-primary font-medium hover:underline disabled:opacity-50 shrink-0"
      >
        {loading ? "Sending…" : "Resend code"}
      </button>
    </div>
  );
}
