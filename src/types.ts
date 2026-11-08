export type NavigationPage = 
  | 'home' 
  | 'services' 
  | 'contact' 
  | 'apply' 
  | 'download' 
  | 'dashboard';

export type DashboardTab = 
  | 'overview' 
  | 'applications' 
  | 'access-codes' 
  | 'finance' 
  | 'staff' 
  | 'content-update' 
  | 'settings';

export type ApplicationStatus = 
  | 'Under Review' 
  | 'Documents Pending' 
  | 'Visa Approved' 
  | 'Interview Scheduled' 
  | 'Action Needed';

export interface StudentApplication {
  id: string;
  trackingId: string;
  applicantName: string;
  email: string;
  contactNumber: string;
  country: string;
  passportOrNin: string;
  intendedDegree: string;
  targetDestination: string;
  intakeTerm: string;
  status: ApplicationStatus;
  submittedAt: string;
  counselor: string;
  documentsCount: number;
}

export interface AccessCodeRecord {
  id: string;
  code: string;
  title: string;
  category: string;
  downloadsCount: number;
  maxDownloads: number;
  status: 'Active' | 'Expired';
  createdAt: string;
  expiresAt: string;
}

export interface ConsultancyService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  keyDeliverables: string[];
  intakeTimeline: string;
  deliverablesChecklist: string[];
  eligibleLevels: string;
  badgeHighlight?: string;
}

export interface GlobalOffice {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  isHeadquarters?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  assignedStudents: number;
  specialization: string;
  avatarUrl?: string;
}
