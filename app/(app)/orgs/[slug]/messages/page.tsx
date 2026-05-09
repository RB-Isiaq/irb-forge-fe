import type { Metadata } from "next";
import { OrgAnnouncements } from "@/widgets/org-announcements";

export const metadata: Metadata = { title: "Announcements" };

export default async function MessagesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Announcements</h1>
      <OrgAnnouncements slug={slug} />
    </div>
  );
}
