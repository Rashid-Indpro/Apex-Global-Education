import { 
  StudentApplication, 
  AccessCodeRecord, 
  ConsultancyService, 
  GlobalOffice, 
  StaffMember 
} from '../types.ts';

export const ASSET_PATHS = {
  heroCampus: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop',
  consultation: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
  adminAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  staffFemale: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  staffMale: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
};

export const SERVICES_DATA: ConsultancyService[] = [
  {
    id: 'university-admission',
    title: 'University Admission & Course Match',
    tagline: 'Direct partnerships with 180+ accredited global institutions.',
    description: 'Data-driven profile evaluation matching your academic background, test scores, budget, and long-term residency aspirations with top-ranked global institutions.',
    keyDeliverables: [
      'Personalized institutional shortlist (Target, Reach, Safe)',
      'Direct fast-track CAS/I-20 application submissions',
      'Tuition waiver and departmental fellowship evaluation',
      'Conditional to unconditional offer letter conversion'
    ],
    deliverablesChecklist: [
      'Official Transcript & Degree Certificate evaluation',
      'Curriculum Vitae / Academic Resume optimization',
      'Letters of Recommendation (LOR) guidance',
      'Direct liaison with university international admission deans'
    ],
    intakeTimeline: '2 to 4 Weeks turnaround',
    eligibleLevels: 'Undergraduate, Postgraduate, PhD & Foundation'
  },
  {
    id: 'visa-guidance',
    title: 'Certified Student Visa Filing',
    tagline: '98.4% grant rate across UK, Canada, USA, and Australia.',
    description: 'End-to-end legal visa petition preparation. We inspect financial bank statements, source of funds declarations, genuine student intent (GS/GTE), and conduct mock embassy interviews.',
    keyDeliverables: [
      'Full immigration dossier verification by certified advisors',
      'Proof of funds (POF) and sponsorship affidavit audits',
      '1-on-1 embassy mock interview simulation with feedback',
      'Biometric appointment booking and expedited submission'
    ],
    deliverablesChecklist: [
      'Bank solvency and 28-day holding proof checks',
      'Statement of Purpose (SOP) visa justification check',
      'Medical examination and police clearance coordination',
      'Post-grant compliance and border clearance kit'
    ],
    intakeTimeline: '3 to 6 Weeks before departure',
    eligibleLevels: 'Tier 4/Student Visa, Study Permit, F-1, Subclass 500'
  },
  {
    id: 'settlement-support',
    title: 'Pre-Departure & Settlement Support',
    tagline: 'Smooth transition from airport arrival to campus housing.',
    description: 'We do not abandon you once the visa is granted. We assist with safe student accommodation, verified student banking, health insurance (OSHC/NHS), and airport pickup networks.',
    keyDeliverables: [
      'Verified PBSA (Purpose-Built Student Accommodation) booking',
      'International zero-fee bank account pre-activation',
      'Student SIM card and public transit pass procurement',
      'Local student alumni mentor introduction in destination city'
    ],
    deliverablesChecklist: [
      'Tenancy contract review and deposit safeguarding',
      'Flight booking guidance with student baggage concessions',
      'Comprehensive pre-departure briefing seminar',
      '24/7 arrival emergency dispatch hotline'
    ],
    intakeTimeline: 'Ongoing from visa grant to 30 days post-arrival',
    eligibleLevels: 'All traveling students and accompanied dependents'
  },
  {
    id: 'scholarship-advisory',
    title: 'Merit Scholarship & Financial Aid',
    tagline: 'Secured $4.2M+ in student fee reductions in 2025/2026.',
    description: 'Strategic identification and application for merit-based entrance scholarships, government bilateral grants, vice-chancellor honors, and external foundation bursaries.',
    keyDeliverables: [
      'Custom scholarship matrix with deadlines and criteria',
      'Tailored essay crafting for high-value competitive grants',
      'Early bird application fee discount vouchers',
      'Sponsorship interview coaching with past scholarship recipients'
    ],
    deliverablesChecklist: [
      'Financial need and academic distinction documentation',
      'Community impact and leadership evidence compilation',
      'Bursary renewal condition monitoring',
      'Direct institutional negotiation for partial fee remissions'
    ],
    intakeTimeline: '3 to 6 Months before intake commencement',
    eligibleLevels: 'Top 25% academic standing or verified leadership profile'
  },
  {
    id: 'sop-review',
    title: 'SOP, LOR & Portfolio Critique',
    tagline: 'Authentic narrative engineering that commands admission board respect.',
    description: 'Our senior editorial team reviews your Personal Statement, Statement of Purpose, and CV to ensure intellectual rigor, academic authenticity, and zero plagiarism.',
    keyDeliverables: [
      'Line-by-line editorial review by native academic editors',
      'Course-specific motivation and career trajectory alignment',
      'Strict adherence to institutional word and structure limits',
      'Turnitin similarity report and stylistic polish'
    ],
    deliverablesChecklist: [
      'Draft brainstorming and narrative structure mapping',
      'Overcoming academic gaps or career pivots narrative',
      'Professor / employer reference letter customization',
      'Final proofread and formatting for submission portals'
    ],
    intakeTimeline: '3 to 5 Business Days',
    eligibleLevels: 'All programs requiring competitive statement submissions'
  },
  {
    id: 'test-prep',
    title: 'Standardized English & Exam Advisory',
    tagline: 'Targeted preparation for IELTS, PTE Academic, TOEFL & GRE.',
    description: 'Diagnostic assessments and strategic testing plans. We identify which test maximizes your admission chances and advise on institutional test waiver criteria.',
    keyDeliverables: [
      'Official diagnostic band score evaluation',
      'Test waiver eligibility checks (Medium of Instruction - MOI)',
      'Targeted band 7.5+ IELTS / 68+ PTE strategy plan',
      'Discounted official exam voucher booking'
    ],
    deliverablesChecklist: [
      'Speaking module live mock practice evaluations',
      'Writing Task 1 & Task 2 structured template guidance',
      'Listening and reading time management drills',
      'Score reporting directly to institution code registries'
    ],
    intakeTimeline: '4 to 8 Weeks intensive',
    eligibleLevels: 'IELTS Academic, PTE Academic, TOEFL iBT, Duolingo, GRE'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    stepNumber: '01',
    title: 'Profile Assessment & Goal Mapping',
    description: 'Comprehensive review of your academic transcript, English proficiency, budget, and post-study career goals to curate your target country and institution pool.'
  },
  {
    stepNumber: '02',
    title: 'University & Program Curation',
    description: 'Our advisors submit certified applications directly to shortlisted partner universities, securing official offer letters and maximum applicable scholarship grants.'
  },
  {
    stepNumber: '03',
    title: 'Visa Filing & Financial Verification',
    description: 'Rigorous compilation of your immigration dossier, bank solvency proofs, genuine student intent declarations, and one-on-one embassy mock interviews.'
  },
  {
    stepNumber: '04',
    title: 'Pre-Departure & Settlement',
    description: 'End-to-end logistical support covering verified student housing, airport pickup coordination, foreign exchange, student SIM cards, and student alumni networks.'
  }
];

export const WHY_CHOOSE_US_PILLARS = [
  {
    title: 'Accredited Immigration Advisors',
    description: 'Our caseworkers hold verified credentials from the British Council, PIER Australia, and ICEF, guaranteeing strict compliance with latest border policies.'
  },
  {
    title: 'Direct University Representation',
    description: 'Official representation agreements with 180+ global universities across the UK, Canada, USA, and Australia ensure priority processing and rapid CAS/I-20 issuance.'
  },
  {
    title: '100% Transparent Zero-Hidden Fee Policy',
    description: 'No surprise levies or arbitrary agency markups. Clear agreements detailing all standard university application and embassy filing costs upfront.'
  },
  {
    title: 'End-to-End Post-Arrival Care',
    description: 'Our global support does not stop at passport stamping. We inspect accommodation contracts, arrange airport transfers, and help establish local banking.'
  }
];

export const GLOBAL_OFFICES: GlobalOffice[] = [
  {
    city: 'London',
    country: 'United Kingdom',
    address: '88 Leadenhall Street, City of London, EC3A 3BP',
    phone: '+44 20 7946 0912',
    email: 'uk.advisory@apexglobaledu.com',
    operatingHours: 'Mon - Fri: 09:00 - 18:00 GMT'
  },
  {
    city: 'Toronto',
    country: 'Canada',
    address: '200 Bay Street, Suite 1400, Financial District, Toronto, ON M5J 2J2',
    phone: '+1 416 555 0184',
    email: 'canada.team@apexglobaledu.com',
    operatingHours: 'Mon - Fri: 08:30 - 17:30 EST'
  },
  {
    city: 'Melbourne',
    country: 'Australia',
    address: '120 Collins Street, Level 22, Melbourne VIC 3000',
    phone: '+61 3 9650 4820',
    email: 'aus.intake@apexglobaledu.com',
    operatingHours: 'Mon - Fri: 09:00 - 18:00 AEST'
  },
  {
    city: 'Dhaka',
    country: 'South Asia Liaison HQ',
    address: 'Gulshan-2 Circle, Bay’s Galleria, 5th Floor, Dhaka 1212',
    phone: '+880 2 988 4501',
    email: 'dhaka.office@apexglobaledu.com',
    operatingHours: 'Sun - Thu: 09:30 - 18:30 BST',
    isHeadquarters: true
  }
];

export const ACCESS_CODES_SEED: AccessCodeRecord[] = [
  {
    id: 'ac-1',
    code: 'APEX-2026',
    title: '2026/2027 Full Intake Dossier & Visa Blueprint',
    category: 'Comprehensive Package',
    downloadsCount: 84,
    maxDownloads: 250,
    status: 'Active',
    createdAt: '2026-01-15',
    expiresAt: '2026-12-31'
  },
  {
    id: 'ac-2',
    code: 'VISA-PASS',
    title: 'Embassy Interview & Bank Solvency Checklist',
    category: 'Visa Protocol',
    downloadsCount: 112,
    maxDownloads: 200,
    status: 'Active',
    createdAt: '2026-02-01',
    expiresAt: '2026-08-31'
  },
  {
    id: 'ac-3',
    code: 'FALL-INTAKE',
    title: 'UK & Canada Autumn Priority Application Guide',
    category: 'Regional Intake',
    downloadsCount: 45,
    maxDownloads: 100,
    status: 'Active',
    createdAt: '2026-02-14',
    expiresAt: '2026-09-30'
  },
  {
    id: 'ac-4',
    code: 'SCHOLAR-UK',
    title: 'Commonwealth & Chevening Application Templates',
    category: 'Scholarships',
    downloadsCount: 63,
    maxDownloads: 100,
    status: 'Active',
    createdAt: '2026-02-20',
    expiresAt: '2026-11-30'
  }
];

export const INITIAL_APPLICATIONS: StudentApplication[] = [
  {
    id: 'app-01',
    trackingId: 'APX-2026-8941',
    applicantName: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@example.com',
    contactNumber: '+44 7700 900481',
    country: 'United Arab Emirates',
    passportOrNin: 'UAE-8829104',
    intendedDegree: 'MSc Advanced Computer Science',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    submittedAt: '2026-03-01',
    counselor: 'Sarah Jenkins',
    documentsCount: 8
  },
  {
    id: 'app-02',
    trackingId: 'APX-2026-8942',
    applicantName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    contactNumber: '+91 98201 54321',
    country: 'India',
    passportOrNin: 'Z4920194',
    intendedDegree: 'Bachelor of Software Engineering',
    targetDestination: 'Canada',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-02',
    counselor: 'David O’Connor',
    documentsCount: 6
  },
  {
    id: 'app-03',
    trackingId: 'APX-2026-8943',
    applicantName: 'Kofi Mensah',
    email: 'k.mensah@example.com',
    contactNumber: '+233 24 555 7890',
    country: 'Ghana',
    passportOrNin: 'GH-3390184',
    intendedDegree: 'Master of Public Health',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Spring 2027',
    status: 'Interview Scheduled',
    submittedAt: '2026-03-03',
    counselor: 'Sarah Jenkins',
    documentsCount: 7
  },
  {
    id: 'app-04',
    trackingId: 'APX-2026-8944',
    applicantName: 'Mei-Ling Chen',
    email: 'ml.chen@example.com',
    contactNumber: '+886 912 345 678',
    country: 'Taiwan',
    passportOrNin: 'TW-7729103',
    intendedDegree: 'Master of Data Science',
    targetDestination: 'Australia',
    intakeTerm: 'Summer 2026',
    status: 'Documents Pending',
    submittedAt: '2026-03-03',
    counselor: 'Elena Rostova',
    documentsCount: 4
  },
  {
    id: 'app-05',
    trackingId: 'APX-2026-8945',
    applicantName: 'Ibrahim Farooq',
    email: 'ibrahim.farooq@example.com',
    contactNumber: '+92 300 1234567',
    country: 'Pakistan',
    passportOrNin: 'PK-9910482',
    intendedDegree: 'BSc Mechanical Engineering',
    targetDestination: 'Germany',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-04',
    counselor: 'Marcus Weber',
    documentsCount: 6
  },
  {
    id: 'app-06',
    trackingId: 'APX-2026-8946',
    applicantName: 'Fatima Zahra',
    email: 'fatima.zahra@example.com',
    contactNumber: '+880 1711 002233',
    country: 'Bangladesh',
    passportOrNin: 'BGD-4019283',
    intendedDegree: 'Master of Business Administration (MBA)',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    submittedAt: '2026-03-04',
    counselor: 'Sarah Jenkins',
    documentsCount: 9
  },
  {
    id: 'app-07',
    trackingId: 'APX-2026-8947',
    applicantName: 'Lucas Silva',
    email: 'lucas.silva@example.com',
    contactNumber: '+55 11 98765 4321',
    country: 'Brazil',
    passportOrNin: 'BR-8192039',
    intendedDegree: 'BSc Architecture & Design',
    targetDestination: 'United States',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-05',
    counselor: 'David O’Connor',
    documentsCount: 5
  },
  {
    id: 'app-08',
    trackingId: 'APX-2026-8948',
    applicantName: 'Ngozi Eze',
    email: 'ngozi.eze@example.com',
    contactNumber: '+234 803 123 4567',
    country: 'Nigeria',
    passportOrNin: 'NGA-5501928',
    intendedDegree: 'MSc Renewable Energy Systems',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Documents Pending',
    submittedAt: '2026-03-05',
    counselor: 'Sarah Jenkins',
    documentsCount: 3
  },
  {
    id: 'app-09',
    trackingId: 'APX-2026-8949',
    applicantName: 'Min-Jun Park',
    email: 'minjun.park@example.com',
    contactNumber: '+82 10 2345 6789',
    country: 'South Korea',
    passportOrNin: 'KOR-1290384',
    intendedDegree: 'BSc Artificial Intelligence',
    targetDestination: 'United States',
    intakeTerm: 'Spring 2027',
    status: 'Interview Scheduled',
    submittedAt: '2026-03-05',
    counselor: 'David O’Connor',
    documentsCount: 7
  },
  {
    id: 'app-10',
    trackingId: 'APX-2026-8950',
    applicantName: 'Zainab Qasim',
    email: 'zainab.qasim@example.com',
    contactNumber: '+971 50 123 9876',
    country: 'United Arab Emirates',
    passportOrNin: 'UAE-7740192',
    intendedDegree: 'Master of Laws (LLM)',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-06',
    counselor: 'Sarah Jenkins',
    documentsCount: 6
  },
  {
    id: 'app-11',
    trackingId: 'APX-2026-8951',
    applicantName: 'Santiago Morales',
    email: 'santiago.m@example.com',
    contactNumber: '+57 300 987 6543',
    country: 'Colombia',
    passportOrNin: 'COL-6629104',
    intendedDegree: 'Master of International Business',
    targetDestination: 'Canada',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    submittedAt: '2026-03-06',
    counselor: 'Elena Rostova',
    documentsCount: 8
  },
  {
    id: 'app-12',
    trackingId: 'APX-2026-8952',
    applicantName: 'Amina Diallo',
    email: 'amina.diallo@example.com',
    contactNumber: '+221 77 123 4567',
    country: 'Senegal',
    passportOrNin: 'SEN-3301948',
    intendedDegree: 'BSc Economics & Finance',
    targetDestination: 'Canada',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-06',
    counselor: 'David O’Connor',
    documentsCount: 5
  },
  {
    id: 'app-13',
    trackingId: 'APX-2026-8953',
    applicantName: 'Kenji Takahashi',
    email: 'kenji.takahashi@example.com',
    contactNumber: '+81 90 8765 4321',
    country: 'Japan',
    passportOrNin: 'JPN-9940182',
    intendedDegree: 'MSc Biomedical Engineering',
    targetDestination: 'Germany',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-07',
    counselor: 'Marcus Weber',
    documentsCount: 7
  },
  {
    id: 'app-14',
    trackingId: 'APX-2026-8954',
    applicantName: 'Rohan Banerjee',
    email: 'rohan.b@example.com',
    contactNumber: '+91 99304 88712',
    country: 'India',
    passportOrNin: 'IND-8819034',
    intendedDegree: 'MSc Cyber Security',
    targetDestination: 'Ireland',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    submittedAt: '2026-03-07',
    counselor: 'Elena Rostova',
    documentsCount: 8
  },
  {
    id: 'app-15',
    trackingId: 'APX-2026-8955',
    applicantName: 'Chioma Nwosu',
    email: 'chioma.n@example.com',
    contactNumber: '+234 812 345 6789',
    country: 'Nigeria',
    passportOrNin: 'NGA-4401923',
    intendedDegree: 'Master of Nursing Practice',
    targetDestination: 'Australia',
    intakeTerm: 'Autumn 2026',
    status: 'Interview Scheduled',
    submittedAt: '2026-03-07',
    counselor: 'Sarah Jenkins',
    documentsCount: 6
  },
  {
    id: 'app-16',
    trackingId: 'APX-2026-8956',
    applicantName: 'Leila Hosseini',
    email: 'leila.h@example.com',
    contactNumber: '+98 912 345 6789',
    country: 'Iran',
    passportOrNin: 'IRN-7730194',
    intendedDegree: 'PhD Civil Engineering',
    targetDestination: 'Canada',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-07',
    counselor: 'David O’Connor',
    documentsCount: 9
  },
  {
    id: 'app-17',
    trackingId: 'APX-2026-8957',
    applicantName: 'Thabo Mokoena',
    email: 'thabo.mokoena@example.com',
    contactNumber: '+27 82 123 4567',
    country: 'South Africa',
    passportOrNin: 'ZAF-5510293',
    intendedDegree: 'BSc Financial Mathematics',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Documents Pending',
    submittedAt: '2026-03-07',
    counselor: 'Sarah Jenkins',
    documentsCount: 4
  },
  {
    id: 'app-18',
    trackingId: 'APX-2026-8958',
    applicantName: 'Elena Popova',
    email: 'elena.popova@example.com',
    contactNumber: '+380 50 123 4567',
    country: 'Ukraine',
    passportOrNin: 'UKR-8820194',
    intendedDegree: 'Master of International Relations',
    targetDestination: 'Germany',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    submittedAt: '2026-03-08',
    counselor: 'Marcus Weber',
    documentsCount: 8
  },
  {
    id: 'app-19',
    trackingId: 'APX-2026-8959',
    applicantName: 'Arjun Nambiar',
    email: 'arjun.n@example.com',
    contactNumber: '+91 97450 11223',
    country: 'India',
    passportOrNin: 'IND-9910283',
    intendedDegree: 'MSc Cloud Computing Architecture',
    targetDestination: 'Ireland',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-08',
    counselor: 'Elena Rostova',
    documentsCount: 6
  },
  {
    id: 'app-20',
    trackingId: 'APX-2026-8960',
    applicantName: 'Thi Huong Nguyen',
    email: 'huong.nguyen@example.com',
    contactNumber: '+84 90 123 4567',
    country: 'Vietnam',
    passportOrNin: 'VNM-4491029',
    intendedDegree: 'Bachelor of Hospitality & Tourism',
    targetDestination: 'Australia',
    intakeTerm: 'Autumn 2026',
    status: 'Interview Scheduled',
    submittedAt: '2026-03-08',
    counselor: 'David O’Connor',
    documentsCount: 7
  },
  {
    id: 'app-21',
    trackingId: 'APX-2026-8961',
    applicantName: 'Faisal Al-Otaibi',
    email: 'faisal.otaibi@example.com',
    contactNumber: '+966 50 987 6543',
    country: 'Saudi Arabia',
    passportOrNin: 'SAU-1192039',
    intendedDegree: 'BSc Petroleum Engineering',
    targetDestination: 'United States',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-08',
    counselor: 'Sarah Jenkins',
    documentsCount: 6
  },
  {
    id: 'app-22',
    trackingId: 'APX-2026-8962',
    applicantName: 'Sara Kovačević',
    email: 'sara.k@example.com',
    contactNumber: '+381 64 123 4567',
    country: 'Serbia',
    passportOrNin: 'SRB-6610293',
    intendedDegree: 'MSc Environmental Science',
    targetDestination: 'Canada',
    intakeTerm: 'Spring 2027',
    status: 'Documents Pending',
    submittedAt: '2026-03-08',
    counselor: 'Elena Rostova',
    documentsCount: 4
  },
  {
    id: 'app-23',
    trackingId: 'APX-2026-8963',
    applicantName: 'Devon Clarke',
    email: 'devon.clarke@example.com',
    contactNumber: '+1 876 555 1234',
    country: 'Jamaica',
    passportOrNin: 'JAM-2290194',
    intendedDegree: 'Master of Sports Management',
    targetDestination: 'United Kingdom',
    intakeTerm: 'Autumn 2026',
    status: 'Visa Approved',
    submittedAt: '2026-03-08',
    counselor: 'Sarah Jenkins',
    documentsCount: 8
  },
  {
    id: 'app-24',
    trackingId: 'APX-2026-8964',
    applicantName: 'Taslima Akter',
    email: 'taslima.akter@example.com',
    contactNumber: '+880 1819 445566',
    country: 'Bangladesh',
    passportOrNin: 'BGD-7729102',
    intendedDegree: 'BSc Biotechnology & Genetics',
    targetDestination: 'Canada',
    intakeTerm: 'Autumn 2026',
    status: 'Under Review',
    submittedAt: '2026-03-08',
    counselor: 'David O’Connor',
    documentsCount: 6
  }
];

export const STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Sarah Jenkins',
    role: 'Head of UK & Commonwealth Admissions',
    email: 's.jenkins@apexglobaledu.com',
    phone: '+44 20 7946 0914',
    assignedStudents: 9,
    specialization: 'UK Tier 4, Russell Group, Ireland',
  },
  {
    id: 'staff-2',
    name: 'David O’Connor',
    role: 'Senior North American Visa Strategist',
    email: 'd.oconnor@apexglobaledu.com',
    phone: '+1 416 555 0192',
    assignedStudents: 8,
    specialization: 'Canada SDS, USA F-1, Scholarship Grants',
  },
  {
    id: 'staff-3',
    name: 'Elena Rostova',
    role: 'Australia & New Zealand Case Manager',
    email: 'e.rostova@apexglobaledu.com',
    phone: '+61 3 9650 4825',
    assignedStudents: 4,
    specialization: 'Subclass 500, GTE Assessments, OSHC',
  },
  {
    id: 'staff-4',
    name: 'Marcus Weber',
    role: 'European & DAAD Admission Specialist',
    email: 'm.weber@apexglobaledu.com',
    phone: '+49 30 2345 6780',
    assignedStudents: 3,
    specialization: 'Germany Public Universities, APS, Blocked Accounts',
  }
];
