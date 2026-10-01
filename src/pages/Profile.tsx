import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, 
  Wallet, 
  User as UserIcon, 
  ShieldAlert, 
  Edit2, 
  Check, 
  X, 
  Camera, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  GraduationCap,
  ArrowRightLeft,
  Send,
  AlertCircle,
  Sparkles,
  Users,
  Award,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { 
  doc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  increment 
} from 'firebase/firestore';
import { getModuleTitle } from '../lib/modules';

export const Profile = () => {
  const { user, profile, logout, lockPortal } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Balance Transfer State
  const [recipientStudentId, setRecipientStudentId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [recipientNameFound, setRecipientNameFound] = useState<string | null>(null);
  const [isSearchingRecipient, setIsSearchingRecipient] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.fullName || '');
      setEditPhone(profile.whatsappNumber || '');
      setEditPhoto(profile.photoUrl || '');
    }
  }, [profile, isEditing]);

  // Real-time recipient lookup
  useEffect(() => {
    const cleanId = recipientStudentId.trim();
    if (/^\d{7}$/.test(cleanId) && cleanId !== profile?.studentIdCode) {
      setIsSearchingRecipient(true);
      const userQ = query(collection(db, 'users'), where('studentIdCode', '==', cleanId));
      getDocs(userQ).then((snap) => {
        if (!snap.empty) {
          const u = snap.docs[0].data();
          setRecipientNameFound(u.fullName || 'Verified Member');
        } else {
          setRecipientNameFound(null);
        }
      }).catch(() => {
        setRecipientNameFound(null);
      }).finally(() => {
        setIsSearchingRecipient(false);
      });
    } else {
      setRecipientNameFound(null);
    }
  }, [recipientStudentId, profile?.studentIdCode]);

  if (!user || !profile) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <UserIcon size={32} />
        </div>
        <h3 className="text-base font-bold text-slate-800">Please Sign In</h3>
        <p className="text-xs text-slate-500">You must be logged in to view your account profile.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editName.trim() || !editPhone.trim()) {
      alert("Full name and contact number are required.");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: editName.trim(),
        whatsappNumber: editPhone.trim(),
        photoUrl: editPhoto
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  const handleBalanceTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    setTransferSuccess('');

    const cleanRecipientId = recipientStudentId.trim();
    const amountNum = parseFloat(transferAmount);

    if (!/^\d{7}$/.test(cleanRecipientId)) {
      setTransferError('Recipient Code must be exactly 7 numeric digits.');
      return;
    }

    if (cleanRecipientId === profile.studentIdCode) {
      setTransferError('Cannot transfer balance to your own Account ID.');
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      setTransferError('Please enter a valid transfer amount.');
      return;
    }

    const currentBalance = profile.balance || 0;
    if (amountNum > currentBalance) {
      setTransferError(`Insufficient balance. Maximum transferable: BDT ${currentBalance.toFixed(2)}`);
      return;
    }

    setTransferLoading(true);

    try {
      // 1. Deduct from sender's wallet
      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(-amountNum)
      });

      // 2. Check if recipient exists by studentIdCode to credit them
      let recipientName = 'Member Account';
      const userQ = query(collection(db, 'users'), where('studentIdCode', '==', cleanRecipientId));
      const userSnap = await getDocs(userQ);

      if (!userSnap.empty) {
        const recipientDoc = userSnap.docs[0];
        recipientName = recipientDoc.data()?.fullName || recipientName;
        await updateDoc(doc(db, 'users', recipientDoc.id), {
          balance: increment(amountNum)
        });
      }

      // 3. Log transfer transaction
      await addDoc(collection(db, 'transfers'), {
        senderId: user.uid,
        senderName: profile.fullName || 'Member',
        senderStudentId: profile.studentIdCode,
        recipientStudentId: cleanRecipientId,
        recipientName,
        amount: amountNum,
        createdAt: new Date().toISOString(),
        status: 'completed'
      });

      setTransferSuccess(`Successfully transferred BDT ${amountNum.toFixed(2)} to ID: ${cleanRecipientId}!`);
      setTransferAmount('');
      setRecipientStudentId('');
    } catch (err: any) {
      console.error(err);
      setTransferError(err.message || 'Transfer failed. Please try again.');
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 pb-10 rounded-b-[36px] shadow-sm text-center relative">
        <div className="absolute top-4 right-4">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
              title="Edit Profile"
            >
              <Edit2 size={16} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                disabled={saving} 
                onClick={handleSave} 
                className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-full transition-colors text-white"
                title="Save Changes"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
              </button>
              <button 
                disabled={saving} 
                onClick={() => setIsEditing(false)} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Profile Picture - Perfect Circular Frame with Blank Silhouette Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-xl overflow-hidden relative">
            {isEditing ? (
              editPhoto ? (
                <img src={editPhoto} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-900 fill-current p-1.5">
                  <circle cx="50" cy="38" r="20" className="fill-slate-600" />
                  <path d="M16 95 C16 68, 30 58, 50 58 C70 58, 84 68, 84 95 Z" className="fill-slate-600" />
                </svg>
              )
            ) : (
              profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-900 fill-current p-1.5" title="Default Blank Portrait">
                  <circle cx="50" cy="38" r="20" className="fill-slate-600" />
                  <path d="M16 95 C16 68, 30 58, 50 58 C70 58, 84 68, 84 95 Z" className="fill-slate-600" />
                </svg>
              )
            )}
          </div>
          
          <button 
            onClick={() => {
              if (!isEditing) setIsEditing(true);
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-400 text-white p-2 rounded-full border-2 border-slate-900 shadow-md active:scale-95 transition cursor-pointer"
            title="ছবি পরিবর্তন করুন"
          >
            <Camera size={13} />
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handlePhotoChange}
          />
        </div>

        {isEditing ? (
          <div className="space-y-2 px-4 mt-2 max-w-xs mx-auto">
            <input 
              type="text" 
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Full Legal Name"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-center font-bold text-sm outline-none focus:border-orange-500"
            />
            <input 
              type="text" 
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
              placeholder="WhatsApp / Phone"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 text-center text-xs outline-none focus:border-orange-500"
            />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold">{profile.fullName}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{profile.whatsappNumber}</p>
            <div className="mt-2.5 text-xs bg-slate-800 text-orange-400 font-mono inline-block px-3 py-1 rounded-full border border-slate-700 font-semibold shadow-inner">
              7-Digit Account ID: {profile.studentIdCode}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono">
              {profile.email || user.email}
            </div>
          </>
        )}
      </div>

      <div className="p-4 -mt-5 space-y-4">
        {/* Wallet Balance Card */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
              <Wallet size={24} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Wallet Balance</div>
              <div className="text-2xl font-bold text-slate-800">BDT {(profile.balance || 0).toFixed(2)}</div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/live-payments')}
            className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl text-xs h-fit hover:bg-emerald-100 transition flex items-center gap-1"
          >
            <span>Live Payouts</span>
          </button>
        </div>

        {/* BALANCE TRANSFER SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <ArrowRightLeft size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Balance Transfer</h3>
                <p className="text-[11px] text-slate-400">Transfer funds instantly to any 7-digit Account ID</p>
              </div>
            </div>
          </div>

          {/* Important Transfer Warning Box */}
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle size={17} className="shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-0.5 leading-snug">
              <strong className="font-bold text-amber-950 block">Important Notice:</strong>
              <p className="text-[11px] text-amber-800">
                Always double-check the recipient's 7-Digit Account ID Code before confirming. Transferring to an incorrect ID Code cannot be reversed.
              </p>
            </div>
          </div>

          {transferError && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{transferError}</span>
            </div>
          )}

          {transferSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
              <span>{transferSuccess}</span>
            </div>
          )}

          <form onSubmit={handleBalanceTransfer} className="space-y-3.5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Recipient 7-Digit Account ID Code <span className="text-rose-500">*</span>
                </label>
                {isSearchingRecipient && (
                  <span className="text-[10px] text-blue-500 font-semibold animate-pulse">
                    Verifying ID...
                  </span>
                )}
                {recipientNameFound && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={11} /> {recipientNameFound}
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                maxLength={7}
                value={recipientStudentId}
                onChange={(e) => setRecipientStudentId(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 7-digit recipient ID (e.g. 5938210)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Transfer Amount (BDT) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Available: BDT {(profile.balance || 0).toFixed(2)}
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                min="1"
                max={profile.balance || 0}
                required
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Amount in BDT (e.g. 100)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />

              {/* Quick Amount Presets */}
              <div className="flex gap-2 mt-2">
                {[50, 100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTransferAmount(amt.toString())}
                    className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold font-mono transition cursor-pointer"
                  >
                    +{amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTransferAmount((profile.balance || 0).toString())}
                  className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 text-[10px] font-bold transition cursor-pointer"
                >
                  All
                </button>
              </div>
            </div>

            {/* Fee Calculation Summary */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Platform Transfer Fee:</span>
                <span className="font-bold text-emerald-600">0.00 BDT (Free)</span>
              </div>
              <div className="flex justify-between">
                <span>Settlement Speed:</span>
                <span className="font-bold text-slate-800">Instant (Real-Time)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={transferLoading || !profile.balance || profile.balance <= 0}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
            >
              <Send size={14} />
              {transferLoading ? 'Processing Transfer...' : 'Confirm & Transfer Balance'}
            </button>
          </form>
        </div>

        {/* Authorized Work Tasks Card */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-100 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Authorized Work Assignment
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
              profile.status === 'active' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {profile.status === 'active' ? 'Active Access' : 'Pending Approval'}
            </span>
          </div>

          {profile.status === 'pending' ? (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Clock size={15} /> Application In Review
              </div>
              <p className="text-[11px] text-amber-700">
                Your account is currently under administrator review. Work module tasks will become accessible once approved.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {((profile.assignedJobs && profile.assignedJobs.length > 0) ? profile.assignedJobs : [profile.assignedJob || 'typing']).map(jobId => (
                <div key={jobId} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-800 text-xs">
                    {getModuleTitle(jobId)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Access to work modules is determined by administrator assignment.
          </p>
        </div>

        {/* Account Details & Settings */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-100 p-5 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Account Specifications
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Account Status</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                profile.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {profile.status || 'Pending'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">7-Digit Student Account ID</span>
              <span className="font-bold font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                {profile.studentIdCode}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Microjob Points</span>
              <span className="font-bold text-slate-800">{profile.microjobPoints || 0} Pts</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Team Leader</span>
              <span className="font-semibold text-slate-800">{profile.teamLeaderName || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Team Trainer</span>
              <span className="font-semibold text-slate-800">{profile.teamTrainerName || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Company Joining Date</span>
              <span className="font-semibold text-slate-700 font-mono">{profile.companyJoinDate || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Training Course Status</span>
              <span className="font-semibold text-slate-700">
                {profile.courseCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>

            {profile.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')}
                className="w-full flex justify-between items-center py-2.5 text-orange-600 font-bold hover:bg-orange-50 rounded-xl px-2 transition-colors mt-2"
              >
                <span>Admin Operations Dashboard</span>
                <ShieldAlert size={16} />
              </button>
            )}

            <button 
              onClick={lockPortal}
              className="w-full flex justify-between items-center py-2.5 text-slate-700 font-semibold hover:bg-slate-50 rounded-xl px-2 transition-colors"
            >
              <span>Lock Security PIN</span>
              <Lock size={16} />
            </button>

            <button 
              onClick={logout}
              className="w-full flex justify-between items-center py-2.5 text-rose-600 font-semibold hover:bg-rose-50 rounded-xl px-2 transition-colors"
            >
              <span>Sign Out</span>
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
