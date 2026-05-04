"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrg } from "@/entities/org";
import { Users, BookOpen, Mail, Settings } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { PageSpinner } from "@/shared/ui/spinner";

const tabs = [
  { label: "Members",     href: "members",     icon: Users },
  { label: "Programs",    href: "programs",    icon: BookOpen },
  { label: "Invitations", href: "invitations", icon: Mail },
  { label: "Settings",    href: "settings",    icon: Settings },
] as const;

export default function OrgDashboardPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: org, isLoading } = useOrg(slug);

  if (isLoading) return <PageSpinner />;
  if (!org) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-text-primary mb-1">{org.name}</h1>
        {org.description && <p className="text-[14px] text-text-muted">{org.description}</p>}
        <p className="text-[12px] text-text-muted mt-1">/{org.slug}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tabs.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={`/orgs/${slug}/${href}`}>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="py-5 flex flex-col items-center gap-2 text-center">
                <div className="h-10 w-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
                  <Icon size={20} className="text-primary" strokeWidth={1.8} />
                </div>
                <span className="text-[13px] font-medium text-text-primary">{label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
