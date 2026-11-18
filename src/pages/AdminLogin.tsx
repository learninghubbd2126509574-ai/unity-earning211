import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from '../lib/firebase';
import { ShieldCheck, KeyRound, ArrowLeft, Phone, Eye, EyeOff } from 'lucide-react';

export const AdminLogin = () => {
  const [adminPhone, setAdminPhone] = useState('01919012426');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAdminLogin, setIsPinUnlocked } = useAuth();
  const navigate = useNavigate();

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPhone = adminPhone.trim().replace(/\D/g, '');
    const cleanPass = password.trim();

    const isPhoneValid =
      cleanPhone === '01919012426' ||
      cleanPhone === '8801919012426' ||
      cleanPhone === '1919012426' ||
      adminPhone.trim() === '01919012426';

    if (!isPhoneValid || cleanPass !== '212650') {
      setError('Invalid credentials! Please enter authorized admin phone number and master password.');
      return;
    }

    setLoading(true);
    try {
      const adminAuthEmail = '01919012426@portal.unityearning.internal';
      try {
        await signInWithEmailAndPassword(auth, adminAuthEmail, cleanPass);
      } catch (err: any) {
        if (
          err.code === 'auth/user-not-found' ||
          err.code === 'auth/invalid-credential' ||
          err.code === 'auth/invalid-login-credentials'
        ) {
          try {
            await createUserWithEmailAndPassword(auth, adminAuthEmail, cleanPass);
          } catch (createErr) {
            console.warn('Admin user create fallback notice:', createErr);
          }
        }
      }

      setAdminLogin(true);
      setIsPinUnlocked(true);
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      // Still allow login to dashboard since credentials matched master admin
      setAdminLogin(true);
      setIsPinUnlocked(true);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex justify-center items-center w-full p-4 font-sans text-[#1E2329]">
      <div className="w-full max-w-[420px] bg-white p-7 sm:p-8 rounded-xl border border-slate-200/90 shadow-xs relative">
        <button
          onClick={() => navigate('/')}
          className="text-slate-500 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium cursor-pointer mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Back to Portal</span>
        </button>

        <div className="flex justify-center mb-4">
          <div className="bg-[#EEF5FC] border border-[#D4E4F7] p-3.5 rounded-xl text-[#0A4D8C]">
            <ShieldCheck size={36} />
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 text-center mb-1">
          Admin Portal Login
        </h1>
        <p className="text-slate-500 text-center text-xs mb-6">
          Unity Earning Official Management Access
        </p>

        {error && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-2.5 rounded-lg text-xs mb-5 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Admin Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="01919012426"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 text-sm font-mono focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg transition-colors text-xs cursor-pointer shadow-xs disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In (Authenticate)'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Authorized phone &amp; password credentials only • Zero Gmail authentication required
          </p>
        </div>
      </div>
    </div>
  );
};
