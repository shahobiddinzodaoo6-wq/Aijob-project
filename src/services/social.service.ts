import { apiClient } from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types/api";
import type { Post, Comment, Connection, Conversation, Message, Notification } from "@/types/social";

export const socialService = {
  // Posts
  async getFeed(params?: { page?: number; pageSize?: number }): Promise<PagedResponse<Post>> {
    const res = await apiClient.get<PagedResponse<Post>>("/api/Post/feed", { params });
    return res.data;
  },

  async getPosts(): Promise<Post[]> {
    const res = await apiClient.get<ApiResponse<Post[]>>("/api/Post");
    return res.data.data;
  },

  async getPost(id: string): Promise<Post> {
    const res = await apiClient.get<ApiResponse<Post>>(`/api/Post/${id}`);
    return res.data.data;
  },

  async createPost(data: { content: string; imageUrl?: string }): Promise<Post> {
    const res = await apiClient.post<ApiResponse<Post>>("/api/Post", data);
    return res.data.data;
  },

  async updatePost(id: string, data: { content: string }): Promise<Post> {
    const res = await apiClient.put<ApiResponse<Post>>(`/api/Post/${id}`, data);
    return res.data.data;
  },

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/api/Post/${id}`);
  },

  async likePost(postId: string): Promise<void> {
    await apiClient.post(`/api/Post/${postId}/like`);
  },

  async repostPost(postId: string): Promise<void> {
    await apiClient.post(`/api/Post/${postId}/repost`);
  },

  async getComments(postId: string): Promise<Comment[]> {
    const res = await apiClient.get<ApiResponse<Comment[]>>(`/api/Post/${postId}/comments`);
    return res.data.data;
  },

  async addComment(postId: string, content: string): Promise<Comment> {
    const res = await apiClient.post<ApiResponse<Comment>>(`/api/Post/${postId}/comments`, { content });
    return res.data.data;
  },

  // Connections
  async sendConnection(addresseeId: number): Promise<void> {
    await apiClient.post(`/api/Connection/send/${addresseeId}`);
  },

  async sendConnectionByEmail(email: string): Promise<void> {
    await apiClient.post("/api/Connection/send-by-email", { email });
  },

  async respondToConnection(connectionId: number, status: string): Promise<void> {
    await apiClient.put(`/api/Connection/${connectionId}/respond`, { status });
  },

  async getConnection(id: number): Promise<Connection> {
    const res = await apiClient.get<ApiResponse<Connection>>(`/api/Connection/${id}`);
    return res.data.data;
  },

  async getMyConnections(): Promise<Connection[]> {
    const res = await apiClient.get<ApiResponse<Connection[]>>("/api/Connection/my");
    return res.data.data;
  },

  async getPendingConnections(): Promise<Connection[]> {
    const res = await apiClient.get<ApiResponse<Connection[]>>("/api/Connection/pending");
    return res.data.data;
  },

  async getAllConnections(): Promise<Connection[]> {
    const res = await apiClient.get<ApiResponse<Connection[]>>("/api/Connection/all");
    return res.data.data;
  },

  async deleteConnection(connectionId: number): Promise<void> {
    await apiClient.delete(`/api/Connection/${connectionId}`);
  },

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    const res = await apiClient.get<ApiResponse<Conversation[]>>("/api/Conversation");
    return res.data.data;
  },

  async getConversation(id: number): Promise<Conversation> {
    const res = await apiClient.get<ApiResponse<Conversation>>(`/api/Conversation/${id}`);
    return res.data.data;
  },

  async createConversation(otherUserId: number): Promise<Conversation> {
    const res = await apiClient.post<ApiResponse<Conversation>>("/api/Conversation", { otherUserId });
    return res.data.data;
  },

  async deleteConversation(id: number): Promise<void> {
    await apiClient.delete(`/api/Conversation/${id}`);
  },

  // Messages
  async getMessages(conversationId: number): Promise<Message[]> {
    const res = await apiClient.get<ApiResponse<Message[]>>(`/api/Message/by-conversation/${conversationId}`);
    return res.data.data;
  },

  async getMessage(id: number): Promise<Message> {
    const res = await apiClient.get<ApiResponse<Message>>(`/api/Message/${id}`);
    return res.data.data;
  },

  async sendMessage(data: { conversationId: number; content: string }): Promise<void> {
    await apiClient.post("/api/Message", data);
  },

  async deleteMessage(id: number): Promise<void> {
    await apiClient.delete(`/api/Message/${id}`);
  },
};
