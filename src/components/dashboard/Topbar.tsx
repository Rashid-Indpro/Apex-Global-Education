import React from 'react';
import { ASSET_PATHS } from '../../data/mockData.ts';
import { DashboardTab } from '../../types.ts';
import { Menu, Shield, LogOut } from 'lucide-react';
import { Button } from '../ui/Button.tsx';

interface TopbarProps {
  activeTab: DashboardTab;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Trigger & Contextual Path */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Internal Portal</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-semibold capitalize">
            {activeTab === 'overview' ? 'Home' : activeTab.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Right Area: Role Badge, Profile Avatar, and Logout Button */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        {/* Role Badge: "Super Admin" */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Super Admin</span>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 bg-slate-200 shrink-0">
            <img
              src={ASSET_PATHS.adminAvatar}
              alt="User profile avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold text-slate-900 block leading-tight">
              Dr. Eleanor Vance
            </span>
            <span className="text-[10px] text-slate-500 block">
              Director of Admissions
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onLogout}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-600" />}
          className="cursor-pointer"
        >
          <span className="hidden sm:inline">Logout</span>
        </Button>

      </div>
    </header>
  );
};
