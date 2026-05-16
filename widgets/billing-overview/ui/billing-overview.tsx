"use client";

import { Check, Zap, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  PLANS,
  getPlan,
  useMySubscription,
  useCreateCheckout,
  useCancelSubscription,
  type Plan,
  type PlanId,
} from "@/entities/subscription";
import { useMyPayments } from "@/entities/subscription";
import { cn, timeAgo } from "@/shared/lib";

/* ── Status badge ────────────────────────────────────────────── */

const statusVariant = {
  active: "success",
  trialing: "primary",
  past_due: "warning",
  cancelled: "outline",
} as const;

/* ── Plan card ───────────────────────────────────────────────── */

function PlanCard({
  plan,
  isCurrent,
  isPending,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  isPending: boolean;
  onSelect: (id: PlanId) => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-5 transition-colors",
        isCurrent
          ? "border-primary bg-primary/[0.02]"
          : plan.highlight
            ? "border-primary/40 bg-surface"
            : "border-border bg-surface"
      )}
    >
      {plan.highlight && !isCurrent && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-white text-[11px] font-semibold">
          Most popular
        </span>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[14px] font-semibold text-text-primary">{plan.name}</p>
          {isCurrent && <Badge variant="primary">Current</Badge>}
        </div>
        <div className="flex items-end gap-1">
          {plan.price === 0 ? (
            <span className="text-[28px] font-bold text-text-primary">Free</span>
          ) : (
            <>
              <span className="text-[28px] font-bold text-text-primary">${plan.price}</span>
              <span className="text-[13px] text-text-muted mb-1">/mo</span>
            </>
          )}
        </div>
        <p className="text-[12px] text-text-muted mt-1">
          {plan.limits.orgs === null ? "Unlimited" : plan.limits.orgs}{" "}
          {plan.limits.orgs === 1 ? "org" : "orgs"} ·{" "}
          {plan.limits.members === null ? "unlimited" : plan.limits.members} members ·{" "}
          {plan.limits.programs === null ? "unlimited" : plan.limits.programs}{" "}
          {plan.limits.programs === 1 ? "program" : "programs"}
        </p>
      </div>

      <ul className="space-y-1.5 flex-1 mb-5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[13px] text-text-secondary">
            <Check size={14} className="text-primary shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="h-9" />
      ) : plan.price === 0 ? null : (
        <Button
          size="sm"
          variant={plan.highlight ? "primary" : "secondary"}
          loading={isPending}
          onClick={() => onSelect(plan.id)}
          leftIcon={<Zap size={13} />}
        >
          Upgrade to {plan.name}
        </Button>
      )}
    </div>
  );
}

/* ── Main widget ─────────────────────────────────────────────── */

export function BillingOverview() {
  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const { data: payments } = useMyPayments();
  const checkout = useCreateCheckout();
  const cancel = useCancelSubscription();

  const currentPlanId: PlanId =
    subscription?.status === "active" || subscription?.status === "trialing"
      ? subscription.planId
      : "free";
  const currentPlan = getPlan(currentPlanId);
  const isPaid = currentPlanId !== "free";
  const isCancelled = subscription?.cancelAtPeriodEnd === true;

  return (
    <div className="space-y-8">
      {/* Current plan status */}
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>Your active IRB Forge subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <div className="space-y-2">
              <div className="h-5 w-32 rounded-md bg-border animate-pulse" />
              <div className="h-4 w-48 rounded-md bg-border animate-pulse" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <p className="text-[16px] font-semibold text-text-primary">{currentPlan.name}</p>
                  {subscription && (
                    <Badge variant={statusVariant[subscription.status]}>
                      {isCancelled ? "Cancels at period end" : subscription.status}
                    </Badge>
                  )}
                </div>
                {isPaid && subscription && (
                  <p className="text-[13px] text-text-muted">
                    {isCancelled ? "Access until" : "Renews"}{" "}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
                {!isPaid && (
                  <p className="text-[13px] text-text-muted">
                    {currentPlan.limits.orgs} org · {currentPlan.limits.members} members ·{" "}
                    {currentPlan.limits.programs} program
                  </p>
                )}
              </div>
              {isPaid && !isCancelled && (
                <Button
                  size="sm"
                  variant="secondary"
                  loading={cancel.isPending}
                  onClick={() => {
                    if (
                      confirm(
                        "Cancel your subscription? You'll keep access until the end of your billing period."
                      )
                    ) {
                      cancel.mutate();
                    }
                  }}
                >
                  Cancel plan
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <section>
        <h2 className="text-[15px] font-semibold text-text-primary mb-4">
          {isPaid ? "Change plan" : "Upgrade your plan"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.id === currentPlanId}
              isPending={checkout.isPending}
              onSelect={(id) => checkout.mutate(id)}
            />
          ))}
        </div>
        <p className="text-[12px] text-text-muted mt-3 text-center">
          Need more? Contact us for Enterprise pricing.
        </p>
      </section>

      {/* Payment history */}
      <section>
        <h2 className="text-[15px] font-semibold text-text-primary mb-4">Payment history</h2>
        {!payments?.length ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-[14px] text-text-muted">No payments yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            {payments.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5",
                  i < payments.length - 1 ? "border-b border-border" : ""
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">{p.description}</p>
                  <p className="text-[12px] text-text-muted">{timeAgo(p.createdAt)}</p>
                </div>
                <p className="text-[13px] font-semibold text-text-primary shrink-0">
                  ${(p.amount / 100).toFixed(2)}
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
                {p.receiptUrl && (
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors shrink-0"
                    aria-label="View receipt"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
