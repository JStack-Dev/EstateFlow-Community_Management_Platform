import { type ReactNode } from "react";
import { Bell } from "lucide-react";

interface TopbarProps {
  children?: ReactNode;
}

export function Topbar({ children }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-6">
      <div className="flex items-center gap-4">{children}</div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-ink-400 transition-colors hover:bg-surface-tertiary hover:text-ink-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
