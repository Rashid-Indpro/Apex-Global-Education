import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Home, 
  FileText, 
  Key,
  RefreshCw, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  LogOut, 
  X,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpenOnMobile,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = user?.role === 'Super Admin';

  // Navigation Items Definition with role access rules
  const sharedNavItems = [
    {
      to: '/dashboard',
      label: 'Dashboard Home',
      icon: <Home className="w-4 h-4 shrink-0" />,
      end: true,
    },
    {
      to: '/dashboard/applications',
      label: 'Applications',
      icon: <FileText className="w-4 h-4 shrink-0" />,
      end: false,
    },
    {
      to: '/dashboard/access-codes',
      label: 'Access Codes',
      icon: <Key className="w-4 h-4 shrink-0" />,
      end: false,
    },
    {
      to: '/dashboard/content-update',
      label: 'Update Website Content',
      icon: <RefreshCw className="w-4 h-4 shrink-0" />,
      end: false,
    },
  ];

  const superAdminNavItems = [
    {
      to: '/dashboard/finance',
      label: 'Financials',
      icon: <DollarSign className="w-4 h-4 shrink-0" />,
      end: false,
      badge: 'Super Admin',
    },
    {
      to: '/dashboard/staff',
      label: 'Staff Management',
      icon: <Users className="w-4 h-4 shrink-0" />,
      end: false,
      badge: 'Super Admin',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between 
          transition-transform duration-200 ease-in-out border-r border-slate-800
          ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-sky-600 flex items-center justify-center text-white font-bold text-xs tracking-wider">
                AG
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight block">
                  Apex Operations
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Internal Dashboard
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links Section */}
          <div className="px-3 py-5 space-y-6">
            
            {/* 1. Core Modules (Available to Both Roles) */}
            <div className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Standard Modules (Both Roles)
              </div>

              {sharedNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => {
                    onCloseMobile();
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-sky-700 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* 2. Executive Modules (Super Admin Conditional Section) */}
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <div className="px-3 pb-2 flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Executive Governance</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Restricted</span>
                </span>
              </div>

              {/* DYNAMIC RENDERING: Only Super Admin renders these links */}
              {isSuperAdmin ? (
                superAdminNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => {
                      onCloseMobile();
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-amber-600 text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-800/80 px-1.5 py-0.5 rounded">
                      Super
                    </span>
                  </NavLink>
                ))
              ) : (
                /* Informative callout when user is standard Admin */
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>2 Super Admin Links Hidden</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Financials & Staff Management are hidden from standard Admin navigation.
                  </p>
                  
                  {/* Test guard attempt trigger */}
                  <NavLink
                    to="/dashboard/finance"
                    onClick={() => {
                      onCloseMobile();
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className="block text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Test Restricted Guard →
                  </NavLink>
                </div>
              )}
            </div>

            {/* Public Website Gateway Link */}
            <div className="pt-2 border-t border-slate-800">
              <NavLink
                to="/"
                onClick={() => {
                  onCloseMobile();
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span>View Public Website</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </NavLink>
            </div>

          </div>
        </div>

        {/* Sidebar Footer with Profile & Logout Button */}
        <div className="p-4 border-t border-slate-800 space-y-3 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
              <img
                src={user?.avatarUrl}
                alt={user?.name || 'User avatar'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {user?.name}
              </span>
              <span className={`text-[10px] font-bold block truncate ${
                isSuperAdmin ? 'text-amber-400' : 'text-sky-400'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700/80"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};
