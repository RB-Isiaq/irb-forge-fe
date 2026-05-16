export type PlanId = "free" | "starter" | "growth" | "scale";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  limits: {
    orgs: number | null;
    members: number | null;
    programs: number | null;
  };
  features: string[];
  highlight?: boolean;
}

export interface Subscription {
  id: string;
  planId: PlanId;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "refunded";
  description: string;
  createdAt: string;
  receiptUrl?: string;
}

export interface CheckoutSession {
  url: string;
}
