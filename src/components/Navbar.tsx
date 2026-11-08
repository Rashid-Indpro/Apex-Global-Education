import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Menu, X, ArrowUpRight, ShieldCheck, LogIn, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Apply Now', to: '/apply' },
    { label: 'Download Form', to: '/download' },
    { label: 'Contact Us', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* 3-Zone Top Bar Contract: Brand | Nav Links | Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single-element Brand wordmark */}
        {/* Zone 1: Single-element Brand wordmark */}
        <Link
          to="/"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }}
          className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-sm"
        >
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-base tracking-tighter">
            AG
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group-hover:text-sky-700 transition-colors">
            Apex Global Education
          </span>
        </Link>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={({ isActive }) => `
                transition-colors whitespace-nowrap shrink-0 py-1 relative
                ${isActive ? 'text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-700 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-700" />
              <span>Go to Dashboard ({user?.role})</span>
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-600" />
              <span>Staff Login</span>
            </Link>
          )}

          <Link
            to="/apply"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded hover:bg-sky-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={({ isActive }) => `
                block px-3 py-2.5 text-sm font-medium rounded transition-colors
                ${isActive ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'}
              `}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-100 rounded flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Staff Portal Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
