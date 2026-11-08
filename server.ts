import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure public upload directory exists
const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Core Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded media statically
app.use('/uploads', express.static(uploadDir));

// 2. Multer Storage Engine for Media Uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Only JPEG, PNG, WebP, GIF, and SVG are accepted.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// 3. Database Store Types & Initial State
export type ApplicationStatus =
  | 'New'
  | 'In Progress'
  | 'Visa Approved'
  | 'Completed'
  | 'Documents Pending';

export interface StudentApplicationRecord {
  id: string;
  applicationNo: string;
  applicantName: string;
  email: string;
  contactNumber: string;
  country: string;
  passportOrNin: string;
  currentQualification: string;
  intendedDegree: string;
  targetDestination: string;
  intakeTerm: string;
  status: ApplicationStatus;
  counselor: string;
  submittedAt: string;
  updatedAt: string;
  notes?: string;
}

export interface AccessCodeRecord {
  id: string;
  code: string;
  applicationNo: string;
  applicantName: string;
  targetDestination: string;
  status: 'Used' | 'Unused';
  createdAt: string;
  usedAt: string | null;
  createdBy: string;
  notes?: string;
}

export type CurrencyCode = 'UGX' | 'USD' | 'KES' | 'GBP' | 'EUR';
export type TransactionType = 'Income' | 'Expense';

export interface FinanceTransactionRecord {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  applicantName?: string;
  applicantId?: string;
  receiptNo?: string;
  paymentMethod?: string;
  category?: string;
  recordedBy: string;
  createdAt: string;
}

export interface StaffMemberRecord {
  id: string;
  workerId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  designation: string;
  department: string;
  photoUrl: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  joiningDate: string;
  specialization?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContentCollection {
  homepage: {
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    statStudentsCount: string;
    statStudentsLabel: string;
    statVisaRate: string;
    statVisaLabel: string;
    statPartnersCount: string;
    statPartnersLabel: string;
    statScholarships: string;
    statScholarshipsLabel: string;
    advisoryTitle: string;
    advisorySubtitle: string;
    advisoryImage: string;
    caseStudyQuote: string;
    caseStudyAuthor: string;
  };
  announcements: {
    cycle: string;
    headline: string;
    body: string;
    isActive: boolean;
  };
}

const DEFAULT_SITE_CONTENT: SiteContentCollection = {
  homepage: {
    heroKicker: 'Certified Education Counsel · British Council & PIER Accredited · 180+ Global University Partners',
    heroTitle: 'Your Pathway to World-Class Higher Education.',
    heroSubtitle: 'We guide ambitious international students from university shortlisting and merit scholarship acquisition to student visa grant and pre-departure settlement.',
    heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop',
    ctaPrimaryText: 'Apply Now for 2026/2027',
    ctaSecondaryText: 'Download Intake Dossier',
    statStudentsCount: '12,500+',
    statStudentsLabel: 'International Students Placed',
    statVisaRate: '98.4%',
    statVisaLabel: 'First-Time Visa Approval Rate',
    statPartnersCount: '180+',
    statPartnersLabel: 'Direct University Partnerships',
    statScholarships: '$4.2M+',
    statScholarshipsLabel: 'Tuition Scholarships Secured in 2025/26',
    advisoryTitle: 'Why Choose Apex Global Education',
    advisorySubtitle: 'International education is a high-stakes investment. We replace generic guesswork with certified legal counselors, institutional tie-ups, and ethical accountability.',
    advisoryImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    caseStudyQuote: 'Apex Global resolved our complex 28-day UK bank solvency audit and helped me secure a £5,000 Vice-Chancellor Scholarship at the University of Birmingham. The visa arrived in 9 days.',
    caseStudyAuthor: 'Tariq Al-Mansoor · MSc Advanced Computer Science · Birmingham, UK',
  },
  announcements: {
    cycle: '2026/2027',
    headline: 'UK Autumn 2026 CAS Allocation Window Opened for Russell Group Institutions',
    body: 'Partner universities have commenced issuing Confirmation of Acceptance for Studies (CAS). Prospective applicants must ensure their 28-day bank maintenance certificates are dated within 31 days of application.',
    isActive: true,
  },
};

const SEED_APPLICATIONS: StudentApplicationRecord[] = [
  {
    id: 'app-01',
    applicationNo: 'APX-2026-8941',
    applicantName: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@example.com',
    contactNumber: '+44 7700 900481',
    country: 'United Arab Emirates',
    passportOrNin: 'UAE-8829104',
    currentQualification: 'BSc Computer Systems',
    intendedDegree: 'MSc Advanced Computer Science',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    counselor: 'Sarah Jenkins',
    submittedAt: '2026-03-01T10:14:00Z',
    updatedAt: '2026-03-05T14:22:00Z',
  },
  {
    id: 'app-02',
    applicationNo: 'APX-2026-8942',
    applicantName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    contactNumber: '+91 98201 54321',
    country: 'India',
    passportOrNin: 'Z4920194',
    currentQualification: 'Higher Secondary (CBSE)',
    intendedDegree: 'Bachelor of Software Engineering',
    targetDestination: 'Canada',
    intakeTerm: 'Autumn 2026',
    status: 'In Progress',
    counselor: 'David O’Connor',
    submittedAt: '2026-03-02T08:30:00Z',
    updatedAt: '2026-03-04T11:00:00Z',
  },
  {
    id: 'app-03',
    applicationNo: 'APX-2026-8943',
    applicantName: 'Kofi Mensah',
    email: 'k.mensah@example.com',
    contactNumber: '+233 24 555 7890',
    country: 'Ghana',
    passportOrNin: 'GH-3390184',
    currentQualification: 'Bachelor of Medicine & Surgery',
    intendedDegree: 'Master of Public Health',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Spring 2027',
    status: 'New',
    counselor: 'Sarah Jenkins',
    submittedAt: '2026-03-03T12:45:00Z',
    updatedAt: '2026-03-03T12:45:00Z',
  },
  {
    id: 'app-04',
    applicationNo: 'APX-2026-8944',
    applicantName: 'Mei-Ling Chen',
    email: 'ml.chen@example.com',
    contactNumber: '+886 912 345 678',
    country: 'Taiwan',
    passportOrNin: 'TW-7729103',
    currentQualification: 'BSc Applied Mathematics',
    intendedDegree: 'Master of Data Science',
    targetDestination: 'Australia',
    intakeTerm: 'Summer 2026',
    status: 'Completed',
    counselor: 'Elena Rostova',
    submittedAt: '2026-03-03T15:20:00Z',
    updatedAt: '2026-03-07T09:15:00Z',
  },
  {
    id: 'app-05',
    applicationNo: 'APX-2026-8945',
    applicantName: 'Ibrahim Farooq',
    email: 'ibrahim.farooq@example.com',
    contactNumber: '+92 300 1234567',
    country: 'Pakistan',
    passportOrNin: 'PK-9910482',
    currentQualification: 'FSc Pre-Engineering',
    intendedDegree: 'BSc Mechanical Engineering',
    targetDestination: 'Germany',
    intakeTerm: 'Autumn 2026',
    status: 'In Progress',
    counselor: 'Marcus Weber',
    submittedAt: '2026-03-04T11:10:00Z',
    updatedAt: '2026-03-06T16:00:00Z',
  },
  {
    id: 'app-06',
    applicationNo: 'APX-2026-8946',
    applicantName: 'Fatima Zahra',
    email: 'fatima.zahra@example.com',
    contactNumber: '+880 1711 002233',
    country: 'Bangladesh',
    passportOrNin: 'BGD-4019283',
    currentQualification: 'BBA Accounting',
    intendedDegree: 'Master of Business Administration (MBA)',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    counselor: 'Sarah Jenkins',
    submittedAt: '2026-03-04T13:00:00Z',
    updatedAt: '2026-03-08T10:30:00Z',
  },
  {
    id: 'app-07',
    applicationNo: 'APX-2026-8947',
    applicantName: 'Lucas Silva',
    email: 'lucas.silva@example.com',
    contactNumber: '+55 11 98765 4321',
    country: 'Brazil',
    passportOrNin: 'BR-8192039',
    currentQualification: 'Secondary Certificate',
    intendedDegree: 'BSc Architecture & Design',
    targetDestination: 'United States',
    intakeTerm: 'Autumn 2026',
    status: 'New',
    counselor: 'David O’Connor',
    submittedAt: '2026-03-05T09:25:00Z',
    updatedAt: '2026-03-05T09:25:00Z',
  },
  {
    id: 'app-08',
    applicationNo: 'APX-2026-8948',
    applicantName: 'Ngozi Eze',
    email: 'ngozi.eze@example.com',
    contactNumber: '+234 803 123 4567',
    country: 'Nigeria',
    passportOrNin: 'NGA-5501928',
    currentQualification: 'BEng Electrical Engineering',
    intendedDegree: 'MSc Renewable Energy Systems',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'In Progress',
    counselor: 'Sarah Jenkins',
    submittedAt: '2026-03-05T14:40:00Z',
    updatedAt: '2026-03-07T12:00:00Z',
  },
];

const SEED_ACCESS_CODES: AccessCodeRecord[] = [
  {
    id: 'code-01',
    code: 'APX-K92F-77',
    applicationNo: 'APX-2026-8941',
    applicantName: 'Tariq Al-Mansoor',
    targetDestination: 'United Kingdom',
    status: 'Unused',
    createdAt: '2026-03-05T10:00:00Z',
    usedAt: null,
    createdBy: 'Sarah Jenkins',
    notes: 'Official 2026 CAS intake verification release',
  },
  {
    id: 'code-02',
    code: 'APX-DEMO-01',
    applicationNo: 'APX-2026-8942',
    applicantName: 'Ananya Sharma',
    targetDestination: 'Canada',
    status: 'Unused',
    createdAt: '2026-03-06T11:30:00Z',
    usedAt: null,
    createdBy: 'David O’Connor',
    notes: 'Priority SDS study permit dossier code',
  },
  {
    id: 'code-03',
    code: 'APX-USED-99',
    applicationNo: 'APX-2026-8944',
    applicantName: 'Mei-Ling Chen',
    targetDestination: 'Australia',
    status: 'Used',
    createdAt: '2026-03-04T09:00:00Z',
    usedAt: '2026-03-07T14:15:00Z',
    createdBy: 'Elena Rostova',
    notes: 'Subclass 500 intake release (Redeemed)',
  },
];

const SEED_FINANCE_TRANSACTIONS: FinanceTransactionRecord[] = [
  {
    id: 'tx-01',
    type: 'Income',
    description: 'CAS Allocation & Priority Visa Filing Retainer',
    amount: 3200,
    currency: 'GBP',
    date: '2026-03-01',
    applicantName: 'Tariq Al-Mansoor',
    applicantId: 'APX-2026-8941',
    receiptNo: 'REC-2026-1001',
    paymentMethod: 'Bank Wire Transfer',
    category: 'Tuition & Visa Escrow',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-01T10:30:00Z',
  },
  {
    id: 'tx-02',
    type: 'Income',
    description: 'Canada SDS Study Permit Filing & Legal Verification',
    amount: 1850,
    currency: 'USD',
    date: '2026-03-02',
    applicantName: 'Ananya Sharma',
    applicantId: 'APX-2026-8942',
    receiptNo: 'REC-2026-1002',
    paymentMethod: 'Credit Card (Stripe)',
    category: 'Legal Representation',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-02T14:20:00Z',
  },
  {
    id: 'tx-03',
    type: 'Income',
    description: 'Nairobi Regional Desk University Placement Retainer',
    amount: 240000,
    currency: 'KES',
    date: '2026-03-03',
    applicantName: 'Kofi Mensah',
    applicantId: 'APX-2026-8943',
    receiptNo: 'REC-2026-1003',
    paymentMethod: 'M-Pesa Express',
    category: 'Admissions Retainer',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-03T11:15:00Z',
  },
  {
    id: 'tx-04',
    type: 'Income',
    description: 'Kampala Liaison Desk Direct Admission Deposit',
    amount: 6800000,
    currency: 'UGX',
    date: '2026-03-04',
    applicantName: 'Ngozi Eze',
    applicantId: 'APX-2026-8948',
    receiptNo: 'REC-2026-1004',
    paymentMethod: 'MTN Mobile Money',
    category: 'Institutional Deposit',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-04T09:45:00Z',
  },
  {
    id: 'tx-05',
    type: 'Income',
    description: 'German Public University DAAD & APS Processing Audit',
    amount: 1450,
    currency: 'EUR',
    date: '2026-03-05',
    applicantName: 'Ibrahim Farooq',
    applicantId: 'APX-2026-8945',
    receiptNo: 'REC-2026-1005',
    paymentMethod: 'SEPA Direct Wire',
    category: 'Document Audit',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-05T13:10:00Z',
  },
  {
    id: 'tx-06',
    type: 'Expense',
    description: 'British Council & PIER Annual Global Accreditation Licensing',
    amount: 1200,
    currency: 'GBP',
    date: '2026-03-02',
    category: 'Immigration & Accreditation',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-02T16:00:00Z',
  },
  {
    id: 'tx-07',
    type: 'Expense',
    description: 'Nairobi Office Dedicated Leased Line & Power Inverter',
    amount: 65000,
    currency: 'KES',
    date: '2026-03-04',
    category: 'Office & Utilities',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-04T12:00:00Z',
  },
  {
    id: 'tx-08',
    type: 'Expense',
    description: 'Kampala Regional Advisory Hub Floor Lease',
    amount: 2200000,
    currency: 'UGX',
    date: '2026-03-05',
    category: 'Office & Utilities',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-05T15:30:00Z',
  },
  {
    id: 'tx-09',
    type: 'Expense',
    description: 'Google Cloud High-Availability CRM Infrastructure',
    amount: 380,
    currency: 'USD',
    date: '2026-03-06',
    category: 'IT & Infrastructure',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-06T10:00:00Z',
  },
  {
    id: 'tx-10',
    type: 'Expense',
    description: 'ICEF Berlin Global Education Summit Delegate Passes',
    amount: 750,
    currency: 'EUR',
    date: '2026-03-06',
    category: 'Travel & Conferences',
    recordedBy: 'Dr. Arthur Vance (Super Admin)',
    createdAt: '2026-03-06T11:45:00Z',
  },
];

const SEED_STAFF_MEMBERS: StaffMemberRecord[] = [
  {
    id: 'stf-01',
    workerId: 'APX-STF-001',
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@apexglobaledu.com',
    contactNumber: '+44 20 7946 0914',
    designation: 'Head of UK & Commonwealth Admissions',
    department: 'Admissions & CAS Filing',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    status: 'Active',
    joiningDate: '2022-04-15',
    specialization: 'UK Tier 4, Russell Group, Ireland SDS',
    bio: 'Certified British Council Advisor #BC-UK-9041 with 8+ years leading university placement and visa representation.',
    createdAt: '2022-04-15T09:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'stf-02',
    workerId: 'APX-STF-002',
    fullName: 'David O’Connor',
    email: 'd.oconnor@apexglobaledu.com',
    contactNumber: '+1 416 555 0192',
    designation: 'Senior North American Visa Strategist',
    department: 'Immigration & Compliance',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
    status: 'Active',
    joiningDate: '2023-01-10',
    specialization: 'Canada SDS, USA F-1, Scholarship Grants',
    bio: 'Licensed education representative specializing in Canadian study permits and competitive North American scholarships.',
    createdAt: '2023-01-10T09:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z',
  },
  {
    id: 'stf-03',
    workerId: 'APX-STF-003',
    fullName: 'Elena Rostova',
    email: 'e.rostova@apexglobaledu.com',
    contactNumber: '+61 3 9650 4825',
    designation: 'Australia & New Zealand Case Manager',
    department: 'Pacific Regional Desk',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
    status: 'Active',
    joiningDate: '2023-08-01',
    specialization: 'Subclass 500, Genuine Student Intent, OSHC',
    bio: 'PIER Qualified Education Agent Counselor (QEAC M412) with expertise in Australian institutional admissions.',
    createdAt: '2023-08-01T09:00:00Z',
    updatedAt: '2026-03-03T14:00:00Z',
  },
  {
    id: 'stf-04',
    workerId: 'APX-STF-004',
    fullName: 'Marcus Weber',
    email: 'm.weber@apexglobaledu.com',
    contactNumber: '+49 30 2345 6780',
    designation: 'European & DAAD Admission Specialist',
    department: 'Continental Europe Desk',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    status: 'Active',
    joiningDate: '2024-02-15',
    specialization: 'Germany Public Unis, APS, Blocked Accounts',
    bio: 'Advises students across DAAD grants, German university APS certification, and Nordic zero-tuition pathways.',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2026-03-04T08:30:00Z',
  },
  {
    id: 'stf-05',
    workerId: 'APX-STF-005',
    fullName: 'Dr. Arthur Vance',
    email: 'a.vance@apexglobaledu.com',
    contactNumber: '+44 20 7946 0900',
    designation: 'Executive Director & Legal Counsel',
    department: 'Executive Governance',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    status: 'Active',
    joiningDate: '2021-01-05',
    specialization: 'Immigration Law, University Governance & Escrow',
    bio: 'Fellow of the Royal Society of Arts and Senior Immigration Solicitor overseeing global operational integrity.',
    createdAt: '2021-01-05T09:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
];

// Persistent File Store Handler
const DB_FILE_PATH = path.resolve(process.cwd(), '.app_database.json');

interface DatabaseSchema {
  siteContent: SiteContentCollection;
  applications: StudentApplicationRecord[];
  accessCodes: AccessCodeRecord[];
  financeTransactions: FinanceTransactionRecord[];
  staffMembers: StaffMemberRecord[];
}

let database: DatabaseSchema = {
  siteContent: { ...DEFAULT_SITE_CONTENT },
  applications: [...SEED_APPLICATIONS],
  accessCodes: [...SEED_ACCESS_CODES],
  financeTransactions: [...SEED_FINANCE_TRANSACTIONS],
  staffMembers: [...SEED_STAFF_MEMBERS],
};

try {
  if (fs.existsSync(DB_FILE_PATH)) {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    database = {
      siteContent: { ...DEFAULT_SITE_CONTENT, ...parsed.siteContent },
      applications: Array.isArray(parsed.applications) && parsed.applications.length > 0
        ? parsed.applications
        : [...SEED_APPLICATIONS],
      accessCodes: Array.isArray(parsed.accessCodes) && parsed.accessCodes.length > 0
        ? parsed.accessCodes
        : [...SEED_ACCESS_CODES],
      financeTransactions: Array.isArray(parsed.financeTransactions) && parsed.financeTransactions.length > 0
        ? parsed.financeTransactions
        : [...SEED_FINANCE_TRANSACTIONS],
      staffMembers: Array.isArray(parsed.staffMembers) && parsed.staffMembers.length > 0
        ? parsed.staffMembers
        : [...SEED_STAFF_MEMBERS],
    };

    // Auto-upgrade legacy local asset paths to online CDN image URLs
    if (database.siteContent?.homepage) {
      if (!database.siteContent.homepage.heroImage || database.siteContent.homepage.heroImage.startsWith('/src/assets')) {
        database.siteContent.homepage.heroImage = DEFAULT_SITE_CONTENT.homepage.heroImage;
      }
      if (!database.siteContent.homepage.advisoryImage || database.siteContent.homepage.advisoryImage.startsWith('/src/assets')) {
        database.siteContent.homepage.advisoryImage = DEFAULT_SITE_CONTENT.homepage.advisoryImage;
      }
    }
    if (Array.isArray(database.staffMembers)) {
      database.staffMembers.forEach((stf, idx) => {
        if (!stf.photoUrl || stf.photoUrl.startsWith('/src/assets')) {
          stf.photoUrl = SEED_STAFF_MEMBERS[idx]?.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop';
        }
      });
    }
  }
} catch (e) {
  console.warn('Initial database load error; using seed records.');
}

const persistDatabase = () => {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(database, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
};

// 4. Role Authorization Middlewares
const requireAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid Bearer authentication token.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const parts = token.split('.');
    if (parts.length < 2) throw new Error('Malformed token');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));

    if (payload.role !== 'Admin' && payload.role !== 'Super Admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Admin or Super Admin role required to perform this operation.',
      });
      return;
    }

    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Authentication token expired or malformed.',
    });
  }
};

// Strict Super Admin Authorization Middleware
const requireSuperAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid Bearer authentication token.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const parts = token.split('.');
    if (parts.length < 2) throw new Error('Malformed token');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));

    if (payload.role !== 'Super Admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Super Admin role strictly required to access this executive resource.',
      });
      return;
    }

    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Authentication token expired or malformed.',
    });
  }
};

// 5. APPLICATIONS API ENDPOINTS

// POST /api/applications - Public Student Submission
app.post('/api/applications', (req: Request, res: Response) => {
  const {
    fullName,
    country,
    passportOrNin,
    email,
    contactNumber,
    currentQualification,
    intendedDegree,
    targetDestination,
    intakeTerm,
    notes,
  } = req.body;

  // Validate core requirements
  if (!fullName?.trim() || !country?.trim() || !passportOrNin?.trim() || !email?.trim() || !contactNumber?.trim()) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: fullName, country, passportOrNin, email, and contactNumber are mandatory.',
    });
    return;
  }

  // Generate unique randomized Application No
  const applicationNo = `APX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newApplication: StudentApplicationRecord = {
    id: `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    applicationNo,
    applicantName: fullName.trim(),
    email: email.trim().toLowerCase(),
    contactNumber: contactNumber.trim(),
    country: country.trim(),
    passportOrNin: passportOrNin.trim().toUpperCase(),
    currentQualification: currentQualification?.trim() || 'Bachelor Degree',
    intendedDegree: intendedDegree?.trim() || 'Postgraduate Program',
    targetDestination: targetDestination?.trim() || 'United Kingdom',
    intakeTerm: intakeTerm?.trim() || 'Autumn 2026',
    status: 'New',
    counselor: 'Sarah Jenkins', // Assigned intake caseworker
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: notes?.trim() || '',
  };

  database.applications.unshift(newApplication);
  persistDatabase();

  res.status(201).json({
    success: true,
    message: 'Application lodged successfully. A senior education counselor will contact you within 24-48 hours.',
    applicationNo,
    data: newApplication,
  });
});

// GET /api/applications - Admin List with filtering and search
app.get('/api/applications', requireAdminAuth, (req: Request, res: Response) => {
  const { status, search, counselor } = req.query;

  let results = [...database.applications];

  if (status && status !== 'All') {
    results = results.filter((a) => a.status === status);
  }

  if (counselor) {
    results = results.filter((a) => a.counselor === counselor);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (a) =>
        a.applicationNo.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.targetDestination.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    data: results,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/applications/:id - Fetch single application record
app.get('/api/applications/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const match = database.applications.find((a) => a.id === id || a.applicationNo === id);

  if (!match) {
    res.status(404).json({ success: false, error: 'Application record not found.' });
    return;
  }

  res.json({ success: true, data: match });
});

// PUT /api/applications/:id - Update status, counselor assignment, or notes
app.put('/api/applications/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = database.applications.findIndex((a) => a.id === id || a.applicationNo === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Application record not found.' });
    return;
  }

  const existing = database.applications[index];
  const {
    status,
    counselor,
    notes,
    intendedDegree,
    targetDestination,
    contactNumber,
  } = req.body;

  const updated: StudentApplicationRecord = {
    ...existing,
    status: status || existing.status,
    counselor: counselor || existing.counselor,
    notes: notes !== undefined ? notes : existing.notes,
    intendedDegree: intendedDegree || existing.intendedDegree,
    targetDestination: targetDestination || existing.targetDestination,
    contactNumber: contactNumber || existing.contactNumber,
    updatedAt: new Date().toISOString(),
  };

  database.applications[index] = updated;
  persistDatabase();

  res.json({
    success: true,
    message: `Application ${updated.applicationNo} updated successfully.`,
    data: updated,
  });
});

// 6. ACCESS CODES API ENDPOINTS

// Generate randomized alphanumeric access code helper
const generateUniqueAccessCode = (): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = `APX-${randomPart.slice(0, 3)}-${randomPart.slice(3, 6)}`;
  return code;
};

// POST /api/access-codes - Generate unique access code linked to Application No (Protected)
app.post('/api/access-codes', requireAdminAuth, (req: Request, res: Response) => {
  const { applicationNo, notes } = req.body;

  if (!applicationNo?.trim()) {
    res.status(400).json({
      success: false,
      error: 'An active Application No is required to generate an authorization access code.',
    });
    return;
  }

  const linkedApp = database.applications.find(
    (a) => a.applicationNo.toUpperCase() === applicationNo.trim().toUpperCase()
  );

  if (!linkedApp) {
    res.status(404).json({
      success: false,
      error: `Application No "${applicationNo}" does not exist in the candidate registry.`,
    });
    return;
  }

  // Generate unique code
  let code = generateUniqueAccessCode();
  while (database.accessCodes.some((ac) => ac.code === code)) {
    code = generateUniqueAccessCode();
  }

  const staffName = (req as any).user?.name || 'Staff Officer';

  const newCodeEntry: AccessCodeRecord = {
    id: `code_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    code,
    applicationNo: linkedApp.applicationNo,
    applicantName: linkedApp.applicantName,
    targetDestination: linkedApp.targetDestination,
    status: 'Unused',
    createdAt: new Date().toISOString(),
    usedAt: null,
    createdBy: staffName,
    notes: notes || `Direct intake release for ${linkedApp.applicantName}`,
  };

  database.accessCodes.unshift(newCodeEntry);
  persistDatabase();

  res.status(201).json({
    success: true,
    message: `Access Code "${code}" generated for Application ${linkedApp.applicationNo}.`,
    data: newCodeEntry,
  });
});

// GET /api/access-codes - List all access codes (Protected)
app.get('/api/access-codes', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: database.accessCodes.length,
    data: database.accessCodes,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/access-codes/verify - Public verification check
app.post('/api/access-codes/verify', (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ success: false, error: 'Please enter a valid Access Code.' });
    return;
  }

  const normalized = code.trim().toUpperCase();
  const matched = database.accessCodes.find((ac) => ac.code.toUpperCase() === normalized);

  if (!matched) {
    res.status(404).json({
      success: false,
      error: 'Invalid Access Code. Please check the code received from your assigned counselor.',
    });
    return;
  }

  if (matched.status === 'Used') {
    res.status(400).json({
      success: false,
      isUsed: true,
      error: `This Access Code was already redeemed on ${new Date(matched.usedAt || '').toLocaleDateString()}. Each authorization code allows a single verified PDF release.`,
    });
    return;
  }

  // Code is valid and Unused
  res.json({
    success: true,
    valid: true,
    data: {
      code: matched.code,
      applicationNo: matched.applicationNo,
      applicantName: matched.applicantName,
      targetDestination: matched.targetDestination,
      status: matched.status,
      createdAt: matched.createdAt,
    },
  });
});

// GET /api/access-codes/:code/download-pdf - Dynamic PDF Generation & Mark as Used (Public)
app.get('/api/access-codes/:code/download-pdf', (req: Request, res: Response) => {
  const { code } = req.params;

  if (!code) {
    res.status(400).send('Access code is required.');
    return;
  }

  const normalized = code.trim().toUpperCase();
  const matchedIndex = database.accessCodes.findIndex((ac) => ac.code.toUpperCase() === normalized);

  if (matchedIndex === -1) {
    res.status(404).send('Error: Access Code not found in authorization database.');
    return;
  }

  const accessCodeEntry = database.accessCodes[matchedIndex];

  if (accessCodeEntry.status === 'Used') {
    res.status(400).send('Error: This Access Code has already been redeemed and marked as Used.');
    return;
  }

  // Find linked application
  const appRecord = database.applications.find(
    (a) => a.applicationNo === accessCodeEntry.applicationNo
  );

  if (!appRecord) {
    res.status(404).send('Error: Linked student application file was not found.');
    return;
  }

  // Mark code as Used and record redemption timestamp
  accessCodeEntry.status = 'Used';
  accessCodeEntry.usedAt = new Date().toISOString();
  database.accessCodes[matchedIndex] = accessCodeEntry;
  persistDatabase();

  // Generate Dynamic PDF Document with PDFKit
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  // Stream directly to response
  const filename = `Apex-Application-${appRecord.applicationNo}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  // 1. PDF Header & Branding
  doc
    .rect(0, 0, doc.page.width, 18)
    .fill('#0f172a'); // Slate 900 top strip

  doc.moveDown(1);

  // Title Box
  doc
    .fontSize(20)
    .fillColor('#0369a1') // Sky 700
    .font('Helvetica-Bold')
    .text('APEX GLOBAL EDUCATION ADVISORY', 40, 45);

  doc
    .fontSize(9)
    .fillColor('#64748b')
    .font('Helvetica')
    .text('Accredited International Student Placement & Visa Compliance Agency', 40, 70)
    .text('British Council #BC-UK-9041  |  PIER QEAC M412  |  ICEF Formal Partner #5419', 40, 83);

  doc
    .strokeColor('#e2e8f0')
    .lineWidth(1)
    .moveTo(40, 105)
    .lineTo(doc.page.width - 40, 105)
    .stroke();

  // 2. Document Certificate Title
  doc.moveDown(1.5);
  doc
    .fontSize(14)
    .fillColor('#0f172a')
    .font('Helvetica-Bold')
    .text('CERTIFIED STUDENT INTAKE DOSSIER & APPLICATION SUMMARY', 40, 120);

  // Metadata Grid
  const metaTop = 145;
  doc
    .fontSize(8)
    .fillColor('#64748b')
    .font('Helvetica-Bold')
    .text('APPLICATION NO:', 40, metaTop)
    .text('AUTHORIZATION ACCESS CODE:', 200, metaTop)
    .text('DATE GENERATED / RELEASED:', 380, metaTop);

  doc
    .fontSize(10)
    .fillColor('#0f172a')
    .font('Courier-Bold')
    .text(appRecord.applicationNo, 40, metaTop + 12)
    .text(accessCodeEntry.code, 200, metaTop + 12)
    .font('Helvetica')
    .text(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 380, metaTop + 12);

  // 3. Candidate Identification Section
  const sec1Top = 185;
  doc
    .rect(40, sec1Top, doc.page.width - 80, 20)
    .fill('#f1f5f9');

  doc
    .fontSize(9)
    .fillColor('#0f172a')
    .font('Helvetica-Bold')
    .text('SECTION 1: APPLICANT IDENTITY & CONTACT DETAILS', 48, sec1Top + 5);

  const sec1Content = sec1Top + 30;
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#64748b')
    .text('FULL LEGAL NAME:', 40, sec1Content)
    .text('COUNTRY OF CITIZENSHIP:', 260, sec1Content)
    .text('PASSPORT / NIN NUMBER:', 420, sec1Content);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#0f172a')
    .text(appRecord.applicantName, 40, sec1Content + 12)
    .text(appRecord.country, 260, sec1Content + 12)
    .font('Courier-Bold')
    .text(appRecord.passportOrNin, 420, sec1Content + 12);

  const sec1Row2 = sec1Content + 32;
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#64748b')
    .text('REGISTERED EMAIL ADDRESS:', 40, sec1Row2)
    .text('PRIMARY CONTACT TELEPHONE:', 260, sec1Row2)
    .text('CURRENT WORKFLOW STATUS:', 420, sec1Row2);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#0f172a')
    .text(appRecord.email, 40, sec1Row2 + 12)
    .text(appRecord.contactNumber, 260, sec1Row2 + 12)
    .font('Helvetica-Bold')
    .fillColor('#0369a1')
    .text(appRecord.status.toUpperCase(), 420, sec1Row2 + 12);

  // 4. Academic Program & Target Institution Section
  const sec2Top = sec1Row2 + 38;
  doc
    .rect(40, sec2Top, doc.page.width - 80, 20)
    .fill('#f1f5f9');

  doc
    .fontSize(9)
    .fillColor('#0f172a')
    .font('Helvetica-Bold')
    .text('SECTION 2: ACADEMIC PROFILE & PROGRAM TARGETS', 48, sec2Top + 5);

  const sec2Content = sec2Top + 28;
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#64748b')
    .text('CURRENT HIGHEST QUALIFICATION:', 40, sec2Content)
    .text('TARGET STUDY DESTINATION:', 240, sec2Content)
    .text('INTENDED DEGREE / MAJOR:', 420, sec2Content);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#0f172a')
    .text(appRecord.currentQualification, 40, sec2Content + 13, { width: 190 })
    .text(appRecord.targetDestination, 240, sec2Content + 13, { width: 170 })
    .text(appRecord.intendedDegree, 420, sec2Content + 13, { width: 135 });

  // Generous row 2 spacing to accommodate any multi-line degree titles above
  const sec2Row2 = sec2Content + 38;
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#64748b')
    .text('PREFERRED INTAKE SESSION:', 40, sec2Row2)
    .text('ASSIGNED CASEWORK COUNSELOR:', 240, sec2Row2)
    .text('SUBMISSION DATE:', 420, sec2Row2);

  const formattedSubmissionDate = new Date(appRecord.submittedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#0f172a')
    .text(appRecord.intakeTerm, 40, sec2Row2 + 13, { width: 190 })
    .text(appRecord.counselor, 240, sec2Row2 + 13, { width: 170 })
    .text(formattedSubmissionDate, 420, sec2Row2 + 13, { width: 135 });

  // 5. Compliance, Financial Solvency & Fiduciary Advisory
  const sec3Top = sec2Row2 + 38;
  doc
    .rect(40, sec3Top, doc.page.width - 80, 20)
    .fill('#f1f5f9');

  doc
    .fontSize(9)
    .fillColor('#0f172a')
    .font('Helvetica-Bold')
    .text('SECTION 3: IMMIGRATION & FINANCIAL COMPLIANCE CHECKLIST', 48, sec3Top + 5);

  doc
    .fontSize(8)
    .font('Helvetica')
    .fillColor('#334155')
    .text('1. Bank Solvency Requirement: Must maintain acceptable maintenance funds for at least 28 consecutive days prior to visa lodgment.', 45, sec3Top + 28)
    .text('2. Genuine Student Intent: All personal statements (SOP) are audited for academic originality and career intent consistency.', 45, sec3Top + 42)
    .text('3. Zero Agency Levy: Direct partner admissions carry zero agency consultation surcharges in compliance with our fiduciary charter.', 45, sec3Top + 56);

  // 6. Security Seal & Sign-off
  const sealTop = sec3Top + 82;
  doc
    .strokeColor('#cbd5e1')
    .lineWidth(1)
    .rect(40, sealTop, doc.page.width - 80, 65)
    .stroke();

  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#0f172a')
    .text('OFFICIAL APEX GLOBAL IMMIGRATION SEAL & VERIFICATION HASH', 50, sealTop + 10);

  doc
    .fontSize(7)
    .font('Courier')
    .fillColor('#64748b')
    .text(`SECURITY TOKEN: SHA-256: 4f88e19c3b8a_${appRecord.applicationNo}_AUTH_${accessCodeEntry.code}_SIGNED`, 50, sealTop + 25)
    .text(`AUTHORIZATION STATUS: VERIFIED & REDEEMED (ONE-TIME PDF RELEASE)`, 50, sealTop + 36)
    .text(`CENTRAL ADMISSIONS DESK: London · Toronto · Melbourne · Dhaka HQ | admissions@apexglobaledu.com`, 50, sealTop + 47);

  // 7. Official Document Footer Notice (Anchored at the bottom footer of Page 1)
  const footerY = 800;
  doc.page.margins.bottom = 0; // Prevent PDFKit auto-page-break on bottom footer text
  doc
    .strokeColor('#cbd5e1')
    .lineWidth(0.5)
    .moveTo(40, footerY - 8)
    .lineTo(doc.page.width - 40, footerY - 8)
    .stroke();

  doc
    .fontSize(7.5)
    .fillColor('#64748b')
    .font('Helvetica-Oblique')
    .text(
      'This certified PDF contains confidential applicant data and must be presented during embassy biometric filing upon request.',
      40,
      footerY,
      { align: 'center', width: doc.page.width - 80 }
    );

  doc.end();
});

// 7. Site Content Endpoints (from Phase 3)
app.get('/api/content', (_req: Request, res: Response) => {
  res.json({ success: true, data: database.siteContent, timestamp: new Date().toISOString() });
});

app.get('/api/content/:section', (req: Request, res: Response) => {
  const { section } = req.params;
  const content = (database.siteContent as any)[section];
  if (!content) {
    res.status(404).json({ success: false, error: `Section "${section}" was not found.` });
    return;
  }
  res.json({ success: true, section, data: content });
});

app.put('/api/content/:section', requireAdminAuth, (req: Request, res: Response) => {
  const { section } = req.params;
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    res.status(400).json({ success: false, error: 'Request body must be an object.' });
    return;
  }
  const currentSection = (database.siteContent as any)[section];
  if (!currentSection) {
    res.status(404).json({ success: false, error: `Section "${section}" was not found.` });
    return;
  }
  (database.siteContent as any)[section] = { ...currentSection, ...updates };
  persistDatabase();
  res.json({
    success: true,
    message: `Section "${section}" updated.`,
    data: (database.siteContent as any)[section],
  });
});

app.post('/api/content/:section/reset', requireAdminAuth, (req: Request, res: Response) => {
  const { section } = req.params;
  const defaultSection = (DEFAULT_SITE_CONTENT as any)[section];
  if (!defaultSection) {
    res.status(404).json({ success: false, error: `Default section "${section}" not found.` });
    return;
  }
  (database.siteContent as any)[section] = { ...defaultSection };
  persistDatabase();
  res.json({ success: true, message: `Section "${section}" reset to defaults.`, data: defaultSection });
});

app.post('/api/upload', requireAdminAuth, upload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No image file uploaded.' });
    return;
  }
  const publicUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    success: true,
    message: 'Media asset uploaded successfully.',
    url: publicUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

// =====================================================
// 8. PHASE 5: FINANCE TRACKER API (SUPER ADMIN RESTRICTED)
// =====================================================

// GET /api/finance/summary - Super Admin Net Position & Currency Balances
app.get('/api/finance/summary', requireSuperAdminAuth, (_req: Request, res: Response) => {
  const currencies: CurrencyCode[] = ['UGX', 'USD', 'KES', 'GBP', 'EUR'];
  
  const summaryByCurrency: Record<
    CurrencyCode,
    { totalIncome: number; totalExpenses: number; netPosition: number; count: number }
  > = {
    UGX: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    USD: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    KES: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    GBP: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
    EUR: { totalIncome: 0, totalExpenses: 0, netPosition: 0, count: 0 },
  };

  database.financeTransactions.forEach((tx) => {
    if (summaryByCurrency[tx.currency]) {
      summaryByCurrency[tx.currency].count += 1;
      if (tx.type === 'Income') {
        summaryByCurrency[tx.currency].totalIncome += tx.amount;
        summaryByCurrency[tx.currency].netPosition += tx.amount;
      } else if (tx.type === 'Expense') {
        summaryByCurrency[tx.currency].totalExpenses += tx.amount;
        summaryByCurrency[tx.currency].netPosition -= tx.amount;
      }
    }
  });

  res.json({
    success: true,
    currencies,
    summary: summaryByCurrency,
    totalTransactions: database.financeTransactions.length,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/finance/transactions - List transactions with filters
app.get('/api/finance/transactions', requireSuperAdminAuth, (req: Request, res: Response) => {
  const { type, currency, search } = req.query;

  let results = [...database.financeTransactions];

  if (type && (type === 'Income' || type === 'Expense')) {
    results = results.filter((tx) => tx.type === type);
  }

  if (currency && typeof currency === 'string' && currency !== 'All') {
    results = results.filter((tx) => tx.currency === currency);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        (tx.applicantName && tx.applicantName.toLowerCase().includes(q)) ||
        (tx.receiptNo && tx.receiptNo.toLowerCase().includes(q)) ||
        (tx.category && tx.category.toLowerCase().includes(q))
    );
  }

  // Sort by date descending
  results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({
    success: true,
    total: results.length,
    data: results,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/finance/expense - Add Expense (Super Admin only)
app.post('/api/finance/expense', requireSuperAdminAuth, (req: Request, res: Response) => {
  const { description, amount, currency, date, category } = req.body;

  if (!description?.trim() || typeof amount !== 'number' || amount <= 0 || !currency || !date) {
    res.status(400).json({
      success: false,
      error: 'Invalid expense data. Description, positive amount, valid currency (UGX, USD, KES, GBP, EUR), and date are required.',
    });
    return;
  }

  const validCurrencies: CurrencyCode[] = ['UGX', 'USD', 'KES', 'GBP', 'EUR'];
  if (!validCurrencies.includes(currency)) {
    res.status(400).json({
      success: false,
      error: `Invalid currency "${currency}". Allowed: UGX, USD, KES, GBP, EUR.`,
    });
    return;
  }

  const staffName = (req as any).user?.name || 'Super Admin';

  const newExpense: FinanceTransactionRecord = {
    id: `exp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: 'Expense',
    description: description.trim(),
    amount: Number(amount),
    currency,
    date,
    category: category?.trim() || 'General Operations',
    recordedBy: staffName,
    createdAt: new Date().toISOString(),
  };

  database.financeTransactions.unshift(newExpense);
  persistDatabase();

  res.status(201).json({
    success: true,
    message: 'Expense record successfully registered in fiscal ledger.',
    data: newExpense,
  });
});

// POST /api/finance/receipt - Generate Income Receipt (Super Admin only)
app.post('/api/finance/receipt', requireSuperAdminAuth, (req: Request, res: Response) => {
  const {
    applicantName,
    applicantId,
    amount,
    currency,
    description,
    date,
    paymentMethod,
    category,
  } = req.body;

  if (!applicantName?.trim() || typeof amount !== 'number' || amount <= 0 || !currency || !description?.trim() || !date) {
    res.status(400).json({
      success: false,
      error: 'Invalid receipt data. Applicant name, positive amount, currency, description, and date are required.',
    });
    return;
  }

  const validCurrencies: CurrencyCode[] = ['UGX', 'USD', 'KES', 'GBP', 'EUR'];
  if (!validCurrencies.includes(currency)) {
    res.status(400).json({
      success: false,
      error: `Invalid currency "${currency}". Allowed: UGX, USD, KES, GBP, EUR.`,
    });
    return;
  }

  // Generate unique receipt number (REC-2026-XXXX)
  const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const staffName = (req as any).user?.name || 'Super Admin';

  const newReceipt: FinanceTransactionRecord = {
    id: `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: 'Income',
    description: description.trim(),
    amount: Number(amount),
    currency,
    date,
    applicantName: applicantName.trim(),
    applicantId: applicantId?.trim() || undefined,
    receiptNo,
    paymentMethod: paymentMethod?.trim() || 'Bank Wire Transfer',
    category: category?.trim() || 'Tuition & Application Escrow',
    recordedBy: staffName,
    createdAt: new Date().toISOString(),
  };

  database.financeTransactions.unshift(newReceipt);
  persistDatabase();

  res.status(201).json({
    success: true,
    message: `Official fiscal receipt ${receiptNo} generated and ledger updated.`,
    receiptNo,
    data: newReceipt,
  });
});

// DELETE /api/finance/transactions/:id - Super Admin removal
app.delete('/api/finance/transactions/:id', requireSuperAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = database.financeTransactions.findIndex((tx) => tx.id === id || tx.receiptNo === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Transaction record not found.' });
    return;
  }

  const removed = database.financeTransactions.splice(index, 1)[0];
  persistDatabase();

  res.json({
    success: true,
    message: `Transaction ${removed.description} has been removed.`,
    data: removed,
  });
});

// =====================================================
// 9. PHASE 5: STAFF MANAGEMENT & QR VERIFICATION API
// =====================================================

// Helper to generate unique Worker ID: APX-STF-XXX
const generateUniqueWorkerId = (): string => {
  let count = database.staffMembers.length + 1;
  let workerId = `APX-STF-${String(count).padStart(3, '0')}`;
  while (database.staffMembers.some((s) => s.workerId.toUpperCase() === workerId.toUpperCase())) {
    count++;
    workerId = `APX-STF-${String(count).padStart(3, '0')}`;
  }
  return workerId;
};

// GET /api/staff - List all staff (Super Admin only)
app.get('/api/staff', requireSuperAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: database.staffMembers.length,
    data: database.staffMembers,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/staff - Register new employee (Super Admin only)
app.post('/api/staff', requireSuperAdminAuth, (req: Request, res: Response) => {
  const {
    fullName,
    email,
    contactNumber,
    designation,
    department,
    photoUrl,
    status,
    joiningDate,
    specialization,
    bio,
  } = req.body;

  if (!fullName?.trim() || !email?.trim() || !contactNumber?.trim() || !designation?.trim()) {
    res.status(400).json({
      success: false,
      error: 'Full Name, Email, Contact Number, and Designation are required fields.',
    });
    return;
  }

  const workerId = generateUniqueWorkerId();
  const defaultPhoto = '/src/assets/images/staff_counselor_female_1794140015435.jpg';

  const newStaff: StaffMemberRecord = {
    id: `stf_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    workerId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    contactNumber: contactNumber.trim(),
    designation: designation.trim(),
    department: department?.trim() || 'International Admissions',
    photoUrl: photoUrl?.trim() || defaultPhoto,
    status: status || 'Active',
    joiningDate: joiningDate || new Date().toISOString().split('T')[0],
    specialization: specialization?.trim() || 'General Student Counseling',
    bio: bio?.trim() || 'Accredited international education counselor at Apex Global Education Advisory.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  database.staffMembers.unshift(newStaff);
  persistDatabase();

  res.status(201).json({
    success: true,
    message: `Staff member registered successfully with Worker ID ${workerId}.`,
    workerId,
    data: newStaff,
  });
});

// PUT /api/staff/:id - Update staff details (Super Admin only)
app.put('/api/staff/:id', requireSuperAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = database.staffMembers.findIndex(
    (s) => s.id === id || s.workerId.toUpperCase() === id.toUpperCase()
  );

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Staff member record not found.' });
    return;
  }

  const existing = database.staffMembers[index];
  const {
    fullName,
    email,
    contactNumber,
    designation,
    department,
    photoUrl,
    status,
    joiningDate,
    specialization,
    bio,
  } = req.body;

  const updated: StaffMemberRecord = {
    ...existing,
    fullName: fullName?.trim() || existing.fullName,
    email: email?.trim().toLowerCase() || existing.email,
    contactNumber: contactNumber?.trim() || existing.contactNumber,
    designation: designation?.trim() || existing.designation,
    department: department?.trim() || existing.department,
    photoUrl: photoUrl?.trim() || existing.photoUrl,
    status: status || existing.status,
    joiningDate: joiningDate || existing.joiningDate,
    specialization: specialization !== undefined ? specialization.trim() : existing.specialization,
    bio: bio !== undefined ? bio.trim() : existing.bio,
    updatedAt: new Date().toISOString(),
  };

  database.staffMembers[index] = updated;
  persistDatabase();

  res.json({
    success: true,
    message: `Staff profile for ${updated.fullName} (${updated.workerId}) updated.`,
    data: updated,
  });
});

// DELETE /api/staff/:id - Delete staff member (Super Admin only)
app.delete('/api/staff/:id', requireSuperAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = database.staffMembers.findIndex(
    (s) => s.id === id || s.workerId.toUpperCase() === id.toUpperCase()
  );

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Staff member record not found.' });
    return;
  }

  const removed = database.staffMembers.splice(index, 1)[0];
  persistDatabase();

  res.json({
    success: true,
    message: `Staff member ${removed.fullName} (${removed.workerId}) removed from active directory.`,
    data: removed,
  });
});

// GET /api/staff/verify/:workerId - PUBLIC Verification Endpoint
app.get('/api/staff/verify/:workerId', (req: Request, res: Response) => {
  const { workerId } = req.params;

  if (!workerId?.trim()) {
    res.status(400).json({ success: false, verified: false, error: 'Worker ID is required.' });
    return;
  }

  const cleanId = workerId.trim().toUpperCase();
  const matched = database.staffMembers.find(
    (s) => s.workerId.toUpperCase() === cleanId || s.id.toUpperCase() === cleanId
  );

  if (!matched) {
    res.status(404).json({
      success: false,
      verified: false,
      error: `No accredited staff record found for Worker ID "${cleanId}". Please verify credentials with our central compliance desk.`,
    });
    return;
  }

  // Return public verification payload
  res.json({
    success: true,
    verified: true,
    data: {
      id: matched.id,
      workerId: matched.workerId,
      fullName: matched.fullName,
      email: matched.email,
      contactNumber: matched.contactNumber,
      designation: matched.designation,
      department: matched.department,
      photoUrl: matched.photoUrl,
      status: matched.status,
      joiningDate: matched.joiningDate,
      specialization: matched.specialization,
      bio: matched.bio,
      organization: 'Apex Global Education Advisory',
      accreditations: [
        'British Council Certified Agency #BC-UK-9041',
        'PIER Qualified Education Agent Counselor QEAC M412',
        'ICEF Formal Screened Partner #5419',
      ],
      centralOffice: 'London · Toronto · Melbourne · Dhaka HQ',
      verifiedAt: new Date().toISOString(),
    },
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Apex Global Full Lead & Application Management System',
    timestamp: new Date().toISOString(),
  });
});

// 8. Vite Integration / Static Hosting
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Full App Engine] Running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
