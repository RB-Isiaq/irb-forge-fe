import type { Metadata } from "next";
import { UserSettings } from "@/widgets/user-settings";

export const metadata: Metadata = { title: "Account — Settings" };

export default function AccountSettingsPage() {
  return <UserSettings />;
}
