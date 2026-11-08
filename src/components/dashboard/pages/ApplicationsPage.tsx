import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Eye, 
  X, 
  Key, 
  UserCheck, 
  RefreshCw,
  Edit,
  Save,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';

export type ApplicationStatus =
  | 'New'
  | 'In Progress'
  | 'Visa Approved'
  | 'Completed'
  | 'Documents Pending';

interface ApplicationItem {
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

export const ApplicationsPage: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  // Edit State inside drawer
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('New');
  const [editCounselor, setEditCounselor] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [generatedCodeResult, setGeneratedCodeResult] = useState<string | null>(null);

  const counselorsList = [
    'Sarah Jenkins',
    'David O’Connor',
    'Elena Rostova',
    'Marcus Weber',
    'Unassigned',
  ];

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/applications', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setApplications(json.data);
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not load applications from server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  // Handle opening application inspector
  const handleOpenInspector = (app: ApplicationItem) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditCounselor(app.counselor);
    setEditNotes(app.notes || '');
    setGeneratedCodeResult(null);
  };

  // PUT /api/applications/:id
  const handleSaveAppUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: editStatus,
          counselor: editCounselor,
          notes: editNotes,
        }),
      });

      const json = await res.json();
      setIsUpdating(false);

      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Dossier Updated',
          message: `Application ${selectedApp.applicationNo} has been updated.`,
        });
        setSelectedApp(json.data);
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? json.data : a))
        );
      } else {
        showToast({
          type: 'error',
          title: 'Update Error',
          message: json.error || 'Failed to save application update.',
        });
      }
    } catch {
      setIsUpdating(false);
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Server failed to respond to update request.',
      });
    }
  };

  // POST /api/access-codes directly for this candidate
  const handleGenerateCodeForCandidate = async () => {
    if (!selectedApp) return;

    setIsGeneratingCode(true);
    try {
      const res = await fetch('/api/access-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          applicationNo: selectedApp.applicationNo,
          notes: `Generated via dossier inspector by ${user?.name || 'Staff'}`,
        }),
      });

      const json = await res.json();
      setIsGeneratingCode(false);

      if (res.ok && json.success) {
        setGeneratedCodeResult(json.data.code);
        showToast({
          type: 'success',
          title: 'Access Code Released',
          message: `Access Code "${json.data.code}" generated for ${selectedApp.applicantName}.`,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Generation Failed',
          message: json.error || 'Failed to generate code.',
        });
      }
    } catch {
      setIsGeneratingCode(false);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to reach access code generator service.',
      });
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.targetDestination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'New':
        return 'text-sky-800 bg-sky-50 border-sky-200';
      case 'In Progress':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Visa Approved':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Completed':
        return 'text-slate-800 bg-slate-100 border-slate-300';
      case 'Documents Pending':
        return 'text-rose-800 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
            <span>Core Operations Engine</span>
            <span aria-hidden="true">·</span>
            <span>Live Candidate Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Student Applications Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage incoming student profiles, assign caseworker counselors, update statuses, and issue verified intake access codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApplications}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Records
          </Button>
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4">
        
        {/* Search & Status Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="max-w-md w-full">
            <Input
              type="text"
              placeholder="Search by student name, Application No, email, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filter Statuses: "All", "New", "In Progress", "Visa Approved", "Completed" */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'New', 'In Progress', 'Visa Approved', 'Completed', 'Documents Pending'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Application No</th>
                <th className="py-3 px-4 font-semibold">Applicant Name</th>
                <th className="py-3 px-4 font-semibold">Country</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold">Date Lodged</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Counselor</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-600 mb-2" />
                    <span>Querying applications database...</span>
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No applications match the current search or status filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => handleOpenInspector(app)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {app.applicationNo}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{app.applicantName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{app.intendedDegree}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{app.country}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{app.passportOrNin}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{app.email}</div>
                      <div className="text-[11px] text-slate-400">{app.contactNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.counselor}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenInspector(app)}
                        className="text-sky-800 bg-sky-50 hover:bg-sky-100 border-sky-200"
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredApps.length} of {applications.length} total applications</span>
          <span className="font-mono">Central Database: REST API Active</span>
        </div>

      </div>

      {/* Application Detail & Management Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-sky-800">
                  {selectedApp.applicationNo}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {selectedApp.applicantName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.country} · Passport/NIN: {selectedApp.passportOrNin}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Readonly Summary Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase">Email:</span>
                <p className="text-slate-900 font-medium truncate">{selectedApp.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase">Phone:</span>
                <p className="text-slate-900 font-medium">{selectedApp.contactNumber}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase">Destination:</span>
                <p className="text-slate-900 font-medium">{selectedApp.targetDestination}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase">Intake:</span>
                <p className="text-slate-900 font-medium">{selectedApp.intakeTerm}</p>
              </div>
            </div>

            {/* Management Form (Status & Counselor Assignment) */}
            <form onSubmit={handleSaveAppUpdates} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Status Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Application Workflow Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer font-medium"
                  >
                    <option value="New">New (Initial Lodgment)</option>
                    <option value="In Progress">In Progress (Reviewing Documents)</option>
                    <option value="Visa Approved">Visa Approved (Embassy Granted)</option>
                    <option value="Completed">Completed (Pre-Departure Enrolled)</option>
                    <option value="Documents Pending">Documents Pending (Action Required)</option>
                  </select>
                </div>

                {/* Counselor Assignment Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assign Staff Counselor
                  </label>
                  <select
                    value={editCounselor}
                    onChange={(e) => setEditCounselor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer"
                  >
                    {counselorsList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Administrative Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Caseworker Notes & Directives
                </label>
                <textarea
                  rows={2}
                  placeholder="Record interview date, missing transcript checklist, or fee waivers..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUpdating}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Status & Assignment
                </Button>
              </div>
            </form>

            {/* Quick Action: Generate Student Access Code */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Official Access Code Release
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate a one-time code enabling this student to download their verified intake PDF on the public Download Form page.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleGenerateCodeForCandidate}
                  isLoading={isGeneratingCode}
                  leftIcon={<Key className="w-3.5 h-3.5 text-sky-700" />}
                >
                  Generate Access Code
                </Button>
              </div>

              {generatedCodeResult && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-150">
                  <div>
                    <span className="font-semibold block">New Code Generated:</span>
                    <span className="font-mono text-base font-bold text-emerald-800">{generatedCodeResult}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCodeResult);
                      showToast({ type: 'success', title: 'Code Copied', message: 'Access code copied to clipboard.' });
                    }}
                    className="px-3 py-1.5 bg-white border border-emerald-300 rounded text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <Button
                variant="dark"
                size="sm"
                onClick={() => setSelectedApp(null)}
              >
                Close Inspector
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
