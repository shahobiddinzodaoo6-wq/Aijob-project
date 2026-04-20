import { apiClient } from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types/api";
import type { Job, JobApplication, JobCategory, JobSkill, JobSearchParams, Organization, OrganizationMember, ApplicationStatus } from "@/types/job";

export const jobService = {
  // Jobs
  async getJobs(): Promise<Job[]> {
    const res = await apiClient.get<ApiResponse<Job[]>>("/api/Job");
    return res.data.data;
  },

  async getJobsPaged(params?: JobSearchParams): Promise<PagedResponse<Job>> {
    const res = await apiClient.get<PagedResponse<Job>>("/api/Job/paged", { params });
    return res.data;
  },

  async searchJobs(params: JobSearchParams): Promise<Job[]> {
    const res = await apiClient.get<ApiResponse<Job[]>>("/api/Job/search", { params });
    return res.data.data;
  },

  async getJob(id: string): Promise<Job> {
    const res = await apiClient.get<ApiResponse<Job>>(`/api/Job/${id}`);
    return res.data.data;
  },

  async getMyJobs(): Promise<Job[]> {
    const res = await apiClient.get<ApiResponse<Job[]>>("/api/Job/mine");
    return res.data.data;
  },

  async getJobsByOrganization(orgId: string): Promise<Job[]> {
    const res = await apiClient.get<ApiResponse<Job[]>>(`/api/Job/by-organization/${orgId}`);
    return res.data.data;
  },

  async createJob(data: Partial<Job>): Promise<Job> {
    const res = await apiClient.post<ApiResponse<Job>>("/api/Job", data);
    return res.data.data;
  },

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    const res = await apiClient.put<ApiResponse<Job>>(`/api/Job/${id}`, data);
    return res.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/api/Job/${id}`);
  },

  // Job Skills
  async getJobSkills(jobId: string): Promise<JobSkill[]> {
    const res = await apiClient.get<ApiResponse<JobSkill[]>>(`/api/JobSkill/by-job/${jobId}`);
    return res.data.data;
  },

  async addJobSkill(data: { jobId: string; skillId: string }): Promise<JobSkill> {
    const res = await apiClient.post<ApiResponse<JobSkill>>("/api/JobSkill", data);
    return res.data.data;
  },

  async deleteJobSkill(id: string): Promise<void> {
    await apiClient.delete(`/api/JobSkill/${id}`);
  },

  // Job Applications
  async applyToJob(data: { jobId: number; userId: number; coverLetter?: string }): Promise<void> {
    await apiClient.post("/api/JobApplication", data);
  },

  async getApplication(id: number): Promise<JobApplication> {
    const res = await apiClient.get<ApiResponse<JobApplication>>(`/api/JobApplication/${id}`);
    return res.data.data;
  },

  async updateApplication(id: number, data: Partial<JobApplication>): Promise<void> {
    await apiClient.put(`/api/JobApplication/${id}`, data);
  },

  async deleteApplication(id: number): Promise<void> {
    await apiClient.delete(`/api/JobApplication/${id}`);
  },

  async getApplicationsPaged(params?: { jobId?: number; userId?: number; pageNumber?: number; pageSize?: number }): Promise<PagedResponse<JobApplication>> {
    const res = await apiClient.get<PagedResponse<JobApplication>>("/api/JobApplication/paged", { 
      params: {
        JobId: params?.jobId,
        UserId: params?.userId,
        PageNumber: params?.pageNumber,
        PageSize: params?.pageSize
      }
    });
    return res.data;
  },

  async getMyApplications(userId: number): Promise<JobApplication[]> {
    const res = await apiClient.get<ApiResponse<JobApplication[]>>(`/api/JobApplication/by-user/${userId}`);
    return res.data.data;
  },

  async getApplicationsByJob(jobId: number): Promise<JobApplication[]> {
    const res = await apiClient.get<ApiResponse<JobApplication[]>>(`/api/JobApplication/by-job/${jobId}`);
    return res.data.data;
  },

  async updateApplicationStatus(id: number, status: string): Promise<void> {
    await apiClient.patch(`/api/JobApplication/${id}/status`, status, {
      headers: { "Content-Type": "application/json" }
    });
  },

  // Categories
  async getCategories(): Promise<JobCategory[]> {
    const res = await apiClient.get<ApiResponse<JobCategory[]>>("/api/JobCategory");
    return res.data.data;
  },

  async getCategory(id: number): Promise<JobCategory> {
    const res = await apiClient.get<ApiResponse<JobCategory>>(`/api/JobCategory/${id}`);
    return res.data.data;
  },

  async createCategory(data: { name: string }): Promise<void> {
    await apiClient.post("/api/JobCategory", data);
  },

  async updateCategory(id: number, data: { id: number; name: string }): Promise<void> {
    await apiClient.put(`/api/JobCategory/${id}`, data);
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/JobCategory/${id}`);
  },

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    const res = await apiClient.get<ApiResponse<Organization[]>>("/api/Organization");
    return res.data.data;
  },

  async getOrganizationsPaged(params?: { name?: string; pageNumber?: number; pageSize?: number }): Promise<PagedResponse<Organization>> {
    const res = await apiClient.get<PagedResponse<Organization>>("/api/Organization/paged", { 
      params: {
        Name: params?.name,
        PageNumber: params?.pageNumber,
        PageSize: params?.pageSize
      }
    });
    return res.data;
  },

  async searchOrganizations(name: string): Promise<Organization[]> {
    const res = await apiClient.get<ApiResponse<Organization[]>>("/api/Organization/search", { params: { name } });
    return res.data.data;
  },

  async getOrganization(id: number): Promise<Organization> {
    const res = await apiClient.get<ApiResponse<Organization>>(`/api/Organization/${id}`);
    return res.data.data;
  },

  async getMyOrganizations(): Promise<Organization[]> {
    const res = await apiClient.get<ApiResponse<Organization[]>>("/api/Organization/mine");
    return res.data.data;
  },

  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    const res = await apiClient.post<ApiResponse<Organization>>("/api/Organization", data);
    return res.data.data;
  },

  async updateOrganization(id: number, data: Partial<Organization>): Promise<void> {
    await apiClient.put(`/api/Organization/${id}`, { ...data, id });
  },

  async deleteOrganization(id: number): Promise<void> {
    await apiClient.delete(`/api/Organization/${id}`);
  },

  // Organization Members
  async getOrgMembers(orgId: number): Promise<OrganizationMember[]> {
    const res = await apiClient.get<ApiResponse<OrganizationMember[]>>(`/api/OrganizationMember/by-organization/${orgId}`);
    return res.data.data;
  },

  async inviteMember(data: { organizationId: number; userId: number; role: string }): Promise<void> {
    await apiClient.post("/api/OrganizationMember/invite", data);
  },

  async respondToInvitation(invitationId: number, status: number): Promise<void> {
    await apiClient.put(`/api/OrganizationMember/invitation/${invitationId}/respond`, { status });
  },

  async removeMember(id: number): Promise<void> {
    await apiClient.delete(`/api/OrganizationMember/${id}`);
  },
};
