"use client";

import { useParams } from "next/navigation";
import { OrgOverview } from "@/widgets/org-overview";

export default function OrgDashboardPage() {
  const { slug } = useParams<{ slug: string }>();
  return <OrgOverview slug={slug} />;
}
