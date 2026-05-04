import type { Metadata } from "next";
import { CreateOrgForm } from "@/features/org/create-org/ui/create-org-form";

export const metadata: Metadata = { title: "New organization" };

export default function NewOrgPage() {
  return (
    <div className="max-w-140">
      <h1 className="text-[28px] font-bold text-text-primary mb-1">New organization</h1>
      <p className="text-[14px] text-text-muted mb-6">Create a community. You&apos;ll be assigned as owner automatically.</p>
      <CreateOrgForm />
    </div>
  );
}
