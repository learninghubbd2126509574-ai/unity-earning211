import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BriefcaseBusiness,
  User as UserIcon,
  PlayCircle,
  Receipt,
  Headphones,
  GraduationCap,
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  FileText,
  Landmark,
  AlertCircle,
  CheckCircle2,
  Send,
  ArrowRightLeft,
  BookOpen,
  Info,
  ShieldAlert,
  LogOut,
  HelpCircle,
  Shield,
  Gift,
  Bell,
  Wallet,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { db, doc, getDoc, onSnapshot, collection, addDoc, updateDoc, increment } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PinLockScreen } from './PinLockScreen';
import { UnifiedAuth } from './UnifiedAuth';
import { HelpSupportModal } from './HelpSupportModal';
import { GiftCampaignModal } from './GiftCampaignModal';
import { NotificationModal } from './NotificationModal';
import { CustomAdminPopupModal } from './CustomAdminPopupModal';
import { BrandedLoader } from './BrandedLoader';

export const MobileLayout = () => {
  const { user, profile, loading, isPinUnlocked, setIsPinUnlocked, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Support URLs state from Firestore
  const [supportChannels, setSupportChannels] = useState<{
    telegramUrl?: string;
    whatsappUrl?: string;
    videoUrl?: string;
    logoUrl?: string;
  }>({
    telegramUrl: 'https://t.me/unityearning',
    whatsappUrl: 'https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p',
    videoUrl: 'https://youtube.com',
    logoUrl: ''
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPaymentPolicyOpen, setIsPaymentPolicyOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [termsActiveTab, setTermsActiveTab] = useState<'agreement' | 'kyc' | 'audit' | 'payout' | 'conduct'>('agreement');

  // Balance Transfer state inside drawer/layout
  const [recipientStudentId, setRecipientStudentId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferPassword, setTransferPassword] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [recipientNameFound, setRecipientNameFound] = useState<string | null>(null);
  const [isSearchingRecipient, setIsSearchingRecipient] = useState(false);

  // Listen for custom portal modal events dispatched from Home or any module page
  useEffect(() => {
    const handleOpenTransfer = () => {
      setIsDrawerOpen(false);
      setIsTransferOpen(true);
    };
    const handleOpenSupport = () => {
      setIsDrawerOpen(false);
      setIsHelpOpen(true);
    };
    const handleOpenGift = () => {
      setIsDrawerOpen(false);
      setIsGiftModalOpen(true);
    };
    const handleOpenNotifications = () => {
      setIsDrawerOpen(false);
      setIsNotificationOpen(true);
    };

    window.addEventListener('open_balance_transfer', handleOpenTransfer);
    window.addEventListener('open_help_support', handleOpenSupport);
    window.addEventListener('open_gift_campaign', handleOpenGift);
    window.addEventListener('open_notifications', handleOpenNotifications);

    return () => {
      window.removeEventListener('open_balance_transfer', handleOpenTransfer);
      window.removeEventListener('open_help_support', handleOpenSupport);
      window.removeEventListener('open_gift_campaign', handleOpenGift);
      window.removeEventListener('open_notifications', handleOpenNotifications);
    };
  }, []);

  // Real-time recipient lookup via public memberDirectory
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

  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState<boolean>(false);
  const [adminPopupData, setAdminPopupData] = useState<any>(null);

  useEffect(() => {
    if (loading) return;
    const unsubSupport = onSnapshot(doc(db, 'settings', 'support'), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        setSupportChannels({
          telegramUrl: d?.telegramUrl || 'https://t.me/unityearning',
          whatsappUrl: d?.whatsappUrl || 'https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p',
          videoUrl: d?.videoUrl || d?.url || 'https://youtube.com',
          logoUrl: d?.logoUrl || ''
        });
      }
    }, (error) => {
      console.warn("Support settings listener warning:", error);
    });

    // Admin Popup Listener (manual view only; never auto-open immediately after login)
    const unsubAdmin = onSnapshot(doc(db, 'settings', 'customPopup'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.isActive && d.message && d.message.trim().length > 0) {
          setAdminPopupData({
            title: d.title || 'Important Notice',
            message: d.message,
            buttonText: d.buttonText || 'Got it',
            isActive: d.isActive,
          });
        }
      }
    }, (error) => {
      console.warn("Custom popup listener warning:", error);
    });

    return () => {
      unsubSupport();
      unsubAdmin();
    };
  }, [loading]);

  const handleVideoClick = () => {
    setIsDrawerOpen(false);
    navigate('/?guide=1');
    window.dispatchEvent(new CustomEvent('open_home_video_guide'));
  };

  const handleCloseAdminPopup = () => {
    setIsAdminPopupOpen(false);
    sessionStorage.setItem('admin_popup_shown_this_session', 'true');
  };

  // Clear popup session flag on logout (do not auto-open admin notice on login)
  useEffect(() => {
    if (!user || !profile) {
      sessionStorage.removeItem('admin_popup_shown_this_session');
      setIsAdminPopupOpen(false);
    }
  }, [user, profile]);

  if (loading) {
    return <BrandedLoader fullScreen size="lg" label="Unity Earning" />;
  }

  // 1. PIN Keypad Lock Screen
  if (!isPinUnlocked) {
    return <PinLockScreen onSuccess={() => setIsPinUnlocked(true)} />;
  }

  // 2. If PIN unlocked but not logged in -> Show Unified Auth
  if (!user || !profile) {
    return <UnifiedAuth />;
  }

  return (
    <div className="min-h-screen bg-[#EBEEF2] flex justify-center w-full antialiased font-sans text-[#1E2329]">

      {/* Custom Admin Popup Modal */}
      <CustomAdminPopupModal isOpen={isAdminPopupOpen} onClose={handleCloseAdminPopup} popupData={adminPopupData} />

      {/* Help & Support Channels Modal */}
      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        telegramUrl={supportChannels.telegramUrl}
        whatsappUrl={supportChannels.whatsappUrl}
        videoUrl={supportChannels.videoUrl}
        onOpenVideoGuide={handleVideoClick}
      />

      {/* Responsive App Shell */}
      <div className="w-full max-w-[520px] md:max-w-3xl lg:max-w-4xl bg-[#F4F5F7] relative min-h-screen flex flex-col border-x border-slate-200/80 shadow-xs">

        {/* Main Content Area with Bottom Padding for Navigation Bar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 bg-[#F4F5F7] text-[#1E2329]">

          {/* Clean Corporate Header Bar (No balance shown in top bar) */}
          <header className="bg-white text-slate-900 h-14 px-4 flex items-center justify-between border-b border-slate-200/90 sticky top-0 z-30">

            {/* Left: Logo & Brand */}
            <a href="/" className="flex items-center gap-2.5 min-w-0 group">
              <div className="w-8.5 h-8.5 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-[#083D70] bg-[#0A4D8C] text-white shadow-xs">
                {supportChannels.logoUrl ? (
                  <img src={supportChannels.logoUrl} alt="Unity Earning" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap size={17} strokeWidth={1.85} className="text-white" />
                )}
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-[14.5px] font-semibold tracking-tight text-slate-900 group-hover:text-[#0A4D8C] transition-colors whitespace-nowrap truncate leading-tight">
                  Unity Earning
                </span>
                <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap truncate leading-tight">
                  E-Learning Platform
                </span>
              </div>
            </a>

            {/* Right: Bell, Video Guide & Three-Line Menu */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#F4F5F7] hover:bg-slate-200/70 text-slate-700 border border-slate-200/80 transition cursor-pointer"
                title="Notices"
                aria-label="Notifications"
              >
                <Bell size={17} strokeWidth={1.75} />
                <span className="absolute -top-1 -right-1 bg-[#0A4D8C] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center border border-white tabular-nums">
                  4
                </span>
              </button>

              <button
                onClick={handleVideoClick}
                className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-[#F4F5F7] hover:bg-slate-200/70 text-slate-700 text-xs font-medium border border-slate-200/80 transition cursor-pointer whitespace-nowrap shrink-0"
                title="Watch Video Guide"
              >
                <PlayCircle size={15} strokeWidth={1.75} className="text-[#0A4D8C]" />
                <span>Guide</span>
              </button>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F4F5F7] hover:bg-slate-200/70 text-slate-800 border border-slate-200/80 transition cursor-pointer"
                title="Navigation Menu"
                aria-label="Navigation Menu"
              >
                <Menu size={19} strokeWidth={1.85} />
              </button>
            </div>
          </header>

          {/* Pending Account Notice */}
          {profile?.status === 'pending' && (
            <div className="bg-[#FEF7E0] text-slate-900 px-4 py-3 text-xs leading-relaxed border-b border-[#F3DFA2] flex items-start gap-2.5">
              <AlertCircle size={16} className="text-[#C88400] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 mb-0.5">Account Approval Pending</p>
                <p className="text-slate-700 text-[11.5px] leading-relaxed">
                  আপনার রিকোয়েস্টটি এখনো পেন্ডিংয়ে রয়েছে। আমাদের এক্সিকিউটিভ সিনিয়র অফিসার অ্যাপ্রুভাল করলেই আপনি কাজ শুরু করতে পারবেন। আপনার টিম লিডারকে অবহিত করুন।
                </p>
              </div>
            </div>
          )}

          <main className="w-full">
            <Outlet />
          </main>
        </div>

        {/* Sliding Right Drawer */}
        {isDrawerOpen && (
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/45 z-50 transition-opacity duration-200"
          />
        )}

        <div className={cn(
          "fixed inset-y-0 right-0 w-[88%] max-w-[360px] bg-[#F4F5F7] text-[#1E2329] z-50 flex flex-col shadow-xl transition-transform duration-250 ease-out transform border-l border-slate-200",
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-white relative">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 w-8 h-8 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
              title="Close Menu"
              aria-label="Close Navigation Menu"
            >
              <X size={16} />
            </button>

            <div className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider mb-2.5">
              Account Overview
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#0A4D8C] text-white flex items-center justify-center font-semibold text-base shrink-0 uppercase">
                {profile?.fullName?.charAt(0) || 'M'}
              </div>
              <div className="min-w-0 pr-6">
                <h3 className="font-semibold text-slate-900 text-sm truncate leading-tight">
                  {profile?.fullName || 'Verified Member'}
                </h3>
                <p className="text-[11.5px] text-slate-500 mt-0.5 tabular-nums">
                  ID <span className="font-mono text-[#0A4D8C] font-semibold">{profile?.studentIdCode}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>

            {/* Account Balance Box */}
            <div className="mt-4 bg-[#0A4D8C] text-white p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/10 text-white">
                  <Wallet size={17} strokeWidth={1.75} />
                </div>
                <div>
                  <span className="text-[10.5px] text-white/75 block">Available Balance</span>
                  <span className="text-base font-semibold text-white font-mono tabular-nums">
                    ৳{(profile?.balance || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsTransferOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#0A4D8C] font-semibold text-xs transition cursor-pointer whitespace-nowrap"
              >
                Transfer
              </button>
            </div>
          </div>

          {/* Drawer Menu List (100% English Navigation) */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">

            {/* Top 2 Highlight Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => { setIsDrawerOpen(false); setIsTransferOpen(true); }}
                className="p-3 bg-white border border-slate-200/90 hover:border-[#0A4D8C]/40 rounded-xl flex flex-col items-start gap-2 transition cursor-pointer text-left"
              >
                <ArrowRightLeft size={18} strokeWidth={1.75} className="text-[#0A4D8C]" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">Balance Transfer</div>
                  <div className="text-[11px] text-[#0D7A5F] font-medium">Instant P2P</div>
                </div>
              </button>

              <button
                onClick={() => { setIsDrawerOpen(false); setIsHelpOpen(true); }}
                className="p-3 bg-white border border-slate-200/90 hover:border-[#0A4D8C]/40 rounded-xl flex flex-col items-start gap-2 transition cursor-pointer text-left"
              >
                <Headphones size={18} strokeWidth={1.75} className="text-[#0A4D8C]" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">Live Support</div>
                  <div className="text-[11px] text-[#0D7A5F] font-medium">WhatsApp & Telegram</div>
                </div>
              </button>
            </div>

            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1 pt-1">
              Account & Services
            </div>

            <DrawerItem
              icon={<ArrowRightLeft size={16} strokeWidth={1.75} />}
              label="Balance Transfer"
              subtitle="Send funds to any 7-digit member ID"
              onClick={() => { setIsDrawerOpen(false); setIsTransferOpen(true); }}
            />

            <DrawerItem
              icon={<Headphones size={16} strokeWidth={1.75} />}
              label="Live Support Helpline"
              subtitle="Official WhatsApp and Telegram channels"
              onClick={() => { setIsDrawerOpen(false); setIsHelpOpen(true); }}
            />

            <DrawerItem
              icon={<Receipt size={16} strokeWidth={1.75} />}
              label="Live Payouts & History"
              subtitle="Transaction ledger and payment logs"
              onClick={() => { setIsDrawerOpen(false); navigate('/live-payments'); }}
            />

            <DrawerItem
              icon={<Star size={16} strokeWidth={1.75} />}
              label="Worker Reviews & Ratings"
              subtitle="Verified 10-point project ratings and feedback"
              onClick={() => { setIsDrawerOpen(false); navigate('/reviews'); }}
            />

            <DrawerItem
              icon={<Gift size={16} strokeWidth={1.75} />}
              label="Weekly Bonus Contest"
              subtitle="Top performer weekly cash pool"
              onClick={() => { setIsDrawerOpen(false); setIsGiftModalOpen(true); }}
            />

            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1 pt-2">
              Policies & Information
            </div>

            <DrawerItem
              icon={<FileText size={16} strokeWidth={1.75} />}
              label="Terms & Conditions"
              subtitle="User operating agreement and guidelines"
              onClick={() => { setIsDrawerOpen(false); setIsTermsOpen(true); }}
            />

            <DrawerItem
              icon={<ShieldCheck size={16} strokeWidth={1.75} />}
              label="Privacy & Security Policy"
              subtitle="Member data protection and encryption"
              onClick={() => { setIsDrawerOpen(false); setIsPrivacyOpen(true); }}
            />

            <DrawerItem
              icon={<BookOpen size={16} strokeWidth={1.75} />}
              label="Company Working Rules"
              subtitle="Task quality guidelines and audit rules"
              onClick={() => { setIsDrawerOpen(false); setIsRulesOpen(true); }}
            />

            <DrawerItem
              icon={<Landmark size={16} strokeWidth={1.75} />}
              label="Payment & Withdrawal Policy"
              subtitle="Processing schedules and gateway rules"
              onClick={() => { setIsDrawerOpen(false); setIsPaymentPolicyOpen(true); }}
            />

            <DrawerItem
              icon={<HelpCircle size={16} strokeWidth={1.75} />}
              label="Frequently Asked Questions"
              subtitle="Common account and task inquiries"
              onClick={() => { setIsDrawerOpen(false); setIsFaqOpen(true); }}
            />

            <DrawerItem
              icon={<Info size={16} strokeWidth={1.75} />}
              label="About Unity Earning"
              subtitle="Platform mission and administration"
              onClick={() => { setIsDrawerOpen(false); setIsAboutOpen(true); }}
            />
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              onClick={async () => {
                setIsDrawerOpen(false);
                await logout();
                navigate('/');
              }}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition cursor-pointer border border-rose-200 flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Balance Transfer Modal */}
        {isTransferOpen && (
          <div className="fixed inset-0 bg-slate-950/50 z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[420px] shadow-xl relative border border-slate-200 flex flex-col space-y-4">
              <button
                onClick={() => {
                  setIsTransferOpen(false);
                  setTransferError('');
                  setTransferSuccess('');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-[#F4F5F7] w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <ArrowRightLeft size={17} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Balance Transfer</h3>
                  <p className="text-[11px] text-slate-500">Transfer funds instantly to any 7-digit account ID</p>
                </div>
              </div>

              {/* Current Account Available Balance */}
              <div className="bg-[#0A4D8C] text-white p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] text-white/75 block">Available Balance</span>
                  <span className="text-base font-semibold text-white font-mono tabular-nums">
                    ৳{(profile?.balance || 0).toFixed(2)}
                  </span>
                </div>
                <span className="text-[11px] text-white/90 font-medium">
                  Active Member
                </span>
              </div>

              {transferError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{transferError}</span>
                </div>
              )}

              {transferSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#0D7A5F] rounded-lg text-xs font-semibold flex items-start gap-2">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{transferSuccess}</span>
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setTransferError('');
                setTransferSuccess('');

                const cleanId = recipientStudentId.trim();
                const amountNum = parseFloat(transferAmount);

                if (!/^\d{7}$/.test(cleanId)) {
                  setTransferError('Recipient Code must be exactly 7 digits.');
                  return;
                }
                if (cleanId === profile?.studentIdCode) {
                  setTransferError('Cannot transfer balance to your own account ID.');
                  return;
                }
                if (isNaN(amountNum) || amountNum <= 0) {
                  setTransferError('Please enter a valid amount.');
                  return;
                }
                if (amountNum > (profile?.balance || 0)) {
                  setTransferError(`Insufficient balance. Maximum: BDT ${(profile?.balance || 0).toFixed(2)}`);
                  return;
                }
                if (transferPassword.trim() !== profile?.passwordText) {
                  setTransferError('Incorrect password. Enter your correct login password.');
                  return;
                }

                setTransferLoading(true);
                try {
                  if (!user?.uid) {
                    setTransferError('Please sign in again to complete balance transfer.');
                    setTransferLoading(false);
                    return;
                  }

                  const dirSnap = await getDoc(doc(db, 'memberDirectory', cleanId));
                  if (!dirSnap.exists() || !dirSnap.data()?.uid) {
                    setTransferError('Recipient Student Account ID not found.');
                    setTransferLoading(false);
                    return;
                  }

                  const recipientData = dirSnap.data();
                  const recipientUid = String(recipientData.uid);
                  const recipientName = recipientData.fullName || 'Verified Member';

                  await updateDoc(doc(db, 'users', user.uid), { balance: increment(-amountNum) });
                  await updateDoc(doc(db, 'users', recipientUid), { balance: increment(amountNum) });

                  await addDoc(collection(db, 'transfers'), {
                    senderId: user.uid,
                    senderName: profile?.fullName || 'Member',
                    senderStudentId: profile?.studentIdCode,
                    recipientStudentId: cleanId,
                    recipientName: recipientName,
                    amount: amountNum,
                    createdAt: new Date().toISOString(),
                    status: 'completed'
                  });

                  setTransferSuccess(`Successfully transferred ৳${amountNum.toFixed(2)} to ID: ${cleanId} (${recipientName}).`);
                  setTransferAmount('');
                  setRecipientStudentId('');
                  setTransferPassword('');
                } catch (err: any) {
                  setTransferError(err.message || 'Transfer failed.');
                } finally {
                  setTransferLoading(false);
                }
              }} className="space-y-3.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-700">Recipient 7-Digit Account ID</label>
                    {isSearchingRecipient && <span className="text-[11px] text-[#0A4D8C] font-medium">Checking...</span>}
                    {recipientNameFound && <span className="text-[11px] text-[#0D7A5F] font-semibold">{recipientNameFound}</span>}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={7}
                    value={recipientStudentId}
                    onChange={(e) => setRecipientStudentId(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 5928172"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono tracking-wider tabular-nums focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-700">Amount (BDT)</label>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">Max ৳{(profile?.balance || 0).toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Amount in BDT (e.g. 150)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono tabular-nums focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15"
                  />

                  <div className="flex gap-1.5 pt-2">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTransferAmount(amt.toString())}
                        className="flex-1 py-1.5 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-slate-700 text-[11px] font-medium font-mono tabular-nums transition border border-slate-200 cursor-pointer"
                      >
                        +৳{amt}
                      </button>
                    ))}
                    {profile?.balance && profile.balance > 0 ? (
                      <button
                        type="button"
                        onClick={() => setTransferAmount(Math.floor(profile.balance).toString())}
                        className="py-1.5 px-3 rounded-lg bg-[#EEF5FC] hover:bg-[#D4E4F7] text-[#0A4D8C] text-[11px] font-semibold transition border border-[#D4E4F7] cursor-pointer"
                      >
                        Max
                      </button>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Account Password</label>
                  <input
                    type="password"
                    required
                    value={transferPassword}
                    onChange={(e) => setTransferPassword(e.target.value)}
                    placeholder="Enter your login password"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15"
                  />
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded-lg text-[11px] text-slate-600 space-y-1 border border-slate-200">
                  <div className="flex justify-between">
                    <span>Transfer Fee</span>
                    <span className="text-[#0D7A5F] font-semibold tabular-nums">0.00 BDT (Free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Speed</span>
                    <span className="text-slate-900 font-medium">Instant</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={transferLoading || !profile?.balance || profile.balance <= 0}
                  className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{transferLoading ? 'Processing Transfer...' : 'Confirm & Send Balance'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Terms & Conditions Modal */}
        {isTermsOpen && (
          <div className="fixed inset-0 bg-slate-950/50 z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[460px] shadow-xl relative border border-slate-200 flex flex-col space-y-3.5">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-[#F4F5F7] w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <FileText size={17} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Terms of Service</h3>
                  <p className="text-[11px] text-slate-500">Corporate Operating Agreement & Guidelines</p>
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
                {[
                  { id: 'agreement', label: '1. Agreement' },
                  { id: 'kyc', label: '2. Student ID' },
                  { id: 'audit', label: '3. Quality Audit' },
                  { id: 'payout', label: '4. Payouts' },
                  { id: 'conduct', label: '5. Conduct' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTermsActiveTab(tab.id as any)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap transition cursor-pointer",
                      termsActiveTab === tab.id
                        ? "bg-[#0A4D8C] text-white"
                        : "bg-[#F4F5F7] text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 min-h-[170px]">
                {termsActiveTab === 'agreement' && (
                  <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                      <Shield size={14} className="text-[#0A4D8C]" />
                      <span>Section 1: Account Agreement</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      By accessing the Unity Earning portal, members agree to execute tasks independently and accurately using authentic data and manual input.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Accounts are non-transferable and assigned exclusively to the registered legal identity.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'kyc' && (
                  <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                      <UserIcon size={14} className="text-[#0A4D8C]" />
                      <span>Section 2: Student ID Verification</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      Each member must register with a unique 7-digit Student ID matching their institutional assignment records.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Duplicate registrations under the same Student ID will result in immediate account suspension.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'audit' && (
                  <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                      <AlertCircle size={14} className="text-[#0A4D8C]" />
                      <span>Section 3: Quality Control Protocol</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      Work modules (Typing, Excel Data Entry, and Form Verification) undergo automated timing and accuracy auditing.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Automated scripts, pasted text, or fabricated submissions trigger automatic rejection.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'payout' && (
                  <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                      <Wallet size={14} className="text-[#0A4D8C]" />
                      <span>Section 4: Earnings & Transfers</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      Approved rewards are credited directly to your wallet in BDT. Withdrawals via bKash, Nagad, or Rocket are processed within 2 to 24 hours.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Peer-to-peer balance transfers are instant, fee-free, and final once confirmed.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'conduct' && (
                  <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                      <ShieldAlert size={14} className="text-[#0A4D8C]" />
                      <span>Section 5: Professional Conduct</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      Members are expected to maintain courteous communication with mentors and peers across chat and support channels.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Unity Earning Compliance</span>
                <button
                  onClick={() => setIsTermsOpen(false)}
                  className="px-4 py-2 bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Accept & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy Modal */}
        {isPrivacyOpen && (
          <div className="fixed inset-0 bg-slate-950/50 z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[460px] shadow-xl relative border border-slate-200 flex flex-col space-y-3.5">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-[#F4F5F7] w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Privacy & Data Security</h3>
                  <p className="text-[11px] text-slate-500">Protection of Member Records & Credentials</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">1. Credential Safeguards</span>
                  <p>Your legal name, contact details, and 4-digit security PIN are encrypted and never disclosed to external marketing entities.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">2. Task Submission Proofs</span>
                  <p>Uploaded recordings, spreadsheets, and project files are stored exclusively for verification and certification audits.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">3. Financial Ledger Retention</span>
                  <p>Payout receipts and transfer logs are retained securely under standard financial compliance rules.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="px-4 py-2 bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Company Working Rules Modal */}
        {isRulesOpen && (
          <div className="fixed inset-0 bg-slate-950/50 z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[460px] shadow-xl relative border border-slate-200 flex flex-col space-y-3.5">
              <button
                onClick={() => setIsRulesOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-[#F4F5F7] w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <BookOpen size={17} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Working Rules & Conduct</h3>
                  <p className="text-[11px] text-slate-500">Standard Operating Procedures for Members</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-[#EEF5FC] rounded-lg border border-[#D4E4F7] space-y-1">
                  <span className="font-semibold text-[#0A4D8C] block">1. Timed Typing Sessions</span>
                  <p className="text-slate-700">Click Start to begin the 30-minute timer. Refreshing or timing out activates a 2-hour cooldown period.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">2. Data Entry Precision</span>
                  <p>Real Excel formulas and complete client datasets are audited by lead trainers before balance credit.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">3. Mentor Coordination</span>
                  <p>Stay connected with your assigned Team Leader and Trainer for weekly task allocations.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setIsRulesOpen(false)}
                  className="px-4 py-2 bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment & Withdrawal Policy Modal */}
        {isPaymentPolicyOpen && (
          <div className="fixed inset-0 bg-slate-950/50 z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[460px] shadow-xl relative border border-slate-200 flex flex-col space-y-3.5">
              <button
                onClick={() => setIsPaymentPolicyOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-[#F4F5F7] w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <Landmark size={17} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Payment & Withdrawal Policy</h3>
                  <p className="text-[11px] text-slate-500">Disbursement Schedules & Limits</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-[#FEF7E0] rounded-lg border border-[#F3DFA2] space-y-1">
                  <span className="font-semibold text-slate-900 block">1. Supported Gateways</span>
                  <p className="text-slate-700">Withdrawals are processed via bKash, Nagad, Rocket, and scheduled bank transfers.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">2. Limits & Processing Time</span>
                  <p>Minimum withdrawal: BDT 200. Maximum single request: BDT 25,000. Approvals take 2–24 hours.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">3. Peer-to-Peer Transfers</span>
                  <p>Transfer funds instantly between student accounts with 0% fee using a valid 7-digit Account ID.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setIsPaymentPolicyOpen(false)}
                  className="px-4 py-2 bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Modal */}
        {isFaqOpen && (
          <div className="fixed inset-0 bg-slate-950/50 z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[460px] shadow-xl relative border border-slate-200 flex flex-col space-y-3.5">
              <button
                onClick={() => setIsFaqOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-[#F4F5F7] w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <HelpCircle size={17} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Frequently Asked Questions</h3>
                  <p className="text-[11px] text-slate-500">Common Inquiries & Solutions</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed max-h-[300px] overflow-y-auto pr-1">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <h4 className="font-semibold text-slate-900">Q: How do I get my pending account approved?</h4>
                  <p className="text-slate-600">Inform your Team Leader after submitting your registration so your profile can be reviewed.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <h4 className="font-semibold text-slate-900">Q: When can I start working on tasks?</h4>
                  <p className="text-slate-600">Once active, select any assigned task from the Home dashboard or My Work tab.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1">
                  <h4 className="font-semibold text-slate-900">Q: How does Balance Transfer work?</h4>
                  <p className="text-slate-600">Open Balance Transfer, enter the recipient's 7-digit Account ID, specify the amount, and confirm with your password.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setIsFaqOpen(false)}
                  className="px-4 py-2 bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About Us Modal */}
        {isAboutOpen && (
          <div className="fixed inset-0 bg-slate-950/50 z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[460px] shadow-xl relative border border-slate-200 flex flex-col space-y-3.5">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-[#F4F5F7] w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <Info size={17} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">About Unity Earning</h3>
                  <p className="text-[11px] text-slate-500">Corporate Administration & Operations</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong className="text-slate-900">Unity Earning</strong> is an online learning and remote digital work platform connecting trained members with verified assignments.
                </p>
                <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">System Director</span>
                    <span className="text-slate-900 font-semibold">Engr. Mahmudul Hasan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mentorship Leads</span>
                    <span className="text-slate-900 font-medium">42 Verified Mentors & Leads</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Helpline Hours</span>
                    <span className="text-slate-900 font-medium">09:00 AM – 11:00 PM Daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Headquarters</span>
                    <span className="text-slate-900 font-medium">Dhaka, Bangladesh</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="px-4 py-2 bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Gift Campaign Contest Modal */}
        <GiftCampaignModal
          isOpen={isGiftModalOpen}
          onClose={() => setIsGiftModalOpen(false)}
        />

        {/* Official Notification Center Modal */}
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        {/* Formal Fixed Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-[520px] md:max-w-3xl lg:max-w-4xl mx-auto w-full bg-white border-t border-slate-200/90 flex justify-between items-center py-1.5 px-1.5 z-40">
          <NavItem
            to="/"
            icon={<Home size={18} strokeWidth={1.75} />}
            label="Home"
            active={location.pathname === '/'}
          />
          <NavItem
            to="/reviews"
            icon={<Star size={18} strokeWidth={1.75} />}
            label="Reviews"
            active={location.pathname === '/reviews'}
          />
          <NavItem
            to="/live-payments"
            icon={<Receipt size={18} strokeWidth={1.75} />}
            label="Payouts"
            active={location.pathname === '/live-payments' || location.pathname === '/payouts'}
          />
          <NavItem
            to="/mentors"
            icon={<GraduationCap size={18} strokeWidth={1.75} />}
            label="Mentors"
            active={location.pathname === '/mentors' || location.pathname === '/guidelines'}
          />
          <NavItem
            to="/live-chat"
            icon={<MessageCircle size={18} strokeWidth={1.75} />}
            label="Live Chat"
            active={location.pathname === '/live-chat' || location.pathname === '/chat'}
          />
          <NavItem
            to="/profile"
            icon={<UserIcon size={18} strokeWidth={1.75} />}
            label="Profile"
            active={location.pathname === '/profile'}
          />
        </nav>

      </div>
    </div>
  );
};

// Formal drawer row component
const DrawerItem = ({
  icon,
  label,
  subtitle,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full bg-white border border-slate-200/90 hover:border-[#0A4D8C]/40 rounded-xl p-3 flex items-center justify-between text-left transition cursor-pointer group"
  >
    <div className="flex items-center gap-3 min-w-0 pr-2">
      <div className="w-8 h-8 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-[12.5px] font-semibold text-slate-900 group-hover:text-[#0A4D8C] truncate leading-snug transition-colors">
          {label}
        </h4>
        {subtitle && (
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <ChevronRight size={15} className="text-slate-400 group-hover:text-[#0A4D8C] shrink-0 transition-colors" />
  </button>
);

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-lg transition-colors cursor-pointer select-none",
        active
          ? "text-[#0A4D8C] font-semibold"
          : "text-slate-500 hover:text-slate-800"
      )}
    >
      <div className="p-0.5">
        {icon}
      </div>
      <span className="text-[10.5px] tracking-tight mt-0.5 whitespace-nowrap">{label}</span>
    </button>
  );
};
