import type { Metadata } from "next";
import { OrgChannels } from "@/widgets/org-channels";

export const metadata: Metadata = { title: "Channels" };

export default async function ChannelsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Channels</h1>
      <OrgChannels slug={slug} />
    </div>
  );
}
