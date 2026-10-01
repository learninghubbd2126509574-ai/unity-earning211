import React, { useState } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  Share2, 
  Copy, 
  Check, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  AlertCircle, 
  MessageSquare, 
  Headphones, 
  Users, 
  Target, 
  Building, 
  Mail, 
  Phone, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LEAD_CAMPAIGNS = [
  {
    id: 'lead_b2b_1',
    title: 'ঢাকা ও চট্টগ্রাম করপোরেট আইটি ক্লায়েন্ট লিড জেনারেশন',
    category: 'B2B Targeted Prospecting',
    reward: 'BDT 5.00',
    targetAudience: 'ব্যবস্থাপনা পরিচালক (MD), সিইও (CEO), আইটি ডিরেক্টর',
    requirements: 'ভেরিফাইড কোম্পানির নাম, অফিসিয়াল ইমেইল, লিঙ্কডইন প্রোফাইল লিংক ও ফোন নম্বর সংগ্রহ করতে হবে।'
  },
  {
    id: 'lead_b2b_2',
    title: 'ই-কমার্স ও ড্রপশিপিং মার্চেন্ট লিড ক্যাম্পেইন',
    category: 'E-Commerce Merchant Outreach',
    reward: 'BDT 4.50',
    targetAudience: 'অনলাইন শপ ওনার, ফেসবুক পেজ অ্যাডমিন ও মার্চেন্ট',
    requirements: 'পেজ লিংক, মাসিক সেলস ভলিউম ক্যাটাগরি ও হোয়াটসঅ্যাপ নম্বর ভেরিফাই করতে হবে।'
  }
];

export const SocialMarketingWork: React.FC = () => {
  return (
    <ModuleGuard moduleId="social_marketing" title="Social Media Marketing">
      <SocialMarketingApp />
    </ModuleGuard>
  );
};

const SocialMarketingApp: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [selectedCamp, setSelectedCamp] = useState(LEAD_CAMPAIGNS[0]);
  const [companyName, setCompanyName] = useState('');
  const [decisionMakerName, setDecisionMakerName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadLinkedin, setLeadLinkedin] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent("আসসালামু আলাইকুম Unity Earning Team, আমি সোশ্যাল মিডিয়া মার্কেটিং ও লিড জেনারেশন (Lead Generation) প্রজেক্টের কাজ শিখতে চাই। অনুগ্রহ করে আমাকে গাইডলাইন দিন।");
    window.open(`https://wa.me/8801919012426?text=${text}`, '_blank');
  };

  const handleOpenTelegram = () => {
    window.open('https://t.me/unityearning', '_blank');
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setValidationError(null);

    if (!companyName.trim() || !decisionMakerName.trim() || !leadEmail.trim() || !leadPhone.trim()) {
      setValidationError("অনুগ্রহ করে লিডের সকল তথ্য (কোম্পানির নাম, সিদ্ধান্ত গ্রহণকারীর নাম, ইমেইল ও ফোন) সঠিকভাবে পূরণ করুন।");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        userName: profile?.fullName || 'Student User',
        userPhone: profile?.whatsappNumber || 'N/A',
        studentIdCode: profile?.studentIdCode || 'N/A',
        module: 'social_marketing',
        moduleTitle: 'Social Media Marketing (B2B Lead Generation)',
        details: `Campaign: ${selectedCamp.title}\nCompany: ${companyName}\nLead: ${decisionMakerName}\nEmail: ${leadEmail}\nPhone: ${leadPhone}\nLinkedIn: ${leadLinkedin || 'N/A'}`,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setValidationError('সাবমিশন ব্যর্থ হয়েছে: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-5 max-w-3xl mx-auto pb-28 space-y-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-5 text-white shadow-md border border-teal-800/80">
        <div className="flex items-center gap-2 text-teal-300 text-[10px] font-bold uppercase tracking-wider mb-2 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full inline-flex">
          <Target size={12} />
          <span>B2B Lead Generation & Outreach</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          সোশ্যাল মিডিয়া মার্কেটিং ও লিড জেনারেশন
        </h1>
        <p className="text-xs text-teal-200 mt-1 leading-relaxed">
          টার্গেটেড করপোরেট ক্লায়েন্ট প্রসপেক্টিং এবং ভেরিফাইড বিজনেস লিড ডাটাবেজ কালেকশন প্রজেক্ট।
        </p>
      </div>

      {/* SPECIAL MANDATORY NOTICE: টিমের সাথে কথা বলে কাজ শিখে নিন */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3.5">
        <div className="flex items-start gap-3 text-amber-950">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <Headphones size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-sm sm:text-base text-amber-950">
              টিমের সাথে সরাসরি কথা বলে এই মার্কেটিংয়ের কাজটি শিখে নিন
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              সোশ্যাল মিডিয়া মার্কেটিং ও লিড জেনারেশন (Lead Generation) একটি অত্যন্ত লাভজনক কিন্তু টেকনিক্যাল প্রজেক্ট। কাজটিতে ভালো করতে হলে এবং রিজেকশন এড়াতে <strong>লাইভ প্রজেক্ট সাবমিট করার পূর্বে আমাদের অফিসিয়াল সাপোর্ট টিমের সাথে সরাসরি কথা বলে কাজের সম্পূর্ণ গাইডলাইন শিখে নেওয়া বাধ্যতামূলক।</strong>
            </p>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <MessageSquare size={16} />
            <span>অফিসিয়াল হোয়াটসঅ্যাপে কাজ শিখুন</span>
          </button>

          <button
            onClick={handleOpenTelegram}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Send size={15} />
            <span>টেলিগ্রাম সাপোর্ট টিমের সাথে যুক্ত হন</span>
          </button>
        </div>

        <div className="text-[11px] text-amber-800 text-center flex items-center justify-center gap-1 font-semibold">
          <GraduationCap size={13} className="text-amber-700" />
          <span>দায়িত্বপ্রাপ্ত কোর্স মেন্টর: আরিফুল ইসলাম চৌধুরী (Lead Gen Expert)</span>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            লিড সাবমিশন সফল হয়েছে!
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            আপনার সাবমিটকৃত বিটুবি ক্লায়েন্ট লিডের ডাটা কোয়ালিটি যাচাইয়ের জন্য মডারেশন টিমের কাছে পাঠানো হয়েছে।
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">কোম্পানি:</span>
              <span className="font-bold text-slate-900">{companyName}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">ক্লায়েন্ট নেম:</span>
              <span className="font-bold text-slate-900">{decisionMakerName}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">স্ট্যাটাস:</span>
              <span className="font-bold text-orange-600">Pending Review</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setCompanyName('');
              setDecisionMakerName('');
              setLeadEmail('');
              setLeadPhone('');
              setLeadLinkedin('');
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition active:scale-95 shadow-md cursor-pointer"
          >
            পরবর্তী লিড তথ্য সাবমিট করুন
          </button>
        </div>
      ) : (
        /* Lead Submission Workspace */
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                লাইভ বিটুবি লিড এন্ট্রি ফর্ম
              </h2>
              <p className="text-xs text-slate-500">
                টার্গেটেড প্রতিষ্ঠানের সিদ্ধান্ত গ্রহণকারীর সঠিক তথ্য পূরণ করুন।
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitLead} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  টার্গেটেড প্রতিষ্ঠানের নাম (Company Legal Name) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. মেঘনা টেকনোলজিস লিমিটেড"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  সিদ্ধান্ত গ্রহণকারীর নাম ও পদবি (MD/CEO/CTO) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. মো: কামরুল হাসান (ব্যবস্থাপনা পরিচালক)"
                  value={decisionMakerName}
                  onChange={e => setDecisionMakerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ভেরিফাইড অফিসিয়াল ইমেইল (Business Email) *
                </label>
                <input
                  type="email"
                  placeholder="name@company.com.bd"
                  value={leadEmail}
                  onChange={e => setLeadEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  অফিসিয়াল যোগাযোগ নম্বর / হোয়াটসঅ্যাপ *
                </label>
                <input
                  type="text"
                  placeholder="+880 17XXXXXXXX"
                  value={leadPhone}
                  onChange={e => setLeadPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                লিঙ্কডইন বা সোর্স প্রোফাইল ইউআরএল (LinkedIn Profile URL)
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={leadLinkedin}
                onChange={e => setLeadLinkedin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={15} className="text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition shadow-md active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>যাচাই ও সাবমিশন চলছে...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>লিড জেনারেশন ডাটা সাবমিট করুন</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
