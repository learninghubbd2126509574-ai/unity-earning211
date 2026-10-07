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
  ArrowRight,
  ShieldCheck,
  FileText,
  Landmark,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Send,
  Building,
  ArrowRightLeft,
  BookOpen,
  Info,
  ShieldAlert,
  LogOut,
  Sparkles,
  PhoneCall,
  HelpCircle,
  Shield,
  Award,
  Gift,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { db, doc, onSnapshot, collection, query, where, getDocs, addDoc, updateDoc, increment } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PinLockScreen } from './PinLockScreen';
import { UnifiedAuth } from './UnifiedAuth';
import { PromoModal } from './PromoModal';
import { HelpSupportModal } from './HelpSupportModal';
import { GiftCampaignModal } from './GiftCampaignModal';
import { NotificationModal } from './NotificationModal';
import { CustomAdminPopupModal } from './CustomAdminPopupModal';

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
    whatsappUrl: 'https://wa.me/8801919012426',
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

  // Listen for open_balance_transfer event from any page/component
  useEffect(() => {
    const handleOpenTransfer = () => {
      setIsDrawerOpen(false);
      setIsTransferOpen(true);
    };
    window.addEventListener('open_balance_transfer', handleOpenTransfer);
    return () => window.removeEventListener('open_balance_transfer', handleOpenTransfer);
  }, []);

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

  // Step 1: 20% Extra Commission Announcement Popup - Shows FIRST of all on enter/login
  const [isPromoOpen, setIsPromoOpen] = useState<boolean>(false);
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState<boolean>(false);
  const [adminPopupData, setAdminPopupData] = useState<any>(null);

  useEffect(() => {
    if (loading) return;
    const unsubSupport = onSnapshot(doc(db, 'settings', 'support'), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        setSupportChannels({
          telegramUrl: d?.telegramUrl || 'https://t.me/unityearning',
          whatsappUrl: d?.whatsappUrl || 'https://wa.me/8801919012426',
          videoUrl: d?.videoUrl || d?.url || 'https://youtube.com',
          logoUrl: d?.logoUrl || ''
        });
      }
    }, (error) => {
      console.warn("Support settings listener quota warning:", error);
    });

    // Admin Popup Listener
    const unsubAdmin = onSnapshot(doc(db, 'settings', 'customPopup'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.isActive && d.message && d.message.trim().length > 0) {
          setAdminPopupData({
            title: d.title || 'গুরুত্বপূর্ণ নোটিশ',
            message: d.message,
            buttonText: d.buttonText || 'বুঝেছি / ধন্যবাদ',
          });
          
          // Only automatically trigger if not already shown in this session
          if (!sessionStorage.getItem('admin_popup_shown_this_session')) {
            // Delay opening to let Promo check run
            setTimeout(() => {
              if (!sessionStorage.getItem('promo_shown_this_session')) {
                // If promo is still open, we'll open this when promo closes.
              } else {
                setIsAdminPopupOpen(true);
              }
            }, 500);
          }
        }
      }
    });

    return () => {
      unsubSupport();
      unsubAdmin();
    };
  }, [loading]);

  const handleVideoClick = () => {
    const target = supportChannels.videoUrl || 'https://youtube.com';
    window.open(target.startsWith('http') ? target : `https://${target}`, '_blank');
  };

  const handleClosePromo = () => {
    setIsPromoOpen(false);
    sessionStorage.setItem('promo_shown_this_session', 'true');
    // Check if we should now show Admin Popup
    if (adminPopupData && !sessionStorage.getItem('admin_popup_shown_this_session')) {
      setIsAdminPopupOpen(true);
    }
  };

  const handleCloseAdminPopup = () => {
    setIsAdminPopupOpen(false);
    sessionStorage.setItem('admin_popup_shown_this_session', 'true');
  };

  // Handle Login Promo Trigger
  useEffect(() => {
    if (user && profile) {
      const alreadyShown = sessionStorage.getItem('promo_shown_this_session');
      if (!alreadyShown) {
        setIsPromoOpen(true);
      }
    } else {
      // Clear session storage on logout
      sessionStorage.removeItem('promo_shown_this_session');
      sessionStorage.removeItem('admin_popup_shown_this_session');
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
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
    <div className="min-h-screen bg-slate-100 flex justify-center w-full antialiased font-sans">
      
      {/* Promo Announcement Modal */}
      <PromoModal isOpen={isPromoOpen} onClose={handleClosePromo} />
      
      {/* Custom Admin Popup Modal */}
      <CustomAdminPopupModal isOpen={isAdminPopupOpen} onClose={handleCloseAdminPopup} popupData={adminPopupData} />

      {/* Help & Support Channels Modal (Telegram, WhatsApp, Video) */}
      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        telegramUrl={supportChannels.telegramUrl}
        whatsappUrl={supportChannels.whatsappUrl}
        videoUrl={supportChannels.videoUrl}
      />

      {/* App Frame Container (Mobile First & Tablet/Desktop Scaled) */}
      <div className="w-full max-w-[480px] bg-white shadow-2xl relative min-h-screen flex flex-col border-x border-slate-200/80">
        
        {/* Main Content Area with Bottom Padding for Navigation Bar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 bg-slate-50 text-slate-800">
          
          {/* Top Brand Header - Slim, Modern & Professional */}
          <header className="bg-slate-900 text-white py-2 px-3 sm:px-4 flex items-center justify-between border-b border-slate-800/90 shadow-2xs sticky top-0 z-30">
            
            {/* Left: Logo & Wordmark Lockup (Clean Brand) */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-slate-700/60 bg-slate-950/60 shadow-xs">
                {supportChannels.logoUrl ? (
                  <img src={supportChannels.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full text-orange-400 bg-orange-500/10 flex items-center justify-center font-bold">
                    <GraduationCap size={18} />
                  </div>
                )}
              </div>
              <div className="leading-tight min-w-0">
                <a href="/" className="text-xs sm:text-sm font-black tracking-tight text-white hover:text-orange-400 transition-colors block whitespace-nowrap">
                  Unity Earning
                </a>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wide whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>E-Learning Platform</span>
                </p>
              </div>
            </div>

            {/* Right: Notification Bell, Video Guide & THREE-LINE MENU OPTION */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Notification Bell Button (Left of Video Guide) with Badge */}
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white border border-slate-700/70 transition cursor-pointer shadow-xs"
                title="অফিশিয়াল নোটিফিকেশন ও অফার"
                aria-label="Notifications"
              >
                <Bell size={16} className="text-amber-400" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-xs animate-pulse">
                  4
                </span>
              </button>

              {/* Video Tutorial Button */}
              <button
                onClick={handleVideoClick}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white text-[11px] font-bold border border-slate-700/70 transition cursor-pointer"
                title="Watch Video Tutorial"
              >
                <PlayCircle size={13} className="text-rose-400" />
                <span>Video</span>
              </button>

              {/* Three-Line Menu (Hamburger) Button on Top Right - Strictly 3 Lines, No Menu Text */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-100 hover:text-white transition shadow-xs cursor-pointer border border-slate-700/70"
                title="Navigation Menu"
                aria-label="Navigation Menu"
              >
                <Menu size={20} className="stroke-[2.3]" />
              </button>

            </div>
          </header>

          {/* Page Routed Content */}
          {profile?.status === 'pending' && (
            <div className="bg-amber-500 text-white p-3.5 px-4 text-xs font-semibold leading-relaxed shadow-sm border-b border-amber-600/40 flex items-start gap-2.5 animate-pulse sticky top-[52px] z-20">
              <span className="text-base shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-slate-900 mb-0.5 text-[12px]">অ্যাকাউন্ট অনুমোদন পেন্ডিং (Pending Approval)</p>
                <p className="text-slate-950 font-medium text-[11px] leading-relaxed">
                  আপনার রিকোয়েস্টটি এখনো পেন্ডিংয়ে রয়েছে। আমাদের এক্সিকিউটিভ সিনিয়র অফিসার অ্যাপ্রুভাল করলেই আপনি কাজ শুরু পারবেন। দয়া করে অপেক্ষা করবেন। আপনার টিম লিডারকে জানাবেন যে আপনি রেজিস্ট্রেশন করেছেন।
                </p>
              </div>
            </div>
          )}

          <main className="w-full">
            <Outlet />
          </main>
        </div>

        {/* Sliding Right Drawer (Hamburger Menu sliding from the RIGHT) */}
        {isDrawerOpen && (
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 transition-opacity duration-300 animate-in fade-in"
          />
        )}

        <div className={cn(
          "fixed inset-y-0 right-0 w-[88%] max-w-[360px] bg-slate-900 text-slate-100 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out transform border-l border-slate-800/80",
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Drawer Header (User Details) */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 relative">
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition cursor-pointer"
              title="Close Menu"
            >
              <X size={16} />
            </button>

            <div className="text-right text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
              Account Overview
            </div>
            
            <div className="flex items-center gap-3.5 mt-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20 shrink-0 uppercase">
                {profile?.fullName?.charAt(0) || 'S'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm sm:text-base truncate leading-tight">
                  {profile?.fullName}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
                  Student ID: <span className="font-mono text-orange-400 font-bold">{profile?.studentIdCode}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide truncate">
                  {profile?.email}
                </p>
              </div>
            </div>

            {/* Account Balance Widget */}
            <div className="mt-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-400">
                  <DollarSign size={16} />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Current Balance</span>
                  <span className="text-sm font-black text-white font-mono">৳{(profile?.balance || 0).toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsTransferOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] transition cursor-pointer shadow-xs active:scale-95"
              >
                Transfer
              </button>
            </div>
          </div>

          {/* Drawer Menu List */}
          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
            <DrawerItem 
              icon={<Gift size={16} className="text-pink-400" />} 
              label="Weekly Mega Gift Contest (৳১০০০+ বোনাস)" 
              onClick={() => { setIsDrawerOpen(false); setIsGiftModalOpen(true); }} 
            />
            <DrawerItem 
              icon={<DollarSign size={16} className="text-emerald-400" />} 
              label="My Balance & Payout History" 
              onClick={() => { setIsDrawerOpen(false); navigate('/live-payments'); }} 
            />
            <DrawerItem 
              icon={<ArrowRightLeft size={16} className="text-blue-400" />} 
              label="Balance Transfer (P2P)" 
              onClick={() => { setIsDrawerOpen(false); setIsTransferOpen(true); }} 
            />
            <DrawerItem 
              icon={<Headphones size={16} className="text-orange-400" />} 
              label="Help & Live Support Channels" 
              onClick={() => { setIsDrawerOpen(false); setIsHelpOpen(true); }} 
            />
            <DrawerItem 
              icon={<FileText size={16} className="text-indigo-400" />} 
              label="Terms & Conditions (Corporate)" 
              onClick={() => { setIsDrawerOpen(false); setIsTermsOpen(true); }} 
            />
            <DrawerItem 
              icon={<ShieldCheck size={16} className="text-purple-400" />} 
              label="Privacy & Security Policy" 
              onClick={() => { setIsDrawerOpen(false); setIsPrivacyOpen(true); }} 
            />
            <DrawerItem 
              icon={<BookOpen size={16} className="text-teal-400" />} 
              label="Company Working Rules & Conduct" 
              onClick={() => { setIsDrawerOpen(false); setIsRulesOpen(true); }} 
            />
            <DrawerItem 
              icon={<Landmark size={16} className="text-amber-400" />} 
              label="Payment & Withdrawal Policy" 
              onClick={() => { setIsDrawerOpen(false); setIsPaymentPolicyOpen(true); }} 
            />
            <DrawerItem 
              icon={<HelpCircle size={16} className="text-rose-400" />} 
              label="Frequently Asked Questions (FAQ)" 
              onClick={() => { setIsDrawerOpen(false); setIsFaqOpen(true); }} 
            />
            <DrawerItem 
              icon={<Info size={16} className="text-cyan-400" />} 
              label="About Unity Earning & Leadership" 
              onClick={() => { setIsDrawerOpen(false); setIsAboutOpen(true); }} 
            />
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 text-center space-y-2">
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Unity Earning • System v2.3</p>
            <button
              onClick={async () => {
                setIsDrawerOpen(false);
                await logout();
                navigate('/');
              }}
              className="w-full py-2 bg-slate-800/60 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Log Out Account
            </button>
          </div>
        </div>

        {/* Floating Action Icons: Animated Gift Box & WhatsApp Helpline - Strictly FIXED to viewport */}
        {location.pathname === '/' && (
          <aside
            className="fixed bottom-[74px] z-50 right-3.5 sm:right-[max(1rem,calc(50vw-240px+1rem))] flex flex-col items-center gap-2.5 pointer-events-auto select-none"
          >
            {/* 1. Pure 3D Isometric Gift Box (No background circle, No 'বোনাস' text) */}
            <button
              onClick={() => setIsGiftModalOpen(true)}
              className="relative group bg-transparent p-0 border-0 outline-none hover:scale-115 active:scale-95 transition-transform duration-300 cursor-pointer select-none flex items-center justify-center filter drop-shadow-[0_10px_16px_rgba(225,29,72,0.5)]"
              title="সাপ্তাহিক মেগা উপহার ক্যাম্পেইন (Weekly Gift Contest)"
              aria-label="Open Gift Contest"
            >
              {/* Premium 3D Isometric Stylized Gift Box SVG */}
              <svg viewBox="0 0 64 64" className="w-13 h-13 overflow-visible" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Gradients for 3D Faces */}
                  <linearGradient id="g3d-left" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BE123C" />
                    <stop offset="100%" stopColor="#881337" />
                  </linearGradient>
                  <linearGradient id="g3d-right" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#BE123C" />
                  </linearGradient>
                  <linearGradient id="g3d-gold-left" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="100%" stopColor="#CA8A04" />
                  </linearGradient>
                  <linearGradient id="g3d-gold-right" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="100%" stopColor="#EAB308" />
                  </linearGradient>
                  <linearGradient id="g3d-lid-left" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#9F1239" />
                  </linearGradient>
                  <linearGradient id="g3d-lid-right" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="100%" stopColor="#E11D48" />
                  </linearGradient>
                  <linearGradient id="g3d-lid-top" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDA4AF" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>

                {/* Ambient Soft Ground Shadow under 3D box */}
                <ellipse cx="32" cy="58" rx="18" ry="4.5" fill="rgba(0,0,0,0.35)" filter="blur(2px)" />

                {/* 3D Box Base: Left Face */}
                <path d="M12 28 L32 38 L32 54 L12 44 Z" fill="url(#g3d-left)" />
                {/* 3D Box Base: Left Gold Ribbon Band */}
                <path d="M20 32 L24 34 L24 50 L20 48 Z" fill="url(#g3d-gold-left)" />

                {/* 3D Box Base: Right Face */}
                <path d="M32 38 L52 28 L52 44 L32 54 Z" fill="url(#g3d-right)" />
                {/* 3D Box Base: Right Gold Ribbon Band */}
                <path d="M40 34 L44 32 L44 48 L40 50 Z" fill="url(#g3d-gold-right)" />

                {/* Light glow coming from inside when lid opens */}
                <path d="M14 26 L32 35 L50 26 L32 17 Z" fill="#FDE047" opacity="0.6" filter="blur(1px)" />

                {/* 3D Openable Box Lid Group (Animated Lid) */}
                <g className="animate-gift-lid">
                  {/* 3D Lid: Left Rim */}
                  <path d="M8 23 L32 35 L32 39 L8 27 Z" fill="url(#g3d-lid-left)" />
                  <path d="M18 28 L22 30 L22 34 L18 32 Z" fill="url(#g3d-gold-left)" />

                  {/* 3D Lid: Right Rim */}
                  <path d="M32 35 L56 23 L56 27 L32 39 Z" fill="url(#g3d-lid-right)" />
                  <path d="M42 30 L46 28 L46 32 L42 34 Z" fill="url(#g3d-gold-right)" />

                  {/* 3D Lid: Top Diamond Face */}
                  <path d="M8 23 L32 11 L56 23 L32 35 Z" fill="url(#g3d-lid-top)" stroke="#FFF" strokeWidth="0.5" strokeOpacity="0.4" />

                  {/* 3D Lid: Gold Ribbon Cross on Top */}
                  <path d="M18 18 L22 16 L46 28 L42 30 Z" fill="url(#g3d-gold-right)" />
                  <path d="M42 16 L46 18 L22 30 L18 28 Z" fill="url(#g3d-gold-left)" />

                  {/* 3D Metallic Golden Bow on top */}
                  <ellipse cx="25" cy="11" rx="6" ry="3.5" transform="rotate(-25 25 11)" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
                  <ellipse cx="39" cy="11" rx="6" ry="3.5" transform="rotate(25 39 11)" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
                  <circle cx="32" cy="13" r="3.2" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.8" />
                </g>
              </svg>
            </button>

            {/* 2. Smaller WhatsApp Icon (Clean, No Call Pill Badge) */}
            <a
              href={supportChannels.whatsappUrl || "https://wa.me/8801919012426"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white ring-3 ring-[#25D366]/20"
              title="হোয়াটসঅ্যাপ হেল্পলাইন (Official Helpline)"
              aria-label="WhatsApp Helpline"
            >
              <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.002 2C8.28 2 2.02 8.26 2.02 15.982c0 2.47.644 4.88 1.868 7.002L2 30l7.218-1.854c2.042 1.114 4.364 1.706 6.784 1.706 7.722 0 13.982-6.26 13.982-13.982S23.724 2 16.002 2zm8.172 19.986c-.34.954-1.986 1.75-2.736 1.864-.702.106-1.594.15-2.584-.168-.6-.192-1.37-.446-2.358-.87-4.148-1.782-6.852-5.962-7.06-6.238-.206-.276-1.688-2.246-1.688-4.286 0-2.04 1.07-3.044 1.45-3.46.38-.414.828-.518 1.104-.518.276 0 .552.002.794.014.256.012.6.096.938.908.348.834 1.188 2.898 1.292 3.11.104.212.172.46.034.736-.138.276-.208.448-.414.69-.206.242-.434.54-.62.724-.206.206-.422.432-.182.846.24.414 1.07 1.764 2.3 2.86 1.584 1.41 2.918 1.848 3.332 2.054.414.206.656.172.9-.104.24-.276 1.036-1.206 1.312-1.62.276-.414.552-.346.932-.206.38.138 2.416 1.138 2.83 1.346.414.206.69.31.794.484.104.172.104 1.002-.236 1.956z"/>
              </svg>
            </a>
          </aside>
        )}

        {/* Balance Transfer Modal (Fixed Viewport Centered Modal Popup) */}
        {isTransferOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-55 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[420px] shadow-2xl relative border border-slate-100 flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setIsTransferOpen(false);
                  setTransferError('');
                  setTransferSuccess('');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold transition"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <ArrowRightLeft size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Balance Transfer (৳)</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Transfer funds instantly to any student account ID</p>
                </div>
              </div>

              {/* Current Account Available Balance */}
              <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Your Available Balance</span>
                  <span className="text-base font-black text-amber-400 font-mono">৳{(profile?.balance || 0).toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                  Active Member
                </div>
              </div>

              {transferError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-500" />
                  <span className="leading-tight">{transferError}</span>
                </div>
              )}

              {transferSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-black flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                  <span className="leading-tight">{transferSuccess}</span>
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
                  const usersRef = collection(db, 'users');
                  const q = query(usersRef, where('studentIdCode', '==', cleanId));
                  const qSnap = await getDocs(q);
                  
                  if (qSnap.empty) {
                    setTransferError('Recipient Student Account ID not found in database.');
                    setTransferLoading(false);
                    return;
                  }
                  
                  const recipientDoc = qSnap.docs[0];
                  const recipientUid = recipientDoc.id;
                  const recipientData = recipientDoc.data();
                  const recipientName = recipientData?.fullName || 'Verified Member';

                  await updateDoc(doc(db, 'users', user?.uid!), { balance: increment(-amountNum) });
                  await updateDoc(doc(db, 'users', recipientUid), { balance: increment(amountNum) });

                  await addDoc(collection(db, 'transfers'), {
                    senderId: user?.uid,
                    senderName: profile?.fullName || 'Member',
                    senderStudentId: profile?.studentIdCode,
                    recipientStudentId: cleanId,
                    recipientName: recipientName,
                    amount: amountNum,
                    createdAt: new Date().toISOString(),
                    status: 'completed'
                  });

                  setTransferSuccess(`Successfully transferred ৳${amountNum.toFixed(2)} to ID: ${cleanId} (${recipientName})!`);
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
                    <label className="block text-xs font-bold text-slate-700">Recipient Account ID Code (7 Digits)</label>
                    {isSearchingRecipient && <span className="text-[9px] text-blue-500 animate-pulse font-semibold">Verifying...</span>}
                    {recipientNameFound && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">{recipientNameFound}</span>}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={7}
                    value={recipientStudentId}
                    onChange={(e) => setRecipientStudentId(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 5928172"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700 font-sans">Transfer Amount (BDT)</label>
                    <span className="text-[10px] font-mono text-slate-400">Limit: ৳{(profile?.balance || 0).toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Amount in BDT (e.g. 150)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />

                  {/* Quick Amount Buttons */}
                  <div className="flex gap-1.5 pt-1.5">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTransferAmount(amt.toString())}
                        className="flex-1 py-1 px-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-[10px] font-bold transition border border-slate-200/60 cursor-pointer text-center"
                      >
                        +৳{amt}
                      </button>
                    ))}
                    {profile?.balance && profile.balance > 0 ? (
                      <button
                        type="button"
                        onClick={() => setTransferAmount(Math.floor(profile.balance).toString())}
                        className="py-1 px-2.5 rounded-lg bg-orange-100/70 hover:bg-orange-200 text-orange-800 text-[10px] font-black transition border border-orange-200 cursor-pointer"
                      >
                        Max
                      </button>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Account Password</label>
                  <input
                    type="password"
                    required
                    value={transferPassword}
                    onChange={(e) => setTransferPassword(e.target.value)}
                    placeholder="Enter your login password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] text-slate-500 font-semibold space-y-0.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span>Transfer Surcharge:</span>
                    <span className="text-emerald-600 font-bold">0.00 BDT (Free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Execution Speed:</span>
                    <span className="text-slate-800 font-bold">Instant (Real-time)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={transferLoading || !profile?.balance || profile.balance <= 0}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send size={12} />
                  <span>{transferLoading ? 'Processing Transfer...' : 'Confirm & Send Balance'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Terms & Conditions Modal (Structured Corporate Conditions, Zero Awkward Inner Scroll) */}
        {isTermsOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[460px] shadow-2xl relative border border-slate-100 flex flex-col space-y-3.5">
              <button 
                onClick={() => setIsTermsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">Terms of Service & Regulations</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Official Corporate Conditions • Unity Earning Portal</p>
                </div>
              </div>

              {/* Category Pill Selector (Tab Navigation instead of awkward inner scrolling) */}
              <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
                {[
                  { id: 'agreement', label: '1. Agreement' },
                  { id: 'kyc', label: '2. Student ID' },
                  { id: 'audit', label: '3. Anti-AI Audit' },
                  { id: 'payout', label: '4. Payouts' },
                  { id: 'conduct', label: '5. Discipline' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTermsActiveTab(tab.id as any)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer",
                      termsActiveTab === tab.id
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Cards */}
              <div className="space-y-2.5 text-xs text-slate-700 min-h-[190px]">
                {termsActiveTab === 'agreement' && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[12px]">
                      <Shield size={14} className="text-orange-500" />
                      <span>Section 1: Legal Operational Covenant</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      By registering and accessing the Unity Earning e-learning portal, you agree to comply with all standard corporate procedures, intellectual property protection, and task delivery covenants.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Membership is personal, non-transferable, and governed under the laws of Bangladesh and the Digital Security Framework.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'kyc' && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[12px]">
                      <User size={14} className="text-blue-500" />
                      <span>Section 2: 7-Digit Student ID & Identity KYC</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      Every student is assigned an official 7-digit Account Code. All submissions, payout requests, and peer-to-peer balance transfers must tie exclusively to this verified ID.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Creating duplicate accounts, falsifying student names, or using proxy numbers will lead to instant permanent termination and forfeiture of wallet balances.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'audit' && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[12px]">
                      <AlertCircle size={14} className="text-rose-500" />
                      <span>Section 3: Anti-AI Protocol & Quality Control</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      Work modules (such as Hand-Typing, Excel Data Entry, and Form Verification) undergo automated keystroke analysis and formula auditing.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Submitting AI-generated paragraphs, fake file placeholders, or unverified Excel datasets triggers immediate automatic task rejection and demerit marks.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'payout' && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[12px]">
                      <DollarSign size={14} className="text-emerald-500" />
                      <span>Section 4: Earnings, Payouts & Transfers</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      All approved task rewards are credited directly to your dashboard wallet in BDT. Withdrawals via bKash, Nagad, or Rocket are processed within 2 to 24 hours.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Peer-to-peer balance transfers between students are instant, fee-free, and irreversible once executed.
                    </p>
                  </div>
                )}

                {termsActiveTab === 'conduct' && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[12px]">
                      <ShieldAlert size={14} className="text-purple-500" />
                      <span>Section 5: Discipline & Suspension Policy</span>
                    </div>
                    <p className="leading-relaxed text-slate-600">
                      Students are expected to maintain professional conduct with assigned Team Leaders and Mentors. Abusive language in live chat or support channels will lead to immediate deactivation.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Attempts to hack, scrape, or exploit system APIs will be reported to legal cybercrime authorities.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Corporate Compliance • Unity Earning</span>
                <button
                  onClick={() => setIsTermsOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  I Understand & Accept
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy Modal */}
        {isPrivacyOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[460px] shadow-2xl relative border border-slate-100 flex flex-col space-y-3.5">
              <button 
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">Privacy & Data Security Policy</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Protection of Student Data & Authentication Credentials</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-sans">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">1. Student Credential Safeguards:</span>
                  <p>Your full legal name, phone number, login credentials, and 4-digit security PIN are encrypted and never shared with external marketing parties.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">2. Task Submission Proofs:</span>
                  <p>Uploaded video recordings, Excel spreadsheets, and project proofs are stored strictly for manual mentor auditing and certification generation.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">3. Financial Ledger Retention:</span>
                  <p>All payout transaction receipts and balance transfer logs are securely archived for audit compliance under Bangladesh financial clearance rules.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close Policy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Company Working Rules Modal */}
        {isRulesOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[460px] shadow-2xl relative border border-slate-100 flex flex-col space-y-3.5">
              <button 
                onClick={() => setIsRulesOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">Working Rules & Code of Conduct</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Standard Operating Procedures for Active Students</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-sans">
                <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 space-y-1">
                  <span className="font-bold text-teal-900 text-[11px] block">1. Live Video Record for Typing Tasks:</span>
                  <p className="text-teal-800">To maintain zero-AI transcription standards, all typing tasks require camera recording while typing as proof of manual keystroke speed.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">2. Data Entry Precision:</span>
                  <p>In project data entry, real Excel formulas and clean numeric formatting are audited by lead trainers. Incomplete entries will be rejected.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">3. Mentor Coordination:</span>
                  <p>Every student is assigned a dedicated Team Leader and Trainer. Check in weekly for task allocations and higher-tier corporate project recommendations.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsRulesOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  I Understand Rules
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment & Withdrawal Policy Modal */}
        {isPaymentPolicyOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[460px] shadow-2xl relative border border-slate-100 flex flex-col space-y-3.5">
              <button 
                onClick={() => setIsPaymentPolicyOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Landmark size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">Payment & Withdrawal Policy</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Financial Regulations, Payout Timelines & Limits</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-sans">
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
                  <span className="font-bold text-amber-900 text-[11px] block">1. Supported Payment Gateways:</span>
                  <p className="text-amber-800">Withdrawals are processed through bKash, Nagad, Rocket, and Scheduled Bank Wire Transfers directly to student mobile wallets.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">2. Withdrawal Limits & Timelines:</span>
                  <p>Minimum payout request: BDT 200. Maximum single withdrawal: BDT 25,000. Micro-task payouts are approved in 2-6 hours; major projects in 24 hours.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">3. Peer-to-Peer (P2P) Balance Transfers:</span>
                  <p>Students can transfer funds to other enrolled students instantly with 0% transaction fee using their 7-digit Account ID.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsPaymentPolicyOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close Policy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Frequently Asked Questions (FAQ) Modal */}
        {isFaqOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[460px] shadow-2xl relative border border-slate-100 flex flex-col space-y-3.5">
              <button 
                onClick={() => setIsFaqOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">Frequently Asked Questions</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Common Inquiries & Platform Solutions</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed font-sans max-h-[300px] overflow-y-auto pr-1">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-[11px]">Q: How do I get my pending account approved?</h4>
                  <p className="text-slate-600">A: Once submitted, your profile is assigned to an executive officer. Inform your Team Leader to accelerate your application approval.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-[11px]">Q: When can I start working on tasks?</h4>
                  <p className="text-slate-600">A: Once your account is active, open the 'My Work' tab to start submitting tasks in your approved modules.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-[11px]">Q: How do I withdraw money to my bKash account?</h4>
                  <p className="text-slate-600">A: Go to the 'Payouts' page, select bKash, enter your 11-digit mobile number and withdrawal amount, and submit.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-[11px]">Q: How does Balance Transfer work?</h4>
                  <p className="text-slate-600">A: Open the Menu or Profile, select 'Balance Transfer', enter the recipient's 7-digit Account ID and password to send instantly.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsFaqOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close FAQ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About Us Modal */}
        {isAboutOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-55 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[460px] shadow-2xl relative border border-slate-100 flex flex-col space-y-3.5">
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Info size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">About Unity Earning</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Platform Leadership & Corporate Administration</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-sans">
                <p>
                  <strong>Unity Earning</strong> is a premier nationwide e-learning and remote work outsourcing platform, bridging skilled students with verified digital assignments.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Chief System Director:</span>
                    <span className="text-orange-600 font-extrabold">Engr. Mahmudul Hasan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Total Mentorship Leads:</span>
                    <span className="text-slate-600 font-semibold">8 Senior In-Charge Leads</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Helpline Operational Hours:</span>
                    <span className="text-slate-600">09:00 AM - 11:00 PM (Daily)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Corporate HQ:</span>
                    <span className="text-slate-600">Dhaka, Bangladesh</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
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

        {/* Stable Fixed Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex justify-between items-center py-2 px-1.5 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <NavItem 
            to="/" 
            icon={<Home size={18} />} 
            label="Home" 
            active={location.pathname === '/'} 
            colorTheme="blue"
          />
          <NavItem 
            to="/my-work" 
            icon={<BriefcaseBusiness size={18} />} 
            label="My Work" 
            active={location.pathname.startsWith('/module') || location.pathname === '/my-work'} 
            colorTheme="emerald"
          />
          <NavItem 
            to="/live-payments" 
            icon={<Receipt size={18} />} 
            label="Payouts" 
            active={location.pathname === '/live-payments' || location.pathname === '/payouts'} 
            colorTheme="amber"
          />
          <NavItem 
            to="/mentors" 
            icon={<GraduationCap size={18} />} 
            label="Mentors" 
            active={location.pathname === '/mentors' || location.pathname === '/guidelines'} 
            colorTheme="purple"
          />
          <NavItem 
            to="/live-chat" 
            icon={<MessageCircle size={18} />} 
            label="Live Chat" 
            active={location.pathname === '/live-chat' || location.pathname === '/chat'} 
            colorTheme="teal"
          />
          <NavItem 
            to="/profile" 
            icon={<UserIcon size={18} />} 
            label="Profile" 
            active={location.pathname === '/profile'} 
            colorTheme="indigo"
          />
        </nav>

      </div>
    </div>
  );
};

// Helper drawer item component
const DrawerItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer text-left text-xs font-semibold group"
  >
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-white">
        {icon}
      </div>
      <span>{label}</span>
    </div>
    <ArrowRight size={14} className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
  </button>
);

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  colorTheme: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'indigo' | 'teal';
}

const NavItem = ({ to, icon, label, active, colorTheme }: NavItemProps) => {
  const navigate = useNavigate();

  const getThemeClasses = () => {
    switch (colorTheme) {
      case 'blue':
        return active 
          ? "text-blue-600 font-bold bg-blue-50/90 border border-blue-200/80 shadow-2xs" 
          : "text-slate-400 hover:text-blue-500";
      case 'emerald':
        return active 
          ? "text-emerald-600 font-bold bg-emerald-50/90 border border-emerald-200/80 shadow-2xs" 
          : "text-slate-400 hover:text-emerald-500";
      case 'amber':
        return active 
          ? "text-amber-600 font-bold bg-amber-50/90 border border-amber-200/80 shadow-2xs" 
          : "text-slate-400 hover:text-amber-500";
      case 'rose':
        return active 
          ? "text-rose-600 font-bold bg-rose-50/90 border border-rose-200/80 shadow-2xs" 
          : "text-slate-400 hover:text-rose-500";
      case 'purple':
        return active 
          ? "text-purple-600 font-bold bg-purple-50/90 border border-purple-200/80 shadow-2xs" 
          : "text-slate-400 hover:text-purple-500";
      case 'teal':
        return active 
          ? "text-teal-600 font-bold bg-teal-50/90 border border-teal-200/80 shadow-2xs" 
          : "text-slate-400 hover:text-teal-500";
      case 'indigo':
        return active 
          ? "text-indigo-600 font-bold bg-indigo-50/90 border border-indigo-200/80 shadow-2xs" 
          : "text-slate-400 hover:text-indigo-500";
    }
  };

  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 rounded-xl transition-all cursor-pointer select-none active:scale-95",
        getThemeClasses()
      )}
    >
      <div className={cn("p-0.5 rounded-lg transition-transform", active && "scale-105")}>
        {icon}
      </div>
      <span className="text-[10px] tracking-tight mt-0.5 font-medium whitespace-nowrap">{label}</span>
    </button>
  );
};
