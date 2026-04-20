import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { UserEducation } from "@/types/user";

export const educationService = {
  async getAll(): Promise<UserEducation[]> {
    const res = await apiClient.get<ApiResponse<UserEducation[]>>("/api/Education");
    return res.data.data;
  },

  async getById(id: number): Promise<UserEducation> {
    const res = await apiClient.get<ApiResponse<UserEducation>>(`/api/Education/${id}`);
    return res.data.data;
  },

  async getByProfile(profileId: number): Promise<UserEducation[]> {
    const res = await apiClient.get<ApiResponse<UserEducation[]>>(`/api/Education/by-profile/${profileId}`);
    return res.data.data;
  },

  async create(data: Partial<UserEducation>): Promise<void> {
    await apiClient.post("/api/Education", data);
  },

  async update(id: number, data: Partial<UserEducation>): Promise<void> {
    await apiClient.put(`/api/Education/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/Education/${id}`);
  },
};
