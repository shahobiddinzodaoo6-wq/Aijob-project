"use client";
import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm"|"md"|"lg"|"xl";
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, description, children, size = "md", footer }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm:"max-w-sm", md:"max-w-lg", lg:"max-w-2xl", xl:"max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm anim-in" onClick={onClose} />
      <div className={clsx(
        "relative w-full flex flex-col max-h-[90vh] anim-scale",
        "bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-black/60",
        sizes[size]
      )}>
        {(title || description) && (
          <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 flex-shrink-0">
            <div>
              {title && <h2 className="text-base font-bold text-slate-900">{title}</h2>}
              {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
            </div>
            <button onClick={onClose}
              className="ml-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto flex-1 scroll-area">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white/80 rounded-b-2xl flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
