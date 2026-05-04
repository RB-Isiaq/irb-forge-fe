import type { Metadata } from "next";
import { InvitationsTable } from "@/widgets/org-invitations";

export const metadata: Metadata = { title: "Invitations" };

export default async function InvitationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Pending invitations</h1>
      <InvitationsTable slug={slug} />
    </div>
  );
}
