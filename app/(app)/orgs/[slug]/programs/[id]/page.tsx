import type { Metadata } from "next";
import { ProgramDetail } from "@/widgets/program-detail";

export const metadata: Metadata = { title: "Program" };

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  return <ProgramDetail slug={slug} programId={id} />;
}
