import React from 'react';
import { DashboardTab } from '../../types.ts';
import { ASSET_PATHS } from '../../data/mockData.ts';
import { 
  Home, 
  FileText, 
  Key, 
  DollarSign, 
  Users, 
  RefreshCw, 
  LogOut, 
  X,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  totalApplicationsCount: number;
  totalAccessCodesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenOnMobile,
  onCloseMobile,
  onLogout,
  totalApplicationsCount,
  totalAccessCodesCount,
}) => {
  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode; badgeCount?: number }[] = [
    { id: 'overview', label: 'Home', icon: <Home className="w-4 h-4 shrink-0" /> },
    { 
      id: 'applications', 
      label: 'Applications', 
      icon: <FileText className="w-4 h-4 shrink-0" />,
      badgeCount: totalApplicationsCount 
    },
    { 
      id: 'access-codes', 
      label: 'Access Codes', 
      icon: <Key className="w-4 h-4 shrink-0" />,
      badgeCount: totalAccessCodesCount 
    },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4 shrink-0" /> },
    { id: 'staff', label: 'Staff', icon: <Users className="w-4 h-4 shrink-0" /> },
    { id: 'content-update', label: 'Content Update', icon: <RefreshCw className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between 
          transition-transform duration-200 ease-in-out border-r border-slate-800
          ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div>
          {/* Brand Shell Header */}
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
                  Internal Staff Portal
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

          {/* Navigation Links with Icons */}
          <div className="px-3 py-5 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Management Portal
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded transition-colors cursor-pointer
                    ${isActive 
                      ? 'bg-sky-700 text-white font-semibold shadow-xs' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {typeof item.badgeCount === 'number' && (
                    <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-sky-800 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer with Super Admin Identity & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
              <img
                src={ASSET_PATHS.adminAvatar}
                alt="Super Admin portrait"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">
                Dr. Eleanor Vance
              </span>
              <span className="text-[10px] text-sky-400 font-semibold block">
                Super Admin
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout to Public Site</span>
          </button>
        </div>
      </aside>
    </>
  );
};
