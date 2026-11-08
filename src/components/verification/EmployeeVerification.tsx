import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Award, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Search, 
  RefreshCw, 
  ArrowLeft,
  FileCheck2,
  Lock,
  ExternalLink,
  Share2
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';

interface VerifiedStaffPayload {
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
  organization: string;
  accreditations: string[];
  centralOffice: string;
  verifiedAt: string;
}

export const EmployeeVerification: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  
  const [data, setData] = useState<VerifiedStaffPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lookupId, setLookupId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchStaffVerification = async (idToVerify: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setData(null);

    try {
      const res = await fetch(`/api/staff/verify/${encodeURIComponent(idToVerify.trim())}`);
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setData(json.data);
      } else {
        setErrorMsg(json.error || `No accredited employee record found for ID: ${idToVerify}`);
      }
    } catch {
      setErrorMsg('Could not establish secure connection to verify staff credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workerId) {
      setLookupId(workerId);
      fetchStaffVerification(workerId);
    }
  }, [workerId]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupId.trim()) {
      fetchStaffVerification(lookupId.trim());
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Top Breadcrumb & Brand */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Apex Global Public Website</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Official Credential Registry · SSL 256-bit</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-sky-700" />
          <span>Public Employee & Counselor Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Official Credential Verification
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Verify the official registration, immigration counseling authorization, and active accreditation of any Apex Global education officer.
        </p>
      </div>

      {/* Manual Search Bar (Allows scanning or looking up another Worker ID) */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs max-w-xl mx-auto">
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Worker ID (e.g. APX-STF-001)"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value.toUpperCase())}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-700"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
          >
            Verify ID
          </Button>
        </form>
      </div>

      {/* Main Verification Result Container */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded p-12 text-center text-slate-500 shadow-xs space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-700 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Verifying Digital Badge Credentials</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Querying central regulatory registry and authenticating counselor identification...
          </p>
        </div>
      ) : data ? (
        /* ================= SUCCESS: VERIFIED EMPLOYEE CARD ================= */
        <div className="bg-white border-2 border-emerald-500/80 rounded-xl shadow-lg overflow-hidden animate-in fade-in duration-200">
          
          {/* Official Verification Header Bar */}
          <div className="bg-emerald-700 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-400/40">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
                  Official Verification Status
                </span>
                <span className="text-base font-bold text-white tracking-wide block">
                  ACCREDITED & ACTIVE REPRESENTATIVE
                </span>
              </div>
            </div>

            <div className="text-xs text-emerald-100 sm:text-right font-mono">
              <span className="block font-bold">WORKER ID: {data.workerId}</span>
              <span className="text-[11px] opacity-80">
                Checked: {new Date(data.verifiedAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Profile Card Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Identity & Photo Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src={data.photoUrl}
                    alt={data.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image if custom URL breaks
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {data.fullName}
                  </h2>
                  <p className="text-sm font-semibold text-sky-800 mt-0.5">
                    {data.designation}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {data.department} · {data.organization}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{data.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{data.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Member since {data.joiningDate}</span>
                  </div>
                </div>

                {data.bio && (
                  <p className="text-xs text-slate-600 pt-2 leading-relaxed border-t border-slate-100 max-w-xl">
                    {data.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Accreditation & Fiduciary Credentials Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Certified Regulatory Compliance & Agency Accreditations</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {data.accreditations.map((acc, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-[11px] leading-snug">{acc}</span>
                  </div>
                ))}
              </div>

              {data.specialization && (
                <div className="text-xs text-slate-600 pt-2 border-t border-slate-200/70">
                  <strong className="text-slate-800">Casework Specialization:</strong>{' '}
                  {data.specialization}
                </div>
              )}
            </div>

            {/* Fiduciary Assurance & Disclaimer */}
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg text-xs text-sky-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <FileCheck2 className="w-4 h-4 text-sky-800" />
                <span>Official Fiduciary Authorization Statement</span>
              </div>
              <p className="text-[11px] text-sky-900 leading-relaxed">
                This verification confirms that <strong>{data.fullName}</strong> is an authorized caseworker of Apex Global Education Advisory with valid authorization to counsel students, issue certified access codes, review bank maintenance proof, and liaise with institutional admission boards.
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
              <div className="text-slate-400 font-mono text-[11px]">
                Registry Security Token: SHA-256:{data.workerId}_VERIFIED_VALID
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareLink}
                  leftIcon={<Share2 className="w-3.5 h-3.5" />}
                >
                  {copiedLink ? 'Link Copied' : 'Share Verification'}
                </Button>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                >
                  <span>Contact Headquarters</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ================= FAILURE / FRAUD WARNING CARD ================= */
        <div className="bg-white border-2 border-rose-400 rounded-xl shadow-lg p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-200">
          
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-300">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-widest block">
              Security Notice · Unverified Credential
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Worker ID Not Found in Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {errorMsg || 'The requested Worker ID is not registered in our official global staff directory.'}
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 max-w-lg mx-auto text-left space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Fraud Prevention Advisory</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • Never send tuition fees or visa processing payments to personal bank accounts or unverified agents.
              <br />
              • All official Apex Global agreements are processed through registered institutional escrow.
              <br />
              • If an individual claimed to represent Apex Global using this ID, report it immediately to our central fraud inspection desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium text-xs transition-colors"
            >
              Report Suspicious Contact
            </Link>

            <Link
              to="/"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-xs transition-colors"
            >
              Return to Homepage
            </Link>
          </div>

        </div>
      )}

      {/* Directory Disclaimer */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p>Apex Global Education Advisory · Central Admissions Registry Desk</p>
        <p>London · Toronto · Melbourne · Dhaka HQ | compliance@apexglobaledu.com</p>
      </div>

    </div>
  );
};
