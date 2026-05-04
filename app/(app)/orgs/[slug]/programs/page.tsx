import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

export const metadata: Metadata = { title: "Programs" };

export default function ProgramsPage() {
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Programs</h1>
      <Card>
        <CardContent className="py-16 text-center">
          <BookOpen size={36} className="mx-auto text-text-muted mb-3" strokeWidth={1.5} />
          <p className="text-[14px] font-medium text-text-primary mb-1">
            Programs — coming Weekend 3
          </p>
          <p className="text-[13px] text-text-muted">
            Cohort programs and enrollments will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
