import type { Metadata } from "next";
import { MembersList } from "@/widgets/org-members";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Members</h1>
      <MembersList slug={slug} />
    </div>
  );
}
