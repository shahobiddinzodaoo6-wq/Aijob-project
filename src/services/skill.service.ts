import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Skill } from "@/types/user";

export const skillService = {
  async getSkills(): Promise<Skill[]> {
    const res = await apiClient.get<ApiResponse<Skill[]>>("/api/Skill");
    return res.data.data;
  },

  async searchSkills(query: string): Promise<Skill[]> {
    const res = await apiClient.get<ApiResponse<Skill[]>>("/api/Skill/search", { params: { query } });
    return res.data.data;
  },

  async createSkill(name: string): Promise<Skill> {
    const res = await apiClient.post<ApiResponse<Skill>>("/api/Skill", { name });
    return res.data.data;
  },
};
