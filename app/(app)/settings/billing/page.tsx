import type { Metadata } from "next";
import { BillingOverview } from "@/widgets/billing-overview";

export const metadata: Metadata = { title: "Billing — Settings" };

export default function BillingSettingsPage() {
  return <BillingOverview />;
}
