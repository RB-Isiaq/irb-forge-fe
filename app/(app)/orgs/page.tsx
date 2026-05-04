import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { OrgGrid } from "@/widgets/org-grid";

export const metadata: Metadata = { title: "Organizations" };

export default function OrgsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary mb-1">Organizations</h1>
          <p className="text-[14px] text-text-muted">Communities you own or belong to.</p>
        </div>
        <Link href="/orgs/new">
          <Button leftIcon={<Plus size={16} />}>New organization</Button>
        </Link>
      </div>
      <OrgGrid />
    </div>
  );
}
