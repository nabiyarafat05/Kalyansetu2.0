export type Language = 'en' | 'hi';

export type UserRole = 'student' | 'admin';

export interface StudentProfile {
  id: string;
  name: string;
  nameHi?: string;
  mobile: string;
  email: string;
  category: string; // e.g. ST (Scheduled Tribe), PVTG (Particularly Vulnerable Tribal Group)
  subTribe: string; // e.g. Santhal, Gond, Bhil, Birhor, Baiga
  state: string;
  district: string;
  institution: string;
  course: string;
  academicYear: string;
  attendancePercentage: number;
  familyAnnualIncome: number;
  academicScorePercentage: number;
  isDigiLockerLinked: boolean;
  isBankVerified: boolean;
  bankAccountMasked?: string;
  bankName?: string;
  ifscCode?: string;
  aadhaarSeeded: boolean;
}

export type SchemeCategory = 
  | 'all'
  | 'pre-matric'
  | 'post-matric'
  | 'overseas'
  | 'fellowship'
  | 'skill'
  | 'higher-education';

export interface Scheme {
  id: string;
  code: string;
  name: string;
  nameHi: string;
  category: SchemeCategory;
  categoryLabel: string;
  categoryLabelHi: string;
  ministry: string;
  ministryHi: string;
  amount: string;
  amountHi: string;
  numericAmount: number;
  deadline: string;
  deadlineHi: string;
  description: string;
  descriptionHi: string;
  eligibilityCriteria: {
    maxIncome: number;
    targetTribes: string[];
    minScore?: number;
    educationLevel: string;
    educationLevelHi: string;
  };
  benefits: string[];
  benefitsHi: string[];
  documentsRequired: string[];
  documentsRequiredHi: string[];
  autoMatchReason?: string;
  autoMatchReasonHi?: string;
}

export type ApplicationStage =
  | 'APPLICATION_SUBMITTED'
  | 'DOCUMENTS_VERIFIED'
  | 'INSTITUTE_NODAL_VERIFIED'
  | 'SANCTION_ORDER_GENERATED'
  | 'PFMS_PAYMENT_INITIATED'
  | 'CREDITED_TO_BENEFICIARY'
  | 'ACTION_REQUIRED'
  | 'REJECTED';

export interface ApplicationHistoryEntry {
  stage: ApplicationStage;
  title: string;
  titleHi: string;
  timestamp: string;
  description: string;
  descriptionHi: string;
  actor: string;
  transactionRef?: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  studentId: string;
  studentName: string;
  studentNameHi?: string;
  studentMobile: string;
  schemeId: string;
  schemeName: string;
  schemeNameHi: string;
  grantAmount: string;
  currentStage: ApplicationStage;
  submittedAt: string;
  lastUpdatedAt: string;
  daysStuck: number;
  history: ApplicationHistoryEntry[];
  pfmsDetails?: {
    sanctionOrderNo: string;
    sanctionDate: string;
    pfmsTxnId: string;
    utrNumber?: string;
    bankReference: string;
    disbursedAmount: number;
    accountMasked: string;
    status: 'PENDING' | 'INITIATED' | 'SUCCESS' | 'FAILED';
  };
  verifiedDocs: {
    aadhaarRef?: string;
    casteCertRef?: string;
    incomeCertRef?: string;
    marksheetRef?: string;
  };
  dropoutRiskScore: number; // 0 - 100
  dropoutRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  isInterventionRequired: boolean;
  notes?: string;
}

export interface DocAuditLog {
  timestamp: string;
  action: string;
  actionHi: string;
  actor: string;
  certificateUri?: string;
  signatureHash?: string;
  status: 'VERIFIED' | 'PULLED' | 'CONSENTED' | 'EXPIRED';
}

export interface DigiLockerDoc {
  id: string;
  docType: 'aadhaar' | 'caste_cert' | 'income_cert' | 'marksheet' | 'ration_card' | 'domicile';
  docTypeLabel: string;
  docTypeLabelHi: string;
  title: string;
  titleHi: string;
  issuer: string;
  issuerHi: string;
  docNumberMasked: string;
  uri: string;
  verifiedAt: string;
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  syncStatus: 'SYNCED' | 'QUEUED_OFFLINE' | 'SYNCING';
  isOfflineUpload?: boolean;
  offlineQueuedAt?: string;
  verificationMethod: string;
  metadata: Record<string, string>;
  auditTrail: DocAuditLog[];
}

export interface BankAccountVerification {
  accountHolderName: string;
  accountNumberMasked: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  pennyDropStatus: 'VERIFIED' | 'FAILED' | 'PENDING';
  aadhaarSeeded: boolean;
  npciStatus: 'ACTIVE' | 'INACTIVE';
  verificationDate: string;
}

export interface VoiceNoteRecord {
  id: string;
  title: string;
  durationSeconds: number;
  recordedAt: string;
  status: 'QUEUED_OFFLINE' | 'SYNCING' | 'SYNCED';
  transcribedText?: string;
  transcribedTextHi?: string;
  detectedIntent?: string;
  audioBlobUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  voiceUrl?: string;
  quickReplies?: string[];
  isOfflineNote?: boolean;
}

export interface AdminMetrics {
  totalDisbursedCrores: number;
  totalApplications: number;
  approvedCount: number;
  pendingPfmsCount: number;
  atRiskCount: number;
  averageDisbursementDays: number;
  dropoffRateByStage: {
    stage: string;
    stageHi: string;
    count: number;
    percentage: number;
  }[];
  districtDistribution: {
    district: string;
    state: string;
    students: number;
    disbursedLakhs: number;
  }[];
}

export interface NotificationSettings {
  pushEnabled: boolean;
  documentUpdates: boolean;
  paymentDisbursement: boolean;
  dropoutInterventions: boolean;
  smsFallback: boolean;
  soundEnabled: boolean;
}

export interface AppNotification {
  id: string;
  type: 'document' | 'payment' | 'risk' | 'system';
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
