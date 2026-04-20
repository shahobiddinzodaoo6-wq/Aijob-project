import { apiClient } from "@/lib/axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthTokens,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

export const authService = {
  normalizeTokens(data: any): AuthTokens {
    const raw = data?.data || data;
    return {
      accessToken: raw?.accessToken || raw?.token || raw?.access_token || "",
      refreshToken: raw?.refreshToken || raw?.refresh_token || "",
    };
  },

  async login(data: LoginRequest): Promise<AuthTokens> {
    const res = await apiClient.post<any>("/api/Auth/login", data);
    return this.normalizeTokens(res.data);
  },

  async register(data: RegisterRequest): Promise<AuthTokens> {
    const res = await apiClient.post<any>("/api/Auth/register", data);
    return this.normalizeTokens(res.data);
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("/api/Auth/logout", { refreshToken });
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post("/api/Auth/forgot-password", data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post("/api/Auth/reset-password", data);
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const res = await apiClient.post<any>("/api/Auth/refresh-token", { refreshToken });
    return this.normalizeTokens(res.data);
  },

  async externalLogin(provider: string, returnUrl?: string): Promise<void> {
    const url = `/api/Auth/external/${provider}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`;
    console.error("externalLogin redirect disabled for debugging", url);
  },

  async externalCallback(returnUrl?: string): Promise<AuthTokens> {
    const res = await apiClient.get<any>(`/api/Auth/external-callback`, { params: { returnUrl } });
    return this.normalizeTokens(res.data);
  },
};
