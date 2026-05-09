"use client";

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { userApi, useAuth } from "@/entities/user";
import { cn } from "@/shared/lib";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function VerifyEmailForm() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const submitLock = useRef(false);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function verify(otp: string) {
    if (otp.length < OTP_LENGTH || loading || submitLock.current) return;
    submitLock.current = true;
    setLoading(true);
    try {
      await userApi.verifyEmail({ otp });
      if (user) setUser({ ...user, isVerified: true });
      toast.success("Email verified. Welcome to IRB Forge!");
      router.push("/dashboard");
    } catch {
      toast.error("That code is incorrect or has expired.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
      submitLock.current = false;
    }
  }

  // Auto-submit when all digits are filled — deferred to keep effect body free of setState
  useEffect(() => {
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH || loading) return;
    const timer = setTimeout(() => verify(otp), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleResend() {
    if (!user?.email || cooldown > 0) return;
    setResending(true);
    try {
      await userApi.resendVerification({ email: user.email });
      toast.success("New code sent — check your inbox.");
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Could not resend. Try again in a moment.");
    } finally {
      setResending(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-8 pb-7 text-center">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mx-auto mb-4">
          <Mail size={24} className="text-primary" strokeWidth={1.8} />
        </div>

        <h1 className="text-[22px] font-semibold text-text-primary mb-2">Check your inbox</h1>
        <p className="text-[14px] text-text-muted mb-1">We sent a 6-digit code to</p>
        <p className="text-[14px] font-medium text-text-primary mb-6">
          {user?.email ?? "your email"}
        </p>

        {/* OTP digit inputs */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          {digits.map((digit, i) => (
            <input
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
              aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
              className={cn(
                "h-13 w-11 rounded-md border bg-surface",
                "text-center text-[24px] font-bold text-text-primary font-mono",
                "outline-none transition-all duration-150",
                digit
                  ? "border-primary ring-2 ring-primary/15"
                  : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full mb-4"
          loading={loading}
          onClick={() => verify(digits.join(""))}
        >
          Verify email
        </Button>

        <p className="text-[13px] text-text-muted">
          Didn&apos;t receive it?{" "}
          {cooldown > 0 ? (
            <span className="text-text-muted">Resend in {cooldown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-primary hover:underline disabled:opacity-50 font-medium"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          )}
        </p>
        <p className="mt-2 text-[12px] text-text-muted">Code expires in 10 minutes.</p>
      </CardContent>
    </Card>
  );
}
