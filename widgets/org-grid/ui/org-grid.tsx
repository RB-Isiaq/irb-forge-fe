"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";
import { useOrgs } from "@/entities/org";

export function OrgGrid() {
  const { data: orgs, isLoading, isError, refetch } = useOrgs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-9 w-9 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mt-1.5" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <ErrorState message="Couldn't load your organizations." onRetry={refetch} />
      </Card>
    );
  }

  if (!orgs?.length) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Building2 size={36} className="mx-auto text-text-muted mb-3" strokeWidth={1.5} />
          <p className="text-[15px] font-medium text-text-primary mb-1">No organizations yet</p>
          <p className="text-[13px] text-text-muted mb-5">
            Create your first organization to get started.
          </p>
          <Link href="/orgs/new">
            <Button size="sm">Create organization</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {orgs.map((org) => (
        <Link key={org.id} href={`/orgs/${org.slug}`}>
          <Card className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full">
            <CardContent className="py-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-[8px] bg-primary/10 flex items-center justify-center">
                  <Building2 size={18} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary truncate">{org.name}</p>
                  <p className="text-[12px] text-text-muted">/{org.slug}</p>
                </div>
              </div>
              {org.description && (
                <p className="text-[13px] text-text-secondary line-clamp-2">{org.description}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
