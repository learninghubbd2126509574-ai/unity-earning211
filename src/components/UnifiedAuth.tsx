import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  db,
  onSnapshot,
  MASTER_ADMIN_EMAIL,
  hashAuthLookupKey,
  normalizePhoneDigits,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { WORK_MODULES } from '../lib/modules';
import { cn } from '../lib/utils';
import {
  DirectAuthUser,
  DirectUserRecord,
  loginDirectAccount,
  registerDirectAccount,
} from '../lib/directAuth';
import {
  UserCheck,
  LogIn,
  Upload,
  AlertCircle,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Briefcase,
  FileBadge,
  Users,
  Award,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  X
} from 'lucide-react';

async function compressImageIfNeeded(dataUrl: string, maxLength = 700000): Promise<string> {
  if (dataUrl.length <= maxLength || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 1000;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.72);
      resolve(compressed.length <= maxLength ? compressed : canvas.toDataURL('image/jpeg', 0.5));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export const UnifiedAuth: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, authNotice, clearAuthNotice, setAdminLogin, setIsPinUnlocked, loginDirectUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(() =>
    user && !profile ? 'register' : 'login'
  );

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginInfo, setLoginInfo] = useState('');

  // Register State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [teamLeaderName, setTeamLeaderName] = useState('');
  const [teamTrainerName, setTeamTrainerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState<boolean>(true);
  const [companyJoinDate, setCompanyJoinDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [hasExperience, setHasExperience] = useState<boolean>(false);
  const [hasSelectedWorkKnowledge, setHasSelectedWorkKnowledge] = useState<boolean | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>(['typing']);
  const [unlockCode, setUnlockCode] = useState('');
  const [isAllUnlocked, setIsAllUnlocked] = useState(false);
  const [codeError, setCodeError] = useState('');

  const [hasCertificate, setHasCertificate] = useState<boolean>(false);
  const [certificateDataUrl, setCertificateDataUrl] = useState<string>('');
  const [certFileName, setCertFileName] = useState<string>('');

  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [registeredCreds, setRegisteredCreds] = useState<{
    user: DirectAuthUser;
    profile: DirectUserRecord;
  } | null>(null);
  const [logoUrl, setLogoUrl] = useState('');

  // Load custom logo if configured in live Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'support'),
      (snap) => {
        if (snap.exists()) {
          setLogoUrl(snap.data().logoUrl || '');
        }
      },
      (err) => {
        console.warn('Support branding listener warning:', err);
      }
    );
    return () => unsub();
  }, []);

  const handleToggleModule = (modId: string) => {
    if (selectedModules.includes(modId)) {
      if (selectedModules.length > 1) {
        setSelectedModules(selectedModules.filter((id) => id !== modId));
      }
    } else {
      if (selectedModules.length < 2) {
        setSelectedModules([...selectedModules, modId]);
      } else {
        setSelectedModules([selectedModules[0], modId]);
      }
    }
  };

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setRegisterError('Certificate file must be smaller than 5MB.');
      return;
    }
    setCertFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const raw = reader.result as string;
      const compressed = await compressImageIfNeeded(raw, 650000);
      if (compressed.length > 850000) {
        setRegisterError('Certificate document exceeds 850KB. Please upload a smaller JPG/PNG image.');
        setCertificateDataUrl('');
        setCertFileName('');
        return;
      }
      setRegisterError('');
      setCertificateDataUrl(compressed);
    };
    reader.readAsDataURL(file);
  };

  const resolveAuthEmailFromIdentifier = async (ident: string): Promise<string> => {
    const cleanIdent = ident.trim();
    if (!cleanIdent) return '';

    if (cleanIdent.includes('@')) {
      return cleanIdent.toLowerCase();
    }

    if (/^\d{7}$/.test(cleanIdent)) {
      const hash = await hashAuthLookupKey(cleanIdent);
      const snap = await getDoc(doc(db, 'authLookups', hash));
      if (snap.exists() && snap.data()?.email) {
        return String(snap.data().email).trim().toLowerCase();
      }
    }

    const normalizedPhone = normalizePhoneDigits(cleanIdent);
    if (normalizedPhone.length >= 10) {
      const hash = await hashAuthLookupKey(normalizedPhone);
      const snap = await getDoc(doc(db, 'authLookups', hash));
      if (snap.exists() && snap.data()?.email) {
        return String(snap.data().email).trim().toLowerCase();
      }
      return `${normalizedPhone}@portal.unityearning.internal`;
    }

    return '';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginInfo('');
    clearAuthNotice();

    const cleanIdent = loginIdentifier.trim();
    const cleanPhoneDigits = cleanIdent.replace(/\D/g, '');
    const cleanPass = loginPassword.trim();

    // 1. Check Master Admin Credentials
    const isAdminPhone =
      cleanPhoneDigits === '01919012426' ||
      cleanPhoneDigits === '8801919012426' ||
      cleanPhoneDigits === '1919012426' ||
      cleanIdent === '01919012426';
    const isAdminEmail =
      cleanIdent.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() ||
      cleanIdent.toLowerCase() === 'admin@unityearning.app';

    if ((isAdminPhone || isAdminEmail) && cleanPass === '212650') {
      signInWithEmailAndPassword(auth, '01919012426@portal.unityearning.internal', cleanPass).catch(() => {});
      setAdminLogin(true);
      setIsPinUnlocked(true);
      setLoginLoading(false);
      navigate('/admin');
      return;
    }

    // 2. Direct Zero-Limit Portal Login (No Firebase quota required)
    try {
      const directResult = await loginDirectAccount(cleanIdent, cleanPass);
      if (directResult.status === 'ok' && directResult.user && directResult.profile) {
        loginDirectUser(directResult.user, directResult.profile);
        setLoginLoading(false);
        return;
      }
      if (directResult.status === 'wrong_password' || directResult.status === 'blocked') {
        setLoginError(directResult.error || 'Incorrect password or deactivated account.');
        setLoginLoading(false);
        return;
      }

      // 3. Fallback for older legacy Firebase accounts (only if not found in direct DB)
      let targetAuthEmail = '';
      try {
        targetAuthEmail = await resolveAuthEmailFromIdentifier(cleanIdent);
      } catch {
        // Ignore Firestore lookup quota errors and try direct phone alias
      }
      if (!targetAuthEmail && cleanPhoneDigits.length >= 10) {
        targetAuthEmail = `${normalizePhoneDigits(cleanIdent) || cleanPhoneDigits}@portal.unityearning.internal`;
      }

      if (!targetAuthEmail) {
        setLoginError(
          'No registered account found. Please check your phone number, 7-digit ID, or email, or create a new account in the Register tab.'
        );
        setLoginLoading(false);
        return;
      }

      const userCred = await signInWithEmailAndPassword(auth, targetAuthEmail, cleanPass);
      const userSnap = await getDoc(doc(db, 'users', userCred.user.uid));

      if (!userSnap.exists()) {
        await signOut(auth).catch(() => {});
        setLoginError('Your account was not found or was deleted by the administrator.');
        setLoginLoading(false);
        return;
      }

      const uData = userSnap.data();
      if (uData.role === 'admin') {
        setAdminLogin(true);
        setIsPinUnlocked(true);
        navigate('/admin');
        return;
      }

      if (uData.status === 'blocked') {
        await signOut(auth).catch(() => {});
        setLoginError('Your account has been deactivated by the administrator. Please contact support.');
        return;
      }
    } catch (authErr: any) {
      if (
        authErr.code === 'auth/wrong-password' ||
        authErr.code === 'auth/invalid-credential' ||
        authErr.code === 'auth/invalid-login-credentials'
      ) {
        setLoginError(
          'Incorrect password or credentials. Please verify your credentials or register a new account.'
        );
      } else if (authErr.code === 'auth/user-not-found') {
        setLoginError('No registered account found with these credentials.');
      } else {
        setLoginError(authErr.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoginError('');
    setLoginInfo('');
    const cleanIdent = loginIdentifier.trim();
    if (!cleanIdent) {
      setLoginError('Please enter your phone number, 7-digit ID, or email to reset password.');
      return;
    }
    setLoginLoading(true);
    try {
      const targetEmail = await resolveAuthEmailFromIdentifier(cleanIdent);
      if (!targetEmail || !targetEmail.includes('@') || targetEmail.endsWith('@portal.unityearning.internal')) {
        setLoginError('No personal email address associated with this account. Please contact your administrator or team leader.');
        return;
      }
      await sendPasswordResetEmail(auth, targetEmail);
      setLoginInfo(`Password reset link has been sent to ${targetEmail}.`);
    } catch (err: any) {
      setLoginError(err.message || 'Password reset failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const validateRegisterInputs = (): boolean => {
    if (!fullName.trim()) {
      setRegisterError('Please enter your full legal name.');
      return false;
    }
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 9) {
      setRegisterError('Please enter a valid phone/WhatsApp number.');
      return false;
    }
    const cleanId = studentId.trim();
    if (!/^\d{7}$/.test(cleanId)) {
      setRegisterError('Student ID code must be exactly 7 numeric digits (e.g. 1234567).');
      return false;
    }
    if (!teamLeaderName.trim()) {
      setRegisterError('Please enter your Team Leader name.');
      return false;
    }
    if (!teamTrainerName.trim()) {
      setRegisterError('Please enter your Team Trainer name.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setRegisterError('Please enter a valid email address.');
      return false;
    }
    if (password.trim().length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      return false;
    }
    if (!selectedModules || selectedModules.length === 0) {
      setRegisterError('Please select at least 1 task (up to 2 tasks allowed).');
      return false;
    }
    if (hasSelectedWorkKnowledge === null) {
      setRegisterError('Please specify whether you have prior knowledge regarding the selected work (Yes/No).');
      return false;
    }
    if (hasCertificate && !certificateDataUrl) {
      setRegisterError('You selected that you have a company certificate. Please upload your certificate document.');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!validateRegisterInputs()) return;

    setRegisterLoading(true);
    const authEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanPhone = normalizePhoneDigits(phone.trim()) || phone.trim();
    const cleanId = studentId.trim();
    const nowIso = new Date().toISOString();

    try {
      const result = await registerDirectAccount({
        fullName: fullName.trim(),
        whatsappNumber: cleanPhone,
        studentIdCode: cleanId,
        email: authEmail,
        passwordText: cleanPass,
        teamLeaderName: teamLeaderName.trim(),
        teamTrainerName: teamTrainerName.trim(),
        assignedJobs: selectedModules,
        preferredModules: selectedModules,
        courseCompleted: Boolean(courseCompleted),
        companyJoinDate: companyJoinDate || nowIso.split('T')[0],
        hasExperience: Boolean(hasExperience),
        hasSelectedWorkKnowledge: Boolean(hasSelectedWorkKnowledge),
        hasCertificate: Boolean(hasCertificate),
        certificateUrl: hasCertificate ? certificateDataUrl : '',
      });

      setRegisteredCreds(result);
      setSubmittedSuccess(true);
    } catch (err: any) {
      setRegisterError(err?.message || 'Registration failed. Please check inputs.');
    } finally {
      setRegisterLoading(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="p-4 sm:p-6 min-h-screen bg-[#F4F5F7] flex items-center justify-center font-sans text-[#1E2329]">
        <div className="w-full max-w-md bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-center space-y-5">
          <div className="w-12 h-12 bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} strokeWidth={1.75} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-slate-900">Registration Successful</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your registration record has been sent to the Admin portal. You can now log in directly without any limit.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 text-left text-xs space-y-2 text-slate-600">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Applicant</span>
              <span className="font-semibold text-slate-900">{fullName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Phone</span>
              <span className="font-mono font-medium text-slate-900 tabular-nums">{phone}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Student ID</span>
              <span className="font-mono font-semibold text-[#0A4D8C] tabular-nums">{studentId}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500 shrink-0">Assigned Tasks ({selectedModules.length})</span>
              <span className="font-semibold text-[#0A4D8C] text-right">
                {selectedModules.map((mId) => WORK_MODULES.find((m) => m.id === mId)?.title).filter(Boolean).join(', ')}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Status</span>
              <span className="font-semibold text-[#0D7A5F]">Active</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {registeredCreds && (
              <button
                onClick={() => {
                  loginDirectUser(registeredCreds.user, registeredCreds.profile);
                }}
                className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition text-sm cursor-pointer shadow-xs"
              >
                Enter Account Directly (Login Now)
              </button>
            )}
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setLoginIdentifier(phone || studentId || email);
                setActiveTab('login');
              }}
              className="w-full bg-[#F4F5F7] hover:bg-slate-200/80 text-slate-800 border border-slate-200 font-semibold py-2.5 rounded-lg transition text-xs cursor-pointer"
            >
              Go to Sign In Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 py-8 min-h-screen bg-[#F4F5F7] flex items-center justify-center font-sans text-[#1E2329]">
      <div
        className={cn(
          'w-full bg-white rounded-xl p-5 sm:p-8 border border-slate-200/90 shadow-xs transition-all duration-200',
          activeTab === 'register' ? 'max-w-3xl' : 'max-w-md'
        )}
      >
        {/* Portal Branding */}
        <div className="text-center mb-6">
          {logoUrl ? (
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center bg-[#F8FAFC] p-1">
                <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-[#0A4D8C] text-white flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={20} strokeWidth={1.75} />
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">Unity Earning Portal</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Member Authentication &amp; Account Registration</p>
        </div>

        {/* Auth Notice Banner */}
        {authNotice && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-medium flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-600" />
              <span>{authNotice}</span>
            </div>
            <button
              type="button"
              onClick={clearAuthNotice}
              className="text-amber-700 hover:text-amber-950 p-0.5 cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#F4F5F7] p-1 rounded-lg mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={cn(
              'py-2 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap',
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/70'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <LogIn size={15} strokeWidth={1.75} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={cn(
              'py-2 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap',
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/70'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <UserCheck size={15} strokeWidth={1.75} />
            <span>Register</span>
          </button>
        </div>

        {/* SIGN IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {loginInfo && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                <span>{loginInfo}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Phone Number, Student ID, or Email
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="01XXXXXXXXX, 7-digit ID, or email"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-[11px] font-medium text-[#0A4D8C] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition text-sm disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">New member? </span>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs font-semibold text-[#0A4D8C] hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </form>
        )}

        {/* REGISTRATION FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[72vh] overflow-y-auto pr-1">
            {registerError && (
              <div className="md:col-span-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-start gap-2 sticky top-0 z-10 shadow-xs">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{registerError}</span>
              </div>
            )}

            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mohammad Rahim"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            {/* 2. Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Phone / WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            {/* 3. 7-Digit Student ID Code */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Student ID Code (7 Digits) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {studentId.length}/7 digits
                </span>
              </div>
              <div className="text-[11.5px] text-slate-700 mb-2 bg-[#FEF7E0] p-3 rounded-lg border border-[#F3DFA2] flex items-start gap-2.5">
                <AlertCircle size={15} className="text-[#C88400] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-semibold text-slate-900">Important Notice:</strong> Your Student ID code must match your institutional Student ID exactly. Multiple registrations with the same code will result in account suspension.
                </div>
              </div>
              <input
                type="text"
                required
                maxLength={7}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
                placeholder="7-digit numeric code (e.g. 1234567)"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-mono tracking-wider tabular-nums text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            {/* 4. Team Leader Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users size={14} className="text-slate-500" />
                <span>Team Leader Name</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={teamLeaderName}
                onChange={(e) => setTeamLeaderName(e.target.value)}
                placeholder="Enter Team Leader Name"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            {/* 5. Team Trainer Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Award size={14} className="text-slate-500" />
                <span>Team Trainer Name</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={teamTrainerName}
                onChange={(e) => setTeamTrainerName(e.target.value)}
                placeholder="Enter Team Trainer Name"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            {/* 6. Email */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            {/* 7. Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition cursor-pointer"
                >
                  {showRegisterPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* 8. Course Completed */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200">
              <label className="block text-xs font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                <GraduationCap size={15} className="text-slate-600" /> Have you completed the training course?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="courseCompleted"
                    checked={courseCompleted === true}
                    onChange={() => setCourseCompleted(true)}
                    className="accent-[#0A4D8C] w-4 h-4"
                  />
                  <span>Yes, Completed</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="courseCompleted"
                    checked={courseCompleted === false}
                    onChange={() => setCourseCompleted(false)}
                    className="accent-[#0A4D8C] w-4 h-4"
                  />
                  <span>No / In Progress</span>
                </label>
              </div>
            </div>

            {/* 9. Joining Date */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-500" /> Company Joining Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={companyJoinDate}
                onChange={(e) => setCompanyJoinDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition"
              />
            </div>

            {/* 10. Prior Experience / Knowledge */}
            <div className="md:col-span-2 bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200">
              <label className="block text-xs font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                <Briefcase size={15} className="text-slate-600" /> Do you have prior experience or basic knowledge of online work? <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-5">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasExperience"
                    checked={hasExperience === true}
                    onChange={() => setHasExperience(true)}
                    className="accent-[#0A4D8C] w-4 h-4"
                  />
                  <span>Yes, I have prior knowledge</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasExperience"
                    checked={hasExperience === false}
                    onChange={() => setHasExperience(false)}
                    className="accent-[#0A4D8C] w-4 h-4"
                  />
                  <span>No prior knowledge</span>
                </label>
              </div>
            </div>

            {/* 11. Desired Work Selection */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-800">
                  Select Work Tasks (1 or 2 Tasks) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-mono font-semibold text-[#0A4D8C] tabular-nums">
                  {selectedModules.length}/2 selected
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mb-3 leading-relaxed">
                Select 1 or 2 tasks from the initial options (Typing, Form Fillup, Data Entry, Affiliate Marketing, Content Moderator).
              </p>

              {/* Authorization Unlock Box */}
              <div className="mb-3.5 bg-[#EEF5FC] p-3.5 rounded-lg border border-[#D4E4F7]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5 text-[#0A4D8C]">
                    <Lock size={13} /> Task Category Authorization Code
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-medium">Optional</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4-digit key"
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A4D8C]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (unlockCode === '1234') {
                        setIsAllUnlocked(true);
                        setCodeError('');
                      } else {
                        setCodeError('Invalid code. Please enter the correct security code.');
                        setIsAllUnlocked(false);
                      }
                    }}
                    className="bg-[#0A4D8C] hover:bg-[#083D70] text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
                  >
                    Verify
                  </button>
                </div>
                {codeError && <p className="text-[11px] text-rose-600 font-medium mt-1.5">{codeError}</p>}
                {isAllUnlocked && <p className="text-[11px] text-[#0D7A5F] font-medium mt-1.5">All 14 portal modules unlocked.</p>}
              </div>

              {/* Modules List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WORK_MODULES.map((mod) => {
                  const isEnabled = isAllUnlocked || ['typing', 'form', 'data', 'shop', 'moderation'].includes(mod.id);
                  const isSelected = selectedModules.includes(mod.id);

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      disabled={!isEnabled}
                      onClick={() => isEnabled && handleToggleModule(mod.id)}
                      className={cn(
                        'px-3.5 py-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer',
                        !isEnabled
                          ? 'border-slate-200/70 bg-slate-50 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#0A4D8C] bg-[#EEF5FC] text-[#0A4D8C] font-semibold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      )}
                    >
                      <span className="truncate pr-2">{mod.title}</span>

                      {isSelected ? (
                        <CheckCircle2 size={15} className="text-[#0A4D8C] shrink-0" />
                      ) : !isEnabled ? (
                        <Lock size={13} className="text-slate-400 shrink-0" />
                      ) : (
                        <span className="text-[10.5px] text-slate-400 shrink-0">Select</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Question: Do you have experience? */}
              <div className="mt-3 p-3.5 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-2">
                <label className="block text-xs font-medium text-slate-800 leading-relaxed">
                  Do you have any prior knowledge or experience regarding the selected task? <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="hasSelectedWorkKnowledge"
                      checked={hasSelectedWorkKnowledge === true}
                      onChange={() => setHasSelectedWorkKnowledge(true)}
                      className="accent-[#0A4D8C] w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="hasSelectedWorkKnowledge"
                      checked={hasSelectedWorkKnowledge === false}
                      onChange={() => setHasSelectedWorkKnowledge(false)}
                      className="accent-[#0A4D8C] w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 12. Company Certificate */}
            <div className="md:col-span-2 bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 space-y-3">
              <label className="block text-xs font-medium text-slate-800 flex items-center gap-1.5">
                <FileBadge size={15} className="text-slate-600" /> Have you received a training certificate?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasCertificate"
                    checked={hasCertificate === true}
                    onChange={() => setHasCertificate(true)}
                    className="accent-[#0A4D8C] w-4 h-4"
                  />
                  <span>Yes, I have a certificate</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasCertificate"
                    checked={hasCertificate === false}
                    onChange={() => {
                      setHasCertificate(false);
                      setCertificateDataUrl('');
                      setCertFileName('');
                    }}
                    className="accent-[#0A4D8C] w-4 h-4"
                  />
                  <span>No certificate</span>
                </label>
              </div>

              {hasCertificate && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                    Upload Certificate Image / Document <span className="text-rose-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg p-4 bg-white cursor-pointer hover:bg-slate-50 transition">
                    <Upload size={18} className="text-slate-500 mb-1" />
                    <span className="text-xs text-slate-700 font-medium">
                      {certFileName ? certFileName : 'Click to select certificate document'}
                    </span>
                    <span className="text-[10.5px] text-slate-400 mt-0.5">PNG, JPG, or PDF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleCertificateUpload}
                      className="hidden"
                    />
                  </label>

                  {certificateDataUrl && (
                    <div className="mt-2.5 text-center">
                      <img
                        src={certificateDataUrl}
                        alt="Certificate Preview"
                        className="max-h-28 mx-auto rounded-lg border border-slate-200 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={registerLoading}
              className="md:col-span-2 w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition text-sm disabled:opacity-50 mt-2 cursor-pointer shadow-xs"
            >
              {registerLoading ? 'Submitting Application...' : 'Complete & Register Account'}
            </button>

            <p className="md:col-span-2 text-[11px] text-slate-400 text-center">
              Registration details (Name, Phone, Password &amp; Selected Work Tasks) sync directly to live Firebase for Admin review.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
