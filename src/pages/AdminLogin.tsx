import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ShieldAlert, KeyRound, Mail, ArrowLeft, Phone, Eye, EyeOff } from 'lucide-react';

export const AdminLogin = () => {
  const [adminPhone, setAdminPhone] = useState('01919012426');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { setAdminLogin, setIsPinUnlocked } = useAuth();
  const navigate = useNavigate();

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = adminPhone.trim().replace(/\D/g, '');
    const cleanPass = password.trim();

    if (
      (cleanPhone === '01919012426' || cleanPhone === '8801919012426' || cleanPhone === '1919012426' || adminPhone.trim() === '01919012426' || !cleanPhone) &&
      cleanPass === '212650'
    ) {
      setAdminLogin(true);
      setIsPinUnlocked(true);
      navigate('/admin');
    } else {
      setError('Invalid Admin credentials. Please check phone number and master password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setAdminLogin(true);
      setIsPinUnlocked(true);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center w-full p-4">
      <div className="w-full max-w-[420px] bg-slate-900 p-8 rounded-3xl shadow-2xl relative border border-slate-800">
        
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex justify-center mb-6 mt-4">
          <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 text-orange-500">
            <ShieldAlert size={44} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-1">Admin Portal</h1>
        <p className="text-slate-400 text-center text-xs mb-6">Restricted System Administration Access</p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-2.5 rounded-xl text-xs mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Admin Phone Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="tel" 
                required
                value={adminPhone}
                onChange={e => setAdminPhone(e.target.value)}
                placeholder="01919012426"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Master Admin Password
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-11 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm mt-2"
          >
            Authenticate Admin Credentials
          </button>
        </form>

        <div className="flex items-center gap-4 mb-6 opacity-30">
          <div className="h-px bg-slate-500 flex-1"></div>
          <span className="text-slate-300 text-xs font-mono">OR</span>
          <div className="h-px bg-slate-500 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-slate-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-sm"
        >
          <Mail size={18} />
          Sign in with Google Admin
        </button>

      </div>
    </div>
  );
};
