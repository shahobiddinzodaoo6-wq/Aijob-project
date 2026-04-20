import { apiClient } from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types/api";
import type { Job, JobApplication } from "@/types/job";
import type { User } from "@/types/user";

export interface JobMatch {
  job: Job;
  matchScore: number;
  matchSummary: string;
}

export interface ApplicantMatch {
  application: JobApplication;
  user: User;
  userProfileAbout: string;
  experienceYears: number;
  matchScore: number;
  matchSummary: string;
}

export interface RecommendedJobsParams {
  Title?: string;
  Location?: string;
  SalaryMin?: number;
  SalaryMax?: number;
  JobType?: string;
  ExperienceLevel?: string;
  OrganizationId?: string;
  CategoryId?: string;
  PageNumber?: number;
  PageSize?: number;
}

export const jobMatchingService = {
  async getRecommendedJobs(userId: string, params?: RecommendedJobsParams): Promise<PagedResponse<JobMatch>> {
    const res = await apiClient.get<PagedResponse<JobMatch>>(`/api/JobMatching/recommended-jobs/${userId}`, { params });
    return res.data;
  },

  async getRecommendedApplicants(jobId: string, params?: { PageNumber?: number; PageSize?: number }): Promise<PagedResponse<ApplicantMatch>> {
    const res = await apiClient.get<PagedResponse<ApplicantMatch>>(`/api/JobMatching/recommended-applicants/${jobId}`, { params });
    return res.data;
  },

  async getMatchExplanation(userId: string, jobId: string, useAi: boolean = true): Promise<string> {
    const res = await apiClient.get<ApiResponse<string>>(`/api/JobMatching/match-explanation/${userId}/${jobId}`, { params: { useAi } });
    return res.data.data;
  },
};
