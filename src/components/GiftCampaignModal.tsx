import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Gift, 
  Trophy, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Clock, 
  ShieldCheck, 
  Check
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

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phone, setPhone] = useState(profile?.whatsappNumber || '');
  const [studentIdCode, setStudentIdCode] = useState(profile?.studentIdCode || '');
  const [tasksCount, setTasksCount] = useState<string>('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(() => {
    return localStorage.getItem('unity_gift_campaign_registered') === 'true';
  });
  const [submitError, setSubmitError] = useState('');
  const [selectedWinnerWeek, setSelectedWinnerWeek] = useState<number>(0);

  useEffect(() => {
    if (profile) {
      if (profile.fullName && !fullName) setFullName(profile.fullName);
      if (profile.whatsappNumber && !phone) setPhone(profile.whatsappNumber);
      if (profile.studentIdCode && !studentIdCode) setStudentIdCode(profile.studentIdCode);
    }
  }, [profile]);

  const campaignDates = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const daysSinceSaturday = (day + 1) % 7;
    
    const saturday = new Date(now);
    saturday.setDate(now.getDate() - daysSinceSaturday);
    saturday.setHours(0, 0, 0, 0);

    const friday = new Date(saturday);
    friday.setDate(saturday.getDate() + 6);
    friday.setHours(20, 0, 0, 0);

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

    return { satDateStr, friDateStr, daysLeft, hoursLeft, minsLeft, daysSinceSaturday };
  }, []);

  const registrationStats = useMemo(() => {
    const now = new Date();
    const daysSinceSat = campaignDates.daysSinceSaturday;
    const hour = now.getHours();
    const minute = now.getMinutes();

    const dayBases = [35, 70, 260, 560, 900, 1240, 1580];
    const currentDayBase = dayBases[daysSinceSat] || 35;
    const nextDayBase = dayBases[(daysSinceSat + 1) % 7] || 1800;
    const daySpan = Math.max(35, nextDayBase - currentDayBase);

    const hourlyProgress = Math.floor((hour / 24) * daySpan);
    const minuteJitter = Math.floor((minute / 60) * 2);

    const totalCount = Math.min(1795, currentDayBase + hourlyProgress + minuteJitter);
    const maxCapacity = 1800;
    const percentage = Math.min(99.6, ((totalCount / maxCapacity) * 100)).toFixed(1);

    return { totalCount, maxCapacity, percentage };
  }, [campaignDates.daysSinceSaturday]);

  const pastWinnerSets: { weekLabel: string; date: string; winners: Winner[] }[] = [
    {
      weekLabel: 'সপ্তাহ ৩',
      date: 'শুক্রবার, ৩ অক্টোবর ২০২৬ (রাত ৮:০০ টা)',
      winners: [
        { rank: 1, name: 'সাদিয়া সুলতানা', studentId: '5938210', tasksCompleted: 48, prizeAmount: 1000, date: 'গত শুক্রবার', status: 'ক্রেডিট সম্পন্ন' },
        { rank: 2, name: 'তানভীর আহমেদ', studentId: '7120492', tasksCompleted: 43, prizeAmount: 700, date: 'গত শুক্রবার', status: 'ক্রেডিট সম্পন্ন' },
        { rank: 3, name: 'লামিয়া আক্তার', studentId: '4819203', tasksCompleted: 39, prizeAmount: 500, date: 'গত শুক্রবার', status: 'ক্রেডিট সম্পন্ন' }
      ]
    },
    {
      weekLabel: 'সপ্তাহ ২',
      date: 'শুক্রবার, ২৬ সেপ্টেম্বর ২০২৬ (রাত ৮:০০ টা)',
      winners: [
        { rank: 1, name: 'আয়েশা সিদ্দিকা', studentId: '6829104', tasksCompleted: 52, prizeAmount: 1000, date: '২৬ সেপ্টেম্বর', status: 'ক্রেডিট সম্পন্ন' },
        { rank: 2, name: 'মেহরাব হোসেন', studentId: '8291047', tasksCompleted: 46, prizeAmount: 700, date: '২৬ সেপ্টেম্বর', status: 'ক্রেডিট সম্পন্ন' },
        { rank: 3, name: 'ফারহানা ইসলাম', studentId: '3920184', tasksCompleted: 41, prizeAmount: 500, date: '২৬ সেপ্টেম্বর', status: 'ক্রেডিট সম্পন্ন' }
      ]
    },
    {
      weekLabel: 'সপ্তাহ ১',
      date: 'শুক্রবার, ১৯ সেপ্টেম্বর ২০২৬ (রাত ৮:০০ টা)',
      winners: [
        { rank: 1, name: 'রাকিবুল হাসান', studentId: '6182903', tasksCompleted: 55, prizeAmount: 1000, date: '১৯ সেপ্টেম্বর', status: 'ক্রেডিট সম্পন্ন' },
        { rank: 2, name: 'সুমাইয়া খানম', studentId: '7391024', tasksCompleted: 49, prizeAmount: 700, date: '১৯ সেপ্টেম্বর', status: 'ক্রেডিট সম্পন্ন' },
        { rank: 3, name: 'নাজমুল হুদা', studentId: '5201948', tasksCompleted: 44, prizeAmount: 500, date: '১৯ সেপ্টেম্বর', status: 'ক্রেডিট সম্পন্ন' }
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

    if (!user?.uid) {
      setSubmitError('ক্যাম্পেইনে অংশগ্রহণ করতে অনুগ্রহ করে লগইন করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'campaign_registrations'), {
        userId: user.uid,
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
      setSubmitError(err?.message || 'তথ্য সংরক্ষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-[#F4F5F7] text-[#1E2329] flex flex-col h-full w-full overflow-hidden">
      
      {/* Formal Top Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
            <Gift size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#1E2329] leading-tight">
              সাপ্তাহিক বোনাস ক্যাম্পেইন
            </h2>
            <p className="text-[11px] text-slate-500">
              শনিবার থেকে শুক্রবার · শীর্ষ ৩ জন কর্মীর জন্য ক্যাশ রিওয়ার্ড
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          title="Close"
        >
          <X size={18} />
        </button>
      </header>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full p-4 space-y-4 pb-16">
        
        {/* Summary Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
              <Calendar size={14} className="text-[#0A4D8C]" />
              <span>সময়কাল: {campaignDates.satDateStr} — {campaignDates.friDateStr}</span>
            </span>
            <span className="text-emerald-700 font-medium">চলতি সপ্তাহ সক্রিয়</span>
          </div>

          <div>
            <h1 className="text-lg font-semibold text-[#1E2329] leading-snug">
              সাপ্তাহিক কাজের বোনাস প্রোগ্রাম
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              প্রতি শনিবার থেকে শুরু হওয়া সাপ্তাহিক পর্বে সর্বোচ্চ কাজ সম্পন্নকারী শীর্ষ ৩ জন শিক্ষার্থীকে নগদ অর্থ বোনাস প্রদান করা হয়।
            </p>
          </div>

          {/* Prize Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#EEF5FC] border border-[#D4E4F7] p-3 rounded-lg">
              <div className="text-[11px] font-medium text-[#0A4D8C]">১ম স্থান</div>
              <div className="text-base sm:text-lg font-semibold text-[#1E2329] font-mono mt-0.5 tabular-nums">৳1,000</div>
              <div className="text-[10px] text-slate-600 mt-0.5">মেইন ব্যালেন্স</div>
            </div>
            <div className="bg-[#F4F5F7] border border-slate-200 p-3 rounded-lg">
              <div className="text-[11px] font-medium text-slate-600">২য় স্থান</div>
              <div className="text-base sm:text-lg font-semibold text-[#1E2329] font-mono mt-0.5 tabular-nums">৳700</div>
              <div className="text-[10px] text-slate-500 mt-0.5">মেইন ব্যালেন্স</div>
            </div>
            <div className="bg-[#F4F5F7] border border-slate-200 p-3 rounded-lg">
              <div className="text-[11px] font-medium text-slate-600">৩য় স্থান</div>
              <div className="text-base sm:text-lg font-semibold text-[#1E2329] font-mono mt-0.5 tabular-nums">৳500</div>
              <div className="text-[10px] text-slate-500 mt-0.5">মেইন ব্যালেন্স</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
              <span>সক্রিয় সদস্যরা বিনামূল্যে এন্ট্রি দিতে পারবেন।</span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
              <span>প্রতি শুক্রবার রাত ৮:০০ টায় ফলাফল প্রকাশিত হয়।</span>
            </div>
          </div>

          <div className="bg-[#FEF7E0] border border-[#F3DFA2] px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Clock size={14} className="text-amber-600" />
              <span>ফলাফল ঘোষণার বাকি সময়:</span>
            </span>
            <span className="font-mono font-semibold text-[#1E2329] tabular-nums">
              {campaignDates.daysLeft}d {campaignDates.hoursLeft}h {campaignDates.minsLeft}m
            </span>
          </div>
        </div>

        {/* Campaign Entry Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-[#1E2329]">
              ক্যাম্পেইন এন্ট্রি ফর্ম
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              আপনার নাম, ৭-সংখ্যার আইডি ও আজকের সম্পন্ন কাজের সংখ্যা জমা দিন
            </p>
          </div>

          {submitSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-emerald-950">এন্ট্রি সফলভাবে গ্রহণ করা হয়েছে</p>
                <p className="text-emerald-800 mt-0.5">
                  নাম ({fullName}) ও আইডি ({studentIdCode}) চলতি সপ্তাহের তালিকায় যুক্ত হয়েছে।
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  পূর্ণ নাম <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="w-full bg-[#F4F5F7] border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#1E2329] focus:bg-white focus:outline-none focus:border-[#0A4D8C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#F4F5F7] border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#1E2329] font-mono focus:bg-white focus:outline-none focus:border-[#0A4D8C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  স্টুডেন্ট আইডি কোড (৭ ডিজিট) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  maxLength={7}
                  required
                  value={studentIdCode}
                  onChange={(e) => setStudentIdCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="যেমন: 5938210"
                  className="w-full bg-[#F4F5F7] border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#1E2329] font-mono focus:bg-white focus:outline-none focus:border-[#0A4D8C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  আজকে সম্পন্ন কাজের সংখ্যা <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={tasksCount}
                  onChange={(e) => setTasksCount(e.target.value)}
                  placeholder="কাজের সংখ্যা"
                  className="w-full bg-[#F4F5F7] border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#1E2329] font-mono focus:bg-white focus:outline-none focus:border-[#0A4D8C]"
                />
              </div>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {['1', '3', '5', '8', '10', '15', '20'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTasksCount(num)}
                  className={`flex-1 min-w-[42px] py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer text-center ${
                    tasksCount === num 
                      ? 'bg-[#0A4D8C] text-white border-[#0A4D8C]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  +{num}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0A4D8C] hover:bg-[#083E72] text-white font-medium py-2.5 px-4 rounded-lg transition text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>{isSubmitting ? 'তথ্য সংরক্ষণ করা হচ্ছে...' : 'অংশগ্রহণ নিশ্চিত করুন'}</span>
            </button>
          </form>
        </div>

        {/* Participation Ratio */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-semibold text-[#1E2329]">
              <Users size={15} className="text-[#0A4D8C]" />
              <span>চলতি সপ্তাহের অংশগ্রহণ</span>
            </span>
            <span className="font-mono font-semibold text-[#0A4D8C] tabular-nums">
              {registrationStats.totalCount.toLocaleString()} / {registrationStats.maxCapacity.toLocaleString()} জন
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#0A4D8C] h-full rounded-full transition-all duration-700"
              style={{ width: `${registrationStats.percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>সক্রিয় নিবন্ধন চলমান</span>
            <span className="font-mono font-medium">{registrationStats.percentage}% পূর্ণ</span>
          </div>
        </div>

        {/* Past Winners */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-600" />
              <h3 className="text-sm font-semibold text-[#1E2329]">
                বিগত সপ্তাহের বিজয়ী তালিকা
              </h3>
            </div>
            
            <div className="flex gap-1 bg-[#F4F5F7] p-1 rounded-lg">
              {pastWinnerSets.map((ws, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWinnerWeek(idx)}
                  className={`py-1 px-2.5 rounded-md text-[11px] font-medium transition cursor-pointer ${
                    selectedWinnerWeek === idx
                      ? 'bg-white text-[#1E2329] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ws.weekLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>{pastWinnerSets[selectedWinnerWeek].date}</span>
            <span className="text-emerald-700 font-medium">প্রাইজ ক্রেডিট সম্পন্ন</span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {pastWinnerSets[selectedWinnerWeek].winners.map((winner) => (
              <div key={winner.rank} className="p-3 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shrink-0 ${
                    winner.rank === 1
                      ? 'bg-[#FEF7E0] text-amber-800 border border-[#F3DFA2]'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    #{winner.rank}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#1E2329] truncate">{winner.name}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-mono">ID: {winner.studentId}</span>
                      <span>·</span>
                      <span>{winner.tasksCompleted} টি কাজ</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-[#1E2329] font-mono tabular-nums">
                    ৳{winner.prizeAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">{winner.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-600">
          <h4 className="font-semibold text-[#1E2329] flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-[#0A4D8C]" />
            <span>ক্যাম্পেইন নিয়মাবলী</span>
          </h4>
          <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
            <li>প্রতি শনিবার থেকে শুরু হয়ে পরবর্তী শুক্রবার রাত ৮:০০ টায় পর্ব শেষ হয়।</li>
            <li>সক্রিয় সকল শিক্ষার্থী নিজস্ব ৭-ডিজিট আইডি দিয়ে অংশ নিতে পারবেন।</li>
            <li>বোনাসের টাকা সরাসরি ওয়ালেট ব্যালেন্সে যোগ হয় এবং উত্তোলনযোগ্য।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
