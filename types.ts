
export enum UserRole {
  User = 'User',
  Admin = 'Admin',
}

export type Page = 'assistant' | 'dashboard';

export enum ComplianceStatus {
  Compliant = 'Compliant',
  PartiallyCompliant = 'PartiallyCompliant',
  NotCompliant = 'NotCompliant',
  Pending = 'Pending',
}

export interface SopStepType {
  id: number;
  title: string;
  description: string;
  compliance: {
    nist: { status: ComplianceStatus; explanation: string };
    iso: { status: ComplianceStatus; explanation: string };
    gdpr: { status: ComplianceStatus; explanation: string };
  };
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  sop?: SopStepType[];
  isLoading?: boolean;
}

export interface UserAnalytics {
  totalSops: number;
  completionRate: number;
  complianceAdherence: {
    nist: number;
    iso: number;
    gdpr: number;
  };
  frequentIssues: { issue: string; count: number }[];
}

export interface AdminAnalytics extends UserAnalytics {
    unresolvedIssues: number;
    evidenceStats: { total: number; averagePerSop: number };
    teamPerformance: { team: string; completionRate: number }[];
}
