import type { Metadata } from "next";
import { LandingPage } from "@/widgets/landing-page";

export const metadata: Metadata = {
  title: "IRB Forge — Build. Connect. Scale.",
  description:
    "The platform built for mentorship communities. Manage organizations, run cohort programs, track enrollment, and collect payments — all in one place.",
};

export default function HomePage() {
  return <LandingPage />;
}
