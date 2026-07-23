import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "rounded-xl border border-ink-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        {icon && <div className="text-ink-400">{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">{value}</p>
      {trend && <p className="mt-1 text-xs text-ink-400">{trend}</p>}
    </motion.div>
  );
}
