import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { UserRole } from '../../types/auth.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  // Trigger toast if user is authenticated but lacks required role
  const isUnauthorized = Boolean(
    isAuthenticated &&
      requiredRole &&
      user &&
      requiredRole === 'Super Admin' &&
      user.role !== 'Super Admin'
  );

  useEffect(() => {
    if (isUnauthorized) {
      showToast({
        type: 'error',
        title: 'Access Denied',
        message: `Super Admin privileges are required to access "${location.pathname}". You have been redirected to the dashboard home.`,
      });
    }
  }, [isUnauthorized, location.pathname, showToast]);

  // Loading state during session rehydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Verifying Security Session...
          </span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated users are redirected to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role restriction check: If Admin attempts to access Super Admin restricted URL, redirect to /dashboard
  if (isUnauthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authorized
  return <>{children}</>;
};
