import { apiClient } from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types/api";
import type { Notification } from "@/types/social";

export const notificationService = {
  async getNotifications(params?: { userId?: number; pageNumber?: number; pageSize?: number }): Promise<PagedResponse<Notification>> {
    const res = await apiClient.get<PagedResponse<Notification>>("/api/Notification/paged", { 
      params: {
        userId: params?.userId,
        PageNumber: params?.pageNumber,
        PageSize: params?.pageSize
      }
    });
    return res.data;
  },

  async getByUser(userId: number): Promise<Notification[]> {
    const res = await apiClient.get<ApiResponse<Notification[]>>(`/api/Notification/by-user/${userId}`);
    return res.data.data;
  },

  async getById(id: number): Promise<Notification> {
    const res = await apiClient.get<ApiResponse<Notification>>(`/api/Notification/${id}`);
    return res.data.data;
  },

  async create(data: { userId: number; type: string; title: string; message: string; relatedId?: number }): Promise<void> {
    await apiClient.post("/api/Notification", data);
  },

  async markRead(id: number): Promise<void> {
    await apiClient.patch(`/api/Notification/${id}/read`);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/Notification/${id}`);
  },
};
