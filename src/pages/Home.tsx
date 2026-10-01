import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenTool, 
  FileText, 
  Database, 
  ShoppingBag, 
  Zap, 
  ArrowRight, 
  Video, 
  Eye, 
  CheckSquare, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Wallet,
  Share2,
  Edit3,
  Package,
  Gamepad2,
  Globe,
  Receipt,
  ArrowRightLeft,
  Clock,
  Palette,
  X,
  Target,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WORK_MODULES } from '../lib/modules';
import { cn } from '../lib/utils';

export const Home = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showOfferModal, setShowOfferModal] = useState(false);

  const isPending = profile?.status === 'pending';
  const authorizedModuleIds: string[] = (profile?.assignedJobs && profile.assignedJobs.length > 0)
    ? profile.assignedJobs
    : (profile?.assignedJob ? [profile.assignedJob] : []);

  const authorizedModules = WORK_MODULES.filter(m => authorizedModuleIds.includes(m.id));

  const getModuleVisuals = (id: string) => {
    switch (id) {
      case 'typing':
        return {
          icon: <PenTool size={24} className="text-white" />,
          gradient: 'from-blue-600 via-indigo-600 to-sky-600',
          shadow: 'shadow-blue-500/20',
          ring: 'border-blue-400/30'
        };
      case 'form':
        return {
          icon: <FileText size={24} className="text-white" />,
          gradient: 'from-emerald-600 via-teal-600 to-green-600',
          shadow: 'shadow-emerald-500/20',
          ring: 'border-emerald-400/30'
        };
      case 'data':
        return {
          icon: <Database size={24} className="text-white" />,
          gradient: 'from-indigo-600 via-purple-600 to-blue-700',
          shadow: 'shadow-indigo-500/20',
          ring: 'border-indigo-400/30'
        };
      case 'video':
        return {
          icon: <Video size={24} className="text-white" />,
          gradient: 'from-purple-600 via-violet-600 to-fuchsia-600',
          shadow: 'shadow-purple-500/20',
          ring: 'border-purple-400/30'
        };
      case 'photo':
        return {
          icon: <Palette size={24} className="text-white" />,
          gradient: 'from-rose-600 via-pink-600 to-red-600',
          shadow: 'shadow-rose-500/20',
          ring: 'border-rose-400/30'
        };
      case 'shop':
        return {
          icon: <ShoppingBag size={24} className="text-white" />,
          gradient: 'from-rose-600 via-pink-600 to-amber-600',
          shadow: 'shadow-rose-500/20',
          ring: 'border-rose-400/30'
        };
      case 'micro':
        return {
          icon: <Zap size={24} className="text-white" />,
          gradient: 'from-amber-500 via-orange-500 to-yellow-500',
          shadow: 'shadow-amber-500/20',
          ring: 'border-amber-400/30'
        };
      case 'ad_viewing':
        return {
          icon: <Eye size={24} className="text-white" />,
          gradient: 'from-teal-600 via-cyan-600 to-emerald-600',
          shadow: 'shadow-teal-500/20',
          ring: 'border-teal-400/30'
        };
      case 'moderation':
        return {
          icon: <CheckSquare size={24} className="text-white" />,
          gradient: 'from-cyan-600 via-sky-600 to-blue-600',
          shadow: 'shadow-cyan-500/20',
          ring: 'border-cyan-400/30'
        };
      case 'social_marketing':
        return {
          icon: <Share2 size={24} className="text-white" />,
          gradient: 'from-pink-600 via-rose-600 to-purple-600',
          shadow: 'shadow-pink-500/20',
          ring: 'border-pink-400/30'
        };
      case 'content_writing':
        return {
          icon: <Edit3 size={24} className="text-white" />,
          gradient: 'from-violet-600 via-indigo-600 to-purple-700',
          shadow: 'shadow-violet-500/20',
          ring: 'border-violet-400/30'
        };
      case 'dropshipping':
        return {
          icon: <Package size={24} className="text-white" />,
          gradient: 'from-lime-600 via-emerald-600 to-teal-700',
          shadow: 'shadow-lime-500/20',
          ring: 'border-lime-400/30'
        };
      case 'gaming':
        return {
          icon: <Gamepad2 size={24} className="text-white" />,
          gradient: 'from-fuchsia-600 via-purple-600 to-indigo-600',
          shadow: 'shadow-fuchsia-500/20',
          ring: 'border-fuchsia-400/30'
        };
      case 'website_visit':
        return {
          icon: <Globe size={24} className="text-white" />,
          gradient: 'from-sky-600 via-blue-600 to-indigo-600',
          shadow: 'shadow-sky-500/20',
          ring: 'border-sky-400/30'
        };
      default:
        return {
          icon: <Sparkles size={24} className="text-white" />,
          gradient: 'from-slate-700 via-slate-800 to-slate-900',
          shadow: 'shadow-slate-500/20',
          ring: 'border-slate-500/30'
        };
    }
  };

  return (
    <div className="p-4 py-5 space-y-4">
      
      {/* Welcome & Wallet Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full inline-block mb-1.5">
              Verified Student Account
            </span>
            <h1 className="text-xl font-extrabold tracking-tight">
              Welcome, {profile?.fullName?.split(' ')[0] || 'Member'}!
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Student ID: <span className="font-mono text-slate-300 font-semibold">{profile?.studentIdCode || 'N/A'}</span>
            </p>
          </div>

          <div className="text-right bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-end gap-1">
              <Wallet size={12} className="text-emerald-400" /> Balance
            </div>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              BDT {(profile?.balance || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Assigned Task Highlight Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              Authorized Task Assignment:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {isPending ? (
                <span className="text-amber-400 text-xs font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                  Account Pending Admin Approval & Task Assignment
                </span>
              ) : authorizedModules.length > 0 ? (
                authorizedModules.map(m => (
                  <span key={m.id} className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>{m.title}</span>
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs font-normal">Pending Administrator Assignment</span>
              )}
            </div>
          </div>

          {!isPending && authorizedModules.length > 0 && (
            <button
              onClick={() => navigate(authorizedModules[0].route)}
              className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm flex items-center justify-center gap-1 cursor-pointer shrink-0"
            >
              Start Work <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Account Pending Notice Banner (if pending) */}
      {isPending && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-amber-900 shadow-xs flex items-start gap-3">
          <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-amber-900">Application Under Review</h4>
            <p className="text-amber-700 leading-relaxed">
              Your account has been created and you can explore the portal. Task submission will be unlocked as soon as the administrator reviews your application and assigns your chosen work categories.
            </p>
          </div>
        </div>
      )}

      {/* Special 20% Boost Promotional Card */}
      <div 
        onClick={() => setShowOfferModal(true)}
        className="cursor-pointer bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-3xl p-4 text-white shadow-md relative overflow-hidden border border-orange-400/30 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-yellow-200">
              <Sparkles size={12} />
              <span>Special Offer • 4 Days Left</span>
            </div>
            <h3 className="text-base font-black tracking-tight leading-snug">
              20% Extra Commission Boost!
            </h3>
            <p className="text-[11px] text-white/90 leading-tight">
              Earn +20% bonus rewards on Data Entry, Typing Work, and Digital Marketing (Lead Generation).
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 border border-white/30 ml-2">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => navigate('/live-payments')}
          className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 flex items-center gap-2.5 text-left transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Receipt size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Live Payouts</div>
            <div className="text-[10px] text-slate-400">130+ Transfers Today</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 flex items-center gap-2.5 text-left transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ArrowRightLeft size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Transfer Balance</div>
            <div className="text-[10px] text-slate-400">Instant to 7-Digit ID</div>
          </div>
        </button>
      </div>

      {/* Work Modules Catalog */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-base font-bold text-slate-800">Available Work Tasks</h2>
            <p className="text-xs text-slate-400">Select your authorized module to proceed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {WORK_MODULES.map((mod) => {
            const isAssigned = !isPending && authorizedModuleIds.includes(mod.id);
            const visuals = getModuleVisuals(mod.id);

            return (
              <button
                key={mod.id}
                onClick={() => navigate(mod.route)}
                className={cn(
                  "flex items-center gap-3.5 p-4 rounded-2xl transition-all text-left relative cursor-pointer group",
                  "bg-gradient-to-br from-white via-slate-50/60 to-slate-100/70 border border-slate-200/70",
                  "shadow-[4px_4px_10px_rgba(203,213,225,0.45),-4px_-4px_10px_rgba(255,255,255,0.9)]",
                  "hover:shadow-[6px_6px_14px_rgba(203,213,225,0.55),-5px_-5px_12px_rgba(255,255,255,1)] active:scale-[0.99]",
                  isAssigned && "border-orange-400/60 ring-1 ring-orange-500/20"
                )}
              >
                {/* Neumorphic Left Logo / Emblem */}
                <div className={cn(
                  "w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105",
                  `bg-gradient-to-br ${visuals.gradient} ${visuals.ring}`,
                  "shadow-[inset_1px_1px_3px_rgba(255,255,255,0.4),3px_3px_8px_rgba(15,23,42,0.15)]"
                )}>
                  {visuals.icon}
                </div>

                {/* Task Details - Full Title & Description */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug break-words">
                      {mod.title}
                    </h3>
                    
                    {isAssigned && (
                      <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>অনুমোদিত</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {mod.shortDesc}
                  </p>
                </div>

                {/* Right Action / Lock Icon (Single Clean Neumorphic Lock/Arrow) */}
                <div className="shrink-0 pl-1">
                  {isAssigned ? (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-[2px_2px_6px_rgba(249,115,22,0.35),-1px_-1px_3px_rgba(255,255,255,0.6)] group-hover:from-orange-600 group-hover:to-amber-600 transition">
                      <ArrowRight size={16} />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200/90 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_2px_5px_rgba(203,213,225,0.5)]">
                      <Lock size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 20% Special Commission Boost Offer Details Modal (All in English) */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setShowOfferModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 pr-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase tracking-wider border border-orange-200">
                <Flame size={12} className="text-orange-600 animate-pulse" />
                <span>Special Promotion • 4 Days Remaining</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                20% Extra Commission Boost Offer
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Maximize your student earnings during this 4-day active campaign window across our highest-paying enterprise categories.
              </p>
            </div>

            {/* Highlighted Boost Categories */}
            <div className="space-y-3">
              <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                Eligible Work Categories for +20% Boost:
              </div>

              {/* 1. Data Entry Work */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 p-3.5 rounded-2xl border border-indigo-100 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      <Database size={14} />
                    </div>
                    <span className="font-extrabold text-xs text-indigo-950">Data Entry Project System</span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-600 text-white shadow-2xs">
                    +20% Extra
                  </span>
                </div>
                <p className="text-[11px] text-indigo-900/90 leading-relaxed pl-9">
                  Earn an additional 20% bonus on all verified 5,000+ row spreadsheet entries, employee biometric rosters, and banking transaction ledger submissions.
                </p>
              </div>

              {/* 2. Typing Work */}
              <div className="bg-gradient-to-r from-blue-50/80 to-sky-50/80 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <PenTool size={14} />
                    </div>
                    <span className="font-extrabold text-xs text-blue-950">Typing Work (Transcription)</span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-2xs">
                    +20% Extra
                  </span>
                </div>
                <p className="text-[11px] text-blue-900/90 leading-relaxed pl-9">
                  Receive a +20% bonus reward on precision legal and medical transcriptions meeting the conditional word transformation rules and anti-AI verification standards.
                </p>
              </div>

              {/* 3. Digital Marketing & Lead Generation */}
              <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 p-3.5 rounded-2xl border border-teal-100 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      <Target size={14} />
                    </div>
                    <span className="font-extrabold text-xs text-teal-950">Social Media & Lead Generation</span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-600 text-white shadow-2xs">
                    +20% Extra
                  </span>
                </div>
                <p className="text-[11px] text-teal-900/90 leading-relaxed pl-9">
                  Earn +20% extra payout on verified corporate B2B executive prospects, direct phone contacts, and targeted decision-maker email databases.
                </p>
              </div>
            </div>

            {/* Campaign Rules & Terms in English */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Terms & Conditions:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                <li>Minimum required accuracy benchmark: <strong>85%+</strong>.</li>
                <li>Bonus is automatically calculated and deposited upon administrator verification.</li>
                <li>Valid for all active student accounts over the next <strong>4 Days</strong>.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  navigate('/module/data');
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Start Data Entry</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => {
                  setShowOfferModal(false);
                  navigate('/module/typing');
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Start Typing Work</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
