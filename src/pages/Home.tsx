import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Keyboard,
  ClipboardCheck,
  FileSpreadsheet,
  Store,
  Layers,
  Clapperboard,
  MonitorPlay,
  Lock,
  Megaphone,
  FilePenLine,
  Image,
  Truck,
  Trophy,
  Globe,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Headphones,
  Gift,
  Bell,
  BriefcaseBusiness,
  PlayCircle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WORK_MODULES } from '../lib/modules';
import { cn } from '../lib/utils';
import { db, doc, onSnapshot } from '../lib/firebase';

function getYouTubeEmbedUrl(rawUrl?: string): string | null {
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
      if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/embed/')[1]?.split('/')[0] || '';
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/shorts/')[1]?.split('/')[0] || '';
      } else if (url.pathname.startsWith('/live/')) {
        videoId = url.pathname.split('/live/')[1]?.split('/')[0] || '';
      } else {
        videoId = url.searchParams.get('v') || '';
      }

      const listId = url.searchParams.get('list');
      if (!videoId && listId) {
        return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(listId)}&autoplay=1&rel=0`;
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
    }
  } catch {
    return null;
  }

  return null;
}

export const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile } = useAuth();
  const [selectedWarnModule, setSelectedWarnModule] = useState<{ id: string; title: string; route: string } | null>(null);
  const [guideVideoUrl, setGuideVideoUrl] = useState<string>('https://youtube.com');
  const [isVideoGuideOpen, setIsVideoGuideOpen] = useState<boolean>(() => searchParams.get('guide') === '1');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'support'), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        setGuideVideoUrl(d?.videoUrl || d?.url || 'https://youtube.com');
      }
    });

    const handleOpenGuide = () => {
      setIsVideoGuideOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('open_home_video_guide', handleOpenGuide);
    return () => {
      unsub();
      window.removeEventListener('open_home_video_guide', handleOpenGuide);
    };
  }, []);

  useEffect(() => {
    if (searchParams.get('guide') === '1') {
      setIsVideoGuideOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams]);

  const embedGuideUrl = useMemo(() => getYouTubeEmbedUrl(guideVideoUrl), [guideVideoUrl]);

  // Live active workers counter state (all > 300)
  const [workerCounts, setWorkerCounts] = useState<Record<string, number>>({
    typing: 418,
    form: 365,
    data: 394,
    shop: 382,
    moderation: 356,
    video: 340,
    photo: 325,
    micro: 412,
    ad_viewing: 374,
    social_marketing: 345,
    content_writing: 330,
    dropshipping: 320,
    gaming: 315,
    website_visit: 360,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkerCounts((prev) => {
        const next = { ...prev };
        const deltas = [3, -2, 5, -4, 8, -10, 15, -15, 20, -12, 30, -5];
        const randomDelta = deltas[Math.floor(Math.random() * deltas.length)];
        let newTyping = (next.typing || 415) + randomDelta;
        if (newTyping < 320) newTyping = 340 + Math.floor(Math.random() * 20);
        if (newTyping > 450) newTyping = 425 - Math.floor(Math.random() * 15);
        next.typing = newTyping;

        Object.keys(next).forEach((key) => {
          if (key !== 'typing') {
            const shift = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
            let val = next[key] + shift;
            if (val < 310) val = 315 + Math.floor(Math.random() * 10);
            if (val > 440) val = 420 - Math.floor(Math.random() * 10);
            next[key] = val;
          }
        });
        return next;
      });
    }, 32000);
    return () => clearInterval(interval);
  }, []);

  const isPending = profile?.status === 'pending';
  const authorizedModuleIds: string[] = (profile?.assignedJobs && profile.assignedJobs.length > 0)
    ? profile.assignedJobs
    : (profile?.assignedJob ? [profile.assignedJob] : []);

  const authorizedModules = WORK_MODULES.filter(m => authorizedModuleIds.includes(m.id));
  const primaryModule = authorizedModules[0];

  const getModuleIcon = (id: string) => {
    const props = { size: 18, strokeWidth: 1.9 };
    switch (id) {
      case 'typing': return <Keyboard {...props} />;
      case 'form': return <ClipboardCheck {...props} />;
      case 'data': return <FileSpreadsheet {...props} />;
      case 'shop': return <Store {...props} />;
      case 'moderation': return <ShieldCheck {...props} />;
      case 'video': return <Clapperboard {...props} />;
      case 'photo': return <Image {...props} />;
      case 'micro': return <Layers {...props} />;
      case 'ad_viewing': return <MonitorPlay {...props} />;
      case 'social_marketing': return <Megaphone {...props} />;
      case 'content_writing': return <FilePenLine {...props} />;
      case 'dropshipping': return <Truck {...props} />;
      case 'gaming': return <Trophy {...props} />;
      case 'website_visit': return <Globe {...props} />;
      default: return <BriefcaseBusiness {...props} />;
    }
  };

  const getModuleTheme = (id: string): { iconBox: string; cardAccent: string } => {
    switch (id) {
      case 'typing':
        return {
          iconBox: 'bg-[#0A4D8C] text-white border-[#073B6D]',
          cardAccent: 'border-l-[#0A4D8C]'
        };
      case 'form':
        return {
          iconBox: 'bg-[#065F46] text-white border-[#044B37]',
          cardAccent: 'border-l-[#065F46]'
        };
      case 'data':
        return {
          iconBox: 'bg-[#312E81] text-white border-[#242163]',
          cardAccent: 'border-l-[#312E81]'
        };
      case 'shop':
        return {
          iconBox: 'bg-[#881337] text-white border-[#6B0F2B]',
          cardAccent: 'border-l-[#881337]'
        };
      case 'moderation':
        return {
          iconBox: 'bg-[#155E75] text-white border-[#104A5D]',
          cardAccent: 'border-l-[#155E75]'
        };
      case 'video':
        return {
          iconBox: 'bg-[#5B21B6] text-white border-[#46188E]',
          cardAccent: 'border-l-[#5B21B6]'
        };
      case 'photo':
        return {
          iconBox: 'bg-[#9A3412] text-white border-[#78280E]',
          cardAccent: 'border-l-[#9A3412]'
        };
      case 'micro':
        return {
          iconBox: 'bg-[#92400E] text-white border-[#74320B]',
          cardAccent: 'border-l-[#92400E]'
        };
      case 'ad_viewing':
        return {
          iconBox: 'bg-[#115E59] text-white border-[#0D4A46]',
          cardAccent: 'border-l-[#115E59]'
        };
      case 'social_marketing':
        return {
          iconBox: 'bg-[#1E40AF] text-white border-[#17328A]',
          cardAccent: 'border-l-[#1E40AF]'
        };
      case 'content_writing':
        return {
          iconBox: 'bg-[#1E293B] text-white border-[#0F172A]',
          cardAccent: 'border-l-[#1E293B]'
        };
      case 'dropshipping':
        return {
          iconBox: 'bg-[#3F6212] text-white border-[#314C0E]',
          cardAccent: 'border-l-[#3F6212]'
        };
      case 'gaming':
        return {
          iconBox: 'bg-[#701A75] text-white border-[#58145C]',
          cardAccent: 'border-l-[#701A75]'
        };
      case 'website_visit':
        return {
          iconBox: 'bg-[#075985] text-white border-[#054568]',
          cardAccent: 'border-l-[#075985]'
        };
      default:
        return {
          iconBox: 'bg-[#0A4D8C] text-white border-[#073B6D]',
          cardAccent: 'border-l-[#0A4D8C]'
        };
    }
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-3.5">

      {/* EMBEDDED HOME YOUTUBE VIDEO GUIDE PLAYER */}
      {isVideoGuideOpen && (
        <div className="bg-white rounded-xl border border-[#D4E4F7] shadow-sm overflow-hidden">
          <div className="bg-[#0A4D8C] text-white px-4 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <PlayCircle size={17} className="text-sky-200 shrink-0" />
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-semibold truncate">
                  Official Portal Video Guide
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsVideoGuideOpen(false);
                if (searchParams.get('guide')) {
                  searchParams.delete('guide');
                  setSearchParams(searchParams, { replace: true });
                }
              }}
              className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer shrink-0"
              aria-label="Close Video Guide"
            >
              <X size={15} />
            </button>
          </div>

          <div className="p-3 bg-[#F8FAFC]">
            {embedGuideUrl ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-200">
                <iframe
                  src={embedGuideUrl}
                  title="Unity Earning Video Guide"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-5 text-center space-y-2.5">
                <div className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <PlayCircle size={24} />
                </div>
                <div className="space-y-1 max-w-sm">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    YouTube Tutorial Video Ready
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Configure a specific YouTube video link (youtube.com/watch?v=...) in Admin Support Settings to stream directly inside this player.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. TOP 2-COLUMN SUMMARY CARDS (Corporate Blue & Charcoal — matches reference screenshot top cards) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0A4D8C] text-white rounded-xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.08)] flex flex-col justify-between min-h-[108px]">
          <div>
            <span className="text-[11px] font-medium text-sky-100/90 block">
              Member Account
            </span>
            <h1 className="text-[15px] sm:text-base font-semibold tracking-tight text-white truncate mt-0.5">
              {profile?.fullName?.split(' ')[0] || 'Member'}
            </h1>
          </div>

          <div className="pt-3 flex items-center justify-between gap-2 text-[11px]">
            <span className="font-mono text-sky-100/90 tabular-nums">
              ID: {profile?.studentIdCode || 'N/A'}
            </span>
            <span className="bg-white/15 text-white px-2 py-0.5 rounded text-[10px] font-medium">
              {isPending ? 'Pending' : 'Active'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isPending && primaryModule) {
              setSelectedWarnModule({
                id: primaryModule.id,
                title: primaryModule.title,
                route: primaryModule.route
              });
            }
          }}
          className="bg-[#22262C] hover:bg-[#2B3038] text-white rounded-xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.08)] flex flex-col justify-between min-h-[108px] text-left transition-colors cursor-pointer"
        >
          <div>
            <span className="text-[11px] font-medium text-slate-300 block">
              Assigned Work
            </span>
            <div className="text-sm sm:text-[15px] font-semibold text-white leading-snug line-clamp-2 mt-0.5">
              {isPending ? 'Under Review' : primaryModule ? primaryModule.title : 'Not Assigned'}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span>{isPending ? 'Awaiting approval' : 'Open workspace'}</span>
            <ChevronRight size={15} className="text-slate-300 shrink-0" />
          </div>
        </button>
      </div>

      {/* 2. TWO-COLUMN COMPACT ACTION CARDS (Exact match to Investimentos / Empréstimos cards) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate('/live-payments')}
          className="bg-white hover:bg-slate-50/70 rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
        >
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#1E2329] truncate">Live Payouts</div>
            <div className="text-[11.5px] font-medium text-[#0D7A5F] mt-0.5 truncate">130+ transfers today</div>
          </div>
          <ChevronRight size={17} className="text-slate-400 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('open_balance_transfer'))}
          className="bg-white hover:bg-slate-50/70 rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
        >
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#1E2329] truncate">Balance Transfer</div>
            <div className="text-[11.5px] font-medium text-[#0D7A5F] mt-0.5 truncate">Instant · Zero fee</div>
          </div>
          <ChevronRight size={17} className="text-slate-400 shrink-0" />
        </button>
      </div>

      {/* 3. FULL-WIDTH ICE-BLUE STATUS ROW (Exact match to "Pix em processamento. >") */}
      <button
        type="button"
        onClick={() => {
          if (!isPending && primaryModule) {
            setSelectedWarnModule({
              id: primaryModule.id,
              title: primaryModule.title,
              route: primaryModule.route
            });
          } else {
            navigate('/profile');
          }
        }}
        className="w-full bg-[#EEF5FC] hover:bg-[#E4EFFA] border border-[#D4E4F7] rounded-xl px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <ShieldCheck size={20} strokeWidth={1.75} className="text-[#0A4D8C] shrink-0" />
          <span className="text-xs sm:text-[13px] font-medium text-[#1E2329] truncate">
            {isPending
              ? 'Account verification in progress. Work access will unlock after approval.'
              : primaryModule
              ? `${primaryModule.title} is active on your account.`
              : 'Account verified. Contact support for module assignment.'}
          </span>
        </div>
        <ChevronRight size={17} className="text-slate-500 shrink-0" />
      </button>

      {/* 4. FORMAL WARM-AMBER ADVISORY CARD (Exact match to warning box in screenshot) */}
      <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={20} strokeWidth={1.75} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h2 className="font-semibold text-[#1E2329] text-[13px]">
            কাজের মান ও অডিট নির্দেশিকা
          </h2>
          <p className="text-slate-700 leading-relaxed font-normal">
            প্রতিটি টাস্ক সাবমিট করার আগে নির্দেশনা ভালোভাবে পড়ে নিন। ভুল তথ্য বা অসম্পূর্ণ ডকুমেন্ট দিলে সংশ্লিষ্ট প্রজেক্ট রিভিউতে বাতিল হতে পারে।
          </p>
        </div>
      </div>

      {/* 5. QUICK SERVICES SECTION (Exact match to "Área Pix" + "Ver mais" + 3-tile grid) */}
      <section className="pt-1 space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={17} strokeWidth={1.75} className="text-slate-700" />
            <h2 className="text-[15px] font-semibold text-[#1E2329]">Portal Services</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/mentors')}
            className="text-xs font-medium text-[#0A4D8C] hover:underline cursor-pointer"
          >
            View mentors
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open_help_support'))}
            className="bg-white hover:bg-slate-50/70 rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-3.5 text-left flex flex-col justify-between min-h-[104px] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-1">
              <Headphones size={20} strokeWidth={1.65} className="text-slate-700" />
              <span className="bg-[#E6F2FC] text-[#0A4D8C] text-[10px] font-medium px-1.5 py-0.5 rounded">
                24/7
              </span>
            </div>
            <div className="pt-3">
              <div className="text-xs sm:text-[13px] font-semibold text-[#1E2329] leading-tight">Live Support</div>
              <div className="text-[11px] text-amber-700 font-medium mt-0.5 truncate">Helpdesk</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open_gift_campaign'))}
            className="bg-white hover:bg-slate-50/70 rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-3.5 text-left flex flex-col justify-between min-h-[104px] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-1">
              <Gift size={20} strokeWidth={1.65} className="text-slate-700" />
              <span className="bg-[#E6F2FC] text-[#0A4D8C] text-[10px] font-medium px-1.5 py-0.5 rounded font-mono">
                ৳2,200
              </span>
            </div>
            <div className="pt-3">
              <div className="text-xs sm:text-[13px] font-semibold text-[#1E2329] leading-tight">Weekly Bonus</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">Top 3 pool</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open_notifications'))}
            className="bg-white hover:bg-slate-50/70 rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-3.5 text-left flex flex-col justify-between min-h-[104px] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-1">
              <Bell size={20} strokeWidth={1.65} className="text-slate-700" />
            </div>
            <div className="pt-3">
              <div className="text-xs sm:text-[13px] font-semibold text-[#1E2329] leading-tight">Notices</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">Daily updates</div>
            </div>
          </button>
        </div>
      </section>

      {/* 6. WORK MODULES LIST (Distinct separated cards, deep formal module logos) */}
      <section className="pt-2 space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-[15px] font-semibold text-[#1E2329]">Work Modules</h2>
            <p className="text-xs text-slate-500">Select an authorized module to begin work</p>
          </div>
          <span className="text-xs font-medium text-slate-500 font-mono tabular-nums">
            {authorizedModules.length} assigned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {WORK_MODULES.map((mod) => {
            const isAssigned = !isPending && (
              authorizedModuleIds.includes(mod.id) || mod.id === 'shop' || mod.id === 'moderation'
            );
            const activeWorkers = workerCounts[mod.id] || 365;
            const theme = getModuleTheme(mod.id);

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  if (mod.id === 'shop') {
                    navigate('/shop');
                  } else if (mod.id === 'moderation') {
                    navigate('/module/moderation');
                  } else if (isAssigned) {
                    setSelectedWarnModule({ id: mod.id, title: mod.title, route: mod.route });
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-left border border-l-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
                  theme.cardAccent,
                  isAssigned
                    ? "bg-white border-slate-200 hover:border-slate-300 hover:bg-[#F8FAFC] cursor-pointer"
                    : "bg-[#F9FAFB] border-slate-200/90 cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs",
                  theme.iconBox
                )}>
                  {getModuleIcon(mod.id)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn(
                      "font-semibold text-[13px] leading-tight truncate",
                      isAssigned ? "text-[#1E2329]" : "text-slate-700"
                    )}>
                      {mod.title}
                    </h3>
                    <span className={cn(
                      "text-[10.5px] font-semibold whitespace-nowrap shrink-0",
                      isAssigned ? "text-[#0D7A5F]" : "text-slate-400"
                    )}>
                      {isAssigned ? 'Authorized' : 'Locked'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-tight line-clamp-1 mt-0.5">
                    {mod.shortDesc}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1 text-[10.5px] text-slate-500 font-medium tabular-nums leading-tight">
                    <span className="whitespace-nowrap shrink-0 text-slate-700 font-semibold">{activeWorkers} active</span>
                    <span aria-hidden="true" className="shrink-0">·</span>
                    <span className="truncate">{mod.rateInfo}</span>
                  </div>
                </div>

                <div className="shrink-0 pl-0.5">
                  {isAssigned ? (
                    <ChevronRight size={16} className="text-slate-500" />
                  ) : (
                    <Lock size={14} className="text-slate-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Task Confirmation Modal */}
      {selectedWarnModule && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-lg border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF7E0] border border-[#F3DFA2] text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1E2329] leading-snug">
                  {selectedWarnModule.title} সংক্রান্ত নির্দেশিকা
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Work Competency Confirmation</p>
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-[#FEF7E0] border border-[#F3DFA2] p-4 rounded-lg space-y-2">
              <p className="font-medium text-[#1E2329]">
                এই কাজটি শুধুমাত্র যারা কোর্স সম্পন্ন করেছে বা যাদের কাজ সম্পর্কে সঠিক দক্ষতা ও ধারণা রয়েছে তাদের জন্য।
              </p>
              <p>
                আপনার যদি {selectedWarnModule.title} সম্পর্কে পূর্ব অভিজ্ঞতা না থাকে, তবে কাজ শুরু করার আগে মেন্টরের সহায়তা নিন। ভুল তথ্য সাবমিট করলে সম্পূর্ণ ব্যাচ রিভিউতে বাতিল হবে।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSelectedWarnModule(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-[#1E2329] font-medium py-2.5 rounded-lg text-xs transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetRoute = selectedWarnModule.route;
                  setSelectedWarnModule(null);
                  navigate(targetRoute);
                }}
                className="w-full bg-[#0A4D8C] hover:bg-[#083E72] text-white font-medium py-2.5 rounded-lg text-xs transition cursor-pointer"
              >
                কাজ শুরু করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
