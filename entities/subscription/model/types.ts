import type { PaginatedData } from "@/shared/lib";

export type OrgPlan = "free" | "pro";
export type SubscriptionStatus = "active" | "past_due" | "trialing" | "cancelled";

export interface Subscription {
  id: string;
  organizationId: string;
  plan: OrgPlan;
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  organizationId: string;
  stripePaymentIntentId: string;
  amount: number; // in cents — divide by 100 for display
  currency: string;
  status: "succeeded" | "failed" | "refunded";
  createdAt: string;
}

export type PaginatedPayments = PaginatedData<Payment>;

export interface CheckoutSession {
  url: string;
}
