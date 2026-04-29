export interface AiAskRequest {
  prompt: string;
}

export interface AiAnalyzeCvRequest {
  userId?: number;
  cvText?: string;
  cvFileUrl?: string;
  applyToProfile?: boolean;
  syncSkills?: boolean;
}

export interface AiAnalyzeCvResponse {
  fullName: string;
  firstName: string;
  lastName: string;
  professionalSummary: string;
  experienceYears: number;
  skills: string[];
  education: string[];
  recommendedRoles: string[];
  notes: string[];
  missingOrWeakSections: string[];
  howToImprove: string[];
  helpfulResources: string[];
  sourceTextPreview: string;
}





export interface AiSkillGapResponse {
  matchScore: number;
  fitSummary: string;
  strengths: string[];
  missingSkills: string[];
  nextSteps: string[];
}

export interface AiImproveJobRequest {
  jobId: number;
  title: string;
  description: string;
  location: string;
  experienceRequired: number;
  applyToJob: boolean;
}

export interface AiImproveJobResponse {
  improvedTitle: string;
  improvedDescription: string;
  suggestedSkills: string[];
  suggestedResponsibilities: string[];
  suggestedBenefits: string[];
}

export interface AiDraftRequest {
  userId: number;
  jobId: number;
  tone: string;
  extraContext?: string;
}

export interface AiDraftMessageRequest {
  userId?: number;
  jobId?: number;
  recipientName: string;
  purpose: string;
  tone: string;
  extraContext?: string;
}

export interface AiDraftResponse {
  subject: string;
  content: string;
}
