"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib";

export function SubscriptionResult({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const result = searchParams.get("subscription");

  useEffect(() => {
    if (result === "success") {
      toast.success("You're now on Pro — full access unlocked!");
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.byOrg(slug) });
      router.replace(`/orgs/${slug}/billing`);
    } else if (result === "cancelled") {
      toast("Checkout cancelled. No payment was made.");
      router.replace(`/orgs/${slug}/billing`);
    }
  }, [result, slug, queryClient, router]);

  return null;
}
