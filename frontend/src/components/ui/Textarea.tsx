import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 transition-all duration-200",
        "placeholder:text-ink-400 resize-y",
        "focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-ink-300",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
