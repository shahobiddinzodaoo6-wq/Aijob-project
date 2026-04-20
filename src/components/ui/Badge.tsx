import { HTMLAttributes } from "react";
import { clsx } from "clsx";

type Variant = "default"|"success"|"warning"|"danger"|"info"|"purple"|"cyan"|"pink"|"outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
  size?: "sm"|"md";
}

const styles: Record<Variant, string> = {
  default: "bg-slate-100 text-slate-700 border border-slate-300",
  success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  warning: "bg-amber-50  text-amber-600  border border-amber-200",
  danger:  "bg-red-500/10    text-red-400    border border-red-500/20",
  info:    "bg-blue-50   text-blue-600   border border-blue-200",
  purple:  "bg-blue-50 text-blue-600 border border-blue-200",
  cyan:    "bg-sky-50   text-sky-600   border border-sky-200",
  pink:    "bg-pink-50   text-pink-600   border border-pink-200",
  outline: "bg-transparent border border-slate-200 text-slate-700",
};

const dotColors: Record<Variant, string> = {
  default: "bg-zinc-400",
  success: "bg-emerald-600",
  warning: "bg-amber-600",
  danger:  "bg-red-400",
  info:    "bg-blue-600",
  purple:  "bg-blue-600",
  cyan:    "bg-sky-600",
  pink:    "bg-pink-600",
  outline: "bg-slate-400",
};

export function Badge({ variant = "default", dot, size = "md", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "badge font-semibold",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        styles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}
