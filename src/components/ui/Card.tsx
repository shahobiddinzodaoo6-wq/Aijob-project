import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  lift?: boolean;
  glow?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ className, children, lift, glow, glass, padding = "none", ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "card",
        lift  && "card-lift cursor-pointer",
        glow  && "card-glow",
        glass && "glass",
        padding === "sm" && "p-4",
        padding === "md" && "p-5",
        padding === "lg" && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("px-6 py-4 border-b border-slate-200 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("px-6 py-4 border-t border-slate-200 bg-white0 rounded-b-xl", className)} {...props}>
      {children}
    </div>
  );
}
