import { Sidebar } from "@/widgets/sidebar";
import { UnverifiedBanner } from "@/widgets/unverified-banner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-56 min-h-full">
        <UnverifiedBanner />
        <main className="flex-1 p-6 bg-bg">{children}</main>
      </div>
    </div>
  );
}
