
import { UserAnalytics, AdminAnalytics } from './types';

export const MOCK_USER_ANALYTICS: UserAnalytics = {
  totalSops: 12,
  completionRate: 85,
  complianceAdherence: {
    nist: 92,
    iso: 88,
    gdpr: 95,
  },
  frequentIssues: [
    { issue: 'Phishing Attack', count: 5 },
    { issue: 'Malware Outbreak', count: 3 },
    { issue: 'Data Exfiltration', count: 2 },
    { issue: 'Unauthorized Access', count: 1 },
    { issue: 'DDoS Attack', count: 1 },
  ],
};

export const MOCK_ADMIN_ANALYTICS: AdminAnalytics = {
  ...MOCK_USER_ANALYTICS,
  totalSops: 152,
  completionRate: 78,
  unresolvedIssues: 14,
  evidenceStats: {
      total: 430,
      averagePerSop: 2.8,
  },
  teamPerformance: [
      { team: 'SOC Level 1', completionRate: 82 },
      { team: 'Incident Response', completionRate: 91 },
      { team: 'Forensics', completionRate: 75 },
      { team: 'Threat Intelligence', completionRate: 68 },
  ]
};
