import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  brand: string;
  brandSubtitle?: string;
  onLogout: () => void;
  children?: ReactNode;
}

export function Sidebar({ items, brand, brandSubtitle, onLogout, children }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-ink-200 bg-white">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-ink-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900">{brand}</p>
          {brandSubtitle && <p className="text-xs text-ink-400">{brandSubtitle}</p>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-500 hover:bg-surface-tertiary hover:text-ink-900"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-600"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {children}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
