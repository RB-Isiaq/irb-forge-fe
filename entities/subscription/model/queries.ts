"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "@/shared/api";
import { queryKeys } from "@/shared/lib";
import { subscriptionApi } from "../api";

export function useOrgSubscription(slug: string) {
  return useQuery({
    queryKey: queryKeys.subscription.byOrg(slug),
    queryFn: () => subscriptionApi.getByOrg(slug),
    enabled: !!slug,
    retry: false,
  });
}

export function useOrgPayments(slug: string) {
  return useQuery({
    queryKey: queryKeys.subscription.payments(slug),
    queryFn: () => subscriptionApi.getPayments(slug),
    enabled: !!slug,
    retry: false,
  });
}

export function useCreateCheckout(slug: string) {
  return useMutation({
    mutationFn: () => subscriptionApi.createCheckout(slug),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (err) => toast.error(extractApiError(err, "Could not start checkout.")),
  });
}

export function useCancelSubscription(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionApi.cancel(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.byOrg(slug) });
      toast.success("Subscription cancelled. Your org is back on Free.");
    },
    onError: (err) => toast.error(extractApiError(err, "Could not cancel subscription.")),
  });
}
