import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Endorsement } from "@/types/user";

export const endorsementService = {
  async endorse(profileSkillId: number): Promise<void> {
    await apiClient.post("/api/Endorsement", { profileSkillId });
  },

  async deleteEndorsement(id: number): Promise<void> {
    await apiClient.delete(`/api/Endorsement/${id}`);
  },

  async getEndorsement(id: number): Promise<Endorsement> {
    const res = await apiClient.get<ApiResponse<Endorsement>>(`/api/Endorsement/${id}`);
    return res.data.data;
  },

  async getByProfileSkill(profileSkillId: number): Promise<Endorsement[]> {
    const res = await apiClient.get<ApiResponse<Endorsement[]>>(`/api/Endorsement/by-profile-skill/${profileSkillId}`);
    return res.data.data;
  },

  async getByUser(userId: number): Promise<Endorsement[]> {
    const res = await apiClient.get<ApiResponse<Endorsement[]>>(`/api/Endorsement/by-user/${userId}`);
    return res.data.data;
  },
};
