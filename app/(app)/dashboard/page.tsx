import type { Metadata } from "next";
import { DashboardStats } from "@/widgets/dashboard-stats";
import { OrgGrid } from "@/widgets/org-grid";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-[14px] text-text-muted">Your overview at a glance.</p>
      </div>

      <DashboardStats />

      <div className="mt-8">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Your organizations</h2>
        <OrgGrid />
      </div>
    </div>
  );
}
