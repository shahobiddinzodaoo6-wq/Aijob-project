import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "success" | "glow";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none active:scale-[0.97] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none";

    const variants = {
      primary:   "bg-blue-600 text-white border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-500/20",
      glow:      "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700",
      secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
      outline:   "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
      ghost:     "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      danger:    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300",
      success:   "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100",
    };

    const sizes = {
      xs: "px-2.5 py-1   text-xs  gap-1   h-7",
      sm: "px-3   py-1.5 text-sm  gap-1.5 h-8",
      md: "px-4   py-2   text-sm  gap-2   h-9",
      lg: "px-5   py-2.5 text-sm  gap-2   h-10",
      xl: "px-7   py-3   text-base gap-2.5 h-12",
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
