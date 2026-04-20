import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      {icon && (
        <div className="w-16 h-16 bg-slate-100/60 border border-slate-300/50 rounded-2xl flex items-center justify-center mb-5 text-slate-300">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-400 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
