"use client";

import { useState } from "react";
import { Check, Zap, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import {
  PRO_PRICE,
  PRO_ORIGINAL_PRICE,
  PRO_DISCOUNT_PCT,
  PRO_CURRENCY_SYMBOL,
  FREE_FEATURES,
  PRO_FEATURES,
  formatNaira,
  formatPaymentAmount,
  useOrgSubscription,
  useOrgPayments,
  useCreateCheckout,
  useCancelSubscription,
} from "@/entities/subscription";
import { useMyRole } from "@/entities/member";
import { cn, timeAgo } from "@/shared/lib";

const statusVariant = {
  active: "success",
  trialing: "primary",
  past_due: "warning",
  cancelled: "outline",
} as const;

export function BillingOverview({ slug }: { slug: string }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data: subscription, isLoading } = useOrgSubscription(slug);
  const { data: paymentsPage } = useOrgPayments(slug);
  const checkout = useCreateCheckout(slug);
  const cancel = useCancelSubscription(slug);
  const myRole = useMyRole(slug);

  const isOwner = myRole === "owner";
  const isPro = subscription?.plan === "pro" && subscription?.status === "active";

  return (
    <div className="space-y-8">
      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>
            Billing is per organization. All charges apply to this org.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <p className="text-[16px] font-semibold text-text-primary">
                    {isPro ? "Pro" : "Free"}
                  </p>
                  {subscription && (
                    <Badge variant={statusVariant[subscription.status]}>
                      {subscription.status}
                    </Badge>
                  )}
                </div>
                {isPro && subscription?.currentPeriodEnd && (
                  <p className="text-[13px] text-text-muted">
                    Renews{" "}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
                {!isPro && (
                  <p className="text-[13px] text-text-muted">No active Stripe subscription.</p>
                )}
                {subscription?.status === "past_due" && (
                  <div className="flex items-center gap-1.5 mt-2 text-[13px] text-warning">
                    <AlertTriangle size={13} />
                    Payment failed — update your payment method in Stripe.
                  </div>
                )}
              </div>

              {isOwner && isPro && (
                <Button size="sm" variant="secondary" onClick={() => setCancelOpen(true)}>
                  Cancel subscription
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <section>
        <h2 className="text-[15px] font-semibold text-text-primary mb-4">
          {isPro ? "Your plan" : "Upgrade to Pro"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free card */}
          <div
            className={cn(
              "rounded-xl border p-5 flex flex-col",
              !isPro ? "border-primary bg-primary/[0.02]" : "border-border bg-surface"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-[15px] font-semibold text-text-primary">Free</p>
              {!isPro && <Badge variant="primary">Current</Badge>}
            </div>
            <p className="text-[26px] font-bold text-text-primary mb-1">{PRO_CURRENCY_SYMBOL}0</p>
            <p className="text-[12px] text-text-muted mb-4">No credit card required</p>
            <ul className="space-y-1.5 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-text-secondary">
                  <Check size={13} className="text-text-muted shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro card */}
          <div
            className={cn(
              "rounded-xl border p-5 flex flex-col relative",
              isPro ? "border-primary bg-primary/[0.02]" : "border-primary/40 bg-surface"
            )}
          >
            {!isPro && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-semibold whitespace-nowrap">
                Launch offer — {PRO_DISCOUNT_PCT}% off
              </span>
            )}
            <div className="flex items-center justify-between mb-1">
              <p className="text-[15px] font-semibold text-text-primary">Pro</p>
              {isPro && <Badge variant="primary">Current</Badge>}
            </div>
            {!isPro && (
              <p className="text-[13px] text-text-muted line-through mb-0.5">
                {PRO_CURRENCY_SYMBOL}
                {PRO_ORIGINAL_PRICE.toLocaleString("en-NG")}
              </p>
            )}
            <div className="flex items-end gap-1 mb-1">
              <p className="text-[26px] font-bold text-text-primary">{formatNaira(PRO_PRICE)}</p>
              <p className="text-[13px] text-text-muted mb-1">/month</p>
            </div>
            <p className="text-[12px] text-text-muted mb-4">Billed monthly · cancel anytime</p>
            <ul className="space-y-1.5 flex-1 mb-5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-text-secondary">
                  <Check size={13} className="text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {!isPro && isOwner && (
              <Button
                size="sm"
                loading={checkout.isPending}
                leftIcon={<Zap size={13} />}
                onClick={() => checkout.mutate()}
              >
                Upgrade to Pro
              </Button>
            )}
            {!isPro && !isOwner && (
              <p className="text-[12px] text-text-muted">Only the org owner can upgrade.</p>
            )}
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel subscription?"
        description="This is immediate — your org reverts to Free right now. No refund is issued."
        confirmLabel="Yes, cancel"
        variant="danger"
        loading={cancel.isPending}
        onConfirm={() => cancel.mutate(undefined, { onSettled: () => setCancelOpen(false) })}
      />

      {/* Payment history */}
      <section>
        <h2 className="text-[15px] font-semibold text-text-primary mb-4">Payment history</h2>
        {!paymentsPage?.items.length ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-[14px] text-text-muted">No payments yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            {paymentsPage.items.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5",
                  i < paymentsPage.items.length - 1 ? "border-b border-border" : ""
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">Pro subscription</p>
                  <p className="text-[12px] text-text-muted">{timeAgo(p.createdAt)}</p>
                </div>
                <p className="text-[13px] font-semibold text-text-primary shrink-0">
                  {formatPaymentAmount(p.amount, p.currency)}
                </p>
                <Badge
                  variant={
                    p.status === "succeeded"
                      ? "success"
                      : p.status === "refunded"
                        ? "outline"
                        : "warning"
                  }
                >
                  {p.status}
                </Badge>
              </div>
            ))}
            {paymentsPage.total > paymentsPage.items.length && (
              <div className="px-5 py-3 border-t border-border">
                <p className="text-[12px] text-text-muted">
                  Showing {paymentsPage.items.length} of {paymentsPage.total} payments
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
