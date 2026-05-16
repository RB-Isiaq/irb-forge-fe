import type { Metadata } from "next";
import { BillingOverview } from "@/widgets/billing-overview";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Billing</h1>
      <BillingOverview slug={slug} />
    </div>
  );
}
