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
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WORK_MODULES } from '../lib/modules';
import { cn } from '../lib/utils';

export const Home = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedWarnModule, setSelectedWarnModule] = useState<{ id: string; title: string; route: string } | null>(null);

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
    <div className="p-3 sm:p-4 py-3 space-y-3">
      
      {/* Welcome & Wallet Header - Executive Slate Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-4 sm:p-4.5 text-white shadow-md relative overflow-hidden border border-slate-800">
        
        {/* Top Info Row */}
        <div className="flex justify-between items-center gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Student Account
              </span>
            </div>
            
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight truncate">
              Welcome, {profile?.fullName?.split(' ')[0] || 'Member'}
            </h1>
            
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              Student ID: <span className="font-mono text-slate-200 font-bold">{profile?.studentIdCode || 'N/A'}</span>
            </p>
          </div>

          {/* Balance Display */}
          <div className="text-right bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700/80 shrink-0 shadow-2xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-end gap-1">
              <Wallet size={12} className="text-emerald-400" /> Wallet Balance
            </div>
            <div className="text-base sm:text-lg font-mono font-black text-emerald-400 tabular-nums leading-tight mt-0.5">
              ৳{(profile?.balance || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Assigned Task Highlight */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] text-slate-400 font-medium shrink-0">
              Active Module:
            </span>
            <div className="truncate">
              {isPending ? (
                <span className="text-amber-400 text-[10.5px] font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                  Pending Admin Assignment
                </span>
              ) : authorizedModules.length > 0 ? (
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="truncate">{authorizedModules[0].title}</span>
                </span>
              ) : (
                <span className="text-slate-400 text-[11px]">Pending Assignment</span>
              )}
            </div>
          </div>

          {!isPending && authorizedModules.length > 0 && (
            <button
              onClick={() => setSelectedWarnModule({ 
                id: authorizedModules[0].id, 
                title: authorizedModules[0].title, 
                route: authorizedModules[0].route 
              })}
              className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition border border-slate-700 flex items-center gap-1 cursor-pointer shrink-0"
            >
              Start Task <ArrowRight size={12} />
            </button>
          )}
        </div>

      </div>

      {/* Account Pending Notice Banner (if pending) */}
      {isPending && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-amber-950 shadow-2xs flex items-start gap-3">
          <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-amber-950 text-sm">Application Under Review</h4>
            <p className="text-amber-800/90 leading-relaxed font-medium">
              Your account has been created. System task permissions will be unlocked upon final administrator verification.
            </p>
          </div>
        </div>
      )}

      {/* Special 20% Boost Promotional Card */}
      <div 
        onClick={() => setShowOfferModal(true)}
        className="cursor-pointer bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden border border-slate-800 active:scale-[0.99] transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-400" />
              <span>Special Offer • 4 Days Left</span>
            </div>
            <h3 className="text-base font-extrabold tracking-tight leading-snug">
              20% Extra Commission Boost
            </h3>
            <p className="text-[11.5px] text-slate-300 leading-normal">
              Earn +20% bonus rewards on Data Entry, Typing Work, and Lead Generation tasks.
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700 ml-3">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => navigate('/live-payments')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 flex items-center gap-3 text-left transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Receipt size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Live Payouts</div>
            <div className="text-[10.5px] text-slate-500 font-medium">130+ Transfers Today</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 flex items-center gap-3 text-left transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <ArrowRightLeft size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Transfer Balance</div>
            <div className="text-[10.5px] text-slate-500 font-medium">Instant to 7-Digit ID</div>
          </div>
        </button>
      </div>

      {/* Work Modules Catalog */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900">Available Work Tasks</h2>
            <p className="text-xs text-slate-500">Select your authorized module to proceed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {WORK_MODULES.map((mod) => {
            const isAssigned = !isPending && authorizedModuleIds.includes(mod.id);
            const visuals = getModuleVisuals(mod.id);

            return (
              <button
                key={mod.id}
                onClick={() => isAssigned ? setSelectedWarnModule({ id: mod.id, title: mod.title, route: mod.route }) : null}
                className={cn(
                  "flex items-center gap-3.5 p-4 rounded-2xl transition-all text-left relative group",
                  "bg-white border border-slate-200/80 shadow-2xs",
                  isAssigned 
                    ? "cursor-pointer hover:border-slate-400 hover:shadow-sm active:scale-[0.99] border-slate-300" 
                    : "cursor-not-allowed opacity-65 bg-slate-50/50"
                )}
              >
                {/* Emblem */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform",
                  isAssigned && "group-hover:scale-105",
                  `bg-gradient-to-br ${visuals.gradient}`,
                  "shadow-xs"
                )}>
                  {visuals.icon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug break-words">
                      {mod.title} {!isAssigned && '(Locked)'}
                    </h3>
                    
                    {isAssigned && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>অনুমোদিত</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {mod.shortDesc}
                  </p>
                </div>

                {/* Right Action */}
                <div className="shrink-0 pl-1">
                  {isAssigned ? (
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-2xs group-hover:bg-slate-800 transition">
                      <ArrowRight size={15} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                      <Lock size={14} className="text-slate-400" />
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

      {/* Dynamic Task Click Warning Modal */}
      {selectedWarnModule && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative animate-in zoom-in-95 duration-150 text-center">
            
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle size={36} className="animate-bounce" />
            </div>

            {/* Modal Heading & Custom Message */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                জরুরী সতর্কতা ও নির্দেশিকা
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {selectedWarnModule.title} সংক্রান্ত সতর্কীকরণ নোটিশ!
              </h3>
              
              <div className="text-xs text-slate-700 leading-relaxed text-left bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <p className="font-semibold text-slate-800">
                  এই কাজটি শুধুমাত্র যারা কোর্স সম্পন্ন করেছে বা যাদের কাজ সম্পর্কে খুব ভালো দক্ষতা ও ধারণা রয়েছে শুধু তাদের জন্য।
                </p>
                <p className="text-rose-600 font-bold">
                  আপনার যদি {selectedWarnModule.title} সম্পর্কে কোনো পূর্ব অভিজ্ঞতা বা ধারণা না থাকে অথবা কাজ যদি আপনি না পেরে থাকেন, তবে এই কাজ আপনার জন্য নয়।
                </p>
                <p className="text-slate-650 font-medium border-t border-dashed border-slate-200 pt-2 text-[11px]">
                  ⚠️ ভুল উপাত্ত বা ভুল কাজ সাবমিট করলে আপনার সম্পূর্ণ প্রজেক্ট ব্যাচটি সিস্টেম অডিটে স্বয়ংক্রিয়ভাবে রিজেক্টেড (Rejected) হয়ে যাবে এবং কোনো পারিশ্রমিক যোগ হবে না।
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setSelectedWarnModule(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                বন্ধ করুন (Close)
              </button>
              
              <button
                onClick={() => {
                  const targetRoute = selectedWarnModule.route;
                  setSelectedWarnModule(null);
                  navigate(targetRoute);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-orange-500/10 cursor-pointer"
              >
                আমি রাজি ও দক্ষ (Proceed)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
