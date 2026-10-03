import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    login, 
    register,
    currentUser 
  } = useApp();

  const [idOrEmail, setIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('user');
  const [regPhone, setRegPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleQuickFill = (userType: 'user' | 'admin') => {
    if (userType === 'user') {
      setIdOrEmail('user');
      setPassword('user123');
    } else {
      setIdOrEmail('admin');
      setPassword('admin123');
    }
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await login(idOrEmail, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      } else {
        setIdOrEmail('');
        setPassword('');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await register({
        name: regName,
        username: regUsername,
        email: regEmail,
        password: regPassword,
        role: regRole,
        phone: regPhone,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Could not register account.');
      } else {
        setRegName('');
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
      }
    } catch {
      setErrorMessage('Could not register account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] p-6 sm:p-8 space-y-6 text-stone-800 animate-fade-scale overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full blur-xs" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>PawCare Secure Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-display">
              {authModalMode === 'login' ? 'Sign in to your panel' : 'Create companion account'}
            </h2>
            <p className="text-xs text-stone-500">
              {authModalMode === 'login'
                ? 'Enter your user credentials or select a one-click demo profile.'
                : 'Register as a pet parent or clinic staff to access services.'}
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Sign In vs Register) */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-100 border border-stone-200/60 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {authModalMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {/* Quick-fill credential chips */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Quick 1-Click Demo Credentials:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('user')}
                  className="p-2 rounded-xl bg-white hover:bg-emerald-50/80 border border-stone-200/80 hover:border-emerald-300 text-left transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-stone-800 group-hover:text-emerald-900">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>User Portal</span>
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono mt-0.5">
                    user / user123
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('admin')}
                  className="p-2 rounded-xl bg-white hover:bg-amber-50/80 border border-stone-200/80 hover:border-amber-300 text-left transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-stone-800 group-hover:text-amber-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Admin Center</span>
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono mt-0.5">
                    admin / admin123
                  </div>
                </button>
              </div>
            </div>

            {/* User ID or Email */}
            <div className="space-y-1">
              <label className="block font-semibold text-stone-700">
                User ID or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={idOrEmail}
                  onChange={(e) => setIdOrEmail(e.target.value)}
                  placeholder="e.g. user or admin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-50/80 border border-stone-200 focus:border-emerald-700 focus:bg-white text-stone-900 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-stone-700">
                  Password
                </label>
                <span className="text-[10px] text-stone-600">Default: user123 / admin123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-50/80 border border-stone-200 focus:border-emerald-700 focus:bg-white text-stone-900 outline-none transition-colors font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Panel'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* 2. REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-stone-700">Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-stone-900 outline-none focus:border-emerald-700"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block font-semibold text-stone-700">Username ID</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. mayalin"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-stone-900 outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-stone-700">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-stone-900 outline-none focus:border-emerald-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-stone-700">Create Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-stone-900 outline-none focus:border-emerald-700 font-mono"
                required
              />
            </div>

            {/* Account Role Selector */}
            <div className="space-y-1">
              <label className="block font-semibold text-stone-700">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('user')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    regRole === 'user'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <div className="text-xs">🐾 Pet Parent</div>
                  <div className="text-[10px] text-stone-600 font-normal">Personal companion care</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('admin')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    regRole === 'admin'
                      ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <div className="text-xs">🛡️ Clinic Staff</div>
                  <div className="text-[10px] text-stone-600 font-normal">Order & patient admin</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration & Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] text-stone-400 pt-2 border-t border-stone-100">
          PawCare Identity Guard · 256-bit AES Simulated Session Encryption
        </div>
      </div>
    </div>
  );
};
