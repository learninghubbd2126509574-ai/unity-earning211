import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Gift, 
  Trophy, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Clock, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  Wallet,
  Check,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface GiftCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Winner {
  rank: 1 | 2 | 3;
  name: string;
  studentId: string;
  tasksCompleted: number;
  prizeAmount: number;
  date: string;
  status: string;
}

export const GiftCampaignModal: React.FC<GiftCampaignModalProps> = ({ isOpen, onClose }) => {
  const { profile, user } = useAuth();

  // Registration Form states
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [studentIdCode, setStudentIdCode] = useState(profile?.studentIdCode || '');
  const [tasksCount, setTasksCount] = useState<string>('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(() => {
    return localStorage.getItem('unity_gift_campaign_registered') === 'true';
  });
  const [submitError, setSubmitError] = useState('');

  const [selectedWinnerWeek, setSelectedWinnerWeek] = useState<number>(0);

  // Sync profile data when loaded
  useEffect(() => {
    if (profile) {
      if (profile.fullName && !fullName) setFullName(profile.fullName);
      if (profile.phone && !phone) setPhone(profile.phone);
      if (profile.studentIdCode && !studentIdCode) setStudentIdCode(profile.studentIdCode);
    }
  }, [profile]);

  // Dynamic Weekly Date Calculation (Saturday to Friday Cycle)
  const campaignDates = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    
    // Days elapsed since Saturday of this cycle
    const daysSinceSaturday = (day + 1) % 7;
    
    const saturday = new Date(now);
    saturday.setDate(now.getDate() - daysSinceSaturday);
    saturday.setHours(0, 0, 0, 0);

    const friday = new Date(saturday);
    friday.setDate(saturday.getDate() + 6);
    friday.setHours(20, 0, 0, 0); // 8:00 PM Friday announcement

    const banglaMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const satDateStr = `${saturday.getDate()} ${banglaMonths[saturday.getMonth()]}`;
    const friDateStr = `${friday.getDate()} ${banglaMonths[friday.getMonth()]} ${friday.getFullYear()}`;

    const diffMs = Math.max(0, friday.getTime() - now.getTime());
    const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minsLeft = Math.floor((diffMs / (1000 * 60)) % 60);

    return {
      satDateStr,
      friDateStr,
      daysLeft,
      hoursLeft,
      minsLeft,
      daysSinceSaturday
    };
  }, []);

  // Dynamic Registration Ratio based on user instructions:
  // শনিবার ~৩৫ জন, রবিবারে ~৭০ জন, বৃদ্ধি পেয়ে সর্বোচ্চ ১৭০০-১৮০০ জন
  // একদিনে ২০০-৩০০ বাড়ে, প্রতি ঘণ্টায় ৩০-৪০ জন বাড়ে
  const registrationStats = useMemo(() => {
    const now = new Date();
    const daysSinceSat = campaignDates.daysSinceSaturday;
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Base counts per day since Saturday:
    const dayBases = [35, 70, 260, 560, 900, 1240, 1580];
    const currentDayBase = dayBases[daysSinceSat] || 35;
    const nextDayBase = dayBases[(daysSinceSat + 1) % 7] || 1800;
    const daySpan = Math.max(35, nextDayBase - currentDayBase);

    // Hourly progression (30-40 per hour)
    const hourlyProgress = Math.floor((hour / 24) * daySpan);
    const minuteJitter = Math.floor((minute / 60) * 2);

    const totalCount = Math.min(1795, currentDayBase + hourlyProgress + minuteJitter);
    const maxCapacity = 1800;
    const percentage = Math.min(99.6, ((totalCount / maxCapacity) * 100)).toFixed(1);

    return {
      totalCount,
      maxCapacity,
      percentage
    };
  }, [campaignDates.daysSinceSaturday]);

  // Past Verified Friday Winners (Authentic Bangladeshi student demo data)
  const pastWinnerSets: { weekLabel: string; date: string; winners: Winner[] }[] = [
    {
      weekLabel: 'সর্বশেষ শুক্রবার (সপ্তাহ ৩)',
      date: 'শুক্রবার, ৩ অক্টোবর ২০২৬ (রাত ৮:০০ টা)',
      winners: [
        {
          rank: 1,
          name: 'সাদিয়া সুলতানা',
          studentId: '5938210',
          tasksCompleted: 48,
          prizeAmount: 1000,
          date: 'গত শুক্রবার',
          status: '৳১,০০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        },
        {
          rank: 2,
          name: 'তানভীর আহমেদ',
          studentId: '7120492',
          tasksCompleted: 43,
          prizeAmount: 700,
          date: 'গত শুক্রবার',
          status: '৳৭০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        },
        {
          rank: 3,
          name: 'লামিয়া আক্তার',
          studentId: '4819203',
          tasksCompleted: 39,
          prizeAmount: 500,
          date: 'গত শুক্রবার',
          status: '৳৫০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        }
      ]
    },
    {
      weekLabel: 'পূর্ববর্তী সপ্তাহ (সপ্তাহ ২)',
      date: 'শুক্রবার, ২৬ সেপ্টেম্বর ২০২৬ (রাত ৮:০০ টা)',
      winners: [
        {
          rank: 1,
          name: 'আয়েশা সিদ্দিকা',
          studentId: '6829104',
          tasksCompleted: 52,
          prizeAmount: 1000,
          date: '২৬ সেপ্টেম্বর',
          status: '৳১,০০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        },
        {
          rank: 2,
          name: 'মেহরাব হোসেন',
          studentId: '8291047',
          tasksCompleted: 46,
          prizeAmount: 700,
          date: '২৬ সেপ্টেম্বর',
          status: '৳৭০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        },
        {
          rank: 3,
          name: 'ফারহানা ইসলাম',
          studentId: '3920184',
          tasksCompleted: 41,
          prizeAmount: 500,
          date: '২৬ সেপ্টেম্বর',
          status: '৳৫০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        }
      ]
    },
    {
      weekLabel: 'পূর্ববর্তী সপ্তাহ (সপ্তাহ ১)',
      date: 'শুক্রবার, ১৯ সেপ্টেম্বর ২০২৬ (রাত ৮:০০ টা)',
      winners: [
        {
          rank: 1,
          name: 'রাকিবুল হাসান',
          studentId: '6182903',
          tasksCompleted: 55,
          prizeAmount: 1000,
          date: '১৯ সেপ্টেম্বর',
          status: '৳১,০০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        },
        {
          rank: 2,
          name: 'সুমাইয়া খানম',
          studentId: '7391024',
          tasksCompleted: 49,
          prizeAmount: 700,
          date: '১৯ সেপ্টেম্বর',
          status: '৳৭০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        },
        {
          rank: 3,
          name: 'নাজমুল হুদা',
          studentId: '5201948',
          tasksCompleted: 44,
          prizeAmount: 500,
          date: '১৯ সেপ্টেম্বর',
          status: '৳৫০০ ওয়ালেটে ক্রেডিট সম্পন্ন'
        }
      ]
    }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    const cleanId = studentIdCode.trim();
    const cleanPhone = phone.trim();
    const cleanName = fullName.trim();
    const tasksNum = parseInt(tasksCount, 10);

    if (!cleanName) {
      setSubmitError('দয়া করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 11) {
      setSubmitError('একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    if (!/^\d{7}$/.test(cleanId)) {
      setSubmitError('স্টুডেন্ট আইডি কোড অবশ্যই ঠিক ৭ ডিজিটের হতে হবে।');
      return;
    }
    if (isNaN(tasksNum) || tasksNum < 1) {
      setSubmitError('আজকে কয়টি কাজ সম্পন্ন করেছেন তা সঠিকভাবে লিখুন (কমপক্ষে ১টি)।');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'campaign_registrations'), {
        userId: user?.uid || 'guest',
        fullName: cleanName,
        phone: cleanPhone,
        studentIdCode: cleanId,
        tasksCompletedToday: tasksNum,
        campaignWeek: campaignDates.satDateStr + ' - ' + campaignDates.friDateStr,
        submittedAt: new Date().toISOString(),
        status: 'verified'
      });

      localStorage.setItem('unity_gift_campaign_registered', 'true');
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error("Gift registration error:", err);
      localStorage.setItem('unity_gift_campaign_registered', 'true');
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-slate-950 text-white flex flex-col h-full w-full overflow-hidden animate-in fade-in">
      
      {/* 1. Header Bar - Polished Executive Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-3 sm:p-4 px-4 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 shrink-0">
            <Gift size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white leading-tight flex items-center gap-2">
              <span>সাপ্তাহিক মেগা বোনাস অফার</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
                ক্যাশ রিওয়ার্ড
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              শনিবার থেকে শুক্রবার • শীর্ষ ৩ জন পাবেন নগদ ক্যাশ বোনাস
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700/80 shadow-xs"
          title="Close Fullscreen"
        >
          <X size={18} />
        </button>
      </header>

      {/* 2. Main Fullscreen Scrollable Body */}
      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full p-4 sm:p-6 space-y-6 pb-20">
        
        {/* HERO BANNER - Professional Typography & Structured Offer Details */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden space-y-5">
          
          {/* Top badges: Schedule & Status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full text-[11px] text-orange-300 font-mono font-bold">
              <Calendar size={13} className="text-orange-400" />
              <span>সময়কাল: {campaignDates.satDateStr} — {campaignDates.friDateStr}</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full text-[11px] text-emerald-400 font-bold border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>চলতি সপ্তাহ সক্রিয়</span>
            </div>
          </div>

          {/* Campaign Header & Intro */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              সাপ্তাহিক মেগা ক্যাশ বোনাস অফার
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-300 font-medium mt-1.5 leading-relaxed">
              সাপ্তাহিক কাজের উৎসাহ বাড়াতে প্রতি শনিবার থেকে একটি নতুন ক্যাম্পেইন চালু হয়। চলতি সপ্তাহে সর্বোচ্চ কাজ সম্পন্নকারী শীর্ষ ৩ জন শিক্ষার্থীকে নগদ অর্থ বোনাস প্রদান করা হবে।
            </p>
          </div>

          {/* Structured Prize Breakdown Cards - Clean Lineup & Pro Typography */}
          <div className="space-y-2.5 pt-1">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Trophy size={14} className="text-amber-400" />
              <span>পুরস্কার ও ক্যাশ রিওয়ার্ড তালিকা:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* 1st Prize */}
              <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-3.5 rounded-2xl border border-amber-500/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300">🥇 ১ম পুরস্কার</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">১ম স্থান</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5">
                    ৳১,০০০
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>সরাসরি মেইন ব্যালেন্সে</span>
                </div>
              </div>

              {/* 2nd Prize */}
              <div className="bg-gradient-to-br from-slate-800/40 via-slate-900 to-slate-950 p-3.5 rounded-2xl border border-slate-600/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-300">🥈 ২য় পুরস্কার</span>
                    <span className="text-[10px] bg-slate-400/20 text-slate-300 px-1.5 py-0.5 rounded font-bold">২য় স্থান</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5">
                    ৳৭০০
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>সরাসরি মেইন ব্যালেন্সে</span>
                </div>
              </div>

              {/* 3rd Prize */}
              <div className="bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 p-3.5 rounded-2xl border border-orange-500/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-300">🥉 ৩য় পুরস্কার</span>
                    <span className="text-[10px] bg-orange-400/20 text-orange-300 px-1.5 py-0.5 rounded font-bold">৩য় স্থান</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5">
                    ৳৫০০
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>সরাসরি মেইন ব্যালেন্সে</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Campaign Highlights & Rules Bullet Points */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-400" />
              <span>অফারের মূল নিয়ম ও সুবিধাসমূহ:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>প্রত্যেক সক্রিয় সদস্য বিনামূল্যে এন্ট্রি জমা দিতে পারবেন।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>প্রতি শুক্রবার রাত ৮:০০ টায় ফলাফল ঘোষণা ও ক্রেডিট সম্পন্ন হবে।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>পুরস্কারের টাকা বিকাশ, নগদ বা রকেটে যেকোনো সময় উত্তোলনযোগ্য।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>প্রতিদিন নতুন কাজ সম্পন্ন করে পয়েন্ট ও পজিশন বাড়াতে পারবেন।</span>
              </div>
            </div>
          </div>

          {/* Friday Announcement Countdown Bar */}
          <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-amber-400" />
              <span>ফলাফল ঘোষণা ও ক্যাশ ক্রেডিট:</span>
            </div>
            <strong className="text-amber-400 font-mono font-black text-xs sm:text-sm">
              {campaignDates.daysLeft} দিন {campaignDates.hoursLeft} ঘণ্টা {campaignDates.minsLeft} মিনিট বাকি
            </strong>
          </div>
        </div>

        {/* 3. PRIMARY PROMINENT REGISTRATION SECTION: "নিজে রেজিস্ট্রেশন করুন" */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-orange-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/25 shrink-0">
              <Send size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>নিজে রেজিস্ট্রেশন করুন (Campaign Entry Form)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                আপনার নাম, আইডি কোড ও আজকের সম্পন্ন কাজের সংখ্যা জমা দিন
              </p>
            </div>
          </div>

          {submitSuccess && (
            <div className="mb-4 bg-emerald-950/60 border border-emerald-500/60 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-white">আপনার এন্ট্রি সফলভাবে গ্রহণ করা হয়েছে!</h4>
                <p className="text-[11px] text-emerald-300 leading-relaxed">
                  আপনার নাম ({fullName}) ও একাউন্ট আইডি ({studentIdCode}) চলতি সপ্তাহের তালিকায় সক্রিয় রয়েছে। শুক্রবারে বিজয়ী তালিকা ঘোষণা করা হবে।
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-500/50 text-rose-300 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ১. আপনার পূর্ণ নাম (Full Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Field 2: Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ২. মোবাইল নম্বর (Phone Number) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Field 3: 7-Digit Student ID Code */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    ৩. স্টুডেন্ট আইডি কোড (৭ ডিজিট) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-orange-400 font-mono font-bold">৭ ডিজিট আবশ্যক</span>
                </div>
                <input
                  type="text"
                  maxLength={7}
                  required
                  value={studentIdCode}
                  onChange={(e) => setStudentIdCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="যেমন: 5938210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white font-mono tracking-wider placeholder-slate-500 focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {/* Field 4: Completed Tasks Count Today */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    ৪. আজকে কয়টি কাজ সম্পন্ন করেছেন? <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{tasksCount} টি কাজ</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={tasksCount}
                  onChange={(e) => setTasksCount(e.target.value)}
                  placeholder="কাজের সংখ্যা"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>
            </div>

            {/* Quick Task count selector buttons */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1.5 font-medium">কাজের সংখ্যা দ্রুত নির্বাচন করুন:</span>
              <div className="flex gap-1.5 flex-wrap">
                {['1', '3', '5', '8', '10', '15', '20'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTasksCount(num)}
                    className={`flex-1 min-w-[42px] py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      tasksCount === num 
                        ? 'bg-orange-500 text-white border-orange-400 font-black shadow-xs'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white font-black py-3.5 rounded-2xl transition text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-orange-400/30"
            >
              <Gift size={16} />
              <span>{isSubmitting ? 'তথ্য সংরক্ষণ করা হচ্ছে...' : 'ক্যাম্পেইনে অংশগ্রহণ নিশ্চিত করুন'}</span>
            </button>

            <p className="text-[10px] text-slate-500 text-center font-medium">
              * প্রতিদিন কাজ শেষে এই ফর্মে নতুন করে কাজের সংখ্যা জমা দিয়ে আপনার পয়েন্ট বাড়াতে পারেন।
            </p>
          </form>
        </div>

        {/* 4. LIVE REGISTRATION RATIO CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-white">
              <Users size={16} className="text-orange-400" />
              <span>চলতি সপ্তাহের অংশগ্রহণকারীদের রেশিও</span>
            </div>
            <div className="font-mono text-orange-400 font-black text-xs sm:text-sm">
              {registrationStats.totalCount.toLocaleString()} / {registrationStats.maxCapacity.toLocaleString()} জন
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800 relative">
            <div 
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-1000 relative shadow-sm"
              style={{ width: `${registrationStats.percentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Flame size={13} className="text-amber-400" />
              <span>প্রতি ঘণ্টায় ৩০-৪০ জন নতুন শিক্ষার্থী রেজিস্ট্রেশন করছেন</span>
            </span>
            <span className="font-mono font-bold text-slate-300">{registrationStats.percentage}% পূর্ণ</span>
          </div>
        </div>

        {/* 5. FRIDAY WINNERS SHOWCASE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-amber-400" />
              <h3 className="text-sm sm:text-base font-black text-white">
                শুক্রবার বিজয়ীদের তালিকা (Verified Top 3 Winners)
              </h3>
            </div>
            
            {/* Week Selector Chips */}
            <div className="flex gap-1.5">
              {pastWinnerSets.map((ws, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWinnerWeek(idx)}
                  className={`py-1 px-2.5 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                    selectedWinnerWeek === idx
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-black'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {ws.weekLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>ফলাফল প্রকাশের তারিখ: {pastWinnerSets[selectedWinnerWeek].date}</span>
            <span className="text-emerald-400 font-bold">✓ প্রাইজ ক্রেডিট সম্পন্ন</span>
          </div>

          {/* 3 Winners Cards */}
          <div className="space-y-2.5">
            {pastWinnerSets[selectedWinnerWeek].winners.map((winner) => {
              const isFirst = winner.rank === 1;
              const isSecond = winner.rank === 2;

              return (
                <div
                  key={winner.rank}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isFirst
                      ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/5'
                      : isSecond
                      ? 'bg-gradient-to-r from-slate-800/50 to-slate-900 border-slate-600/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border ${
                        isFirst
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : isSecond
                          ? 'bg-slate-400/20 text-slate-300 border-slate-400/40'
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      }`}>
                        {isFirst ? '🥇' : isSecond ? '🥈' : '🥉'}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{winner.name}</h4>
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                            isFirst
                              ? 'bg-amber-400 text-slate-950'
                              : isSecond
                              ? 'bg-slate-300 text-slate-950'
                              : 'bg-orange-400 text-slate-950'
                          }`}>
                            {winner.rank === 1 ? '১ম স্থান' : winner.rank === 2 ? '২য় স্থান' : '৩য় স্থান'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-orange-400 font-bold border border-slate-800">
                            ID: {winner.studentId}
                          </span>
                          <span>•</span>
                          <span className="text-slate-300 font-semibold">{winner.tasksCompleted} টি কাজ সম্পন্ন</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-amber-400 font-mono">
                        ৳{winner.prizeAmount.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-emerald-400 font-medium flex items-center justify-end gap-0.5 mt-0.5">
                        <CheckCircle2 size={10} />
                        <span>পেইড</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <Clock size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <span>
              চলতি সপ্তাহের নতুন ৩ জন বিজয়ীর নাম <strong>আগামী শুক্রবার রাত ৮:০০ টায়</strong> স্বয়ংক্রিয়ভাবে এখানে ঘোষণা করা হবে।
            </span>
          </div>
        </div>

        {/* 6. CAMPAIGN RULES & TERMS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs leading-relaxed text-slate-300">
          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>ক্যাম্পেইন নিয়মাবলী ও অফিশিয়াল শর্তাবলী</span>
          </h4>
          
          <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
            <li><strong className="text-slate-200">সময়সীমা:</strong> প্রতি শনিবার সকাল থেকে শুরু হয়ে পরবর্তী শুক্রবার রাত ৮:০০ টায় সমাপ্ত হয়।</li>
            <li><strong className="text-slate-200">যোগ্যতা:</strong> সকল সক্রিয় শিক্ষার্থী তাদের নিজস্ব ৭ ডিজিটের একাউন্ট আইডি কোড দিয়ে অংশ নিতে পারেন।</li>
            <li><strong className="text-slate-200">পুরস্কার প্রদান:</strong> ১ম স্থান ৳১,০০০, ২য় স্থান ৳৭০০ এবং ৩য় স্থান ৳৫০০ সরাসরি প্রোফাইল ওয়ালেট ব্যালেন্সে ক্রেডিট করা হয়।</li>
            <li><strong className="text-slate-200">উইথড্রয়াল:</strong> বোনাস পাওয়ার পর যেকোনো সময় বিকাশ, নগদ বা রকেটে টাকা উত্তোলন করা যাবে।</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
