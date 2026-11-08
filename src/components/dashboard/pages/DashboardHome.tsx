import React from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { INITIAL_APPLICATIONS } from '../../../data/mockData.ts';
import { 
  FileText, 
  Clock, 
  Key, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const { user, switchRole } = useAuth();
  const isSuperAdmin = user?.role === 'Super Admin';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner with Role Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${
              isSuperAdmin 
                ? 'bg-amber-50 text-amber-900 border-amber-200' 
                : 'bg-sky-50 text-sky-900 border-sky-200'
            }`}>
              {isSuperAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> : <UserCheck className="w-3.5 h-3.5 text-sky-700" />}
              <span>{user?.role} Session</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">· Logged in as {user?.email}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {isSuperAdmin
              ? 'You have unrestricted Super Admin governance over student admissions, intake releases, financial ledgers, and staff workloads.'
              : 'You have standard Admin clearance to review student applications, manage access codes, and update public website content.'}
          </p>
        </div>

        {/* Quick Role Switcher for Phase 2 Evaluation */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg shrink-0 space-y-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Role Simulator (Test Guard)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => switchRole('Super Admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer border ${
                isSuperAdmin
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => switchRole('Admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer border ${
                !isSuperAdmin
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Toggle between roles to see dynamic sidebar links.
          </span>
        </div>
      </div>

      {/* CORE STAT WIDGETS (Total Applications: 24) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Total Applications</span>
            <FileText className="w-4 h-4 text-sky-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {INITIAL_APPLICATIONS.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% this cycle
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Active student dossiers under active review
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
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

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Active Access Codes</span>
            <Key className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              142
            </span>
            <span className="text-xs font-semibold text-sky-700">
              4 releases
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Intake dossiers and visa checklist keys
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Visa Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              98.4%
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              Audited
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Tier-4, F-1, SDS, and Subclass 500 grants
          </p>
        </div>

      </div>

      {/* Role Permissions Matrix Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900">
            Role-Based Access Control (RBAC) Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phase 2 route permissions matrix governing sidebar links and URL guard validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Admin Rights */}
          <div className={`p-4 rounded-lg border space-y-2.5 ${
            !isSuperAdmin ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                Standard Admin Capabilities
              </span>
              <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                Both Roles
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dashboard Home (`/dashboard`)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>View & Manage Student Applications (`/dashboard/applications`)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Generate & Track Access Codes (`/dashboard/access-codes`)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Update Public Website Content (`/dashboard/content-update`)</span>
              </li>
            </ul>
          </div>

          {/* Super Admin Restricted */}
          <div className={`p-4 rounded-lg border space-y-2.5 ${
            isSuperAdmin ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                Super Admin Restricted Modules
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Super Admin Only
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Financial Ledger & Escrow (`/dashboard/finance`)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Staff Management & Workloads (`/dashboard/staff`)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Admin access to these URLs triggers auto-redirect & "Access Denied" toast</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Try Direct Restricted URL Test Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <div>
            <span className="font-bold text-slate-900">Test Guard:</span>
            <span className="text-slate-600 ml-1.5">
              Click to attempt navigating to <code>/dashboard/finance</code>.
            </span>
          </div>
          <Link
            to="/dashboard/finance"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium transition-colors cursor-pointer shrink-0"
          >
            <span>Navigate to /dashboard/finance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
};
