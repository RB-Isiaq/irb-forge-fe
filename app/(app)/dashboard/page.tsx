import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-text-primary mb-1">Dashboard</h1>
      <p className="text-[14px] text-text-muted mb-8">
        Your overview across all organizations.
      </p>

      {/* Placeholder — populate with real data as backend endpoints ship */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Organizations", "Active programs", "Pending invitations"].map((label) => (
          <div
            key={label}
            className="rounded-[12px] bg-surface border border-border p-5"
          >
            <p className="text-[13px] text-text-muted mb-1">{label}</p>
            <p className="text-[28px] font-bold text-text-primary">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
