import { useCallback, useMemo } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { authService } from "@/services/auth.service";
import { getApiError } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
export function useAuth() {
  const { user, isAuthenticated, setTokens, logout: storeLogout, accessToken, refreshToken } = useAuthStore();
  const router = useRouter();

  const login = useCallback(async (data: LoginRequest) => {
    const tokens = await authService.login(data);
    setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  }, [setTokens]);

  const register = useCallback(async (data: RegisterRequest) => {
    const tokens = await authService.register(data);
    setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  }, [setTokens]);

  const logout = useCallback(async () => {
    try {
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
      // ignore
    }
    storeLogout();
    router.push("/login");
  }, [refreshToken, storeLogout, router]);

  const requireRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    register,
    logout,
    requireRole,
    accessToken
  }), [user, isAuthenticated, login, register, logout, requireRole, accessToken]);

  return value;
}
