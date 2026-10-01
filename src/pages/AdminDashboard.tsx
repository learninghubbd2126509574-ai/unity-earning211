import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WORK_MODULES, getModuleTitle } from '../lib/modules';
import { 
  Users, 
  FileText, 
  Settings as ConfigIcon, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  LifeBuoy, 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  FileBadge, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  Lock,
  Edit3,
  Trash2,
  Plus,
  Minus,
  Check,
  MessageSquareQuote,
  Star,
  ThumbsUp,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Video,
  ExternalLink,
  Layers,
  Clock
} from 'lucide-react';
import { DATA_ENTRY_PROJECTS, downloadProjectExcel, DataEntryProjectDef } from '../lib/dataEntryDatasets';
import { ProjectSubmissionDoc, checkAndApplyAutoRejection } from '../lib/projectSubmissionService';
import { ProjectCountdownTimer } from '../components/ProjectCountdownTimer';
import { getDoc } from 'firebase/firestore';

export const AdminDashboard = () => {
  const { isAdminLogin, setAdminLogin } = useAuth();
  const navigate = useNavigate();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'pin' | 'notice' | 'work' | 'reviews' | 'data_entry'>('pending');
  
  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [dataEntrySubmissions, setDataEntrySubmissions] = useState<ProjectSubmissionDoc[]>([]);
  const [isVideoRequired, setIsVideoRequired] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  
  // PIN management
  const [currentPin, setCurrentPin] = useState('1234');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinUpdateSuccess, setPinUpdateSuccess] = useState('');
  const [pinUpdateError, setPinUpdateError] = useState('');

  // Notice & Support
  const [notice, setNotice] = useState({ message: '', isActive: false });
  const [noticeInput, setNoticeInput] = useState('');
  const [telegramInput, setTelegramInput] = useState('https://t.me/unityearning');
  const [whatsappInput, setWhatsappInput] = useState('https://wa.me/8801919012426');
  const [videoInput, setVideoInput] = useState('https://youtube.com');

  // Multi-job assignment map: userId -> string[] (selected module IDs)
  const [selectedJobsMap, setSelectedJobsMap] = useState<Record<string, string[]>>({});
  
  // Certificate view modal
  const [certificateModalUrl, setCertificateModalUrl] = useState<string | null>(null);
  
  // Password edit state (for both pending and active users)
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLogin) {
      navigate('/admin-login');
      return;
    }

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const fetchedUsers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(fetchedUsers);

      // Initialize selectedJobsMap for users if not already set
      setSelectedJobsMap((prev) => {
        const next = { ...prev };
        fetchedUsers.forEach((u: any) => {
          if (!next[u.id]) {
            if (u.assignedJobs && Array.isArray(u.assignedJobs) && u.assignedJobs.length > 0) {
              next[u.id] = u.assignedJobs;
            } else if (u.assignedJob) {
              next[u.id] = [u.assignedJob];
            } else if (u.preferredModules && u.preferredModules.length > 0) {
              next[u.id] = u.preferredModules;
            } else {
              next[u.id] = ['typing'];
            }
          }
        });
        return next;
      });
    });

    const unsubSubs = onSnapshot(collection(db, 'submissions'), (snap) => {
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubPin = onSnapshot(doc(db, 'settings', 'appConfig'), (snap) => {
      if (snap.exists() && snap.data()?.accessPin) {
        setCurrentPin(snap.data().accessPin);
      }
    });

    const unsubNotice = onSnapshot(doc(db, 'settings', 'globalNotice'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setNotice({ message: d.message || '', isActive: d.isActive || false });
        setNoticeInput(d.message || '');
      }
    });

    const unsubSupport = onSnapshot(doc(db, 'settings', 'support'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setTelegramInput(d.telegramUrl || 'https://t.me/unityearning');
        setWhatsappInput(d.whatsappUrl || 'https://wa.me/8801919012426');
        setVideoInput(d.videoUrl || d.url || 'https://youtube.com');
      }
    });

    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snap) => {
      setReviewsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubDataEntry = onSnapshot(collection(db, 'projectSubmissions'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectSubmissionDoc));
      setDataEntrySubmissions(list);
    });

    const unsubDataEntryConfig = onSnapshot(doc(db, 'settings', 'dataEntryConfig'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.isVideoRequired !== undefined) setIsVideoRequired(d.isVideoRequired);
      }
    });

    return () => {
      unsubUsers();
      unsubSubs();
      unsubPin();
      unsubNotice();
      unsubSupport();
      unsubReviews();
      unsubDataEntry();
      unsubDataEntryConfig();
    };
  }, [isAdminLogin, navigate]);

  if (!isAdminLogin) return null;

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Toggle module selection for a user in the UI
  const handleToggleUserModule = (userId: string, moduleId: string) => {
    setSelectedJobsMap((prev) => {
      const currentList = prev[userId] || [];
      if (currentList.includes(moduleId)) {
        // Remove
        const updated = currentList.filter(id => id !== moduleId);
        return { ...prev, [userId]: updated };
      } else {
        // Add
        return { ...prev, [userId]: [...currentList, moduleId] };
      }
    });
  };

  // Select all applied tasks for a user
  const handleSelectAppliedModules = (userId: string, preferred: string[]) => {
    if (!preferred || preferred.length === 0) return;
    setSelectedJobsMap((prev) => ({
      ...prev,
      [userId]: [...preferred]
    }));
  };

  // Select all modules for a user
  const handleSelectAllModules = (userId: string) => {
    setSelectedJobsMap((prev) => ({
      ...prev,
      [userId]: WORK_MODULES.map(m => m.id)
    }));
  };

  // Clear all modules for a user
  const handleClearModules = (userId: string) => {
    setSelectedJobsMap((prev) => ({
      ...prev,
      [userId]: []
    }));
  };

  // Save updated assigned jobs for an active user
  const handleSaveAssignedJobs = async (userId: string) => {
    const selected = selectedJobsMap[userId] || [];
    if (selected.length === 0) {
      alert('Please select at least 1 work task to assign.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        assignedJobs: selected,
        assignedJob: selected[0] || '',
        updatedAt: new Date().toISOString()
      });
      showNotification(`Assigned ${selected.length} work task(s) successfully!`);
    } catch (err: any) {
      console.error(err);
      alert('Failed to update assigned tasks: ' + err.message);
    }
  };

  // Approve pending registration with the chosen tasks
  const handleApproveUser = async (userId: string) => {
    const selected = selectedJobsMap[userId] || [];
    const chosenList = selected.length > 0 ? selected : ['typing'];

    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'active',
        assignedJobs: chosenList,
        assignedJob: chosenList[0] || 'typing',
        updatedAt: new Date().toISOString()
      });
      showNotification(`Application approved with ${chosenList.length} task(s) assigned!`);
    } catch (err: any) {
      console.error('Failed to approve user:', err);
      alert('Error approving user: ' + err.message);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'blocked',
        updatedAt: new Date().toISOString()
      });
      showNotification('User account set to blocked.');
    } catch (err: any) {
      console.error(err);
      alert('Error updating user status.');
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'active',
        updatedAt: new Date().toISOString()
      });
      showNotification('User account reactivated.');
    } catch (err: any) {
      console.error(err);
      alert('Error reactivating user.');
    }
  };

  const updateBalance = async (id: string, current: number, delta: number) => {
    const newBal = Number((current + delta).toFixed(2));
    if (newBal >= 0) await updateDoc(doc(db, 'users', id), { balance: newBal });
  };

  const updatePoints = async (id: string, current: number, delta: number) => {
    const newPoints = current + delta;
    if (newPoints >= 0) await updateDoc(doc(db, 'users', id), { microjobPoints: newPoints });
  };

  // Password reset/update for ANY user (pending, active, blocked)
  const handleUpdatePassword = async (id: string) => {
    if (!newPassword.trim()) {
      alert('Please enter a valid password.');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', id), { 
        passwordText: newPassword.trim(),
        updatedAt: new Date().toISOString()
      });
      setEditingPasswordId(null);
      setNewPassword('');
      showNotification('User password updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to update password: ' + err.message);
    }
  };

  const deleteUser = async (id: string) => {
    if (deleteConfirmId === id) {
      await deleteDoc(doc(db, 'users', id));
      setDeleteConfirmId(null);
      showNotification('User deleted permanently.');
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  // Save new 4-digit PIN
  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinUpdateSuccess('');
    setPinUpdateError('');

    if (!/^\d{4}$/.test(newPinInput.trim())) {
      setPinUpdateError('PIN must be exactly 4 numeric digits (e.g. 1234).');
      return;
    }

    try {
      await setDoc(doc(db, 'settings', 'appConfig'), {
        accessPin: newPinInput.trim(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setCurrentPin(newPinInput.trim());
      setNewPinInput('');
      setPinUpdateSuccess('Security Access PIN updated successfully!');
      setTimeout(() => setPinUpdateSuccess(''), 4000);
    } catch (err: any) {
      setPinUpdateError(err.message || 'Failed to update PIN.');
    }
  };

  const updateNotice = async (isActive: boolean) => {
    await setDoc(doc(db, 'settings', 'globalNotice'), {
      message: noticeInput,
      isActive,
      updatedAt: new Date().toISOString()
    });
    showNotification('Global banner updated.');
  };

  const updateSupport = async () => {
    await setDoc(doc(db, 'settings', 'support'), {
      telegramUrl: telegramInput.trim(),
      whatsappUrl: whatsappInput.trim(),
      videoUrl: videoInput.trim(),
      url: videoInput.trim(),
      updatedAt: new Date().toISOString()
    });
    showNotification('Official support channels & video tutorial updated successfully!');
  };

  const handleSubmissionReview = async (subId: string, userId: string, isApproved: boolean, customAmount?: number) => {
    let creditAmount = customAmount !== undefined ? customAmount : 1;
    const subDoc = submissions.find(s => s.id === subId);
    if (subDoc && subDoc.rewardAmount) {
      const match = String(subDoc.rewardAmount).match(/\d+(\.\d+)?/);
      if (match) {
        creditAmount = parseFloat(match[0]);
      }
    }

    if (isApproved && creditAmount > 0) {
      const user = users.find(u => u.id === userId);
      if (user) {
        await updateDoc(doc(db, 'users', userId), { balance: Number(((user.balance || 0) + creditAmount).toFixed(2)) });
      }
    }
    await updateDoc(doc(db, 'submissions', subId), {
      status: isApproved ? 'approved' : 'rejected',
      creditedAmount: isApproved ? creditAmount : 0,
      reviewedAt: new Date().toISOString()
    });
    showNotification(`Submission ${isApproved ? `Approved (+BDT ${creditAmount.toFixed(2)})` : 'Rejected'}.`);
  };

  const handleApproveReview = async (reviewId: string) => {
    await updateDoc(doc(db, 'reviews', reviewId), {
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
    showNotification('Student review approved and published live!');
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteDoc(doc(db, 'reviews', reviewId));
    showNotification('Review deleted.');
  };

  // Data Entry Project Moderation Handlers
  const handleAcceptProjectSubmission = async (sub: ProjectSubmissionDoc) => {
    if (!sub.id) return;
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'projectSubmissions', sub.id), {
      status: 'Accepted',
      acceptanceTime: now,
      reviewerId: 'admin',
      updatedAt: now
    });

    if (sub.userId) {
      const uDoc = await getDoc(doc(db, 'users', sub.userId));
      if (uDoc.exists()) {
        const curBal = uDoc.data().balance || 0;
        await updateDoc(doc(db, 'users', sub.userId), {
          balance: curBal + 1000
        });
      }
    }
    showNotification(`Project submission by ${sub.participantName} Accepted! (+BDT 1,000 rewarded)`);
  };

  const handleRejectProjectSubmission = async (sub: ProjectSubmissionDoc) => {
    if (!sub.id) return;
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'projectSubmissions', sub.id), {
      status: 'Rejected',
      rejectionTime: now,
      reviewerId: 'admin',
      rejectionReason: 'Submission did not pass Excel auditing or formula validation.',
      updatedAt: now
    });
    showNotification(`Project submission for ${sub.participantName} has been Rejected.`);
  };

  const handleDeleteProjectSubmission = async (subId: string) => {
    await deleteDoc(doc(db, 'projectSubmissions', subId));
    showNotification('Project submission record deleted.');
  };

  const handleToggleVideoReq = async () => {
    const nextVal = !isVideoRequired;
    await setDoc(doc(db, 'settings', 'dataEntryConfig'), {
      isVideoRequired: nextVal,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    setIsVideoRequired(nextVal);
    showNotification(`Video proof requirement set to ${nextVal ? 'ENABLED' : 'DISABLED'}.`);
  };

  // Filtered lists
  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active' || u.status === 'blocked');
  const pendingReviewsList = reviewsList.filter(r => r.status === 'pending');
  const approvedReviewsList = reviewsList.filter(r => r.status === 'approved');
  
  const underReviewProjects = dataEntrySubmissions.filter(s => s.status === 'Under Review');
  const acceptedProjects = dataEntrySubmissions.filter(s => s.status === 'Accepted');
  const rejectedProjects = dataEntrySubmissions.filter(s => s.status === 'Rejected');

  const filteredPending = pendingUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.whatsappNumber?.includes(q) ||
      u.studentIdCode?.includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.teamLeaderName?.toLowerCase().includes(q) ||
      u.teamTrainerName?.toLowerCase().includes(q)
    );
  });

  const filteredActive = activeUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.whatsappNumber?.includes(q) ||
      u.studentIdCode?.includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.teamLeaderName?.toLowerCase().includes(q) ||
      u.teamTrainerName?.toLowerCase().includes(q) ||
      u.assignedJob?.toLowerCase().includes(q) ||
      (u.assignedJobs && u.assignedJobs.some((j: string) => j.toLowerCase().includes(q)))
    );
  });

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Header */}
      <header className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-30 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">Admin Operations Control</h1>
            <p className="text-[10px] text-slate-400">Unity Earning Management Center</p>
          </div>
        </div>

        <button
          onClick={() => {
            setAdminLogin(false);
            navigate('/');
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <LogOut size={14} /> Exit Portal
        </button>
      </header>

      {/* Floating Action Success Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle size={16} />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex px-4 pt-3 gap-2 overflow-x-auto pb-3 bg-slate-900/60 border-b border-slate-800/80 hide-scrollbar">
        {[
          { id: 'pending', icon: <Users size={16} />, label: `Pending Applications (${pendingUsers.length})` },
          { id: 'active', icon: <CheckCircle size={16} />, label: `Active Users (${activeUsers.length})` },
          { id: 'data_entry', icon: <FileSpreadsheet size={16} />, label: `Data Entry Projects (${underReviewProjects.length} under review)` },
          { id: 'reviews', icon: <MessageSquareQuote size={16} />, label: `Reviews (${pendingReviewsList.length} pending)` },
          { id: 'pin', icon: <KeyRound size={16} />, label: 'Security PIN Setup' },
          { id: 'notice', icon: <ConfigIcon size={16} />, label: 'Notice & Support' },
          { id: 'work', icon: <FileText size={16} />, label: `Work Submissions (${pendingSubmissions.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 1. PENDING APPLICATIONS TAB */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="text-orange-400" size={20} />
                  Pending Registrations Review ({pendingUsers.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Review applicant profiles, check applied tasks, select authorized task checkboxes, and approve or reset passwords.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applicant name, ID, phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {filteredPending.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <CheckCircle size={36} className="mx-auto mb-2 opacity-40 text-emerald-500" />
                <p className="text-sm font-medium">No pending registration applications found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredPending.map(u => {
                  const userChosenJobs = selectedJobsMap[u.id] || (u.preferredModules && u.preferredModules.length > 0 ? u.preferredModules : ['typing']);

                  return (
                    <div key={u.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition">
                      
                      {/* Top Bar: Name, 7-Digit ID, Date & Password */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-white text-base">{u.fullName}</h3>
                            <span className="bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border border-orange-500/30">
                              7-Digit ID: {u.studentIdCode}
                            </span>
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-amber-500/30">
                              Pending Review
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Phone / WhatsApp: <span className="text-slate-200 font-mono">{u.whatsappNumber}</span> • Email: <span className="text-slate-200">{u.email}</span>
                          </p>
                        </div>

                        {/* Password Reset/Edit Section for Pending User */}
                        <div className="text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                          <span className="text-slate-400">Password:</span>
                          <span className="font-mono text-white font-bold">{u.passwordText || 'N/A'}</span>
                          {editingPasswordId !== u.id ? (
                            <button
                              onClick={() => {
                                setEditingPasswordId(u.id);
                                setNewPassword(u.passwordText || '');
                              }}
                              className="text-orange-400 hover:text-orange-300 font-bold text-[11px] ml-1 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 ml-1">
                              <input
                                type="text"
                                placeholder="New password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white w-28 focus:outline-none focus:border-orange-500"
                              />
                              <button
                                onClick={() => handleUpdatePassword(u.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingPasswordId(null)}
                                className="text-slate-400 hover:text-white text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Information Badges Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium">Team Leader:</span>
                          <span className="font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                            {u.teamLeaderName || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium">Team Trainer:</span>
                          <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {u.teamTrainerName || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Training, Experience & Certificate Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
                            <GraduationCap size={12} className="text-orange-400" /> Course Status
                          </div>
                          <span className={`font-semibold ${u.courseCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {u.courseCompleted ? '✓ Completed Training' : 'Incomplete / In Progress'}
                          </span>
                        </div>

                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
                            <Briefcase size={12} className="text-orange-400" /> Work Experience
                          </div>
                          <span className={`font-semibold ${u.hasExperience ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {u.hasExperience ? '✓ Has Prior Experience' : 'No Prior Experience'}
                          </span>
                        </div>

                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
                            <FileBadge size={12} className="text-orange-400" /> Certificate
                          </div>
                          {u.hasCertificate && u.certificateUrl ? (
                            <button
                              onClick={() => setCertificateModalUrl(u.certificateUrl)}
                              className="text-orange-400 hover:text-orange-300 font-bold underline flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> View Certificate
                            </button>
                          ) : (
                            <span className="text-slate-400 font-medium">None Submitted</span>
                          )}
                        </div>
                      </div>

                      {/* Applied / Preferred Tasks by User */}
                      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                          <div className="text-[11px] text-slate-300 uppercase font-bold flex items-center gap-1.5">
                            <Sparkles size={13} className="text-orange-400" /> Applicant Applied Work Tasks:
                          </div>
                          {u.preferredModules && u.preferredModules.length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleSelectAppliedModules(u.id, u.preferredModules)}
                              className="text-[10px] font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 cursor-pointer"
                            >
                              Select Applied Tasks ({u.preferredModules.length})
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {u.preferredModules?.map((modId: string) => (
                            <span key={modId} className="bg-orange-500/10 text-orange-300 px-2.5 py-1 rounded-lg text-xs font-semibold border border-orange-500/20 flex items-center gap-1">
                              <span>✓</span> {getModuleTitle(modId)}
                            </span>
                          )) || <span className="text-xs text-slate-500">None specified</span>}
                        </div>
                      </div>

                      {/* Checkbox Task Assignment & Approval Controls */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div>
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                              Assign Tasks (Tick mark 1, 2, 3 or any):
                            </span>
                            <span className="text-xs text-slate-400 ml-2 font-mono">
                              ({userChosenJobs.length} selected)
                            </span>
                          </div>
                          <div className="flex gap-2 text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleSelectAllModules(u.id)}
                              className="text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearModules(u.id)}
                              className="text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Interactive Task Checkboxes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {WORK_MODULES.map(m => {
                            const isChecked = userChosenJobs.includes(m.id);
                            return (
                              <label
                                key={m.id}
                                onClick={() => handleToggleUserModule(u.id, m.id)}
                                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all select-none ${
                                  isChecked 
                                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-sm'
                                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare size={16} className="text-orange-400 shrink-0" />
                                ) : (
                                  <Square size={16} className="text-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{m.title}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Approval Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 justify-end">
                          <button
                            onClick={() => handleApproveUser(u.id)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <CheckCircle size={16} /> Approve & Grant Access ({userChosenJobs.length} Tasks)
                          </button>
                          <button
                            onClick={() => handleRejectUser(u.id)}
                            className="px-4 py-2.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Reject Application
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. ACTIVE USERS MANAGEMENT TAB */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle className="text-emerald-400" size={20} />
                  Active Users & Multi-Task Assignment ({activeUsers.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Select or change work task permissions with checkboxes, edit passwords, adjust wallet balances, and manage status.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search active user, ID, task..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {filteredActive.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <Users size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No active or blocked users found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredActive.map(u => {
                  const userChosenJobs = selectedJobsMap[u.id] || (
                    u.assignedJobs && u.assignedJobs.length > 0
                      ? u.assignedJobs
                      : (u.assignedJob ? [u.assignedJob] : ['typing'])
                  );

                  return (
                    <div key={u.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition">
                      
                      {/* Top Bar: Name, 7-Digit ID, Status, and Password Controls */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-white text-base">{u.fullName}</h3>
                            <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-mono text-xs font-bold border border-slate-700">
                              7-Digit ID: {u.studentIdCode}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {u.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {u.whatsappNumber} • {u.email}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-1.5">
                            <span>Team Leader: <strong className="text-orange-400 font-semibold">{u.teamLeaderName || 'N/A'}</strong></span>
                            <span>Team Trainer: <strong className="text-amber-400 font-semibold">{u.teamTrainerName || 'N/A'}</strong></span>
                          </div>
                        </div>

                        {/* Password Management for Active Users */}
                        <div className="text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                          <span className="text-slate-400">Password:</span>
                          <span className="font-mono text-white font-bold">{u.passwordText || 'N/A'}</span>
                          {editingPasswordId !== u.id ? (
                            <button
                              onClick={() => {
                                setEditingPasswordId(u.id);
                                setNewPassword(u.passwordText || '');
                              }}
                              className="text-orange-400 hover:text-orange-300 font-bold text-[11px] ml-1 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 ml-1">
                              <input
                                type="text"
                                placeholder="New password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white w-28 focus:outline-none focus:border-orange-500"
                              />
                              <button
                                onClick={() => handleUpdatePassword(u.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingPasswordId(null)}
                                className="text-slate-400 hover:text-white text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Applied Tasks & Active Authorized Tasks Badges */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                            <Sparkles size={12} className="text-orange-400" /> Applicant Applied Tasks:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {u.preferredModules?.map((modId: string) => (
                              <span key={modId} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-700">
                                {getModuleTitle(modId)}
                              </span>
                            )) || <span className="text-slate-500 text-[11px]">None specified</span>}
                          </div>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1 flex items-center gap-1">
                            <CheckCircle size={12} className="text-emerald-400" /> Currently Authorized Tasks:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {userChosenJobs.map((modId: string) => (
                              <span key={modId} className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-500/30">
                                ✓ {getModuleTitle(modId)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Balance & Microjob Points Controls */}
                      <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-800/80">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Wallet Balance</div>
                          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                            BDT {(u.balance || 0).toFixed(2)}
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={() => updateBalance(u.id, u.balance || 0, 10)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => updateBalance(u.id, u.balance || 0, 50)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              +50
                            </button>
                            <button
                              onClick={() => updateBalance(u.id, u.balance || 0, -10)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              -10
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Microjob Points</div>
                          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                            {u.microjobPoints || 0} pts
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={() => updatePoints(u.id, u.microjobPoints || 0, 5)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => updatePoints(u.id, u.microjobPoints || 0, 20)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              +20
                            </button>
                            <button
                              onClick={() => updatePoints(u.id, u.microjobPoints || 0, -5)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              -5
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Task Assignment Checkboxes for Active User */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div>
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                              Change Task Permissions (Check 1, 2, 3 or any):
                            </span>
                            <span className="text-xs text-slate-400 ml-2 font-mono">
                              ({userChosenJobs.length} selected)
                            </span>
                          </div>
                          <div className="flex gap-2 text-[10px]">
                            {u.preferredModules && u.preferredModules.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleSelectAppliedModules(u.id, u.preferredModules)}
                                className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
                              >
                                Select Applied
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSelectAllModules(u.id)}
                              className="text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearModules(u.id)}
                              className="text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Interactive Checkboxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {WORK_MODULES.map(m => {
                            const isChecked = userChosenJobs.includes(m.id);
                            return (
                              <label
                                key={m.id}
                                onClick={() => handleToggleUserModule(u.id, m.id)}
                                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all select-none ${
                                  isChecked 
                                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-sm'
                                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare size={16} className="text-orange-400 shrink-0" />
                                ) : (
                                  <Square size={16} className="text-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{m.title}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 justify-between items-center">
                          <button
                            onClick={() => handleSaveAssignedJobs(u.id)}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <Check size={15} /> Save Task Permissions
                          </button>

                          <div className="flex gap-2">
                            {u.status === 'blocked' ? (
                              <button
                                onClick={() => handleReactivateUser(u.id)}
                                className="px-3 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-xs font-semibold transition cursor-pointer"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRejectUser(u.id)}
                                className="px-3 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
                              >
                                Deactivate
                              </button>
                            )}
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="px-3 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={13} /> {deleteConfirmId === u.id ? 'Confirm Delete?' : 'Delete'}
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. SECURITY PIN SETUP TAB */}
        {activeTab === 'pin' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <KeyRound size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">4-Digit Security Access PIN</h2>
                  <p className="text-xs text-slate-400">Manage device unlock PIN for restricted portal access</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Current Security PIN:</span>
                <span className="font-mono text-xl font-bold text-orange-400 tracking-widest bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-800">
                  {currentPin}
                </span>
              </div>

              {pinUpdateSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle size={16} /> {pinUpdateSuccess}
                </div>
              )}

              {pinUpdateError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={16} /> {pinUpdateError}
                </div>
              )}

              <form onSubmit={handleUpdatePin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Enter New 4-Digit PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newPinInput}
                    onChange={e => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 1234"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-mono tracking-widest text-center focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition shadow-md text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save New Security PIN
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. NOTICE & SUPPORT CONFIG TAB */}
        {activeTab === 'notice' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <ConfigIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Global Announcement Banner</h2>
                  <p className="text-xs text-slate-400">Broadcast message displayed at the top of the user app</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Announcement Message
                </label>
                <textarea
                  rows={3}
                  value={noticeInput}
                  onChange={e => setNoticeInput(e.target.value)}
                  placeholder="Enter notice text for all students..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => updateNotice(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle size={15} /> Publish & Enable Banner
                </button>
                <button
                  onClick={() => updateNotice(false)}
                  className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition text-xs cursor-pointer"
                >
                  Disable Banner
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <LifeBuoy size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Help & Official Support Channels</h2>
                  <p className="text-xs text-slate-400">Manage Telegram, WhatsApp, and Tutorial Video links for students</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 1. Telegram Channel URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span>Official Telegram Helpline / Channel Link</span>
                  </label>
                  <input
                    type="url"
                    value={telegramInput}
                    onChange={e => setTelegramInput(e.target.value)}
                    placeholder="https://t.me/your_telegram_channel"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* 2. WhatsApp Support Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>WhatsApp Helpline / Group Link</span>
                  </label>
                  <input
                    type="url"
                    value={whatsappInput}
                    onChange={e => setWhatsappInput(e.target.value)}
                    placeholder="https://wa.me/8801919012426"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* 3. Tutorial Video URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>Tutorial / Work Training Video URL</span>
                  </label>
                  <input
                    type="url"
                    value={videoInput}
                    onChange={e => setVideoInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                onClick={updateSupport}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition shadow-md text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Support Channels & Video URL
              </button>
            </div>
          </div>
        )}

        {/* 5. WORK SUBMISSIONS TAB */}
        {activeTab === 'work' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="text-orange-400" size={20} />
              Pending Work Proof Submissions ({pendingSubmissions.length})
            </h2>

            {pendingSubmissions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <CheckCircle size={36} className="mx-auto mb-2 opacity-40 text-emerald-500" />
                <p className="text-sm font-medium">No pending work submissions to review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingSubmissions.map(s => {
                  const submitter = users.find(u => u.id === s.userId);

                  return (
                    <div key={s.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30">
                            {s.moduleTitle || s.moduleId}
                          </span>
                          <h4 className="font-bold text-white text-sm mt-1">
                            {submitter?.fullName || 'Student User'}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-mono">
                            ID: {submitter?.studentIdCode || 'N/A'} • {submitter?.whatsappNumber}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      {s.details && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {s.details}
                        </div>
                      )}

                      {/* Photo Editing Image Preview */}
                      {s.imageProofUrl && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                          <div className="text-[11px] font-bold text-pink-400 flex items-center gap-1.5 uppercase">
                            <span>🖼️ Submitted Edited Photo ({s.taskProductType || 'Product'}):</span>
                          </div>
                          <div className="relative rounded-lg overflow-hidden bg-black max-h-56 flex items-center justify-center border border-slate-700">
                            <img src={s.imageProofUrl} alt="Submitted edit" className="max-h-52 object-contain" />
                          </div>
                        </div>
                      )}

                      {/* Screen Recording Video Proof Preview */}
                      {(s.videoUrl || s.screenRecordUrl) && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                          <div className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5 uppercase">
                            <Video size={13} />
                            <span>Video & Screen Recording Proof ({s.videoProofType || s.module}):</span>
                          </div>
                          
                          {s.videoUrl && (
                            <div>
                              {s.videoUrl.startsWith('http') && !s.videoUrl.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                                <a
                                  href={s.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 hover:text-blue-300 underline font-mono flex items-center gap-1 mb-1"
                                >
                                  <span>🔗 Open Video Link ({s.videoUrl.slice(0, 45)}...)</span>
                                </a>
                              ) : (
                                <video
                                  src={s.videoUrl}
                                  controls
                                  className="w-full max-h-48 rounded-lg bg-black object-contain"
                                />
                              )}
                            </div>
                          )}

                          {s.screenRecordUrl && s.screenRecordUrl !== s.videoUrl && (
                            <div className="pt-1 border-t border-slate-800 text-xs">
                              <span className="text-slate-400 font-semibold block mb-0.5">Timeline Screen Record:</span>
                              {s.screenRecordUrl.startsWith('http') ? (
                                <a
                                  href={s.screenRecordUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:underline font-mono"
                                >
                                  {s.screenRecordUrl}
                                </a>
                              ) : (
                                <span className="font-mono text-slate-300">{s.screenRecordUrl}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => handleSubmissionReview(s.id, s.userId, true)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle size={14} /> Approve (+{s.rewardAmount || 'BDT 1.00'})
                        </button>
                        <button
                          onClick={() => handleSubmissionReview(s.id, s.userId, false)}
                          className="px-4 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 font-semibold py-2 rounded-xl text-xs cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. REVIEWS MANAGEMENT TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquareQuote className="text-orange-400" size={20} />
                  Student Reviews Moderation & Management
                </h2>
                <p className="text-xs text-slate-400">
                  অনুমোদনের জন্য অপেক্ষমাণ ও লাইভ রিভিউ নিয়ন্ত্রণ করুন
                </p>
              </div>
            </div>

            {/* Pending Reviews Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertCircle size={16} />
                Pending Reviews for Approval ({pendingReviewsList.length})
              </h3>

              {pendingReviewsList.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
                  কোনো পেন্ডিং রিভিউ নেই। সকল রিভিউ অনুমোদিত আছে।
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingReviewsList.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-lg relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{rev.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                              Pending Review
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Student ID: {rev.submittedByStudentId || 'N/A'} • {rev.userPhone || ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-0.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap">
                        {rev.text}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                        >
                          <CheckCircle size={14} />
                          <span>Approve & Publish Live</span>
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="px-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Reviews Section */}
            {approvedReviewsList.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Approved & Live Custom Reviews ({approvedReviewsList.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedReviewsList.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{rev.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">
                            Live
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3">
                        {rev.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. DATA ENTRY PROJECTS & SUBMISSIONS MODERATION */}
        {activeTab === 'data_entry' && (
          <div className="space-y-6">
            
            {/* Header & Stats Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <FileSpreadsheet size={20} />
                  </span>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Data Entry Projects Management & Submissions Control
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Monitor participant Excel assignments, enforce 60-minute automated review timers, and audit video proofs.
                </p>
              </div>

              {/* Action Buttons: Video Requirement Toggle & Custom Project */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleToggleVideoReq}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    isVideoRequired 
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle whether participants must upload a screen-recording video"
                >
                  <Video size={14} className={isVideoRequired ? 'text-blue-400' : 'text-slate-500'} />
                  <span>Video Proof: {isVideoRequired ? 'Required (Default)' : 'Optional'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Submissions</span>
                <span className="text-xl font-black text-white mt-1 block">{dataEntrySubmissions.length}</span>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Under Review (Active)</span>
                <span className="text-xl font-black text-amber-400 mt-1 block flex items-center gap-1.5">
                  <Clock size={16} className="animate-spin-slow" />
                  {underReviewProjects.length}
                </span>
              </div>

              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Accepted & Certified</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">{acceptedProjects.length}</span>
              </div>

              <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Rejected / Expired</span>
                <span className="text-xl font-black text-rose-400 mt-1 block">{rejectedProjects.length}</span>
              </div>
            </div>

            {/* ACTIVE SUBMISSIONS TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" />
                    Participant Project Submissions ({dataEntrySubmissions.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Review submissions and verify work within the 60-minute window.
                  </p>
                </div>
              </div>

              {dataEntrySubmissions.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/60 text-xs text-slate-400">
                  No participant project submissions recorded yet. When participants submit an Excel project, it will appear here with a 60-minute review timer.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 px-3">Participant Name</th>
                        <th className="pb-3 px-3">Project</th>
                        <th className="pb-3 px-3">Submitted At</th>
                        <th className="pb-3 px-3">Review Deadline</th>
                        <th className="pb-3 px-3">Video Proof</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {dataEntrySubmissions.map((sub) => {
                        const isUnderReview = sub.status === 'Under Review';
                        const isAccepted = sub.status === 'Accepted';
                        const isRejected = sub.status === 'Rejected';

                        return (
                          <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                            
                            {/* Participant Name & Contact */}
                            <td className="py-3.5 px-3">
                              <div>
                                <span className="font-bold text-white block">{sub.participantName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {sub.studentIdCode || 'N/A'} • {sub.participantPhone}
                                </span>
                              </div>
                            </td>

                            {/* Project Title */}
                            <td className="py-3.5 px-3">
                              <span className="font-medium text-slate-200 block max-w-xs truncate" title={sub.projectTitle}>
                                {sub.projectTitle}
                              </span>
                              <span className="text-[10px] text-blue-400 font-mono">
                                {sub.excelFileName || 'Completed.xlsx'}
                              </span>
                            </td>

                            {/* Submitted At */}
                            <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                              <span className="block">{sub.submissionTime ? new Date(sub.submissionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                              <span className="text-[10px] text-slate-500">{sub.submissionTime ? new Date(sub.submissionTime).toLocaleDateString() : ''}</span>
                            </td>

                            {/* Review Deadline / Countdown */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {isUnderReview && sub.reviewDeadline ? (
                                <ProjectCountdownTimer 
                                  deadlineIso={sub.reviewDeadline} 
                                  size="sm" 
                                  showWarningText={false}
                                  onExpire={() => checkAndApplyAutoRejection(sub)}
                                />
                              ) : (
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {sub.reviewDeadline ? new Date(sub.reviewDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Expired'}
                                </span>
                              )}
                            </td>

                            {/* Video Submitted */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {sub.videoSubmitted ? (
                                <button
                                  onClick={() => {
                                    if (sub.videoUrl) {
                                      window.open(sub.videoUrl, '_blank');
                                    } else {
                                      setSelectedVideoUrl(sub.videoFileName || 'Attached File');
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[11px] font-bold transition cursor-pointer"
                                  title="View Screen Recording"
                                >
                                  <Video size={12} />
                                  <span>View Video</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500">No Video</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {isAccepted && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  <CheckCircle size={11} /> Accepted
                                </span>
                              )}
                              {isUnderReview && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                  <Clock size={11} /> Under Review
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  <XCircle size={11} /> {sub.autoRejected ? 'Auto-Rejected (60m)' : 'Rejected'}
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {isUnderReview && (
                                  <>
                                    <button
                                      onClick={() => handleAcceptProjectSubmission(sub)}
                                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
                                      title="Accept submission and award user (+BDT 1,000)"
                                    >
                                      <CheckCircle size={13} />
                                      <span>Accept</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectProjectSubmission(sub)}
                                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                      title="Reject submission"
                                    >
                                      <XCircle size={13} />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteProjectSubmission(sub.id!)}
                                  className="text-slate-500 hover:text-rose-400 p-1.5 transition cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* RAW DATASETS & PROJECT INVENTORY SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download size={16} className="text-emerald-400" />
                    Official Projects & Raw Datasets Library
                  </h3>
                  <p className="text-xs text-slate-400">
                    Administrator testing and download portal for all 4 project datasets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DATA_ENTRY_PROJECTS.map((proj) => (
                  <div key={proj.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        Project #{proj.number} • {proj.difficulty}
                      </span>
                      <h4 className="font-bold text-white text-xs sm:text-sm">
                        {proj.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {proj.recordsCount} • Est. {proj.estimatedHours}
                      </p>
                    </div>

                    <button
                      onClick={() => downloadProjectExcel(proj)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/30 transition cursor-pointer shrink-0"
                    >
                      <Download size={13} />
                      <span>Download .xlsx</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Certificate Modal */}
      {certificateModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileBadge size={20} className="text-orange-400" />
                Submitted Certificate Document
              </h3>
              <button
                onClick={() => setCertificateModalUrl(null)}
                className="text-slate-400 hover:text-white bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center">
              <img 
                src={certificateModalUrl} 
                alt="Certificate" 
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Proof Modal */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Video size={20} className="text-blue-400" />
                Submitted Video Proof
              </h3>
              <button
                onClick={() => setSelectedVideoUrl(null)}
                className="text-slate-400 hover:text-white bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
              <p className="text-xs text-slate-300">
                Attached Video / Recording Reference:
              </p>
              <div className="font-mono text-xs text-blue-400 bg-slate-900 p-3 rounded-xl border border-slate-800 break-all select-all">
                {selectedVideoUrl}
              </div>
              {selectedVideoUrl.startsWith('http') && (
                <a
                  href={selectedVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>Open Video in New Tab</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
