import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Language } from "@/types/user";

export const languageService = {
  async getAll(): Promise<Language[]> {
    const res = await apiClient.get<ApiResponse<Language[]>>("/api/Language");
    return res.data.data;
  },

  async getById(id: number): Promise<Language> {
    const res = await apiClient.get<ApiResponse<Language>>(`/api/Language/${id}`);
    return res.data.data;
  },

  async create(data: Partial<Language>): Promise<Language> {
    const res = await apiClient.post<ApiResponse<Language>>("/api/Language", data);
    return res.data.data;
  },

  async update(id: number, data: Partial<Language>): Promise<Language> {
    const res = await apiClient.put<ApiResponse<Language>>(`/api/Language/${id}`, data);
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/Language/${id}`);
  },

  async search(name: string): Promise<Language[]> {
    const res = await apiClient.get<ApiResponse<Language[]>>("/api/Language/search", { params: { name } });
    return res.data.data;
  },
};
