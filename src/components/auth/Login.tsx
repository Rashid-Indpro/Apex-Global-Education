import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  WifiOff,
  UserCheck
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);

  // Where to redirect after login (default to /dashboard)
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await login({
      email,
      password,
      rememberMe,
      simulateNetworkError,
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Welcome back to the Apex Global operations dashboard.',
      });
      navigate(fromLocation, { replace: true });
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleFillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-sky-500 selection:text-white">
      
      {/* Top Header / Public Link */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link 
          to="/"
          className="flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
        >
          <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center text-white font-bold text-sm tracking-tight">
            AG
          </div>
          <span className="text-base font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
            Apex Global Education
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>← Back to Public Website</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Consultancy Portal Login
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Authenticate using your internal staff credentials to manage student dossiers, access codes, and financial operations.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div 
              role="alert"
              className="p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-lg text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label 
                htmlFor="loginEmail" 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Staff Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="loginEmail"
                  type="email"
                  required
                  placeholder="name@apexglobaledu.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 hover:border-slate-600 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label 
                htmlFor="loginPassword" 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 hover:border-slate-600 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>

              <span className="text-slate-500 hover:text-slate-400 cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full shadow-lg cursor-pointer"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials Fill Buttons */}
          <div className="pt-4 border-t border-slate-700/80 space-y-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick Test Credentials (Phase 2 Demo)
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleFillCredentials('superadmin@apexglobaledu.com', 'SuperAdmin123!')
                }
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 group-hover:text-amber-300">
                    Super Admin
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  Full unrestricted access
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleFillCredentials('admin@apexglobaledu.com', 'Admin123!')
                }
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400 group-hover:text-sky-300">
                    Standard Admin
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400" />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  No Finance/Staff rights
                </span>
              </button>
            </div>

            {/* Network Error Simulator Toggle */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-400">
                <input
                  type="checkbox"
                  checked={simulateNetworkError}
                  onChange={(e) => setSimulateNetworkError(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-rose-400"
                />
                <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Simulate network outage error</span>
              </label>
            </div>

          </div>

        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Apex Global Education Advisory Ltd. Internal Security Gateway.</p>
        <p className="text-[11px] text-slate-600 mt-1">
          Authorized personnel only. All access attempts are logged under cryptographic audit compliance.
        </p>
      </div>

    </div>
  );
};
