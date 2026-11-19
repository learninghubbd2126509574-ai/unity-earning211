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
  ArrowRightLeft,
  Send,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import {
  doc,
  updateDoc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  increment,
  onSnapshot
} from 'firebase/firestore';
import { getModuleTitle } from '../lib/modules';
import { updateDirectUserProfile } from '../lib/directAuth';

export const Profile = () => {
  const { user, profile, logout, lockPortal, updateCurrentProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Balance Transfer State
  const [recipientStudentId, setRecipientStudentId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [recipientNameFound, setRecipientNameFound] = useState<string | null>(null);
  const [isSearchingRecipient, setIsSearchingRecipient] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<{ id: string; title: string; projectSuccessId: string }[]>([]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.fullName || '');
      setEditPhone(profile.whatsappNumber || '');
      setEditPhoto(profile.photoUrl || '');
    }
  }, [profile, isEditing]);

  // Real-time recipient lookup via memberDirectory
  useEffect(() => {
    const cleanId = recipientStudentId.trim();
    if (user?.uid && /^\d{7}$/.test(cleanId) && cleanId !== profile?.studentIdCode) {
      setIsSearchingRecipient(true);
      getDoc(doc(db, 'memberDirectory', cleanId))
        .then((snap) => {
          if (snap.exists()) {
            const u = snap.data();
            setRecipientNameFound(u?.fullName || 'Verified Member');
          } else {
            setRecipientNameFound(null);
          }
        })
        .catch(() => {
          setRecipientNameFound(null);
        })
        .finally(() => {
          setIsSearchingRecipient(false);
        });
    } else {
      setRecipientNameFound(null);
    }
  }, [recipientStudentId, profile?.studentIdCode, user?.uid]);

  // Listen for user's verified approved projects (to surface real 7-digit projectSuccessId if earned)
  useEffect(() => {
    if (!user?.uid) return;
    const subsQ = query(collection(db, 'submissions'), where('userId', '==', user.uid));
    const projQ = query(collection(db, 'projectSubmissions'), where('userId', '==', user.uid));

    let subsList: { id: string; title: string; projectSuccessId: string }[] = [];
    let projList: { id: string; title: string; projectSuccessId: string }[] = [];

    const syncCombined = () => {
      setCompletedProjects([...subsList, ...projList]);
    };

    const unsub1 = onSnapshot(
      subsQ,
      (snap) => {
        const next: { id: string; title: string; projectSuccessId: string }[] = [];
        (snap.docs || []).forEach((docSnap: any) => {
          const d = docSnap.data();
          if (d.status === 'approved' && d.projectSuccessId) {
            next.push({
              id: docSnap.id,
              title: d.taskTitle || d.moduleTitle || 'Completed Project',
              projectSuccessId: String(d.projectSuccessId)
            });
          }
        });
        subsList = next;
        syncCombined();
      },
      (err) => console.warn('Profile submissions listener:', err)
    );

    const unsub2 = onSnapshot(
      projQ,
      (snap) => {
        const next: { id: string; title: string; projectSuccessId: string }[] = [];
        (snap.docs || []).forEach((docSnap: any) => {
          const d = docSnap.data();
          if (d.status === 'Accepted' && d.projectSuccessId) {
            next.push({
              id: docSnap.id,
              title: d.projectTitle || d.projectId || 'Data Entry Project',
              projectSuccessId: String(d.projectSuccessId)
            });
          }
        });
        projList = next;
        syncCombined();
      },
      (err) => console.warn('Profile projectSubmissions listener:', err)
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [user?.uid]);

  if (!user || !profile) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
          <UserIcon size={26} strokeWidth={1.6} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Sign In Required</h3>
          <p className="text-xs text-slate-500">Please sign in to access your profile details.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-[#0A4D8C] hover:bg-[#083D70] text-white px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer"
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
        setProfileError('Image must be smaller than 2MB.');
        return;
      }
      setProfileError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editName.trim() || !editPhone.trim()) {
      setProfileError('Full name and contact number are required.');
      return;
    }
    setProfileError('');
    setSaving(true);
    try {
      const updatedFields = {
        fullName: editName.trim(),
        whatsappNumber: editPhone.trim(),
        photoUrl: editPhoto || ''
      };
      await updateDirectUserProfile(user.uid, updatedFields);
      updateCurrentProfile(updatedFields);

      updateDoc(doc(db, 'users', user.uid), updatedFields).catch(() => {});
      if (profile.studentIdCode && /^\d{7}$/.test(String(profile.studentIdCode))) {
        setDoc(
          doc(db, 'memberDirectory', String(profile.studentIdCode)),
          {
            uid: user.uid,
            studentIdCode: String(profile.studentIdCode),
            fullName: editName.trim(),
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ).catch(() => {});
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setProfileError('Failed to update profile details.');
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
      const dirSnap = await getDoc(doc(db, 'memberDirectory', cleanRecipientId));
      if (!dirSnap.exists() || !dirSnap.data()?.uid) {
        setTransferError('Recipient 7-Digit Account ID not found.');
        setTransferLoading(false);
        return;
      }

      const dirData = dirSnap.data();
      const recipientUid = String(dirData.uid);
      const recipientName = dirData.fullName || 'Verified Member';

      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(-amountNum)
      });

      await updateDoc(doc(db, 'users', recipientUid), {
        balance: increment(amountNum)
      });

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

      setTransferSuccess(`Successfully transferred BDT ${amountNum.toFixed(2)} to ID: ${cleanRecipientId}.`);
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
    <div className="p-3.5 sm:p-5 space-y-4 pb-20 bg-[#F4F5F7]">
      {/* Formal Member Identity Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs relative">
        <div className="absolute top-4 right-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F4F5F7] hover:bg-slate-200/70 rounded-lg transition-colors text-slate-700 text-xs font-medium border border-slate-200 cursor-pointer"
              title="Edit Profile"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                disabled={saving}
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#0A4D8C] hover:bg-[#083D70] rounded-lg transition-colors text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Save Changes"
              >
                {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={13} />}
                <span>Save</span>
              </button>
              <button
                disabled={saving}
                onClick={() => setIsEditing(false)}
                className="p-1.5 bg-[#F4F5F7] hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer"
                title="Cancel"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Portrait Frame */}
          <div className="relative w-18 h-18 shrink-0">
            <div className="w-full h-full bg-[#EEF5FC] rounded-full flex items-center justify-center border border-[#D4E4F7] overflow-hidden">
              {(isEditing ? editPhoto : profile.photoUrl) ? (
                <img
                  src={isEditing ? editPhoto : profile.photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon size={30} strokeWidth={1.5} className="text-[#0A4D8C]" />
              )}
            </div>

            <button
              onClick={() => {
                if (!isEditing) setIsEditing(true);
                fileInputRef.current?.click();
              }}
              className="absolute bottom-0 right-0 bg-[#0A4D8C] hover:bg-[#083D70] text-white p-1.5 rounded-full border-2 border-white transition cursor-pointer"
              title="Change photo"
            >
              <Camera size={11} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-2 max-w-xs">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold text-sm outline-none focus:border-[#0A4D8C]"
                />
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="WhatsApp / Phone"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 text-xs font-mono outline-none focus:border-[#0A4D8C]"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate pr-16">{profile.fullName}</h2>
                <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  ID {profile.studentIdCode} <span className="mx-1.5 text-slate-300">·</span> {profile.whatsappNumber}
                </p>
                <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">{profile.email || user.email}</p>
              </div>
            )}
          </div>
        </div>
        {profileError && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{profileError}</span>
          </div>
        )}
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-[#0A4D8C] text-white rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-white/15 p-2.5 rounded-lg">
            <Wallet size={20} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[11px] text-white/80 font-medium">Available Balance</div>
            <div className="text-xl sm:text-2xl font-semibold text-white font-mono tabular-nums">
              BDT {(profile.balance || 0).toFixed(2)}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/live-payments')}
          className="bg-white hover:bg-slate-100 text-[#0A4D8C] font-semibold px-3.5 py-2 rounded-lg text-xs transition cursor-pointer whitespace-nowrap"
        >
          View Payouts
        </button>
      </div>

      {/* Balance Transfer Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
            <ArrowRightLeft size={16} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Balance Transfer</h3>
            <p className="text-[11px] text-slate-500">Transfer funds instantly to any 7-digit member ID</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-3 bg-[#FEF7E0] border border-[#F3DFA2] rounded-lg text-xs flex items-start gap-2.5">
          <AlertCircle size={15} className="shrink-0 text-[#C88400] mt-0.5" />
          <p className="text-[11.5px] text-slate-700 leading-relaxed">
            Verify the recipient's 7-digit Account ID before confirming. Completed balance transfers cannot be reversed.
          </p>
        </div>

        {transferError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{transferError}</span>
          </div>
        )}

        {transferSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#0D7A5F] rounded-lg text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            <span>{transferSuccess}</span>
          </div>
        )}

        <form onSubmit={handleBalanceTransfer} className="space-y-3.5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Recipient 7-Digit Account ID <span className="text-rose-500">*</span>
              </label>
              {isSearchingRecipient && <span className="text-[11px] text-[#0A4D8C] font-medium">Checking...</span>}
              {recipientNameFound && (
                <span className="text-[11px] text-[#0D7A5F] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> {recipientNameFound}
                </span>
              )}
            </div>
            <input
              type="text"
              required
              maxLength={7}
              value={recipientStudentId}
              onChange={(e) => setRecipientStudentId(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 7-digit ID (e.g. 5938210)"
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono tracking-wider tabular-nums focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Transfer Amount (BDT) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                Available: ৳{(profile.balance || 0).toFixed(2)}
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
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono tabular-nums focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15"
            />

            <div className="flex gap-1.5 mt-2">
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTransferAmount(amt.toString())}
                  className="flex-1 py-1.5 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-slate-700 text-[11px] font-medium font-mono tabular-nums border border-slate-200 transition cursor-pointer"
                >
                  +{amt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTransferAmount((profile.balance || 0).toString())}
                className="px-3 py-1.5 rounded-lg bg-[#EEF5FC] hover:bg-[#D4E4F7] text-[#0A4D8C] text-[11px] font-semibold border border-[#D4E4F7] transition cursor-pointer"
              >
                All
              </button>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Transfer Fee</span>
              <span className="font-semibold text-[#0D7A5F] tabular-nums">0.00 BDT (Free)</span>
            </div>
            <div className="flex justify-between">
              <span>Settlement</span>
              <span className="font-medium text-slate-900">Instant</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={transferLoading || !profile.balance || profile.balance <= 0}
            className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
          >
            <Send size={13} />
            <span>{transferLoading ? 'Processing Transfer...' : 'Confirm & Transfer Balance'}</span>
          </button>
        </form>
      </div>

      {/* Authorized Work Tasks Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold text-slate-800">
            Authorized Work Modules
          </div>
          <span className={`text-[11px] font-semibold ${profile.status === 'active' ? 'text-[#0D7A5F]' : 'text-[#C88400]'}`}>
            {profile.status === 'active' ? 'Active Access' : 'Pending Approval'}
          </span>
        </div>

        {profile.status === 'pending' ? (
          <div className="p-3 bg-[#FEF7E0] rounded-lg border border-[#F3DFA2] text-xs text-slate-700 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-slate-900">
              <Clock size={14} className="text-[#C88400]" /> Application In Review
            </div>
            <p className="text-[11.5px]">
              Your account is under administrator review. Work modules will become accessible once approved.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {((profile.assignedJobs && profile.assignedJobs.length > 0) ? profile.assignedJobs : [profile.assignedJob || 'typing']).map(jobId => (
              <div key={jobId} className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-lg">
                <CheckCircle2 size={15} className="text-[#0D7A5F] shrink-0" />
                <span className="font-medium text-slate-900 text-xs">
                  {getModuleTitle(jobId)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Successful Project IDs */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold text-slate-800">
            Completed Project IDs (For Reviews)
          </div>
          <span className="text-[11px] font-mono tabular-nums font-semibold text-[#0A4D8C]">
            {completedProjects.length} Completed
          </span>
        </div>

        {completedProjects.length === 0 ? (
          <div className="p-3 bg-[#F8FAFC] border border-slate-200/80 rounded-lg text-xs text-slate-500">
            No completed successful project IDs yet. Once an admin approves your submitted project, your 7-digit Project ID will appear here.
          </div>
        ) : (
          <div className="space-y-1.5">
            {completedProjects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between gap-2 p-2.5 bg-[#EEF5FC] border border-[#D4E4F7] rounded-lg text-xs"
              >
                <span className="font-medium text-slate-900 truncate">{proj.title}</span>
                <span className="font-mono font-semibold text-[#0A4D8C] tabular-nums shrink-0">
                  ID: {proj.projectSuccessId}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Specifications */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
        <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-200 pb-2.5">
          Account Specifications
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="flex justify-between items-center py-2.5">
            <span className="text-slate-500">Account Status</span>
            <span className={`font-semibold capitalize ${profile.status === 'active' ? 'text-[#0D7A5F]' : 'text-[#C88400]'}`}>
              {profile.status || 'Pending'}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <span className="text-slate-500">7-Digit Student ID</span>
            <span className="font-semibold font-mono text-[#0A4D8C] tabular-nums">
              {profile.studentIdCode}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <span className="text-slate-500">Microjob Points</span>
            <span className="font-semibold text-slate-900 tabular-nums">{profile.microjobPoints || 0} Pts</span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <span className="text-slate-500">Team Leader</span>
            <span className="font-medium text-slate-900">{profile.teamLeaderName || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <span className="text-slate-500">Team Trainer</span>
            <span className="font-medium text-slate-900">{profile.teamTrainerName || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <span className="text-slate-500">Joining Date</span>
            <span className="font-medium text-slate-700 font-mono tabular-nums">{profile.companyJoinDate || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <span className="text-slate-500">Training Course</span>
            <span className="font-medium text-slate-700">
              {profile.courseCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
          {profile.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex justify-between items-center py-2.5 px-3 text-[#0A4D8C] font-semibold bg-[#EEF5FC] hover:bg-[#D4E4F7]/70 rounded-lg transition-colors cursor-pointer"
            >
              <span>Admin Operations Dashboard</span>
              <ShieldAlert size={15} />
            </button>
          )}

          <button
            onClick={lockPortal}
            className="w-full flex justify-between items-center py-2.5 px-3 text-slate-700 font-medium hover:bg-[#F4F5F7] rounded-lg transition-colors cursor-pointer"
          >
            <span>Lock Security PIN</span>
            <Lock size={15} className="text-slate-500" />
          </button>

          <button
            onClick={logout}
            className="w-full flex justify-between items-center py-2.5 px-3 text-rose-700 font-semibold hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <span>Sign Out</span>
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
