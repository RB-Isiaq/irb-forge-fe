import type { Metadata } from "next";
import { OrgPrograms } from "@/widgets/org-programs";

export const metadata: Metadata = { title: "Programs" };

export default async function ProgramsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Programs</h1>
      <OrgPrograms slug={slug} />
    </div>
  );
}
