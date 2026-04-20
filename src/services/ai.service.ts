import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  AiAnalyzeCvRequest,
  AiAnalyzeCvResponse,
  AiAskRequest,
  AiDraftRequest,
  AiDraftMessageRequest,
  AiDraftResponse,
  AiImproveJobRequest,
  AiImproveJobResponse,
  AiSkillGapResponse,
} from "@/types/ai";

export const aiService = {
  async ask(prompt: string): Promise<string> {
    const res = await apiClient.post<ApiResponse<string>>("/api/Ai/ask", {
      prompt,
    } as AiAskRequest);
    return res.data.data;
  },

  async analyzeCv(data: AiAnalyzeCvRequest): Promise<AiAnalyzeCvResponse> {
    const res = await apiClient.post<ApiResponse<AiAnalyzeCvResponse>>(
      "/api/Ai/analyze-cv",
      data
    );
    return res.data.data;
  },

  async getSkillGap(userId: number, jobId: number): Promise<AiSkillGapResponse> {
    const res = await apiClient.get<ApiResponse<AiSkillGapResponse>>(
      `/api/Ai/skill-gap/${userId}/${jobId}`
    );
    return res.data.data;
  },

  async improveJob(data: AiImproveJobRequest): Promise<AiImproveJobResponse> {
    const res = await apiClient.post<ApiResponse<AiImproveJobResponse>>(
      "/api/Ai/improve-job",
      data
    );
    return res.data.data;
  },

  async draftCoverLetter(data: AiDraftRequest): Promise<AiDraftResponse> {
    const res = await apiClient.post<ApiResponse<AiDraftResponse>>(
      "/api/Ai/draft-cover-letter",
      data
    );
    return res.data.data;
  },

  async draftMessage(data: AiDraftMessageRequest): Promise<AiDraftResponse> {
    const res = await apiClient.post<ApiResponse<AiDraftResponse>>(
      "/api/Ai/draft-message",
      data
    );
    return res.data.data;
  },
};
