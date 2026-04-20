import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { User, UserProfile, UserExperience, UserEducation, UserSkill, ProfileSkill, ProfileLanguage } from "@/types/user";

export const userService = {
  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>("/api/User/me");
    return res.data.data;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const res = await apiClient.put<ApiResponse<User>>(`/api/User/${id}`, data);
    return res.data.data;
  },

  async getUserDirectory(): Promise<User[]> {
    const res = await apiClient.get<any>("/api/User/directory");
    return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
  },

  // UserProfile
  async createProfile(data: any): Promise<UserProfile> {
    const res = await apiClient.post<ApiResponse<UserProfile>>("/api/UserProfile", data);
    return res.data.data;
  },

  async getProfileByUser(userId: string): Promise<UserProfile> {
    const res = await apiClient.get<any>(`/api/UserProfile/by-user/${userId}`);
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data[0] : data;
  },

  async updateProfile(id: string, data: any): Promise<UserProfile> {
    const res = await apiClient.put<ApiResponse<UserProfile>>(`/api/UserProfile/${id}`, data);
    return res.data.data;
  },

  // Experience
  async getExperienceByUser(userId: string): Promise<UserExperience[]> {
    const res = await apiClient.get<ApiResponse<UserExperience[]>>(`/api/UserExperience/by-user/${userId}`);
    return res.data.data;
  },

  async createExperience(data: Partial<UserExperience>): Promise<UserExperience> {
    const res = await apiClient.post<ApiResponse<UserExperience>>("/api/UserExperience", data);
    return res.data.data;
  },

  async updateExperience(id: string, data: Partial<UserExperience>): Promise<UserExperience> {
    const res = await apiClient.put<ApiResponse<UserExperience>>(`/api/UserExperience/${id}`, data);
    return res.data.data;
  },

  async deleteExperience(id: string): Promise<void> {
    await apiClient.delete(`/api/UserExperience/${id}`);
  },

  // Education
  async getEducationByUser(userId: string): Promise<UserEducation[]> {
    const res = await apiClient.get<ApiResponse<UserEducation[]>>(`/api/Education/by-profile/${userId}`);
    return res.data.data;
  },

  async createEducation(data: Partial<UserEducation>): Promise<void> {
    await apiClient.post("/api/Education", data);
  },

  async updateEducation(id: number, data: Partial<UserEducation>): Promise<void> {
    await apiClient.put(`/api/Education/${id}`, data);
  },

  async deleteEducation(id: number): Promise<void> {
    await apiClient.delete(`/api/Education/${id}`);
  },

  // Skills
  async getUserSkills(userId: string): Promise<UserSkill[]> {
    const res = await apiClient.get<ApiResponse<UserSkill[]>>(`/api/JobSkill/by-user/${userId}`);
    return res.data.data;
  },

  async addUserSkill(data: { skillId: number; userId: number }): Promise<void> {
    await apiClient.post("/api/JobSkill", data);
  },

  async deleteUserSkill(id: number): Promise<void> {
    await apiClient.delete(`/api/JobSkill/${id}`);
  },

  // Profile Skills
  async getProfileSkills(profileId: string): Promise<ProfileSkill[]> {
    const res = await apiClient.get<ApiResponse<ProfileSkill[]>>(`/api/ProfileSkill/by-profile/${profileId}`);
    return res.data.data;
  },

  async addProfileSkill(data: { profileId: string; skillId: string }): Promise<ProfileSkill> {
    const res = await apiClient.post<ApiResponse<ProfileSkill>>("/api/ProfileSkill", data);
    return res.data.data;
  },

  async deleteProfileSkill(profileId: string, skillId: string): Promise<void> {
    await apiClient.delete(`/api/ProfileSkill/profile/${profileId}/skill/${skillId}`);
  },

  // Profile Languages
  async getProfileLanguages(profileId: string): Promise<ProfileLanguage[]> {
    const res = await apiClient.get<ApiResponse<ProfileLanguage[]>>(`/api/ProfileLanguage/by-profile/${profileId}`);
    return res.data.data;
  },

  async addProfileLanguage(data: Partial<ProfileLanguage>): Promise<ProfileLanguage> {
    const res = await apiClient.post<ApiResponse<ProfileLanguage>>("/api/ProfileLanguage", data);
    return res.data.data;
  },

  async deleteProfileLanguage(id: string): Promise<void> {
    await apiClient.delete(`/api/ProfileLanguage/${id}`);
  },

  // Upload
  async uploadPhoto(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await apiClient.post<any>("/api/Upload/photo", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const raw = res.data?.data ?? res.data;
    return typeof raw === "string" ? raw : (raw?.url || raw?.path || "");
  },

  async uploadCv(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await apiClient.post<any>("/api/Upload/cv", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const raw = res.data?.data ?? res.data;
    return typeof raw === "string" ? raw : (raw?.url || raw?.path || "");
  },
};
