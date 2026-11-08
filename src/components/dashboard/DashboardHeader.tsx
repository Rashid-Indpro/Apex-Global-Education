import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../ui/Button.tsx';
import { 
  Menu, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface DashboardHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileSidebar,
}) => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSuperAdmin = user?.role === 'Super Admin';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getPageTitle = (path: string) => {
    if (path === '/dashboard') return 'Dashboard Home';
    if (path.includes('/applications')) return 'Applications';
    if (path.includes('/content-update')) return 'Update Website Content';
    if (path.includes('/finance')) return 'Financials (Super Admin)';
    if (path.includes('/staff')) return 'Staff Management (Super Admin)';
    return 'Portal';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-2xs">
      
      {/* Left: Mobile Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Consultancy CRM</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-bold">
            {getPageTitle(location.pathname)}
          </span>
        </div>
      </div>

      {/* Right: Quick Role Toggle, Role Badge, Avatar, and Logout */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        
        {/* Quick Role Switcher (Crucial for verifying Phase 2 requirements) */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => switchRole('Super Admin')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              isSuperAdmin
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to Super Admin permissions"
          >
            Super Admin
          </button>
          <button
            onClick={() => switchRole('Admin')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              !isSuperAdmin
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to Standard Admin permissions"
          >
            Admin
          </button>
        </div>

        {/* Current Role Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${
          isSuperAdmin 
            ? 'bg-amber-50 border-amber-200 text-amber-900' 
            : 'bg-sky-50 border-sky-200 text-sky-900'
        }`}>
          {isSuperAdmin ? (
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          ) : (
            <UserCheck className="w-3.5 h-3.5 text-sky-700 shrink-0" />
          )}
          <span>{user?.role}</span>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 bg-slate-200 shrink-0">
            <img
              src={user?.avatarUrl}
              alt={user?.name || 'User avatar'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold text-slate-900 block leading-tight">
              {user?.name}
            </span>
            <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
              {user?.title}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-600" />}
          className="cursor-pointer"
        >
          <span className="hidden sm:inline">Logout</span>
        </Button>

      </div>

    </header>
  );
};
