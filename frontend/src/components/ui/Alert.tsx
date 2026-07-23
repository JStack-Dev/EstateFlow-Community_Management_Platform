import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex items-start gap-3 rounded-lg border p-4 text-sm transition-all",
  {
    variants: {
      variant: {
        info: "border-blue-200 bg-blue-50 text-blue-800",
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        warning: "border-amber-200 bg-amber-50 text-amber-800",
        danger: "border-red-200 bg-red-50 text-red-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant = "info", children, ...props }: AlertProps) {
  const Icon = icons[variant || "info"];
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
