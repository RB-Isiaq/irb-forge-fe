import { Suspense } from "react";
import type { Metadata } from "next";
import { BillingOverview } from "@/widgets/billing-overview";
import { SubscriptionResult } from "./subscription-result";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Billing</h1>
      {/* Handles ?subscription=success|cancelled redirected back from Stripe */}
      <Suspense>
        <SubscriptionResult slug={slug} />
      </Suspense>
      <BillingOverview slug={slug} />
    </div>
  );
}
