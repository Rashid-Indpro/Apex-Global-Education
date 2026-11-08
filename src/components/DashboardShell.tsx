import React, { useState } from 'react';
import { 
  StudentApplication, 
  DashboardTab, 
  ApplicationStatus, 
  AccessCodeRecord 
} from '../types.ts';
import { 
  ACCESS_CODES_SEED, 
  STAFF_MEMBERS 
} from '../data/mockData.ts';
import { Sidebar } from './dashboard/Sidebar.tsx';
import { Topbar } from './dashboard/Topbar.tsx';
import { Button } from './ui/Button.tsx';
import { Input } from './ui/Input.tsx';
import { 
  FileText, 
  Key, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  TrendingUp, 
  X, 
  Check 
} from 'lucide-react';

interface DashboardShellProps {
  applications: StudentApplication[];
  onUpdateApplicationStatus: (id: string, newStatus: ApplicationStatus) => void;
  onExitDashboard: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  applications,
  onUpdateApplicationStatus,
  onExitDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [selectedApplication, setSelectedApplication] = useState<StudentApplication | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal for creating Access Code
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [accessCodesList, setAccessCodesList] = useState<AccessCodeRecord[]>(ACCESS_CODES_SEED);
  const [newCodeData, setNewCodeData] = useState({
    code: 'INTAKE-2027',
    title: 'Spring 2027 Fast-Track Priority Dossier',
    category: 'Regional Intake',
    maxDownloads: 150
  });

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.targetDestination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case 'Visa Approved':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Under Review':
        return 'text-sky-800 bg-sky-50 border-sky-200';
      case 'Interview Scheduled':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Documents Pending':
      case 'Action Needed':
        return 'text-rose-800 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const handleCreateAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: AccessCodeRecord = {
      id: `ac-${Date.now()}`,
      code: newCodeData.code.trim().toUpperCase(),
      title: newCodeData.title,
      category: newCodeData.category,
      downloadsCount: 0,
      maxDownloads: newCodeData.maxDownloads,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: '2027-01-31'
    };
    setAccessCodesList([newEntry, ...accessCodesList]);
    setShowAccessCodeModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col lg:flex-row antialiased">
      
      {/* 1. MODULAR SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpenOnMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={onExitDashboard}
        totalApplicationsCount={applications.length}
        totalAccessCodesCount={accessCodesList.length}
      />

      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* MODULAR TOPBAR */}
        <Topbar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onLogout={onExitDashboard}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1 & 2: OVERVIEW & APPLICATIONS */}
          {(activeTab === 'overview' || activeTab === 'applications') && (
            <div className="space-y-8">
              
              {/* Header Title & Quick Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {activeTab === 'overview' ? 'Central Operations Overview' : 'Student Applications Ledger'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Live telemetry across student admissions, visa filings, and counselor assignments.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAccessCodeModal(true)}
                    leftIcon={<Key className="w-3.5 h-3.5 text-sky-700" />}
                  >
                    Generate Access Code
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('applications')}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    New Application File
                  </Button>
                </div>
              </div>

              {/* STAT WIDGETS (Tabular Figures) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Widget 1: Total Applications: 24 (Explicit requirement) */}
                <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Total Applications</span>
                    <FileText className="w-4 h-4 text-sky-700" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                      {applications.length}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +12% this cycle
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Active student dossiers across all 6 study destinations
                  </p>
                </div>

                {/* Widget 2: Pending Visa Approvals */}
                <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Pending Visa Approvals</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                      7
                    </span>
                    <span className="text-xs text-slate-500">
                      Embassy queues
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Awaiting biometric decision or interview call
                  </p>
                </div>

                {/* Widget 3: Active Access Codes */}
                <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Active Access Codes</span>
                    <Key className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                      142
                    </span>
                    <span className="text-xs font-semibold text-sky-700">
                      4 active releases
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    304 total student dossier downloads logged
                  </p>
                </div>

                {/* Widget 4: Visa Success Rate */}
                <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Visa Success Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                      98.4%
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      Audit clean
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Exceeding British Council & ICEF benchmark
                  </p>
                </div>

              </div>

              {/* APPLICATIONS TABLE SECTION */}
              <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden space-y-4">
                
                {/* Search & Filter Controls */}
                <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  
                  {/* Search Input using reusable Input */}
                  <div className="flex-1 max-w-md">
                    <Input
                      type="text"
                      placeholder="Search applicant name, tracking ID, country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<Search className="w-4 h-4" />}
                    />
                  </div>

                  {/* Status Filter Segmented Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['All', 'Under Review', 'Visa Approved', 'Interview Scheduled', 'Documents Pending'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                          statusFilter === status
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Tracking ID</th>
                        <th className="py-3 px-4 font-semibold">Applicant Name</th>
                        <th className="py-3 px-4 font-semibold">Country</th>
                        <th className="py-3 px-4 font-semibold">Target Course & Country</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Counselor</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-500">
                            No applications match the active filters or search terms.
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                              {app.trackingId}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">
                              <div>{app.applicantName}</div>
                              <div className="text-[11px] text-slate-400 font-normal">{app.email}</div>
                            </td>
                            <td className="py-3 px-4">
                              {app.country}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-800">{app.intendedDegree}</div>
                              <div className="text-[11px] text-slate-500">{app.targetDestination} · {app.intakeTerm}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadgeStyle(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {app.counselor}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApplication(app)}
                                className="text-sky-800 bg-sky-50 hover:bg-sky-100 border-sky-200"
                              >
                                View File
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span>Showing {filteredApps.length} of {applications.length} applications</span>
                  <span className="font-mono">Central Registry: v2026.03</span>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: ACCESS CODES MANAGEMENT */}
          {activeTab === 'access-codes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Access Code Release Management
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Generate and revoke authorization keys that grant student candidates access to official intake dossiers.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAccessCodeModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Generate New Access Code
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accessCodesList.map((ac) => (
                  <div
                    key={ac.id}
                    className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xl font-bold font-mono text-sky-900 tracking-wider">
                          {ac.code}
                        </div>
                        <h2 className="text-sm font-semibold text-slate-800 mt-0.5">
                          {ac.title}
                        </h2>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        ac.status === 'Active' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-100 border-slate-200'
                      }`}>
                        {ac.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded text-xs text-slate-600">
                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-400">Category</span>
                        <span className="font-medium text-slate-900">{ac.category}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-400">Downloads</span>
                        <span className="font-mono font-medium text-slate-900 tabular-nums">
                          {ac.downloadsCount} / {ac.maxDownloads}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-400">Valid Until</span>
                        <span className="font-mono text-slate-700">{ac.expiresAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400">Created {ac.createdAt}</span>
                      <button
                        onClick={() => {
                          const updated = accessCodesList.map(item => 
                            item.id === ac.id ? { ...item, status: (item.status === 'Active' ? 'Expired' : 'Active') as 'Active' | 'Expired' } : item
                          );
                          setAccessCodesList(updated);
                        }}
                        className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        {ac.status === 'Active' ? 'Deactivate Code' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE & LEDGER */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Financial Records & University Deposit Ledger
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Reconciliation of university tuition deposits, visa application fees, and commission statements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded p-5 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Gross Tuitions Processed</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                    £1,842,500
                  </div>
                  <p className="text-xs text-slate-500 mt-1">2025/2026 Academic year to date</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-5 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Institutional Commissions</span>
                  <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
                    £248,600
                  </div>
                  <p className="text-xs text-slate-500 mt-1">100% direct from partner universities</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-5 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Student Agency Service Fees</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                    £0.00
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Zero-charge policy strictly enforced</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded shadow-xs p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  Recent Tuition Deposit Confirmation Records
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Institution</th>
                        <th className="py-2.5 px-3">Deposit Amount</th>
                        <th className="py-2.5 px-3">Receipt Ref</th>
                        <th className="py-2.5 px-3">Verified Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-3 font-semibold text-slate-900">Tariq Al-Mansoor</td>
                        <td className="py-3 px-3">University of Birmingham</td>
                        <td className="py-3 px-3 font-mono font-medium">£3,000.00</td>
                        <td className="py-3 px-3 font-mono text-slate-500">UB-DEP-9410</td>
                        <td className="py-3 px-3 text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Reconciled
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold text-slate-900">Fatima Zahra</td>
                        <td className="py-3 px-3">Queen Mary University of London</td>
                        <td className="py-3 px-3 font-mono font-medium">£2,500.00</td>
                        <td className="py-3 px-3 font-mono text-slate-500">QM-DEP-8831</td>
                        <td className="py-3 px-3 text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Reconciled
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold text-slate-900">Santiago Morales</td>
                        <td className="py-3 px-3">Conestoga College (Canada)</td>
                        <td className="py-3 px-3 font-mono font-medium">CAD $1,500.00</td>
                        <td className="py-3 px-3 font-mono text-slate-500">CC-REC-1029</td>
                        <td className="py-3 px-3 text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Reconciled
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STAFF & COUNSELORS */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Credentialed Advisory Staff
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Accredited counselors holding British Council, PIER, and ICEF agent licenses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STAFF_MEMBERS.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          {staff.name}
                        </h2>
                        <p className="text-xs font-semibold text-sky-800 mt-0.5">
                          {staff.role}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {staff.assignedStudents} Active Cases
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-500">Specialization:</span>{' '}
                        <span className="text-slate-900">{staff.specialization}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Direct Contact:</span>{' '}
                        <span className="text-slate-800">{staff.email} · {staff.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONTENT UPDATE */}
          {activeTab === 'content-update' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Public Website Content Updates
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Broadcast university intake notices, update application quotas, or publish scholarship news.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4 max-w-2xl">
                <h2 className="text-base font-bold text-slate-900">
                  Publish Urgent Intake Announcement
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    defaultValue="UK September 2026 CAS Issuance Window Opened for Russell Group"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Notice Body Prose
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Partner universities have commenced issuing Confirmation of Acceptance for Studies (CAS). Prospective applicants must ensure their 28-day bank maintenance certificates are dated within 31 days of application."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
                <Button
                  variant="dark"
                  size="sm"
                  type="button"
                  onClick={() => alert('Announcement saved to public notification ticker.')}
                >
                  Save & Publish Announcement
                </Button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* APPLICANT DETAIL MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-150">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-sky-800">
                  {selectedApplication.trackingId}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {selectedApplication.applicantName}
                </h3>
                <p className="text-xs text-slate-500">
                  Citizenship: {selectedApplication.country} · Passport/NIN: {selectedApplication.passportOrNin}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase">Email:</span>
                <p className="text-slate-900 font-medium">{selectedApplication.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase">Phone:</span>
                <p className="text-slate-900 font-medium">{selectedApplication.contactNumber}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase">Target Destination:</span>
                <p className="text-slate-900 font-medium">{selectedApplication.targetDestination}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase">Intended Program:</span>
                <p className="text-slate-900 font-medium">{selectedApplication.intendedDegree}</p>
              </div>
            </div>

            {/* Quick Status Changer */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Update Application Workflow Status
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {(['Under Review', 'Interview Scheduled', 'Visa Approved', 'Documents Pending'] as ApplicationStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateApplicationStatus(selectedApplication.id, st);
                      setSelectedApplication({ ...selectedApplication, status: st });
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                      selectedApplication.status === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Liaison: {selectedApplication.counselor}
              </span>
              <Button
                variant="dark"
                size="sm"
                onClick={() => setSelectedApplication(null)}
              >
                Save & Close
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE ACCESS CODE MODAL */}
      {showAccessCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Generate Student Access Code
              </h3>
              <button
                onClick={() => setShowAccessCodeModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccessCode} className="space-y-4">
              <Input
                label="Access Code Key"
                type="text"
                required
                value={newCodeData.code}
                onChange={(e) => setNewCodeData({ ...newCodeData, code: e.target.value.toUpperCase() })}
                className="font-mono uppercase"
              />

              <Input
                label="Release Title"
                type="text"
                required
                value={newCodeData.title}
                onChange={(e) => setNewCodeData({ ...newCodeData, title: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCodeData.category}
                    onChange={(e) => setNewCodeData({ ...newCodeData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
                  >
                    <option value="Regional Intake">Regional Intake</option>
                    <option value="Visa Protocol">Visa Protocol</option>
                    <option value="Scholarships">Scholarships</option>
                  </select>
                </div>
                <div>
                  <Input
                    label="Download Quota"
                    type="number"
                    value={newCodeData.maxDownloads}
                    onChange={(e) => setNewCodeData({ ...newCodeData, maxDownloads: parseInt(e.target.value) || 100 })}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setShowAccessCodeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                >
                  Create Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
