import type { Metadata } from "next";
import { InvitationsInbox } from "@/widgets/invitations-inbox";

export const metadata: Metadata = { title: "Invitations" };

export default function InvitationsInboxPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-text-primary mb-1">Invitations</h1>
        <p className="text-[14px] text-text-muted">Organizations waiting for your response.</p>
      </div>
      <InvitationsInbox />
    </div>
  );
}
