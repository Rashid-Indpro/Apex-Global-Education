import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { ContentProvider } from './context/ContentContext.tsx';

// Public Components
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { Home } from './components/Home.tsx';
import { Services } from './components/Services.tsx';
import { ContactUs } from './components/ContactUs.tsx';
import { ApplyNow } from './components/ApplyNow.tsx';
import { DownloadForm } from './components/DownloadForm.tsx';
import { EmployeeVerification } from './components/verification/EmployeeVerification.tsx';
import { ScrollToTop } from './components/utils/ScrollToTop.tsx';

// Auth & Protected Routing Components
import { Login } from './components/auth/Login.tsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';

// Dashboard Shell & Pages
import { DashboardLayout } from './components/dashboard/DashboardLayout.tsx';
import { DashboardHome } from './components/dashboard/pages/DashboardHome.tsx';
import { ApplicationsPage } from './components/dashboard/pages/ApplicationsPage.tsx';
import { AccessCodesPage } from './components/dashboard/pages/AccessCodesPage.tsx';
import { ContentUpdatePage } from './components/dashboard/pages/ContentUpdatePage.tsx';
import { FinancePage } from './components/dashboard/pages/FinancePage.tsx';
import { StaffPage } from './components/dashboard/pages/StaffPage.tsx';

// Public Website Layout Shell
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-700 selection:text-white antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ContentProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              
              {/* 1. PUBLIC WEBSITE ROUTES */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/apply" element={<ApplyNow />} />
                <Route path="/download" element={<DownloadForm />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/verify/:workerId" element={<EmployeeVerification />} />
              </Route>

              {/* 2. AUTHENTICATION ROUTE */}
              <Route path="/login" element={<Login />} />

              {/* 3. PROTECTED CONSULTANCY DASHBOARD SHELL & ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* Common Routes: Both Admin and Super Admin can access */}
                <Route index element={<DashboardHome />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="access-codes" element={<AccessCodesPage />} />
                <Route path="content-update" element={<ContentUpdatePage />} />

                {/* Super Admin Restricted Routes: Admin is denied and redirected */}
                <Route
                  path="finance"
                  element={
                    <ProtectedRoute requiredRole="Super Admin">
                      <FinancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="staff"
                  element={
                    <ProtectedRoute requiredRole="Super Admin">
                      <StaffPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 4. FALLBACK REDIRECT */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
