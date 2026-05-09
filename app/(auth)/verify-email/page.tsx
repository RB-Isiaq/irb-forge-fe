"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userApi, useAuth } from "@/entities/user";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function focusNext(index: number) {
    inputRefs.current[index + 1]?.focus();
  }
  function focusPrev(index: number) {
    inputRefs.current[index - 1]?.focus();
  }

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) focusNext(index);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) focusPrev(index);
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify() {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      toast.error("Enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      await userApi.verifyEmail({ otp });
      if (user) setUser({ ...user, isVerified: true });
      toast.success("Email verified.");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!user?.email) return;
    setResending(true);
    try {
      await userApi.resendVerification({ email: user.email });
      toast.success("New code sent — check your inbox.");
    } catch {
      toast.error("Could not resend. Try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mx-auto">
          <span className="text-[22px]">✉️</span>
        </div>
        <h1 className="text-[22px] font-semibold text-text-primary mb-1">Verify your email</h1>
        <p className="text-[14px] text-text-muted mb-6">
          Enter the 6-digit code sent to{" "}
          <strong className="text-text-primary">{user?.email ?? "your email"}</strong>. It expires
          in 10 minutes.
        </p>

        {/* OTP Input */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {digits.map((digit, i) => (
            <input
              aria-label="numeric"
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className={cn(
                "h-12 w-11 rounded-[8px] border border-border bg-surface",
                "text-center text-[22px] font-bold text-text-primary font-mono",
                "outline-none transition-colors",
                "focus:border-primary focus:ring-2 focus:ring-primary/15",
                digit && "border-primary"
              )}
            />
          ))}
        </div>

        <Button size="lg" className="w-full mb-4" loading={loading} onClick={handleVerify}>
          Verify email
        </Button>

        <button
          onClick={handleResend}
          disabled={resending}
          className="text-[13px] text-primary hover:underline disabled:opacity-50"
        >
          {resending ? "Sending…" : "Didn't receive it? Resend"}
        </button>
      </CardContent>
    </Card>
  );
}
