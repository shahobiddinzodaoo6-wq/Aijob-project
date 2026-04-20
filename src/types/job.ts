export interface Job {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary?: string;
  jobType?: string;
  experienceLevel?: string;
  experienceRequired?: number;
  salaryMin?: number;
  salaryMax?: number;
  categoryId?: string;
  isActive: boolean;
  createdAt: string;
  organization?: Organization;
  skills?: JobSkill[];
}

export interface JobSkill {
  id: string;
  jobId: string;
  skillId: string;
  skill: { id: string; name: string };
}

export interface JobCategory {
  id: string;
  name: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  coverLetter: string;
  status: ApplicationStatus;
  createdAt: string;
  job?: Job;
  user?: import("./user").User;
}

export type ApplicationStatus = "Pending" | "Reviewed" | "Accepted" | "Rejected";

export interface Organization {
  id: string;
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  location: string;
  industry: string;
  ownerId: string;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  status: string;
  user?: import("./user").User;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  type?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}
