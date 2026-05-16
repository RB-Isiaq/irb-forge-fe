import { Suspense } from "react";
import type { Metadata } from "next";
import { OrgSettingsForm } from "@/widgets/org-settings";
import { SubscriptionResult } from "./subscription-result";

export const metadata: Metadata = { title: "Settings" };

export default async function OrgSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="max-w-140">
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Settings</h1>
      {/* Handles ?subscription=success|cancelled redirected from Stripe */}
      <Suspense>
        <SubscriptionResult slug={slug} />
      </Suspense>
      <OrgSettingsForm slug={slug} />
    </div>
  );
}
