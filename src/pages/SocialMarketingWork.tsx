import React, { useState } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Headphones, 
  Target, 
  GraduationCap
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

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

  const [selectedCamp] = useState(LEAD_CAMPAIGNS[0]);
  const [companyName, setCompanyName] = useState('');
  const [decisionMakerName, setDecisionMakerName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadLinkedin, setLeadLinkedin] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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
    <div className="min-h-full bg-[#F4F5F7] p-3 sm:p-5 pb-28">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70]">
          <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-medium mb-1">
            <Target size={13} />
            <span>B2B Lead Generation & Outreach</span>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            সোশ্যাল মিডিয়া মার্কেটিং ও লিড জেনারেশন
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            টার্গেটেড করপোরেট ক্লায়েন্ট প্রসপেক্টিং এবং ভেরিফাইড বিজনেস লিড ডাটাবেজ কালেকশন প্রজেক্ট।
          </p>
        </div>

        {/* SPECIAL MANDATORY NOTICE */}
        <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-xl p-5 space-y-3.5 text-[#5F4B16]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#B47B00] text-white flex items-center justify-center shrink-0">
              <Headphones size={19} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[#47380F]">
                টিমের সাথে সরাসরি কথা বলে এই মার্কেটিংয়ের কাজটি শিখে নিন
              </h3>
              <p className="text-xs leading-relaxed">
                সোশ্যাল মিডিয়া মার্কেটিং ও লিড জেনারেশন একটি টেকনিক্যাল প্রজেক্ট। রিজেকশন এড়াতে <strong>লাইভ প্রজেক্ট সাবমিট করার পূর্বে আমাদের অফিসিয়াল সাপোর্ট টিমের সাথে সরাসরি কথা বলে কাজের গাইডলাইন শিখে নেওয়া বাধ্যতামূলক।</strong>
              </p>
            </div>
          </div>

          {/* Contact Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href="https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0D7A5F] hover:bg-[#09604A] text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={15} />
              <span>অফিসিয়াল হোয়াটসঅ্যাপে কাজ শিখুন</span>
            </a>

            <a
              href="https://t.me/unityearning"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>টেলিগ্রাম সাপোর্ট টিমের সাথে যুক্ত হন</span>
            </a>
          </div>

          <div className="text-[11px] text-[#5F4B16] pt-1 border-t border-[#F3DFA2] flex items-center justify-center gap-1.5 font-medium">
            <GraduationCap size={13} className="text-[#B47B00]" />
            <span>দায়িত্বপ্রাপ্ত কোর্স মেন্টর: আরিফুল ইসলাম চৌধুরী (Lead Gen Expert)</span>
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 text-center space-y-4">
            <div className="w-14 h-14 bg-[#ECFDF5] border border-[#A7F3D0] text-[#0D7A5F] rounded-xl flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-lg font-semibold text-[#111827]">
              লিড সাবমিশন সফল হয়েছে
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              আপনার সাবমিটকৃত বিটুবি ক্লায়েন্ট লিডের ডাটা কোয়ালিটি যাচাইয়ের জন্য মডারেশন টিমের কাছে পাঠানো হয়েছে।
            </p>

            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center gap-3 text-slate-700">
                <span className="font-medium text-slate-500">কোম্পানি</span>
                <span className="font-semibold text-[#111827]">{companyName}</span>
              </div>
              <div className="flex justify-between items-center gap-3 text-slate-700">
                <span className="font-medium text-slate-500">ক্লায়েন্ট নেম</span>
                <span className="font-semibold text-[#111827]">{decisionMakerName}</span>
              </div>
              <div className="flex justify-between items-center gap-3 text-slate-700">
                <span className="font-medium text-slate-500">স্ট্যাটাস</span>
                <span className="font-semibold text-[#B47B00]">Pending Review</span>
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
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
            >
              পরবর্তী লিড তথ্য সাবমিট করুন
            </button>
          </div>
        ) : (
          /* Lead Submission Workspace */
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold text-[#111827]">
                লাইভ বিটুবি লিড এন্ট্রি ফর্ম
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                টার্গেটেড প্রতিষ্ঠানের সিদ্ধান্ত গ্রহণকারীর সঠিক তথ্য পূরণ করুন।
              </p>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    টার্গেটেড প্রতিষ্ঠানের নাম (Company Legal Name) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. মেঘনা টেকনোলজিস লিমিটেড"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    সিদ্ধান্ত গ্রহণকারীর নাম ও পদবি (MD/CEO/CTO) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. মো: কামরুল হাসান (ব্যবস্থাপনা পরিচালক)"
                    value={decisionMakerName}
                    onChange={e => setDecisionMakerName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ভেরিফাইড অফিসিয়াল ইমেইল (Business Email) *
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com.bd"
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    অফিসিয়াল যোগাযোগ নম্বর / হোয়াটসঅ্যাপ *
                  </label>
                  <input
                    type="text"
                    placeholder="+880 17XXXXXXXX"
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  লিঙ্কডইন বা সোর্স প্রোফাইল ইউআরএল (LinkedIn Profile URL)
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={leadLinkedin}
                  onChange={e => setLeadLinkedin(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] font-mono"
                />
              </div>

              {validationError && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A4D8C] hover:bg-[#083D70] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>যাচাই ও সাবমিশন চলছে...</span>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>লিড জেনারেশন ডাটা সাবমিট করুন</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
