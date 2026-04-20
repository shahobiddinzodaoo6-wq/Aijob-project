"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { TooltipProvider } from "@/components/ui/Tooltip";

function AuthInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().initFromStorage();
  }, []);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (

    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <AuthInit>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </AuthInit>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
