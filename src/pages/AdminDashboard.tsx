import React, { useState, useEffect, useMemo } from 'react';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  hashAuthLookupKey,
  normalizePhoneDigits,
  OperationType
} from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WORK_MODULES, getModuleTitle } from '../lib/modules';
import {
  adminDeleteAllDirectUsers,
  adminDeleteDirectUser,
  adminUpdateDirectUser,
  fetchAllDirectAdminUsers,
} from '../lib/directAuth';
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
  Briefcase, 
  GraduationCap,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  Check,
  MessageSquareQuote,
  Star,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Video,
  ExternalLink,
  Clock,
  Megaphone,
  ShoppingBag,
  PenTool,
  Mic,
  Phone,
  Mail,
  PlayCircle
} from 'lucide-react';
import { DATA_ENTRY_PROJECTS, downloadProjectExcel } from '../lib/dataEntryDatasets';
import { ProjectSubmissionDoc, checkAndApplyAutoRejection } from '../lib/projectSubmissionService';
import { CustomAdminPopupModal } from '../components/CustomAdminPopupModal';
import { ProjectCountdownTimer } from '../components/ProjectCountdownTimer';

function getAdminYouTubeEmbedUrl(rawUrl?: string): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const url = new URL(normalized);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    let videoId = '';
    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || '';
    } else if (host.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) videoId = url.pathname.split('/embed/')[1]?.split('/')[0] || '';
      else if (url.pathname.startsWith('/shorts/')) videoId = url.pathname.split('/shorts/')[1]?.split('/')[0] || '';
      else if (url.pathname.startsWith('/live/')) videoId = url.pathname.split('/live/')[1]?.split('/')[0] || '';
      else videoId = url.searchParams.get('v') || '';
    }
    if (videoId) return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0`;
  } catch {
    return null;
  }
  return null;
}

export const AdminDashboard = () => {
  const { isAdminLogin, setAdminLogin } = useAuth();
  const navigate = useNavigate();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'moderator' | 'affiliate' | 'typing' | 'pin' | 'notice' | 'users' | 'work' | 'data_entry' | 'reviews'>('users');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'pending' | 'blocked'>('all');
  
  // Data states
  const [firestoreUsers, setFirestoreUsers] = useState<any[]>([]);
  const [directUsers, setDirectUsers] = useState<any[]>([]);
  const users = useMemo(() => {
    const map = new Map<string, any>();
    firestoreUsers.forEach((u) => {
      if (u?.id || u?.uid) map.set(u.id || u.uid, u);
    });
    directUsers.forEach((u) => {
      if (u?.id || u?.uid) map.set(u.id || u.uid, u);
    });
    return Array.from(map.values()).sort((a: any, b: any) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    });
  }, [firestoreUsers, directUsers]);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [moderatorApplications, setModeratorApplications] = useState<any[]>([]);
  const [affiliateSubmissions, setAffiliateSubmissions] = useState<any[]>([]);
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
  const [whatsappInput, setWhatsappInput] = useState('https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p');
  const [videoInput, setVideoInput] = useState('https://youtube.com');
  const [logoInput, setLogoInput] = useState('');
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  // Custom User Popup Settings
  const [customPopupTitleInput, setCustomPopupTitleInput] = useState('গুরুত্বপূর্ণ নোটিশ');
  const [customPopupMessageInput, setCustomPopupMessageInput] = useState('');
  const [customPopupButtonTextInput, setCustomPopupButtonTextInput] = useState('বুঝেছি / ঠিক আছে');
  const [customPopupIsActive, setCustomPopupIsActive] = useState(false);
  const [showCustomPopupPreview, setShowCustomPopupPreview] = useState(false);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Logo image must be smaller than 4MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        if (res.length > 850000) {
          alert('Logo exceeds 850KB size limit. Please compress or use a smaller image.');
          return;
        }
        setLogoInput(res);
        showNotification('Company Logo uploaded! Click save button below to update.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Multi-job assignment map: userId -> string[] (selected module IDs)
  const [selectedJobsMap, setSelectedJobsMap] = useState<Record<string, string[]>>({});
  
  // Certificate view modal
  const [certificateModalUrl, setCertificateModalUrl] = useState<string | null>(null);
  
  // Password edit state (for both pending and active users)
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const videoPreviewEmbed = useMemo(() => getAdminYouTubeEmbedUrl(videoInput), [videoInput]);

  useEffect(() => {
    if (!isAdminLogin) {
      navigate('/admin-login');
      return;
    }

    // Ensure current Firebase session has admin identity for Firestore rules
    const ensureAdminAuth = async () => {
      const curEmail = auth.currentUser?.email?.toLowerCase();
      if (
        curEmail !== '01919012426@portal.unityearning.internal' &&
        curEmail !== 'admin@portal.unityearning.internal' &&
        curEmail !== 'learninghubbd2126509574@gmail.com'
      ) {
        try {
          await signInWithEmailAndPassword(auth, '01919012426@portal.unityearning.internal', '212650');
        } catch (e) {
          console.warn('Silent admin auth check notice:', e);
        }
      }
    };
    ensureAdminAuth();

    const onListenerError = (path: string) => (error: unknown) => {
      console.error(`Firestore Admin Listener (${OperationType.LIST} ${path}):`, error);
    };

    // Load zero-limit direct registered users from backend and keep refreshed
    const syncDirectUsers = async () => {
      const list = await fetchAllDirectAdminUsers();
      setDirectUsers(list);
      setSelectedJobsMap((prev) => {
        const next = { ...prev };
        list.forEach((u: any) => {
          const uidKey = u.id || u.uid;
          if (!next[uidKey]) {
            if (u.assignedJobs && Array.isArray(u.assignedJobs) && u.assignedJobs.length > 0) {
              next[uidKey] = u.assignedJobs;
            } else if (u.assignedJob) {
              next[uidKey] = [u.assignedJob];
            } else if (u.preferredModules && u.preferredModules.length > 0) {
              next[uidKey] = u.preferredModules;
            } else {
              next[uidKey] = ['typing'];
            }
          }
        });
        return next;
      });
    };

    syncDirectUsers();
    const directPoll = setInterval(syncDirectUsers, 6000);

    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const fetchedUsers = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => {
            const ta = new Date(a.createdAt || 0).getTime();
            const tb = new Date(b.createdAt || 0).getTime();
            return tb - ta;
          });
        setFirestoreUsers(fetchedUsers);

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
      },
      onListenerError('users')
    );

    const unsubSubs = onSnapshot(
      collection(db, 'submissions'),
      (snap) => {
        setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      onListenerError('submissions')
    );

    const unsubPin = onSnapshot(
      doc(db, 'settings', 'appConfig'),
      (snap) => {
        if (snap.exists() && snap.data()?.accessPin) {
          setCurrentPin(snap.data().accessPin);
        }
      },
      onListenerError('settings/appConfig')
    );

    const unsubNotice = onSnapshot(
      doc(db, 'settings', 'globalNotice'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setNotice({ message: d.message || '', isActive: d.isActive || false });
          setNoticeInput(d.message || '');
        }
      },
      onListenerError('settings/globalNotice')
    );

    const unsubSupport = onSnapshot(
      doc(db, 'settings', 'support'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setTelegramInput(d.telegramUrl || 'https://t.me/unityearning');
          setWhatsappInput(d.whatsappUrl || 'https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p');
          setVideoInput(d.videoUrl || d.url || 'https://youtube.com');
          setLogoInput(d.logoUrl || '');
        }
      },
      onListenerError('settings/support')
    );

    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snap) => {
        setReviewsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      onListenerError('reviews')
    );

    const unsubDataEntry = onSnapshot(
      collection(db, 'projectSubmissions'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectSubmissionDoc));
        setDataEntrySubmissions(list);
      },
      onListenerError('projectSubmissions')
    );

    const unsubDataEntryConfig = onSnapshot(
      doc(db, 'settings', 'dataEntryConfig'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (d.isVideoRequired !== undefined) setIsVideoRequired(d.isVideoRequired);
        }
      },
      onListenerError('settings/dataEntryConfig')
    );

    const unsubCustomPopup = onSnapshot(
      doc(db, 'settings', 'customPopup'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setCustomPopupTitleInput(d.title || 'অফিশিয়াল জরুরি নোটিশ');
          setCustomPopupMessageInput(d.message || '');
          setCustomPopupButtonTextInput(d.buttonText || 'বুঝেছি / ঠিক আছে');
          setCustomPopupIsActive(d.isActive || false);
        }
      },
      onListenerError('settings/customPopup')
    );

    const unsubModeratorApps = onSnapshot(
      collection(db, 'moderatorApplications'),
      (snap) => {
        setModeratorApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      onListenerError('moderatorApplications')
    );

    const unsubAffiliateSales = onSnapshot(
      collection(db, 'affiliateSubmissions'),
      (snap) => {
        setAffiliateSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      onListenerError('affiliateSubmissions')
    );

    return () => {
      clearInterval(directPoll);
      unsubUsers();
      unsubSubs();
      unsubPin();
      unsubNotice();
      unsubSupport();
      unsubReviews();
      unsubDataEntry();
      unsubDataEntryConfig();
      unsubCustomPopup();
      unsubModeratorApps();
      unsubAffiliateSales();
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
        const updated = currentList.filter(id => id !== moduleId);
        return { ...prev, [userId]: updated };
      } else {
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

    const nowIso = new Date().toISOString();
    await adminUpdateDirectUser(userId, {
      assignedJobs: selected,
      assignedJob: selected[0] || '',
      updatedAt: nowIso,
    });
    setDirectUsers((prev) =>
      prev.map((u) =>
        u.id === userId || u.uid === userId
          ? { ...u, assignedJobs: selected, assignedJob: selected[0] || '', updatedAt: nowIso }
          : u
      )
    );
    updateDoc(doc(db, 'users', userId), {
      assignedJobs: selected,
      assignedJob: selected[0] || '',
      updatedAt: nowIso,
    }).catch(() => {});
    showNotification(`Tasks updated successfully (${selected.length} tasks assigned).`);
  };

  // Approve a pending user
  const handleApproveUser = async (userId: string) => {
    const selected = selectedJobsMap[userId] || [];
    if (selected.length === 0) {
      alert('Please select at least 1 work task before approving user.');
      return;
    }

    const nowIso = new Date().toISOString();
    const targetUser = users.find((u) => u.id === userId);
    const studentIdCode = targetUser?.studentIdCode || '';

    await adminUpdateDirectUser(userId, {
      status: 'active',
      assignedJobs: selected,
      assignedJob: selected[0] || '',
      updatedAt: nowIso,
    });
    setDirectUsers((prev) =>
      prev.map((u) =>
        u.id === userId || u.uid === userId
          ? { ...u, status: 'active', assignedJobs: selected, assignedJob: selected[0] || '', updatedAt: nowIso }
          : u
      )
    );

    updateDoc(doc(db, 'users', userId), {
      status: 'active',
      assignedJobs: selected,
      assignedJob: selected[0] || '',
      updatedAt: nowIso,
    }).catch(() => {});

    if (studentIdCode && /^\d{7}$/.test(studentIdCode)) {
      setDoc(
        doc(db, 'memberDirectory', studentIdCode),
        {
          studentIdCode,
          fullName: targetUser?.fullName || 'Verified Member',
          whatsappNumber: targetUser?.whatsappNumber || '',
          status: 'active',
          updatedAt: nowIso,
        },
        { merge: true }
      ).catch(() => {});
    }

    showNotification(`User approved successfully! Access granted to ${selected.length} tasks.`);
  };

  // Reject / Deactivate user
  const handleRejectUser = async (userId: string) => {
    const nowIso = new Date().toISOString();
    await adminUpdateDirectUser(userId, { status: 'blocked', updatedAt: nowIso });
    setDirectUsers((prev) =>
      prev.map((u) => (u.id === userId || u.uid === userId ? { ...u, status: 'blocked', updatedAt: nowIso } : u))
    );
    updateDoc(doc(db, 'users', userId), { status: 'blocked', updatedAt: nowIso }).catch(() => {});
    showNotification('অ্যাকাউন্ট ডিঅ্যাক্টিভেট (Deactivated) করা হয়েছে।');
  };

  const handleReactivateUser = async (userId: string) => {
    const nowIso = new Date().toISOString();
    await adminUpdateDirectUser(userId, { status: 'active', updatedAt: nowIso });
    setDirectUsers((prev) =>
      prev.map((u) => (u.id === userId || u.uid === userId ? { ...u, status: 'active', updatedAt: nowIso } : u))
    );
    updateDoc(doc(db, 'users', userId), { status: 'active', updatedAt: nowIso }).catch(() => {});
    showNotification('অ্যাকাউন্ট পুনরায় অ্যাক্টিভ (Reactivated) করা হয়েছে।');
  };

  const updateBalance = async (id: string, current: number, delta: number) => {
    const newBal = Number((current + delta).toFixed(2));
    if (newBal >= 0) {
      const nowIso = new Date().toISOString();
      await adminUpdateDirectUser(id, { balance: newBal, updatedAt: nowIso });
      setDirectUsers((prev) =>
        prev.map((u) => (u.id === id || u.uid === id ? { ...u, balance: newBal, updatedAt: nowIso } : u))
      );
      updateDoc(doc(db, 'users', id), { balance: newBal, updatedAt: nowIso }).catch(() => {});
      showNotification(`ব্যালেন্স আপডেট করা হয়েছে: BDT ${newBal.toFixed(2)}`);
    }
  };

  const updatePoints = async (id: string, current: number, delta: number) => {
    const newPoints = current + delta;
    if (newPoints >= 0) {
      const nowIso = new Date().toISOString();
      await adminUpdateDirectUser(id, { microjobPoints: newPoints, updatedAt: nowIso });
      setDirectUsers((prev) =>
        prev.map((u) => (u.id === id || u.uid === id ? { ...u, microjobPoints: newPoints, updatedAt: nowIso } : u))
      );
      updateDoc(doc(db, 'users', id), { microjobPoints: newPoints, updatedAt: nowIso }).catch(() => {});
      showNotification(`পয়েন্ট আপডেট করা হয়েছে: ${newPoints} pts`);
    }
  };

  // Password reset/update for ANY user (pending, active, blocked)
  const handleUpdatePassword = async (id: string) => {
    if (!newPassword.trim() || newPassword.trim().length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    const trimmedPass = newPassword.trim();
    const nowIso = new Date().toISOString();
    await adminUpdateDirectUser(id, { passwordText: trimmedPass, updatedAt: nowIso });
    setDirectUsers((prev) =>
      prev.map((u) => (u.id === id || u.uid === id ? { ...u, passwordText: trimmedPass, updatedAt: nowIso } : u))
    );
    updateDoc(doc(db, 'users', id), { passwordText: trimmedPass, updatedAt: nowIso }).catch(() => {});
    setEditingPasswordId(null);
    setNewPassword('');
    showNotification('User password updated and saved successfully!');
  };

  const handleSendPasswordResetEmail = async (userEmail?: string) => {
    if (!userEmail || !userEmail.includes('@')) {
      alert('No valid email address found for this account.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, userEmail.trim().toLowerCase());
      showNotification(`Password reset email sent to: ${userEmail}`);
    } catch (err: any) {
      alert('Password reset email error: ' + err.message);
    }
  };

  const deleteUser = async (id: string) => {
    if (deleteConfirmId === id) {
      const target = users.find((u) => u.id === id);
      await adminDeleteDirectUser(id);
      setDirectUsers((prev) => prev.filter((u) => u.id !== id && u.uid !== id));
      setFirestoreUsers((prev) => prev.filter((u) => u.id !== id && u.uid !== id));
      deleteDoc(doc(db, 'users', id)).catch(() => {});
      if (target?.studentIdCode && /^\d{7}$/.test(String(target.studentIdCode))) {
        deleteDoc(doc(db, 'memberDirectory', String(target.studentIdCode))).catch(() => {});
      }
      if (target?.whatsappNumber) {
        try {
          const phoneHash = await hashAuthLookupKey(normalizePhoneDigits(target.whatsappNumber) || target.whatsappNumber);
          deleteDoc(doc(db, 'authLookups', phoneHash)).catch(() => {});
        } catch {}
      }
      if (target?.studentIdCode) {
        try {
          const idHash = await hashAuthLookupKey(String(target.studentIdCode).trim());
          deleteDoc(doc(db, 'authLookups', idHash)).catch(() => {});
        } catch {}
      }
      setDeleteConfirmId(null);
      showNotification('User account deleted permanently.');
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3500);
    }
  };

  // Delete all registered student accounts from live database
  const handleDeleteAllUsers = async () => {
    setIsDeletingAll(true);
    try {
      const count = users.length;
      await adminDeleteAllDirectUsers();
      setDirectUsers([]);

      for (const u of firestoreUsers) {
        if (!u.id) continue;
        await deleteDoc(doc(db, 'users', u.id)).catch(() => {});
        if (u.studentIdCode && /^\d{7}$/.test(String(u.studentIdCode))) {
          await deleteDoc(doc(db, 'memberDirectory', String(u.studentIdCode))).catch(() => {});
        }
        if (u.whatsappNumber) {
          try {
            const phoneHash = await hashAuthLookupKey(normalizePhoneDigits(u.whatsappNumber) || u.whatsappNumber);
            await deleteDoc(doc(db, 'authLookups', phoneHash)).catch(() => {});
          } catch {}
        }
        if (u.studentIdCode) {
          try {
            const idHash = await hashAuthLookupKey(String(u.studentIdCode).trim());
            await deleteDoc(doc(db, 'authLookups', idHash)).catch(() => {});
          } catch {}
        }
      }
      setFirestoreUsers([]);
      setShowDeleteAllModal(false);
      showNotification(`All ${count} user accounts have been deleted. New registrations can now be created.`);
    } catch (err: any) {
      console.error('Failed to delete all accounts:', err);
      alert('Failed to delete all accounts: ' + err.message);
    } finally {
      setIsDeletingAll(false);
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
    try {
      await setDoc(doc(db, 'settings', 'globalNotice'), {
        message: noticeInput,
        isActive,
        updatedAt: new Date().toISOString()
      });
      showNotification('Global banner updated.');
    } catch (err: any) {
      alert('Failed to update notice banner: ' + err.message);
    }
  };

  const updateSupport = async () => {
    try {
      await setDoc(doc(db, 'settings', 'support'), {
        telegramUrl: telegramInput.trim(),
        whatsappUrl: whatsappInput.trim(),
        videoUrl: videoInput.trim(),
        url: videoInput.trim(),
        logoUrl: logoInput.trim(),
        updatedAt: new Date().toISOString()
      });
      showNotification('Official support channels, YouTube video guide & logo updated successfully!');
    } catch (err: any) {
      alert('Failed to update support & video settings: ' + err.message);
    }
  };

  const updateCustomPopup = async (isActive: boolean) => {
    try {
      await setDoc(doc(db, 'settings', 'customPopup'), {
        isActive,
        title: customPopupTitleInput.trim() || 'গুরুত্বপূর্ণ নোটিশ',
        message: customPopupMessageInput.trim(),
        buttonText: customPopupButtonTextInput.trim() || 'বুঝেছি / ঠিক আছে',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setCustomPopupIsActive(isActive);
      showNotification(isActive ? 'ইউজারদের জন্য স্পেশাল পপআপ সক্রিয় করা হয়েছে।' : 'স্পেশাল পপআপ বন্ধ করা হয়েছে।');
    } catch (err: any) {
      showNotification('পপআপ আপডেট ব্যর্থ: ' + err.message);
    }
  };

  const handleSubmissionReview = async (subId: string, userId: string, isApproved: boolean, customAmount?: number) => {
    try {
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
      const generatedProjectId = isApproved
        ? (subDoc?.projectSuccessId || String(1000000 + Math.floor(Math.random() * 9000000)))
        : undefined;

      await updateDoc(doc(db, 'submissions', subId), {
        status: isApproved ? 'approved' : 'rejected',
        creditedAmount: isApproved ? creditAmount : 0,
        ...(generatedProjectId ? { projectSuccessId: generatedProjectId } : {}),
        reviewedAt: new Date().toISOString()
      });
      showNotification(`Submission ${isApproved ? `Approved (+BDT ${creditAmount.toFixed(2)} · Project ID: ${generatedProjectId})` : 'Rejected'}.`);
    } catch (err: any) {
      alert('Failed to review submission: ' + err.message);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });
      showNotification('Student review approved and published live!');
    } catch (err: any) {
      alert('Failed to approve review: ' + err.message);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      showNotification('Review deleted.');
    } catch (err: any) {
      alert('Failed to delete review: ' + err.message);
    }
  };

  // Data Entry Project Moderation Handlers
  const handleAcceptProjectSubmission = async (sub: ProjectSubmissionDoc) => {
    if (!sub.id) return;
    try {
      const now = new Date().toISOString();
      const generatedProjectId = (sub as any).projectSuccessId || String(1000000 + Math.floor(Math.random() * 9000000));
      await updateDoc(doc(db, 'projectSubmissions', sub.id), {
        status: 'Accepted',
        acceptanceTime: now,
        projectSuccessId: generatedProjectId,
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
    } catch (err: any) {
      alert('Failed to accept project submission: ' + err.message);
    }
  };

  const handleRejectProjectSubmission = async (sub: ProjectSubmissionDoc) => {
    if (!sub.id) return;
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'projectSubmissions', sub.id), {
        status: 'Rejected',
        rejectionTime: now,
        reviewerId: 'admin',
        rejectionReason: 'Submission did not pass Excel auditing or formula validation.',
        updatedAt: now
      });
      showNotification(`Project submission for ${sub.participantName} has been Rejected.`);
    } catch (err: any) {
      alert('Failed to reject project submission: ' + err.message);
    }
  };

  const handleDeleteProjectSubmission = async (subId: string) => {
    try {
      await deleteDoc(doc(db, 'projectSubmissions', subId));
      showNotification('Project submission record deleted.');
    } catch (err: any) {
      alert('Failed to delete project submission: ' + err.message);
    }
  };

  const handleToggleVideoReq = async () => {
    try {
      const nextVal = !isVideoRequired;
      await setDoc(doc(db, 'settings', 'dataEntryConfig'), {
        isVideoRequired: nextVal,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setIsVideoRequired(nextVal);
      showNotification(`Video proof requirement set to ${nextVal ? 'ENABLED' : 'DISABLED'}.`);
    } catch (err: any) {
      alert('Failed to toggle video requirement: ' + err.message);
    }
  };

  // Moderator Applications Review Handlers
  const handleApproveModerator = async (appId: string, name: string) => {
    try {
      await updateDoc(doc(db, 'moderatorApplications', appId), {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });
      showNotification(`মডারেটর আবেদন অ্যাপ্রুভ করা হয়েছে (${name})`);
    } catch (err: any) {
      alert('Failed to approve moderator application: ' + err.message);
    }
  };

  const handleRejectModerator = async (appId: string) => {
    try {
      await updateDoc(doc(db, 'moderatorApplications', appId), {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });
      showNotification('মডারেটর আবেদন বাতিল করা হয়েছে।');
    } catch (err: any) {
      alert('Failed to reject moderator application: ' + err.message);
    }
  };

  const handleDeleteModerator = async (appId: string) => {
    try {
      await deleteDoc(doc(db, 'moderatorApplications', appId));
      showNotification('মডারেটর আবেদনের রেকর্ড মুছে ফেলা হয়েছে।');
    } catch (err: any) {
      alert('Failed to delete moderator application: ' + err.message);
    }
  };

  // Affiliate Sales Review Handlers
  const handleApproveAffiliateSale = async (saleId: string, sellerName: string, amount: number) => {
    try {
      await updateDoc(doc(db, 'affiliateSubmissions', saleId), {
        status: 'approved_paid',
        approvedAt: new Date().toISOString()
      });
      showNotification(`অ্যাফিলিয়েট কমিশন অ্যাপ্রুভ ও পেড সম্পন্ন! (+৳${amount}) - ${sellerName}`);
    } catch (err: any) {
      alert('Failed to approve affiliate sale: ' + err.message);
    }
  };

  const handleRejectAffiliateSale = async (saleId: string) => {
    try {
      await updateDoc(doc(db, 'affiliateSubmissions', saleId), {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });
      showNotification('অ্যাফিলিয়েট সেলস রিপোর্ট রিজেক্ট করা হয়েছে।');
    } catch (err: any) {
      alert('Failed to reject affiliate sale: ' + err.message);
    }
  };

  const handleDeleteAffiliateSale = async (saleId: string) => {
    try {
      await deleteDoc(doc(db, 'affiliateSubmissions', saleId));
      showNotification('অ্যাফিলিয়েট সেলস রেকর্ড মুছে ফেলা হয়েছে।');
    } catch (err: any) {
      alert('Failed to delete affiliate sale: ' + err.message);
    }
  };

  // Filtered lists
  const pendingModerators = moderatorApplications.filter(m => m.status === 'pending');
  const approvedModerators = moderatorApplications.filter(m => m.status === 'approved');
  
  const pendingAffiliates = affiliateSubmissions.filter(a => a.status === 'pending');
  const approvedAffiliates = affiliateSubmissions.filter(a => a.status === 'approved_paid');

  const typingSubmissions = submissions.filter(s => s.module === 'typing');

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const activeOnlyUsers = users.filter((u) => u.status === 'active');
  const blockedUsers = users.filter((u) => u.status === 'blocked');
  const pendingReviewsList = reviewsList.filter((r) => r.status === 'pending');
  const approvedReviewsList = reviewsList.filter((r) => r.status === 'approved');
  
  const underReviewProjects = dataEntrySubmissions.filter((s) => s.status === 'Under Review');
  const acceptedProjects = dataEntrySubmissions.filter((s) => s.status === 'Accepted');
  const rejectedProjects = dataEntrySubmissions.filter((s) => s.status === 'Rejected');

  const filteredAllUsers = users.filter((u) => {
    if (userStatusFilter !== 'all' && u.status !== userStatusFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.whatsappNumber?.includes(q) ||
      u.studentIdCode?.includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.teamLeaderName?.toLowerCase().includes(q) ||
      u.teamTrainerName?.toLowerCase().includes(q) ||
      u.assignedJob?.toLowerCase().includes(q) ||
      (u.preferredModules && u.preferredModules.some((j: string) => j.toLowerCase().includes(q))) ||
      (u.assignedJobs && u.assignedJobs.some((j: string) => j.toLowerCase().includes(q)))
    );
  });

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F7] text-[#1E2329] font-sans">
      
      {/* Top Header */}
      <header className="px-4 py-3 sm:px-6 border-b border-slate-200/90 bg-white sticky top-0 z-30 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7] flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">Admin Operations Control</h1>
              <span className="hidden sm:inline-flex text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Live Firebase Connected
              </span>
            </div>
            <p className="text-xs text-slate-500">Unity Earning Management & Administration Center</p>
          </div>
        </div>

        <button
          onClick={() => {
            setAdminLogin(false);
            navigate('/');
          }}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-[#F4F5F7] hover:bg-slate-200/80 border border-slate-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
        >
          <LogOut size={14} /> <span>Exit Portal</span>
        </button>
      </header>

      {/* Floating Action Success Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-16 right-4 z-50 bg-[#0D7A5F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle size={16} />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex px-4 sm:px-6 py-2.5 gap-2 overflow-x-auto bg-white border-b border-slate-200/90 hide-scrollbar shadow-xs">
        {[
          { id: 'moderator', icon: <ShieldCheck size={15} />, label: `মডারেটর আবেদন (${pendingModerators.length})` },
          { id: 'affiliate', icon: <ShoppingBag size={15} />, label: `অ্যাফিলিয়েট সেলস (${pendingAffiliates.length})` },
          { id: 'typing', icon: <PenTool size={15} />, label: `টাইপিং জব (${typingSubmissions.length})` },
          { id: 'pin', icon: <KeyRound size={15} />, label: 'লগইন সিকিউরিটি পিন' },
          { id: 'notice', icon: <ConfigIcon size={15} />, label: 'নোটিশ ও সাপোর্ট লিংক' },
          { id: 'users', icon: <Users size={15} />, label: `রেজিস্টার্ড ইউজার (${users.length})` },
          { id: 'work', icon: <FileText size={15} />, label: `কাজের প্রমাণ (${pendingSubmissions.length})` },
          { id: 'data_entry', icon: <FileSpreadsheet size={15} />, label: `ডাটা এন্ট্রি প্রোজেক্ট (${underReviewProjects.length})` },
          { id: 'reviews', icon: <MessageSquareQuote size={15} />, label: `রিভিউ (${pendingReviewsList.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#0A4D8C] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 1. MODERATOR APPLICATIONS TAB */}
        {activeTab === 'moderator' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-[#0A4D8C]" size={20} />
                  কন্টেন্ট মডারেটর জব অ্যাপ্লিকেশন রিভিউ ({moderatorApplications.length})
                </h2>
                <p className="text-xs text-slate-500">
                  আবেদনকারীদের ব্যক্তিগত তথ্য, মা-বাবার বিবরণ, এনআইডি, পাসপোর্ট সাইজের ছবি ও ভয়েস ওভার যাচাই করে অনুমোদন দিন।
                </p>
              </div>

              <div className="text-xs font-mono bg-blue-50 text-[#0A4D8C] border border-blue-200 px-3 py-1.5 rounded-lg font-semibold">
                পেন্ডিং আবেদন: {pendingModerators.length}টি | অনুমোদিত: {approvedModerators.length}টি
              </div>
            </div>

            {moderatorApplications.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-xs">
                <ShieldCheck size={36} className="mx-auto mb-2 opacity-40 text-[#0A4D8C]" />
                <p className="text-sm font-medium text-slate-600">এখন পর্যন্ত কোনো মডারেটর আবেদন জমা পড়েনি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {moderatorApplications.map((app) => (
                  <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4 shadow-xs">
                    {/* Top Row: Applicant & Role */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{app.applicantName}</span>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                            app.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {app.status === 'approved' ? '✓ অনুমোদিত (Approved)' : app.status === 'rejected' ? '✕ বাতিল (Rejected)' : '⏳ পর্যালোচনায় (Pending)'}
                          </span>
                        </div>
                        <p className="text-xs text-[#0A4D8C] font-semibold mt-0.5">
                          {app.roleBengaliTitle || app.roleTitle}
                        </p>
                      </div>

                      <div className="text-right text-xs text-slate-500">
                        <div>স্টুডেন্ট আইডি: <span className="font-mono text-slate-800 font-bold">{app.studentIdCode}</span></div>
                        <div className="text-[10px] text-slate-400">{new Date(app.appliedAt || app.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-[#F8FAFC] p-4 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">ফোন / হোয়াটসঅ্যাপ</span>
                        <span className="text-slate-800 font-mono font-semibold">{app.phone}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">বাসার ঠিকানা ও জেলা</span>
                        <span className="text-slate-800">{app.homeAddress}, {app.district}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">অভিজ্ঞতা ও দৈনিক সময়</span>
                        <span className="text-emerald-700 font-bold">{app.experienceYears} • {app.availableHours}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">পিতার তথ্য</span>
                        <span className="text-slate-700">{app.fatherName} ({app.fatherOccupation})</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">মাতার তথ্য</span>
                        <span className="text-slate-700">{app.motherName} ({app.motherOccupation})</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">এনআইডি নম্বর</span>
                        <span className="text-slate-800 font-mono font-bold">{app.nidNumber}</span>
                      </div>
                    </div>

                    {/* Media attachments */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-[#0A4D8C] font-semibold">
                          <Mic size={14} />
                          <span>ভয়েস ওভার অডিও রেকর্ড:</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{app.voiceOverName || 'অডিও রেকর্ড সংযুক্ত'}</p>
                        {app.voiceOverData && app.voiceOverData.startsWith('data:audio') ? (
                          <audio controls className="w-full h-8 mt-1">
                            <source src={app.voiceOverData} />
                            Your browser does not support the audio element.
                          </audio>
                        ) : app.voiceOverData ? (
                          <a 
                            href={app.voiceOverData} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#0A4D8C] hover:underline font-bold mt-1"
                          >
                            অডিও ফাইল শুনুন <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">অডিও রেকর্ড ডাটা সংরক্ষিত</span>
                        )}
                      </div>

                      <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                        <div className="space-y-1">
                          <span className="text-[#0A4D8C] font-semibold block">পাসপোর্ট সাইজের ছবি:</span>
                          <span className="text-slate-400 text-[10px]">এনআইডি ও ছবি ডাটাবেসে সেভ করা</span>
                        </div>
                        {app.passportPhotoUrl && app.passportPhotoUrl.startsWith('data:image') ? (
                          <img 
                            src={app.passportPhotoUrl} 
                            alt="Passport" 
                            className="w-12 h-14 object-cover rounded-md border border-slate-200 shadow-xs" 
                          />
                        ) : (
                          <div className="w-12 h-14 bg-slate-100 rounded-md flex items-center justify-center text-[9px] text-slate-500 text-center font-bold">
                            ছবি সংযুক্ত
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      {app.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveModerator(app.id, app.applicantName)}
                          className="bg-[#0D7A5F] hover:bg-[#0A644D] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle size={14} /> অনুমোদন দিন
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleRejectModerator(app.id)}
                          className="bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                        >
                          <XCircle size={14} /> বাতিল করুন
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteModerator(app.id)}
                        className="bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. AFFILIATE MARKETING SALES CLAIMS TAB */}
        {activeTab === 'affiliate' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="text-[#0A4D8C]" size={20} />
                  অ্যাফিলিয়েট প্রোডাক্ট সেলস ও কমিশন রিকোয়েস্ট ({affiliateSubmissions.length})
                </h2>
                <p className="text-xs text-slate-500">
                  শিক্ষার্থীদের কৃত সেলস রিপোর্ট যাচাই করে তাদের বিকাশ অথবা নগদ অ্যাকাউন্টে কমিশন পাঠিয়ে দিন।
                </p>
              </div>

              <div className="text-xs font-mono bg-blue-50 text-[#0A4D8C] border border-blue-200 px-3 py-1.5 rounded-lg font-semibold">
                পেন্ডিং সেলস: {pendingAffiliates.length}টি | পেইড: {approvedAffiliates.length}টি
              </div>
            </div>

            {affiliateSubmissions.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-xs">
                <ShoppingBag size={36} className="mx-auto mb-2 opacity-40 text-[#0A4D8C]" />
                <p className="text-sm font-medium text-slate-600">এখন পর্যন্ত কোনো অ্যাফিলিয়েট সেলস রিপোর্ট জমা পড়েনি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {affiliateSubmissions.map((sale) => (
                  <div key={sale.id} className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4 shadow-xs">
                    {/* Top Row: Product, Commission & Status */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-start gap-3">
                        {sale.productImage && (
                          <img
                            src={sale.productImage}
                            alt={sale.productTitle || 'Product'}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900">{sale.productTitle}</span>
                            <span className="text-xs font-mono font-bold text-rose-600">
                              Order Amount: ৳{sale.orderAmount ?? sale.productPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                              কমিশন দাবি: ৳{sale.commissionAmount} টাকা
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              sale.status === 'approved_paid' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : sale.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {sale.status === 'approved_paid' ? '✓ পেইড (Paid)' : sale.status === 'rejected' ? '✕ বাতিল (Rejected)' : '⏳ পেন্ডিং পেমেন্ট (Pending)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs text-slate-500">
                        <div>তারিখ: <span className="font-mono text-slate-700">{new Date(sale.submittedAt || sale.createdAt).toLocaleDateString()}</span></div>
                        <div className="text-[10px] text-slate-400">{new Date(sale.submittedAt || sale.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>

                    {/* Customer & Seller Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200/80 space-y-1.5">
                        <span className="text-[#0A4D8C] font-semibold block text-[11px] uppercase">শিক্ষার্থী / সেলারের তথ্য:</span>
                        <div><span className="text-slate-400">নাম:</span> <span className="text-slate-900 font-bold">{sale.sellerName}</span>{sale.sellerAge ? ` (বয়স: ${sale.sellerAge})` : ''}</div>
                        <div><span className="text-slate-400">স্টুডেন্ট আইডি:</span> <span className="text-slate-800 font-mono font-bold">{sale.studentIdCode}</span></div>
                        {sale.sellerNid && (
                          <div><span className="text-slate-400">এনআইডি নম্বর:</span> <span className="text-slate-700 font-mono">{sale.sellerNid}</span></div>
                        )}
                        <div><span className="text-slate-400">হোয়াটসঅ্যাপ:</span> <span className="text-slate-700 font-mono">{sale.sellerPhone}</span></div>
                        {sale.affiliateLink && (
                          <div className="truncate"><span className="text-slate-400">প্রোডাক্ট লিংক:</span> <span className="text-[#0A4D8C] font-mono text-[11px]">{sale.affiliateLink}</span></div>
                        )}
                      </div>

                      <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200/80 space-y-1.5">
                        <span className="text-slate-600 font-semibold block text-[11px] uppercase">ক্রেতা / কাস্টমারের তথ্য:</span>
                        <div><span className="text-slate-400">গ্রাহকের নাম:</span> <span className="text-slate-900 font-bold">{sale.customerName}</span></div>
                        <div><span className="text-slate-400">ফোন নম্বর:</span> <span className="text-emerald-700 font-mono font-bold">{sale.customerPhone}</span></div>
                        <div><span className="text-slate-400">ডেলিভারি ঠিকানা:</span> <span className="text-slate-700">{sale.customerAddress}</span></div>
                        <div><span className="text-slate-400">অর্ডার অ্যামাউন্ট:</span> <span className="text-slate-900 font-mono font-bold">৳{sale.orderAmount ?? sale.productPrice}</span></div>
                        {sale.orderDetails && (
                          <div><span className="text-slate-400">ডিটেইলস:</span> <span className="text-slate-700">{sale.orderDetails}</span></div>
                        )}
                      </div>
                    </div>

                    {/* Payout Mobile Wallet Box */}
                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          sale.payoutMethod === 'bKash' ? 'bg-pink-600 text-white' : 'bg-orange-600 text-white'
                        }`}>
                          {sale.payoutMethod || 'Wallet'}
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">
                            কমিশন প্রেরণের <strong className="text-slate-900">{sale.payoutMethod}</strong> পার্সোনাল নম্বর:
                          </div>
                          <div className="text-sm font-bold text-slate-900 font-mono tracking-wider">
                            {sale.payoutNumber}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">প্রদেয় কমিশন অংক</div>
                        <div className="text-base font-bold text-emerald-700 font-mono">৳{sale.commissionAmount}.00</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      {sale.status !== 'approved_paid' && (
                        <button
                          onClick={() => handleApproveAffiliateSale(sale.id, sale.sellerName, sale.commissionAmount)}
                          className="bg-[#0D7A5F] hover:bg-[#0A644D] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle size={14} /> কমিশন সেন্ড ও অনুমোদন সম্পন্ন (Mark Paid)
                        </button>
                      )}
                      {sale.status !== 'rejected' && (
                        <button
                          onClick={() => handleRejectAffiliateSale(sale.id)}
                          className="bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                        >
                          <XCircle size={14} /> বাতিল করুন
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAffiliateSale(sale.id)}
                        className="bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. TYPING BATCH SUBMISSIONS (10-TASK BATCHES) */}
        {activeTab === 'typing' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PenTool className="text-[#0A4D8C]" size={20} />
                  টাইপিং জব — ১০টি টাস্ক সাবমিশন অডিট ({typingSubmissions.length})
                </h2>
                <p className="text-xs text-slate-500">
                  শিক্ষার্থীদের ১০টি করে টাইপিং টাস্ক সম্পন্ন হওয়ার পর স্ক্রিন রেকর্ডিং প্রমাণ ও নির্ভুলতা যাচাই করে অনুমোদন দিন।
                </p>
              </div>

              <div className="text-xs font-mono bg-blue-50 text-[#0A4D8C] border border-blue-200 px-3 py-1.5 rounded-lg font-semibold">
                মোট সাবমিশন: {typingSubmissions.length}টি
              </div>
            </div>

            {typingSubmissions.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-xs">
                <PenTool size={36} className="mx-auto mb-2 opacity-40 text-[#0A4D8C]" />
                <p className="text-sm font-medium text-slate-600">কোনো টাইপিং সাবমিশন পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {typingSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-3 shadow-xs">
                    <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{sub.userName || 'Student User'}</div>
                        <div className="text-xs text-[#0A4D8C] font-semibold">{sub.taskTitle}</div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-mono text-slate-800 font-bold">ID: {sub.studentIdCode}</span>
                        <div className="text-[10px] text-slate-400">{new Date(sub.submittedAt || sub.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#F8FAFC] p-3 rounded-lg border border-slate-200/80">
                      <div><span className="text-slate-400 text-[10px] block">অ্যাকুরেসি</span><span className="text-emerald-700 font-bold">{sub.accuracy || 98}%</span></div>
                      <div><span className="text-slate-400 text-[10px] block">স্পিড (WPM)</span><span className="text-slate-900 font-mono font-bold">{sub.wpm || 38} WPM</span></div>
                      <div><span className="text-slate-400 text-[10px] block">ক্যারেক্টার সংখ্যা</span><span className="text-slate-700 font-mono">{sub.totalChars} / {sub.targetChars}</span></div>
                      <div><span className="text-slate-400 text-[10px] block">স্ট্যাটাস</span><span className="text-amber-700 font-bold">{sub.status}</span></div>
                    </div>

                    {sub.videoUrl && (
                      <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">স্ক্রিন রেকর্ডিং প্রমাণ:</span>
                        <a href={sub.videoUrl} target="_blank" rel="noreferrer" className="text-[#0A4D8C] hover:underline font-bold flex items-center gap-1">
                          ভিডিও লিংক ওপেন করুন <ExternalLink size={12} />
                        </a>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleSubmissionReview(sub.id, sub.userId, true, 1.00)}
                        className="bg-[#0D7A5F] hover:bg-[#0A644D] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        অনুমোদন দিন (+৳১.০০)
                      </button>
                      <button
                        onClick={() => handleSubmissionReview(sub.id, sub.userId, false)}
                        className="bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. UNIFIED LIVE FIREBASE REGISTERED USERS DATABASE */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="text-[#0A4D8C]" size={20} />
                  লাইভ রেজিস্টার্ড ইউজার ও অ্যাকাউন্ট নিয়ন্ত্রণ ({users.length})
                </h2>
                <p className="text-xs text-slate-500">
                  রেজিস্ট্রেশন করা ইউজারদের নাম, নম্বর, পাসওয়ার্ড, নির্বাচিত কাজ দেখুন এবং অ্যাকাউন্ট অনুমোদন, ডিঅ্যাক্টিভেট, ডিলিট বা পাসওয়ার্ড পরিবর্তন করুন।
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="নাম, নম্বর, ৭-ডিজিট আইডি বা কাজ খুঁজুন..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white shadow-xs"
                />
              </div>
            </div>

            {/* Status Filter Buttons & Delete All */}
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: `All (${users.length})` },
                  { id: 'active', label: `Active (${activeOnlyUsers.length})` },
                  { id: 'pending', label: `Pending (${pendingUsers.length})` },
                  { id: 'blocked', label: `Deactivated (${blockedUsers.length})` }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setUserStatusFilter(st.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      userStatusFilter === st.id
                        ? 'bg-[#0A4D8C] text-white border-[#0A4D8C] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {users.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDeleteAllModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Delete all registered user accounts to start fresh"
                >
                  <Trash2 size={13} />
                  <span>Delete All Accounts ({users.length})</span>
                </button>
              )}
            </div>

            {filteredAllUsers.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-xs">
                <Users size={36} className="mx-auto mb-2 opacity-40 text-[#0A4D8C]" />
                <p className="text-sm font-medium text-slate-600">কোনো রেজিস্টার্ড ইউজার পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredAllUsers.map(u => {
                  const defaultApplied = (u.assignedJobs && u.assignedJobs.length > 0)
                    ? u.assignedJobs
                    : (u.preferredModules && u.preferredModules.length > 0
                      ? u.preferredModules
                      : (u.assignedJob ? [u.assignedJob] : ['typing']));
                  const userChosenJobs = selectedJobsMap[u.id] || defaultApplied;
                  const registeredTasks = (u.preferredModules && u.preferredModules.length > 0)
                    ? u.preferredModules
                    : defaultApplied;

                  return (
                    <div key={u.id} className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-4 shadow-xs hover:border-slate-300 transition-colors">

                      {/* Top Bar: Identity, Status & Live Credentials */}
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-3 border-b border-slate-100 pb-3.5">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">{u.fullName || 'Unnamed User'}</h3>
                            <span className="bg-blue-50 text-[#0A4D8C] px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border border-blue-200">
                              ID: {u.studentIdCode || 'N/A'}
                            </span>
                            <span className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : u.status === 'blocked'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {u.status === 'blocked' ? 'Deactivated' : u.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-[#0D7A5F]" />
                              ফোন/হোয়াটসঅ্যাপ: <strong className="font-mono text-slate-900">{u.whatsappNumber || 'N/A'}</strong>
                            </span>
                            {u.email && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Mail size={12} className="text-[#0A4D8C]" />
                                <span>{u.email}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            <span>Team Leader: <strong className="text-slate-800 font-semibold">{u.teamLeaderName || 'N/A'}</strong></span>
                            <span>Team Trainer: <strong className="text-slate-800 font-semibold">{u.teamTrainerName || 'N/A'}</strong></span>
                            <span>Created: <strong className="font-mono text-slate-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</strong></span>
                          </div>
                        </div>

                        {/* Password Management Box */}
                        <div className="text-xs bg-[#F8FAFC] px-3.5 py-2 rounded-lg border border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
                          <span className="text-slate-500">Password:</span>
                          <span className="font-mono text-slate-900 font-bold select-all bg-white px-2 py-0.5 rounded border border-slate-200">
                            {u.passwordText || 'N/A'}
                          </span>
                          {editingPasswordId !== u.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPasswordId(u.id);
                                  setNewPassword(u.passwordText || '');
                                }}
                                className="text-[#0A4D8C] hover:text-[#083D70] font-semibold text-[11px] ml-1 flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              {u.email && (
                                <button
                                  type="button"
                                  onClick={() => handleSendPasswordResetEmail(u.email)}
                                  className="text-[#0A4D8C] hover:text-[#083D70] font-semibold text-[11px] ml-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
                                  title="Send Firebase Auth password reset link to user's email"
                                >
                                  Reset Email
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-1.5 ml-1">
                              <input
                                type="text"
                                placeholder="New password (min 6)"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-900 w-32 focus:outline-none focus:border-[#0A4D8C] font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdatePassword(u.id)}
                                className="bg-[#0D7A5F] hover:bg-[#0A644D] text-white px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPasswordId(null)}
                                className="text-slate-500 hover:text-slate-800 text-[11px] cursor-pointer px-1"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Registered Tasks & Currently Authorized Tasks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-[#0A4D8C] uppercase font-bold flex items-center gap-1.5">
                              <Sparkles size={13} className="text-[#0A4D8C]" />
                              যে কাজের জন্য রেজিস্ট্রেশন করেছেন:
                            </span>
                            {registeredTasks.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleSelectAppliedModules(u.id, registeredTasks)}
                                className="text-[10px] font-semibold text-[#0A4D8C] hover:text-[#083D70] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
                              >
                                Sync ({registeredTasks.length})
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {registeredTasks.map((modId: string) => (
                              <span key={modId} className="bg-blue-50 text-[#0A4D8C] px-2.5 py-1 rounded-md text-[11px] font-semibold border border-blue-200">
                                {getModuleTitle(modId)}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200/80 space-y-2">
                          <div className="text-[11px] text-emerald-700 uppercase font-bold flex items-center gap-1.5">
                            <CheckCircle size={13} className="text-emerald-600" />
                            বর্তমানে অনুমোদিত কাজের অনুমতি:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {userChosenJobs.length > 0 ? (
                              userChosenJobs.map((modId: string) => (
                                <span key={modId} className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-emerald-200">
                                  ✓ {getModuleTitle(modId)}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">কোনো কাজ সিলেক্ট করা হয়নি</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Training, Experience & Certificate Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                            <GraduationCap size={12} className="text-[#0A4D8C]" /> Course Status
                          </div>
                          <span className={`font-semibold ${u.courseCompleted ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {u.courseCompleted ? '✓ Completed Training' : 'Incomplete / In Progress'}
                          </span>
                        </div>

                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                            <Briefcase size={12} className="text-[#0A4D8C]" /> Work Experience
                          </div>
                          <span className={`font-semibold ${u.hasExperience ? 'text-emerald-700' : 'text-slate-600'}`}>
                            {u.hasExperience ? '✓ Has Prior Experience' : 'No Prior Experience'}
                          </span>
                        </div>

                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                            <FileBadge size={12} className="text-[#0A4D8C]" /> Certificate
                          </div>
                          {u.hasCertificate && u.certificateUrl ? (
                            <button
                              type="button"
                              onClick={() => setCertificateModalUrl(u.certificateUrl)}
                              className="text-[#0A4D8C] hover:text-[#083D70] font-semibold underline flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> View Certificate
                            </button>
                          ) : (
                            <span className="text-slate-500 font-medium">None Submitted</span>
                          )}
                        </div>
                      </div>

                      {/* Balance & Microjob Points Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2.5 border-y border-slate-100">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Wallet Balance</div>
                          <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
                            BDT {(u.balance || 0).toFixed(2)}
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <button
                              type="button"
                              onClick={() => updateBalance(u.id, u.balance || 0, 10)}
                              className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md cursor-pointer transition-colors"
                            >
                              +10
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBalance(u.id, u.balance || 0, 50)}
                              className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md cursor-pointer transition-colors"
                            >
                              +50
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBalance(u.id, u.balance || 0, -10)}
                              className="px-2.5 py-1 bg-[#FEF2F2] hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-md cursor-pointer transition-colors"
                            >
                              -10
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Microjob Points</div>
                          <div className="text-xl font-bold font-mono text-[#0A4D8C] mt-0.5">
                            {u.microjobPoints || 0} pts
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <button
                              type="button"
                              onClick={() => updatePoints(u.id, u.microjobPoints || 0, 5)}
                              className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md cursor-pointer transition-colors"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => updatePoints(u.id, u.microjobPoints || 0, 20)}
                              className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md cursor-pointer transition-colors"
                            >
                              +20
                            </button>
                            <button
                              type="button"
                              onClick={() => updatePoints(u.id, u.microjobPoints || 0, -5)}
                              className="px-2.5 py-1 bg-[#FEF2F2] hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-md cursor-pointer transition-colors"
                            >
                              -5
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Task Permissions Checkboxes + Deactivate / Reactivate / Delete */}
                      <div className="bg-[#F8FAFC] p-4 rounded-lg border border-slate-200 space-y-3">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                              Assign / Update Work Tasks:
                            </span>
                            <span className="text-xs text-slate-500 ml-2 font-mono">
                              ({userChosenJobs.length} selected)
                            </span>
                          </div>
                          <div className="flex gap-2.5 text-[10px]">
                            {u.preferredModules && u.preferredModules.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleSelectAppliedModules(u.id, u.preferredModules)}
                                className="text-[#0A4D8C] hover:text-[#083D70] font-semibold underline cursor-pointer"
                              >
                                Select Applied
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSelectAllModules(u.id)}
                              className="text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearModules(u.id)}
                              className="text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {WORK_MODULES.map(m => {
                            const isChecked = userChosenJobs.includes(m.id);
                            return (
                              <label
                                key={m.id}
                                onClick={() => handleToggleUserModule(u.id, m.id)}
                                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold border cursor-pointer transition-all select-none ${
                                  isChecked
                                    ? 'bg-blue-50 text-[#0A4D8C] border-blue-300 shadow-xs'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare size={16} className="text-[#0A4D8C] shrink-0" />
                                ) : (
                                  <Square size={16} className="text-slate-400 shrink-0" />
                                )}
                                <span className="truncate">{m.title}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Account Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2.5 border-t border-slate-200/80 justify-between items-center">
                          <div className="flex flex-wrap gap-2">
                            {u.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleApproveUser(u.id)}
                                className="px-4 py-2 bg-[#0D7A5F] hover:bg-[#0A644D] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <CheckCircle size={15} /> Approve & Grant Access ({userChosenJobs.length})
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSaveAssignedJobs(u.id)}
                              className="px-4 py-2 bg-[#0A4D8C] hover:bg-[#083D70] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Check size={15} /> Save Task Permissions
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {u.status === 'blocked' ? (
                              <button
                                type="button"
                                onClick={() => handleReactivateUser(u.id)}
                                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRejectUser(u.id)}
                                className="px-3.5 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Deactivate
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteUser(u.id)}
                              className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
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

        {/* 5. SECURITY PIN SETUP TAB */}
        {activeTab === 'pin' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7] flex items-center justify-center font-bold">
                  <KeyRound size={22} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">4-Digit Security Access PIN</h2>
                  <p className="text-xs text-slate-500">Manage device unlock PIN for restricted portal access</p>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Current Security PIN:</span>
                <span className="font-mono text-xl font-bold text-[#0A4D8C] tracking-widest bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                  {currentPin}
                </span>
              </div>

              {pinUpdateSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium flex items-center gap-2">
                  <CheckCircle size={16} /> {pinUpdateSuccess}
                </div>
              )}

              {pinUpdateError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={16} /> {pinUpdateError}
                </div>
              )}

              <form onSubmit={handleUpdatePin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enter New 4-Digit PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newPinInput}
                    onChange={e => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 1234"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-lg font-mono tracking-widest text-center focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition-colors shadow-xs text-xs tracking-wider cursor-pointer"
                >
                  Save New Security PIN
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. NOTICE & SUPPORT CONFIG TAB */}
        {activeTab === 'notice' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7] flex items-center justify-center font-bold">
                  <ConfigIcon size={22} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Global Announcement Banner</h2>
                  <p className="text-xs text-slate-500">Broadcast message displayed at the top of the user app</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Announcement Message
                </label>
                <textarea
                  rows={3}
                  value={noticeInput}
                  onChange={e => setNoticeInput(e.target.value)}
                  placeholder="Enter notice text for all students..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => updateNotice(true)}
                  className="flex-1 bg-[#0D7A5F] hover:bg-[#0A644D] text-white font-semibold py-2.5 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <CheckCircle size={15} /> Publish & Enable Banner
                </button>
                <button
                  onClick={() => updateNotice(false)}
                  className="px-5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-lg transition-colors text-xs cursor-pointer"
                >
                  Disable Banner
                </button>
              </div>
            </div>

            {/* Custom User Announcement Popup Card */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7] flex items-center justify-center font-bold">
                    <Megaphone size={22} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>ইউজার স্পেশাল নোটিশ পপআপ (Custom User Popup)</span>
                      {customPopupIsActive ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                          ● লাইভ সক্রিয় আছে
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 font-semibold">
                          ○ বন্ধ আছে
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500">
                      এখানে যা লিখে দিবেন তা প্রত্যেক শিক্ষার্থীর লগইনের সময় স্ক্রিনের সামনে সুন্দর পপআপে শো করবে
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0A4D8C]"></span>
                    <span>পপআপের শিরোনাম (Popup Title)</span>
                  </label>
                  <input
                    type="text"
                    value={customPopupTitleInput}
                    onChange={e => setCustomPopupTitleInput(e.target.value)}
                    placeholder="যেমন: গুরুত্বপূর্ণ নোটিশ / গুরুত্বপূর্ণ বার্তা"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0A4D8C]"></span>
                      <span>পপআপে প্রদর্শিত বার্তা (Detailed Announcement Message)</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      লাইন ভাঙতে Enter চাপুন, টেক্সট সুন্দরভাবে ফ্রেমের ভেতর থাকবে
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={customPopupMessageInput}
                    onChange={e => setCustomPopupMessageInput(e.target.value)}
                    placeholder="আপনার নোটিশ বা নির্দেশনা এখানে বিস্তারিত লিখুন..."
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white leading-relaxed font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0A4D8C]"></span>
                    <span>বাটনের লেখা (Confirm Button Text)</span>
                  </label>
                  <input
                    type="text"
                    value={customPopupButtonTextInput}
                    onChange={e => setCustomPopupButtonTextInput(e.target.value)}
                    placeholder="যেমন: বুঝেছি / ধন্যবাদ / ঠিক আছে"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => updateCustomPopup(true)}
                    className="flex-1 min-w-[200px] bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <CheckCircle size={15} /> সংরক্ষণ ও পপআপ চালু করুন (Enable Popup)
                  </button>
                  <button
                    onClick={() => setShowCustomPopupPreview(true)}
                    className="px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors text-xs cursor-pointer border border-slate-200 flex items-center gap-1.5"
                  >
                    <Eye size={15} /> লাইভ প্রিভিউ দেখুন
                  </button>
                  <button
                    onClick={() => updateCustomPopup(false)}
                    className="px-4 bg-white hover:bg-slate-50 text-rose-600 font-semibold py-2.5 rounded-lg transition-colors text-xs cursor-pointer border border-rose-200"
                  >
                    পপআপ বন্ধ রাখুন (Disable)
                  </button>
                </div>

                <CustomAdminPopupModal
                  isOpen={showCustomPopupPreview}
                  onClose={() => setShowCustomPopupPreview(false)}
                  popupData={{
                    title: customPopupTitleInput.trim() || 'অফিশিয়াল জরুরি নোটিশ',
                    message: customPopupMessageInput || 'এখানে আপনার নোটিশের লেখা দেখা যাবে।',
                    buttonText: customPopupButtonTextInput.trim() || 'বুঝেছি / ঠিক আছে'
                  }}
                />
              </div>
            </div>

            {/* Support and Video Settings */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7] flex items-center justify-center font-bold">
                  <LifeBuoy size={22} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Help & Official Support Channels</h2>
                  <p className="text-xs text-slate-500">Manage Telegram, WhatsApp, and Tutorial Video links for students</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0A4D8C]"></span>
                    <span>Official Telegram Helpline / Channel Link</span>
                  </label>
                  <input
                    type="url"
                    value={telegramInput}
                    onChange={e => setTelegramInput(e.target.value)}
                    placeholder="https://t.me/your_telegram_channel"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0D7A5F]"></span>
                    <span>WhatsApp Helpline / Group Link</span>
                  </label>
                  <input
                    type="url"
                    value={whatsappInput}
                    onChange={e => setWhatsappInput(e.target.value)}
                    placeholder="https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>YouTube Video Guide URL (হোম পেজে সরাসরি চলবে)</span>
                  </label>
                  <input
                    type="url"
                    value={videoInput}
                    onChange={e => setVideoInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... বা https://youtu.be/..."
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white font-mono"
                  />
                  {videoPreviewEmbed ? (
                    <div className="mt-3 p-3 bg-[#F8FAFC] border border-slate-200 rounded-lg space-y-2">
                      <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                        <PlayCircle size={14} /> ইউজার হোম পেজে লাইভ ভিডিও প্রিভিউ:
                      </div>
                      <div className="aspect-video rounded-lg overflow-hidden bg-black border border-slate-200">
                        <iframe
                          src={videoPreviewEmbed}
                          title="Admin YouTube Video Guide Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      একটি সঠিক YouTube লিংক দিন (যেমন: https://www.youtube.com/watch?v=VIDEO_ID অথবা https://youtu.be/VIDEO_ID)
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0A4D8C]"></span>
                      <span>Company Logo (Upload Image or paste URL)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-[#0A4D8C] hover:text-[#083D70] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>📁 Upload Logo File</span>
                    </button>
                  </div>
                  
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={logoInput}
                      onChange={e => setLogoInput(e.target.value)}
                      placeholder="Paste image URL or click 'Upload Logo File' button above..."
                      className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                    />
                    {logoInput && (
                      <button
                        type="button"
                        onClick={() => setLogoInput('')}
                        className="px-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                        title="Remove Logo"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {logoInput.trim() && (
                    <div className="mt-3.5 p-3.5 bg-[#F8FAFC] rounded-lg border border-slate-200 flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block shrink-0">Logo Preview:</span>
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-white p-0.5 shadow-xs">
                        <img src={logoInput.trim()} alt="Custom Logo Preview" className="w-full h-full object-contain rounded-md" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=80&fit=crop"; }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-emerald-700 block">✓ Logo Loaded Ready</span>
                        <span className="text-[10px] text-slate-500 font-mono truncate block max-w-xs">{logoInput.startsWith('data:') ? 'Custom uploaded image asset' : logoInput}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={updateSupport}
                className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition-colors shadow-xs text-xs tracking-wider cursor-pointer"
              >
                Save Support Channels, Video & Company Logo
              </button>
            </div>
          </div>
        )}

        {/* 7. WORK SUBMISSIONS TAB */}
        {activeTab === 'work' && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-[#0A4D8C]" size={20} />
              Pending Work Proof Submissions ({pendingSubmissions.length})
            </h2>

            {pendingSubmissions.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-xs">
                <CheckCircle size={36} className="mx-auto mb-2 opacity-40 text-emerald-600" />
                <p className="text-sm font-medium text-slate-600">No pending work submissions to review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingSubmissions.map(s => {
                  const submitter = users.find(u => u.id === s.userId);

                  return (
                    <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-3 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-semibold uppercase bg-blue-50 text-[#0A4D8C] px-2 py-0.5 rounded border border-blue-200">
                            {s.moduleTitle || s.moduleId}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">
                            {submitter?.fullName || 'Student User'}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            ID: {submitter?.studentIdCode || 'N/A'} • {submitter?.whatsappNumber}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      {s.details && (
                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {s.details}
                        </div>
                      )}

                      {/* Photo Editing Image Preview */}
                      {s.imageProofUrl && (
                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 uppercase">
                            <span>🖼️ Submitted Edited Photo ({s.taskProductType || 'Product'}):</span>
                          </div>
                          <div className="relative rounded-lg overflow-hidden bg-black max-h-56 flex items-center justify-center border border-slate-200">
                            <img src={s.imageProofUrl} alt="Submitted edit" className="max-h-52 object-contain" />
                          </div>
                        </div>
                      )}

                      {/* Screen Recording Video Proof Preview */}
                      {(s.videoUrl || s.screenRecordUrl) && (
                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="text-[11px] font-semibold text-[#0A4D8C] flex items-center gap-1.5 uppercase">
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
                                  className="text-xs text-[#0A4D8C] hover:underline font-mono flex items-center gap-1 mb-1 font-semibold"
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
                            <div className="pt-1 border-t border-slate-200 text-xs">
                              <span className="text-slate-500 font-semibold block mb-0.5">Timeline Screen Record:</span>
                              {s.screenRecordUrl.startsWith('http') ? (
                                <a
                                  href={s.screenRecordUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:underline font-mono"
                                >
                                  {s.screenRecordUrl}
                                </a>
                              ) : (
                                <span className="font-mono text-slate-700">{s.screenRecordUrl}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleSubmissionReview(s.id, s.userId, true)}
                          className="flex-1 bg-[#0D7A5F] hover:bg-[#0A644D] text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <CheckCircle size={14} /> Approve (+{s.rewardAmount || 'BDT 1.00'})
                        </button>
                        <button
                          onClick={() => handleSubmissionReview(s.id, s.userId, false)}
                          className="px-4 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold py-2 rounded-lg text-xs cursor-pointer transition-colors"
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

        {/* 8. REVIEWS MANAGEMENT TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquareQuote className="text-[#0A4D8C]" size={20} />
                  Student Reviews Moderation & Management
                </h2>
                <p className="text-xs text-slate-500">
                  অনুমোদনের জন্য অপেক্ষমাণ ও লাইভ রিভিউ নিয়ন্ত্রণ করুন
                </p>
              </div>
            </div>

            {/* Pending Reviews Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2">
                <AlertCircle size={16} />
                Pending Reviews for Approval ({pendingReviewsList.length})
              </h3>

              {pendingReviewsList.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-xl p-6 text-center text-slate-500 text-xs shadow-xs">
                  কোনো পেন্ডিং রিভিউ নেই। সকল রিভিউ অনুমোদিত আছে।
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingReviewsList.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-white border border-amber-200 rounded-xl p-4 space-y-3 shadow-xs relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{rev.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                              Pending Review
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Student ID: {rev.submittedByStudentId || 'N/A'} • {rev.userPhone || ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-[#F8FAFC] px-2 py-1 rounded-md border border-slate-200 text-amber-700 text-[11px] font-mono tabular-nums font-bold">
                          <Star size={11} className="fill-amber-500 text-amber-500" />
                          <span>{rev.rating || 10}/10</span>
                        </div>
                      </div>

                      <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 text-xs text-slate-700 font-sans whitespace-pre-wrap">
                        {rev.text}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="flex-1 bg-[#0D7A5F] hover:bg-[#0A644D] text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <CheckCircle size={14} />
                          <span>Approve & Publish Live</span>
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
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
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Approved & Live Custom Reviews ({approvedReviewsList.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedReviewsList.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rev.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                            Live
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3">
                        {rev.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. DATA ENTRY PROJECTS & SUBMISSIONS MODERATION */}
        {activeTab === 'data_entry' && (
          <div className="space-y-6">
            
            {/* Header & Stats Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-blue-50 text-[#0A4D8C]">
                    <FileSpreadsheet size={20} />
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Data Entry Projects Management & Submissions Control
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Monitor participant Excel assignments, enforce 60-minute automated review timers, and audit video proofs.
                </p>
              </div>

              {/* Action Buttons: Video Requirement Toggle */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleToggleVideoReq}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    isVideoRequired 
                      ? 'bg-blue-50 text-[#0A4D8C] border-blue-200 hover:bg-blue-100' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Toggle whether participants must upload a screen-recording video"
                >
                  <Video size={14} className={isVideoRequired ? 'text-[#0A4D8C]' : 'text-slate-400'} />
                  <span>Video Proof: {isVideoRequired ? 'Required (Default)' : 'Optional'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Submissions</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">{dataEntrySubmissions.length}</span>
              </div>

              <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider block">Under Review (Active)</span>
                <span className="text-xl font-bold text-amber-700 mt-1 block flex items-center gap-1.5">
                  <Clock size={16} />
                  {underReviewProjects.length}
                </span>
              </div>

              <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">Accepted & Certified</span>
                <span className="text-xl font-bold text-emerald-700 mt-1 block">{acceptedProjects.length}</span>
              </div>

              <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider block">Rejected / Expired</span>
                <span className="text-xl font-bold text-rose-700 mt-1 block">{rejectedProjects.length}</span>
              </div>
            </div>

            {/* ACTIVE SUBMISSIONS TABLE */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock size={16} className="text-[#0A4D8C]" />
                    Participant Project Submissions ({dataEntrySubmissions.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review submissions and verify work within the 60-minute window.
                  </p>
                </div>
              </div>

              {dataEntrySubmissions.length === 0 ? (
                <div className="p-8 text-center bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs text-slate-500">
                  No participant project submissions recorded yet. When participants submit an Excel project, it will appear here with a 60-minute review timer.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-600 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Participant Name</th>
                        <th className="py-2.5 px-3">Project</th>
                        <th className="py-2.5 px-3">Submitted At</th>
                        <th className="py-2.5 px-3">Review Deadline</th>
                        <th className="py-2.5 px-3">Video Proof</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {dataEntrySubmissions.map((sub) => {
                        const isUnderReview = sub.status === 'Under Review';
                        const isAccepted = sub.status === 'Accepted';
                        const isRejected = sub.status === 'Rejected';

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                            
                            {/* Participant Name & Contact */}
                            <td className="py-3.5 px-3">
                              <div>
                                <span className="font-bold text-slate-900 block">{sub.participantName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {sub.studentIdCode || 'N/A'} • {sub.participantPhone}
                                </span>
                              </div>
                            </td>

                            {/* Project Title */}
                            <td className="py-3.5 px-3">
                              <span className="font-medium text-slate-800 block max-w-xs truncate" title={sub.projectTitle}>
                                {sub.projectTitle}
                              </span>
                              <span className="text-[10px] text-[#0A4D8C] font-mono">
                                {sub.excelFileName || 'Completed.xlsx'}
                              </span>
                            </td>

                            {/* Submitted At */}
                            <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                              <span className="block">{sub.submissionTime ? new Date(sub.submissionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                              <span className="text-[10px] text-slate-400">{sub.submissionTime ? new Date(sub.submissionTime).toLocaleDateString() : ''}</span>
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
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#0A4D8C] border border-blue-200 hover:bg-blue-100 text-[11px] font-semibold transition-colors cursor-pointer"
                                  title="View Screen Recording"
                                >
                                  <Video size={12} />
                                  <span>View Video</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">No Video</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {isAccepted && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle size={11} /> Accepted
                                </span>
                              )}
                              {isUnderReview && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock size={11} /> Under Review
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
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
                                      className="px-2.5 py-1.5 rounded-lg bg-[#0D7A5F] hover:bg-[#0A644D] text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                                      title="Accept submission and award user (+BDT 1,000)"
                                    >
                                      <CheckCircle size={13} />
                                      <span>Accept</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectProjectSubmission(sub)}
                                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Reject submission"
                                    >
                                      <XCircle size={13} />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteProjectSubmission(sub.id!)}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
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
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Download size={16} className="text-[#0D7A5F]" />
                    Official Projects & Raw Datasets Library
                  </h3>
                  <p className="text-xs text-slate-500">
                    Administrator testing and download portal for all 4 project datasets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DATA_ENTRY_PROJECTS.map((proj) => (
                  <div key={proj.id} className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#0A4D8C] uppercase tracking-wider">
                        Project #{proj.number} • {proj.difficulty}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {proj.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {proj.recordsCount} • Est. {proj.estimatedHours}
                      </p>
                    </div>

                    <button
                      onClick={() => downloadProjectExcel(proj)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A4D8C] font-semibold text-xs border border-blue-200 transition-colors cursor-pointer shrink-0"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-xl relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileBadge size={20} className="text-[#0A4D8C]" />
                Submitted Certificate Document
              </h3>
              <button
                onClick={() => setCertificateModalUrl(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-lg bg-[#F8FAFC] p-2 flex items-center justify-center border border-slate-200">
              <img 
                src={certificateModalUrl} 
                alt="Certificate" 
                className="max-h-[70vh] object-contain rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Proof Modal */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl relative">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Video size={20} className="text-[#0A4D8C]" />
                Submitted Video Proof
              </h3>
              <button
                onClick={() => setSelectedVideoUrl(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 text-center space-y-3">
              <p className="text-xs text-slate-600">
                Attached Video / Recording Reference:
              </p>
              <div className="font-mono text-xs text-[#0A4D8C] bg-white p-3 rounded-lg border border-slate-200 break-all select-all font-semibold">
                {selectedVideoUrl}
              </div>
              {selectedVideoUrl.startsWith('http') && (
                <a
                  href={selectedVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>Open Video in New Tab</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete All Accounts Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                Delete All Registered Accounts?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will permanently delete all {users.length} registered student accounts and directory records from the database. Everyone will be able to register fresh from scratch.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-700" />
              <span>This action cannot be undone. All user data, balances, and assignments will be wiped.</span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingAll}
                onClick={handleDeleteAllUsers}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isDeletingAll ? 'Deleting All Accounts...' : 'Yes, Delete All Accounts'}
              </button>
              <button
                type="button"
                disabled={isDeletingAll}
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-xs transition-colors border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
