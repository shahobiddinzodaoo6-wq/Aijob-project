import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, UserRole } from "@/types/auth";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  role?: string;
  exp: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setHasHydrated: (val: boolean) => void;
  logout: () => void;
  initFromStorage: () => void;
}

function parseUser(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded.role ||
      "Candidate";
    return {
      id: decoded.sub,
      email: decoded.email,
      fullName: decoded.name || "",
      role: role as UserRole,
    };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,
 
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }
        const user = parseUser(accessToken);
        set({ accessToken, refreshToken, user, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      initFromStorage: () => {
        if (typeof window === "undefined") return;
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (accessToken && refreshToken) {
          const user = parseUser(accessToken);
          if (user) {
            set({ accessToken, refreshToken, user, isAuthenticated: true });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
