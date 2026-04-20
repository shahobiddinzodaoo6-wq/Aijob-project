"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/AuthStore";
import { PageLoader } from "@/components/ui/Spinner";

interface RoleGuardProps {
  children: React.ReactNode;
  role: "Candidate" | "Organization";
}

export function RoleGuard({ children, role }: RoleGuardProps) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.role !== role) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, role, _hasHydrated, router]);

  if (!_hasHydrated || !isAuthenticated || user?.role !== role) return <PageLoader />;
  return <>{children}</>;
}
