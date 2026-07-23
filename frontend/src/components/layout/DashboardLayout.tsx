import { type ReactNode } from "react";
import { Sidebar, type NavItem } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  items: NavItem[];
  brand: string;
  brandSubtitle?: string;
  onLogout: () => void;
  children: ReactNode;
}

export function DashboardLayout({
  items,
  brand,
  brandSubtitle,
  onLogout,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={items} brand={brand} brandSubtitle={brandSubtitle} onLogout={onLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-surface-secondary p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
