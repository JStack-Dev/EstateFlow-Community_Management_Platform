import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 transition-all duration-200",
        "placeholder:text-ink-400",
        "focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-ink-300",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
