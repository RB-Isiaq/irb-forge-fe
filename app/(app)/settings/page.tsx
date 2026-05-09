import type { Metadata } from "next";
import { UserSettings } from "@/widgets/user-settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="max-w-140">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-[14px] text-text-muted">Manage your account and preferences.</p>
      </div>
      <UserSettings />
    </div>
  );
}
