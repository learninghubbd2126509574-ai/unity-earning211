import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db, onSnapshot } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { WORK_MODULES } from '../lib/modules';
import { 
  UserCheck, 
  LogIn, 
  Upload, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  FileBadge,
  Sparkles,
  Users,
  Award,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';

export const UnifiedAuth: React.FC = () => {
  const navigate = useNavigate();
  const { setAdminLogin, setIsPinUnlocked } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

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
  const [selectedModule, setSelectedModule] = useState<string>('typing');
  const [hasCertificate, setHasCertificate] = useState<boolean>(false);
  const [certificateDataUrl, setCertificateDataUrl] = useState<string>('');
  const [certFileName, setCertFileName] = useState<string>('');
  
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  // Load custom logo if configured
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'support'), (snap) => {
      if (snap.exists()) {
        setLogoUrl(snap.data().logoUrl || '');
      }
    });
    return () => unsub();
  }, []);

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setRegisterError('Certificate file must be smaller than 5MB.');
        return;
      }
      setCertFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificateDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const cleanIdent = loginIdentifier.trim();
    const cleanPhoneDigits = cleanIdent.replace(/\D/g, '');
    const cleanPass = loginPassword.trim();

    // 1. Check for Master Admin Credentials (Phone: 01919012426, Password: 212650)
    const isAdminPhone = cleanPhoneDigits === '01919012426' || 
                         cleanPhoneDigits === '8801919012426' || 
                         cleanPhoneDigits === '1919012426' ||
                         cleanIdent === '01919012426';
    const isAdminEmail = cleanIdent.toLowerCase() === 'learninghubbd2126509574@gmail.com' ||
                         cleanIdent.toLowerCase() === 'admin@unityearning.app';

    if ((isAdminPhone || isAdminEmail) && cleanPass === '212650') {
      setAdminLogin(true);
      setIsPinUnlocked(true);
      setLoginLoading(false);
      navigate('/admin');
      return;
    }

    // Direct password match for administrator
    if (cleanPass === '212650' && (cleanIdent.includes('01919012426') || cleanIdent.toLowerCase().includes('admin'))) {
      setAdminLogin(true);
      setIsPinUnlocked(true);
      setLoginLoading(false);
      navigate('/admin');
      return;
    }

    // 2. Multi-Identifier Resolution (Email, Phone, or 7-Digit Student ID)
    try {
      let targetAuthEmail = '';
      let targetUserDoc: any = null;

      // Check if identifier is direct email format
      if (cleanIdent.includes('@')) {
        targetAuthEmail = cleanIdent.toLowerCase();
      }

      const usersRef = collection(db, 'users');

      // Check 1: 7-digit Student ID Code lookup
      if (/^\d{7}$/.test(cleanIdent)) {
        const idSnap = await getDocs(query(usersRef, where('studentIdCode', '==', cleanIdent)));
        if (!idSnap.empty) {
          targetUserDoc = idSnap.docs[0].data();
          if (targetUserDoc.email) {
            targetAuthEmail = targetUserDoc.email.trim().toLowerCase();
          }
        }
      }

      // Check 2: Phone / WhatsApp lookup (strict phone matching)
      if (!targetUserDoc && cleanPhoneDigits.length >= 10) {
        const phoneSnap = await getDocs(query(usersRef, where('whatsappNumber', '==', cleanIdent)));
        if (!phoneSnap.empty) {
          targetUserDoc = phoneSnap.docs[0].data();
          if (targetUserDoc.email) {
            targetAuthEmail = targetUserDoc.email.trim().toLowerCase();
          }
        } else {
          const phoneDigitsSnap = await getDocs(query(usersRef, where('whatsappNumber', '==', cleanPhoneDigits)));
          if (!phoneDigitsSnap.empty) {
            targetUserDoc = phoneDigitsSnap.docs[0].data();
            if (targetUserDoc.email) {
              targetAuthEmail = targetUserDoc.email.trim().toLowerCase();
            }
          }
        }
      }

      // Check 3: Email field lookup
      if (!targetUserDoc && cleanIdent.includes('@')) {
        const emailSnap = await getDocs(query(usersRef, where('email', '==', cleanIdent.toLowerCase())));
        if (!emailSnap.empty) {
          targetUserDoc = emailSnap.docs[0].data();
          if (targetUserDoc.email) {
            targetAuthEmail = targetUserDoc.email.trim().toLowerCase();
          }
        }
      }

      // Check 4: Deep scan across users collection with strict matching only
      if (!targetUserDoc) {
        const allUsersSnap = await getDocs(usersRef);
        for (const uDoc of allUsersSnap.docs) {
          const data = uDoc.data();
          const uPhone = (data.whatsappNumber || '').replace(/\D/g, '');
          const uId = (data.studentIdCode || '').trim();
          const uEmail = (data.email || '').trim().toLowerCase();
          const qDigits = cleanPhoneDigits;

          const isIdMatch = Boolean(uId && /^\d{7}$/.test(cleanIdent) && uId === cleanIdent);
          const isEmailMatch = Boolean(uEmail && cleanIdent.includes('@') && uEmail === cleanIdent.toLowerCase());
          const isPhoneMatch = Boolean(
            qDigits.length >= 10 && uPhone.length >= 10 &&
            (uPhone === qDigits ||
             ('88' + qDigits) === uPhone ||
             qDigits === ('88' + uPhone) ||
             (qDigits.startsWith('0') && uPhone === qDigits.slice(1)) ||
             (uPhone.startsWith('0') && qDigits === uPhone.slice(1)))
          );

          if (isIdMatch || isEmailMatch || isPhoneMatch) {
            targetUserDoc = data;
            if (data.email) {
              targetAuthEmail = data.email.trim().toLowerCase();
            }
            break;
          }
        }
      }

      if (!targetUserDoc) {
        setLoginError('কোনো নিবন্ধিত অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক ফোন নম্বর, ৭-সংখ্যার আইডি বা ইমেইল দিন অথবা নতুন আবেদন করুন।');
        setLoginLoading(false);
        return;
      }

      if (targetUserDoc.passwordText && targetUserDoc.passwordText !== cleanPass) {
        setLoginError('ভুল পাসওয়ার্ড! অনুগ্রহ করে পাসওয়ার্ড চেক করে পুনরায় চেষ্টা করুন।');
        setLoginLoading(false);
        return;
      }

      // Fallback auth email construction if not found in Firestore
      if (!targetAuthEmail) {
        if (cleanIdent.includes('@')) {
          targetAuthEmail = cleanIdent.toLowerCase();
        } else {
          targetAuthEmail = `${cleanIdent.replace(/[^a-zA-Z0-9]/g, '')}@unityearning.app`;
        }
      }

      // Attempt Firebase Auth sign in
      try {
        const userCred = await signInWithEmailAndPassword(auth, targetAuthEmail, cleanPass);
        
        // Check user profile status
        const userSnap = await getDoc(doc(db, 'users', userCred.user.uid));
        if (userSnap.exists()) {
          const uData = userSnap.data();
          if (uData.role === 'admin') {
            setAdminLogin(true);
            setIsPinUnlocked(true);
            navigate('/admin');
            return;
          }
          if (uData.status === 'blocked') {
            setLoginError('Your account has been deactivated. Please contact administrator.');
            return;
          }
          // Note: Pending users are allowed to log in!
        }
      } catch (authErr: any) {
        // Detailed password / credential verification
        if (targetUserDoc && targetUserDoc.passwordText) {
          if (targetUserDoc.passwordText !== cleanPass) {
            setLoginError('Incorrect password. Please click the eye icon to verify your entered password.');
            return;
          }
          if (targetUserDoc.status === 'blocked') {
            setLoginError('Your account has been deactivated. Please contact administrator.');
            return;
          }
        }

        if (authErr.code === 'auth/wrong-password' || authErr.code === 'auth/invalid-credential') {
          setLoginError('Incorrect password. Please toggle the eye icon to double check what you typed.');
        } else if (authErr.code === 'auth/user-not-found') {
          setLoginError('No registered account found with these credentials. Please check your Phone Number, Student ID, or Email.');
        } else {
          setLoginError(authErr.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'System error during login. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');

    // Validations
    if (!fullName.trim()) {
      setRegisterError('Please enter your full legal name.');
      setRegisterLoading(false);
      return;
    }

    const cleanPhone = phone.trim();
    if (cleanPhone.length < 9) {
      setRegisterError('Please enter a valid phone/WhatsApp number.');
      setRegisterLoading(false);
      return;
    }

    // 7-digit student ID validation
    const cleanId = studentId.trim();
    if (!/^\d{7}$/.test(cleanId)) {
      setRegisterError('Student ID code must be exactly 7 numeric digits (e.g. 1234567).');
      setRegisterLoading(false);
      return;
    }

    // Team Leader & Team Trainer validations
    if (!teamLeaderName.trim()) {
      setRegisterError('Please enter your Team Leader name.');
      setRegisterLoading(false);
      return;
    }

    if (!teamTrainerName.trim()) {
      setRegisterError('Please enter your Team Trainer name.');
      setRegisterLoading(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setRegisterError('Please enter a valid email address.');
      setRegisterLoading(false);
      return;
    }

    const cleanPass = password.trim();
    if (cleanPass.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      setRegisterLoading(false);
      return;
    }

    if (!selectedModule) {
      setRegisterError('Please select a preferred work task.');
      setRegisterLoading(false);
      return;
    }

    if (hasSelectedWorkKnowledge === null) {
      setRegisterError('দয়া করে নির্বাচিত কাজ সম্পর্কে আপনার কোনো ধারণা আছে কিনা তা নির্ধারণ করুন (Yes/No)।');
      setRegisterLoading(false);
      return;
    }

    if (hasCertificate && !certificateDataUrl) {
      setRegisterError('You selected that you have a company certificate. Please upload your certificate document.');
      setRegisterLoading(false);
      return;
    }

    try {
      const authEmail = email.trim().toLowerCase();
      const cred = await createUserWithEmailAndPassword(auth, authEmail, cleanPass);
      
      const newUserData = {
        fullName: fullName.trim(),
        whatsappNumber: cleanPhone,
        studentIdCode: cleanId,
        teamLeaderName: teamLeaderName.trim(),
        teamTrainerName: teamTrainerName.trim(),
        email: authEmail,
        role: 'student',
        status: 'active', // Immediate activation
        assignedJob: selectedModule, // Assigned immediately
        courseCompleted: Boolean(courseCompleted),
        companyJoinDate: companyJoinDate || new Date().toISOString().split('T')[0],
        hasExperience: Boolean(hasExperience),
        hasSelectedWorkKnowledge: Boolean(hasSelectedWorkKnowledge),
        hasCertificate: Boolean(hasCertificate),
        certificateUrl: hasCertificate ? certificateDataUrl : '',
        balance: 0,
        microjobPoints: 0,
        passwordText: cleanPass,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', cred.user.uid), newUserData);
      await signOut(auth);
      setSubmittedSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setRegisterError('This email is already registered. Please sign in or use another email.');
      } else {
        setRegisterError(err.message || 'Registration failed. Please check inputs.');
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="p-6 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Registration Successful!</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your account has been created successfully and is now active. You can log in immediately with your phone number and password to start working on your assigned task.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <div><span className="font-semibold text-slate-800">Applicant:</span> {fullName}</div>
            <div><span className="font-semibold text-slate-800">Phone:</span> {phone}</div>
            <div><span className="font-semibold text-slate-800">Assigned Task:</span> <span className="font-bold text-orange-600">{WORK_MODULES.find(m => m.id === selectedModule)?.title}</span></div>
            <div><span className="font-semibold text-slate-800">Status:</span> <span className="font-bold text-emerald-600">Active</span></div>
          </div>

          <button
            onClick={() => {
              setSubmittedSuccess(false);
              setActiveTab('login');
            }}
            className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 py-8 min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl">
        
        {/* Portal Branding */}
        <div className="text-center mb-6">
          {logoUrl ? (
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-slate-100 flex items-center justify-center bg-slate-50 p-0.5">
                <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-orange-600 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Unity Earning Portal
            </div>
          )}
          <h1 className="text-2xl font-bold text-slate-800">Task Earning System</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Single Registration for all tasks</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck size={16} /> Register
          </button>
        </div>

        {/* SIGN IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number or Email Address
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="01XXXXXXXXX or email@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition shadow-md disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Don't have an approved account? </span>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                Register Now
              </button>
            </div>
          </form>
        )}

        {/* REGISTRATION FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {registerError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium flex items-start gap-2 sticky top-0 z-10">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{registerError}</span>
              </div>
            )}

            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mohammad Rahim"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* 2. Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* 3. 7-Digit Student ID Code */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Student ID Code (7 Digits) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {studentId.length}/7 digits
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={7}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
                placeholder="7-digit numeric code (e.g. 1234567)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* 4. Team Leader Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users size={15} className="text-orange-500" />
                <span>Team Leader Name</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={teamLeaderName}
                onChange={(e) => setTeamLeaderName(e.target.value)}
                placeholder="Enter Team Leader Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* 5. Team Trainer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Award size={15} className="text-orange-500" />
                <span>Team Trainer Name</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={teamTrainerName}
                onChange={(e) => setTeamTrainerName(e.target.value)}
                placeholder="Enter Team Trainer Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* 6. Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* 7. Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition cursor-pointer"
                >
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 8. Course Completed */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <GraduationCap size={16} className="text-orange-500" /> Have you completed the training course?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="courseCompleted"
                    checked={courseCompleted === true}
                    onChange={() => setCourseCompleted(true)}
                    className="accent-orange-500"
                  />
                  <span>Yes, Completed</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="courseCompleted"
                    checked={courseCompleted === false}
                    onChange={() => setCourseCompleted(false)}
                    className="accent-orange-500"
                  />
                  <span>No / In Progress</span>
                </label>
              </div>
            </div>

            {/* 9. Joining Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-orange-500" /> Company Joining Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={companyJoinDate}
                onChange={(e) => setCompanyJoinDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* 10. Prior Experience / Knowledge */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Briefcase size={16} className="text-orange-500" /> কাজ সম্পর্কে কোন প্রকার ধারণা আছে কিনা? <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasExperience"
                    checked={hasExperience === true}
                    onChange={() => setHasExperience(true)}
                    className="accent-orange-500"
                  />
                  <span>হ্যাঁ, আমার ধারণা আছে (Yes)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasExperience"
                    checked={hasExperience === false}
                    onChange={() => setHasExperience(false)}
                    className="accent-orange-500"
                  />
                  <span>না, আমার কোনো ধারণা নেই (No)</span>
                </label>
              </div>
            </div>

            {/* 11. Desired Work Selection (1 to max 3) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Your Work Task <span className="text-rose-500">*</span>
                </label>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Choose the work category you wish to undertake. Access will be granted immediately.
              </p>

              <div className="grid grid-cols-1 gap-2">
                {WORK_MODULES.map((mod) => {
                  const isEnabled = ['typing', 'form', 'data'].includes(mod.id);
                  const isSelected = selectedModule === mod.id;
                  
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      disabled={!isEnabled}
                      onClick={() => isEnabled && setSelectedModule(mod.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        !isEnabled 
                          ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                          : isSelected
                           ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{mod.title} {!isEnabled && '(Locked)'}</span>
                        {isSelected && <span className="text-orange-600 text-xs font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Question: Do you have any experience/idea about the selected tasks? */}
              <div className="mt-3 p-3 bg-orange-50/40 rounded-2xl border border-orange-200/50 space-y-2">
                <label className="block text-xs font-bold text-slate-800 leading-relaxed">
                  নির্বাচিত কাজ সম্পর্কে আপনার কি কোনো ধারণা আছে? <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="hasSelectedWorkKnowledge"
                      checked={hasSelectedWorkKnowledge === true}
                      onChange={() => setHasSelectedWorkKnowledge(true)}
                      className="accent-orange-500"
                    />
                    <span>হ্যাঁ (Yes)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="hasSelectedWorkKnowledge"
                      checked={hasSelectedWorkKnowledge === false}
                      onChange={() => setHasSelectedWorkKnowledge(false)}
                      className="accent-orange-500"
                    />
                    <span>না (No)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 12. Company Certificate */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-3">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileBadge size={16} className="text-orange-500" /> Have you received a certificate from the company?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasCertificate"
                    checked={hasCertificate === true}
                    onChange={() => setHasCertificate(true)}
                    className="accent-orange-500"
                  />
                  <span>Yes, I have a certificate</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="hasCertificate"
                    checked={hasCertificate === false}
                    onChange={() => {
                      setHasCertificate(false);
                      setCertificateDataUrl('');
                      setCertFileName('');
                    }}
                    className="accent-orange-500"
                  />
                  <span>No certificate</span>
                </label>
              </div>

              {hasCertificate && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Upload Certificate Image / Document <span className="text-rose-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-300 rounded-xl p-3 bg-white cursor-pointer hover:bg-orange-50/20 transition">
                    <Upload size={20} className="text-orange-500 mb-1" />
                    <span className="text-xs text-slate-600 font-medium">
                      {certFileName ? certFileName : 'Click to select certificate file'}
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, or PDF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleCertificateUpload}
                      className="hidden"
                    />
                  </label>

                  {certificateDataUrl && (
                    <div className="mt-2 text-center">
                      <img
                        src={certificateDataUrl}
                        alt="Certificate Preview"
                        className="max-h-28 mx-auto rounded-lg border border-slate-200 object-contain shadow-xs"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition shadow-md disabled:opacity-50 mt-4"
            >
              {registerLoading ? 'Submitting Application...' : 'Submit Registration Application'}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Your details will be securely sent to the administrator. Once approved, you will receive your designated work module.
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
