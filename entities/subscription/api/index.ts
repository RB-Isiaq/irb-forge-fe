import { apiGet, apiPost, apiDelete } from "@/shared/api";
import type { Subscription, Payment, CheckoutSession, PlanId } from "../model/types";

export const subscriptionApi = {
  getMy: () => apiGet<Subscription>("/subscriptions/me"),
  createCheckout: (planId: PlanId) =>
    apiPost<CheckoutSession>("/subscriptions/checkout", { planId }),
  cancel: () => apiDelete("/subscriptions/me"),
  getPayments: () => apiGet<Payment[]>("/payments/me"),
};
