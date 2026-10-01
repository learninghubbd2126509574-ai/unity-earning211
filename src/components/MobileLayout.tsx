import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BriefcaseBusiness, 
  User as UserIcon, 
  PlayCircle,
  Receipt,
  Headphones,
  GraduationCap,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PinLockScreen } from './PinLockScreen';
import { UnifiedAuth } from './UnifiedAuth';
import { PromoModal } from './PromoModal';
import { HelpSupportModal } from './HelpSupportModal';

export const MobileLayout = () => {
  const { user, profile, loading, isPinUnlocked, setIsPinUnlocked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Support URLs state from Firestore
  const [supportChannels, setSupportChannels] = useState<{
    telegramUrl?: string;
    whatsappUrl?: string;
    videoUrl?: string;
  }>({
    telegramUrl: 'https://t.me/unityearning',
    whatsappUrl: 'https://wa.me/8801919012426',
    videoUrl: 'https://youtube.com'
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Promo Modal state (pops up directly in front on login / first load)
  const [isPromoOpen, setIsPromoOpen] = useState<boolean>(() => {
    return sessionStorage.getItem('unity_promo_seen') !== 'true';
  });

  useEffect(() => {
    if (loading) return;
    const unsubSupport = onSnapshot(doc(db, 'settings', 'support'), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        setSupportChannels({
          telegramUrl: d?.telegramUrl || 'https://t.me/unityearning',
          whatsappUrl: d?.whatsappUrl || 'https://wa.me/8801919012426',
          videoUrl: d?.videoUrl || d?.url || 'https://youtube.com'
        });
      }
    });

    return () => {
      unsubSupport();
    };
  }, [loading]);

  const handleVideoClick = () => {
    const target = supportChannels.videoUrl || 'https://youtube.com';
    window.open(target.startsWith('http') ? target : `https://${target}`, '_blank');
  };

  const handleClosePromo = () => {
    setIsPromoOpen(false);
    sessionStorage.setItem('unity_promo_seen', 'true');
  };

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
          
          {/* Top Brand Header */}
          <header className="bg-slate-900 text-white py-3.5 px-4 sm:px-5 flex items-center justify-between border-b border-slate-800/90 shadow-xs sticky top-0 z-30">
            
            {/* Left: Brand & Subtitle */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black shadow-xs shrink-0">
                <GraduationCap size={20} />
              </div>
              <div className="leading-tight">
                <a href="/" className="text-base sm:text-lg font-black tracking-tight text-white uppercase hover:text-orange-400 transition-colors">
                  Unity Earning
                </a>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  E-Learning Platform
                </p>
              </div>
            </div>

            {/* Right: Video Guide & Help Support Actions */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Video Tutorial Button */}
              <button
                onClick={handleVideoClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition cursor-pointer"
                title="Watch Video Tutorial"
              >
                <PlayCircle size={15} className="text-rose-400" />
                <span className="text-[11px] font-medium">Video</span>
              </button>

              {/* Help & Support Button */}
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                title="Help, Telegram & WhatsApp Support"
              >
                <Headphones size={14} />
                <span className="text-[11px]">Help</span>
              </button>

            </div>
          </header>

          {/* Page Routed Content */}
          <main className="w-full">
            <Outlet />
          </main>
        </div>

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
