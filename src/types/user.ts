export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: string;
  createdAt: string;
  profile?: import("./user").UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio: string;
  headline: string;
  location: string;
  website: string;
  photoUrl: string;
  cvUrl: string;
  createdAt: string;
}

export interface UserExperience {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface UserEducation {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill: Skill;
}

export interface ProfileSkill {
  id: string;
  profileId: string;
  skillId: string;
  skill: Skill;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface ProfileLanguage {
  id: string;
  profileId: string;
  languageId: string;
  level: string;
  language: Language;
}

export interface Endorsement {
  id: string;
  profileSkillId: string;
  endorserId: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  authorId: string;
  recipientId: string;
  content: string;
  createdAt: string;
}
