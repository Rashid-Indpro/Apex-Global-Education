import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { 
  Key, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  FileText, 
  X,
  User,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface ApplicationSummary {
  id: string;
  applicationNo: string;
  applicantName: string;
  country: string;
  targetDestination: string;
  status: string;
}

export const AccessCodesPage: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [codes, setCodes] = useState<AccessCodeRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Unused' | 'Used'>('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppNo, setSelectedAppNo] = useState('');
  const [codeNotes, setCodeNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newlyGeneratedCode, setNewlyGeneratedCode] = useState<AccessCodeRecord | null>(null);

  // Copy indicator state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchCodesAndApps = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const [codesRes, appsRes] = await Promise.all([
        fetch('/api/access-codes', { headers }),
        fetch('/api/applications', { headers }),
      ]);

      const codesJson = await codesRes.json();
      const appsJson = await appsRes.json();

      if (codesRes.ok && codesJson.success) {
        setCodes(codesJson.data);
      }
      if (appsRes.ok && appsJson.success) {
        setApplications(appsJson.data);
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not fetch access code records from database.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCodesAndApps();
  }, [token]);

  // Handle Code Copy
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `Access Code "${code}" is ready to share with applicant.`,
    });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  // Handle Generate Code Submission
  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppNo) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select an active student application file.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/access-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          applicationNo: selectedAppNo,
          notes: codeNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      setIsGenerating(false);

      if (res.ok && json.success) {
        setNewlyGeneratedCode(json.data);
        setCodes((prev) => [json.data, ...prev]);
        showToast({
          type: 'success',
          title: 'Access Code Issued',
          message: `Code ${json.data.code} successfully registered.`,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Generation Failed',
          message: json.error || 'Could not issue access code.',
        });
      }
    } catch {
      setIsGenerating(false);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Server failed to process code generation.',
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppNo('');
    setCodeNotes('');
    setNewlyGeneratedCode(null);
  };

  // Filtered Codes
  const filteredCodes = codes.filter((c) => {
    const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      c.code.toLowerCase().includes(q) ||
      c.applicationNo.toLowerCase().includes(q) ||
      c.applicantName.toLowerCase().includes(q) ||
      c.targetDestination.toLowerCase().includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const unusedCount = codes.filter((c) => c.status === 'Unused').length;
  const usedCount = codes.filter((c) => c.status === 'Used').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider mb-1">
            <Key className="w-3.5 h-3.5 text-sky-700" />
            <span>Document Authorization System</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Applicant Access Codes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue and track randomized 8-character codes granting single-use certified intake PDF downloads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCodesAndApps}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setNewlyGeneratedCode(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Generate Code
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Access Codes
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {codes.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Lifetime generated authorization keys
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active / Unused Codes</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-800">
            {unusedCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Available for student intake dossier redemption
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Redeemed / Used Codes
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-700">
            {usedCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Official PDF intake packages downloaded
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by code, application no, student, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Unused', 'Used'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                filterStatus === st
                  ? 'bg-sky-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'All' ? 'All Codes' : st === 'Unused' ? `Unused (${unusedCount})` : `Used (${usedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Access Codes Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Authorization Code</th>
                <th className="py-3 px-4">Candidate & File No</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Generated</th>
                <th className="py-3 px-4">Redeemed At</th>
                <th className="py-3 px-4">Notes / Officer</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-sky-600" />
                    <span>Loading authorization records from database...</span>
                  </td>
                </tr>
              ) : filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Key className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-600 text-sm">No access codes found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm ? 'Try adjusting your search criteria.' : 'Click "Generate Code" to issue the first authorization key.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCodes.map((item) => {
                  const isUnused = item.status === 'Unused';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Code with Monospace Styling & Copy */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sky-900 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded text-xs select-all">
                            {item.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.code)}
                            title="Copy code to clipboard"
                            className="p-1 text-slate-400 hover:text-sky-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            {copiedCode === item.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Candidate & File No */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">
                          {item.applicantName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {item.applicationNo}
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                        {item.targetDestination}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isUnused ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Unused (Ready)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <CheckCircle2 className="w-3 h-3 text-slate-500" />
                            <span>Used (Redeemed)</span>
                          </span>
                        )}
                      </td>

                      {/* Generated Date & By */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400">By {item.createdBy}</div>
                      </td>

                      {/* Redeemed Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {item.usedAt ? (
                          <div className="text-slate-800 font-medium">
                            {new Date(item.usedAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Pending student download
                          </span>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-4 max-w-xs truncate text-slate-500 text-[11px]" title={item.notes || ''}>
                        {item.notes || '—'}
                      </td>

                      {/* Quick Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/download?code=${encodeURIComponent(item.code)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-1 rounded transition-colors"
                          title="Open public Download page with this code"
                        >
                          <span>Test Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Access Code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Generate Intake Access Code
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Creates an encrypted alphanumeric code for candidate dossier download
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              
              {/* If code was just generated, show celebration & copy card */}
              {newlyGeneratedCode ? (
                <div className="space-y-4 py-2">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                        Authorization Key Created Successfully
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        Assigned to candidate: <strong>{newlyGeneratedCode.applicantName}</strong> ({newlyGeneratedCode.applicationNo})
                      </p>
                    </div>

                    <div className="p-3 bg-white border border-emerald-300 rounded font-mono text-xl font-bold tracking-widest text-sky-900 select-all">
                      {newlyGeneratedCode.code}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCopy(newlyGeneratedCode.code)}
                        leftIcon={copiedCode === newlyGeneratedCode.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      >
                        {copiedCode === newlyGeneratedCode.code ? 'Copied Code' : 'Copy Access Code'}
                      </Button>

                      <Link
                        to={`/download?code=${encodeURIComponent(newlyGeneratedCode.code)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors"
                      >
                        <span>Test Download</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                    Provide this code to the student. When redeemed on the <code>/download</code> portal, it dynamically streams a certified PDF and marks the code as Used.
                  </p>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCloseModal}
                    >
                      Done & Return to Table
                    </Button>
                  </div>
                </div>
              ) : (
                /* Generator Form */
                <form onSubmit={handleGenerateCode} className="space-y-4">
                  
                  {/* Select Application */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Link to Student Application <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedAppNo}
                      onChange={(e) => setSelectedAppNo(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-sky-700 focus:border-sky-700 bg-white"
                    >
                      <option value="">-- Choose registered applicant file --</option>
                      {applications.map((app) => (
                        <option key={app.id} value={app.applicationNo}>
                          {app.applicationNo} — {app.applicantName} ({app.country} → {app.targetDestination}) [{app.status}]
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-slate-400 block">
                      The generated code will bind specifically to this applicant&apos;s records and immigration profile.
                    </span>
                  </div>

                  {/* Selected applicant card preview */}
                  {selectedAppNo && (
                    (() => {
                      const matched = applications.find((a) => a.applicationNo === selectedAppNo);
                      if (!matched) return null;
                      return (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1 text-slate-600">
                          <div className="flex items-center justify-between font-semibold text-slate-900">
                            <span>{matched.applicantName}</span>
                            <span className="font-mono text-sky-800">{matched.applicationNo}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span>Origin: {matched.country}</span>
                            <span>•</span>
                            <span>Target: {matched.targetDestination}</span>
                            <span>•</span>
                            <span>Status: {matched.status}</span>
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {/* Notes input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Internal Purpose / Caseworker Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. CAS verification intake release for Visa Biometrics appointment"
                      value={codeNotes}
                      onChange={(e) => setCodeNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-sky-700 focus:border-sky-700"
                    />
                  </div>

                  <div className="p-3 bg-sky-50 border border-sky-100 rounded text-[11px] text-sky-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                    <span>
                      Access codes are single-use tokens in the format <code>APX-XXX-XXX</code>. Once the PDF is downloaded, the token is automatically retired to prevent unauthorized document circulation.
                    </span>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isGenerating}
                      disabled={!selectedAppNo}
                      leftIcon={<Key className="w-3.5 h-3.5" />}
                    >
                      Generate & Issue Code
                    </Button>
                  </div>

                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
