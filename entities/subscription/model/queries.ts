"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { subscriptionApi } from "../api";
import type { PlanId } from "./types";

export function useMySubscription() {
  return useQuery({
    queryKey: queryKeys.subscription.me(),
    queryFn: () => subscriptionApi.getMy(),
    retry: false,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: queryKeys.subscription.payments(),
    queryFn: () => subscriptionApi.getPayments(),
    retry: false,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (planId: PlanId) => subscriptionApi.createCheckout(planId),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (err) => toast.error(extractApiError(err, "Could not start checkout.")),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionApi.cancel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.me() });
      toast.success(
        "Subscription cancelled. Access continues until the end of your billing period."
      );
    },
    onError: (err) => toast.error(extractApiError(err, "Could not cancel subscription.")),
  });
}
