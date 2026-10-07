import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Star, 
  Users, 
  Award, 
  Sparkles, 
  Clock, 
  Mail, 
  ShieldAlert,
  FileCheck,
  Building,
  UserCheck
} from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  workingHours: string;
  assignedCourse: string;
  email: string;
  avatarColor: string;
  isSystemAdmin?: boolean;
}

const MENTORS_LIST: Mentor[] = [
  {
    id: 'm_mahmud',
    name: 'Engr. Mahmudul Hasan',
    role: 'Chief System Director & Lead Platform Architect',
    expertise: ['System Administration & Safety', 'Payout Verification & Audits', 'Database Scaling & Access Control'],
    workingHours: 'Working: 09:00 AM - 11:00 PM (GMT+6)',
    assignedCourse: 'Overall System Administration & Technical Escalations',
    email: 'mahmud.director@unityearning.app',
    avatarColor: 'from-slate-800 to-slate-950',
    isSystemAdmin: true
  },
  {
    id: 'm_tanveer',
    name: 'Tanveer Ahmed Chowdhury',
    role: 'Senior CPA Marketing Specialist & Lead Campaign Auditor',
    expertise: ['CPA Network Approvals', 'High-Converting Lead Generation', 'Traffic Source Quality Control'],
    workingHours: 'Working: 10:00 AM - 08:00 PM (GMT+6)',
    assignedCourse: 'CPA & Lead Generation Support Hub',
    email: 'tanveer.cpa@unityearning.app',
    avatarColor: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'm_alamin',
    name: 'Md. Al-Amin Hossain',
    role: 'Lead Digital Marketing Specialist & Traffic Auditor',
    expertise: ['Social Media Distribution', 'Facebook Ads Campaign Optimization', 'Targeted Lead Mining & Sourcing'],
    workingHours: 'Working: 11:00 AM - 09:00 PM (GMT+6)',
    assignedCourse: 'Digital Marketing & Social Traffic Operations',
    email: 'alamin.marketing@unityearning.app',
    avatarColor: 'from-cyan-600 to-blue-700'
  },
  {
    id: 'm_rahman',
    name: 'Rahman Sheikh',
    role: 'Senior Transcription & Hand-Typing Speed Instructor',
    expertise: ['120+ WPM Keystroke Auditing', 'Anti-AI Quality Proofreading', 'Zero-Error Key Validation'],
    workingHours: 'Working: 08:00 AM - 06:00 PM (GMT+6)',
    assignedCourse: 'Professional Typing Work & Medical/Legal Transcription',
    email: 'rahman.typing@unityearning.app',
    avatarColor: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'm_farhana',
    name: 'Farhana Yasmin',
    role: 'Data Verification Officer & Compliance Lead',
    expertise: ['Multi-Field Form Verification', 'KYC Auditing & Document Validation', 'Accuracy Control Checks'],
    workingHours: 'Working: 10:00 AM - 10:00 PM (GMT+6)',
    assignedCourse: 'Form Fillup & Corporate Data Entry Compliance',
    email: 'farhana.data@unityearning.app',
    avatarColor: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'm_saiful',
    name: 'Md. Saiful Islam',
    role: 'E-Commerce Merchant & Dropshipping Operations Lead',
    expertise: ['Inventory Sync & Tracking', 'Supplier Reconciliation Metrics', 'Profit Margin Optimization'],
    workingHours: 'Working: 12:00 PM - 10:00 PM (GMT+6)',
    assignedCourse: 'Dropshipping & Product Selling Business',
    email: 'saiful.dropship@unityearning.app',
    avatarColor: 'from-amber-600 to-orange-700'
  },
  {
    id: 'm_sabrina',
    name: 'Sabrina Nowshin',
    role: 'Senior Student Support Executive & Linguistic Mentor',
    expertise: ['Student Query Resolution', 'Grammar & Spell Auditing', 'Platform Guideline Execution'],
    workingHours: 'Working: 09:00 AM - 09:00 PM (GMT+6)',
    assignedCourse: 'Platform Guidelines, Onboarding & General Support',
    email: 'sabrina.support@unityearning.app',
    avatarColor: 'from-pink-600 to-rose-700'
  },
  {
    id: 'm_shakil',
    name: 'Engr. Shakil Mahmud',
    role: 'Technical Support Coach & Freelancing Mentor',
    expertise: ['Account Verification & Security', 'Micro Job Quality Ratings', 'Platform Bug Resolution'],
    workingHours: 'Working: 10:00 AM - 12:00 AM (GMT+6)',
    assignedCourse: 'Micro Jobs & Technical Support Escalation Desk',
    email: 'shakil.tech@unityearning.app',
    avatarColor: 'from-rose-600 to-pink-700'
  }
];

export const Mentors = () => {
  const [activeTab, setActiveTab] = useState<'mentors' | 'guidelines'>('mentors');

  return (
    <div className="p-4 py-5 space-y-4 max-w-2xl mx-auto pb-28 bg-slate-50 min-h-screen">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
              <GraduationCap size={12} />
              <span>Unity E-Learning & Earning Platform</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Course Mentors & System Management
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Meet our professional administrators, specialists, and support mentors who manage operations and guide students.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl text-center shrink-0 w-full sm:w-auto shadow-inner">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Specialists</div>
            <div className="text-lg font-bold font-mono text-orange-400 mt-0.5">8 In-Charge Leads</div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mt-5 pt-3.5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'mentors'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800/90 text-slate-300 hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>Official Mentors List</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800/90 text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>কাজের নিয়ম ও নীতিমালা</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Guidelines (Bengali as requested for terms and rules) */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          
          {/* Main Strict Warning Box */}
          <div className="bg-gradient-to-br from-rose-50 via-red-50/60 to-amber-50 border-2 border-rose-200/90 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-rose-900">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-rose-950">
                  ইউনিটি ই-লার্নিং প্ল্যাটফর্মের অফিসিয়াল কাজের নীতিমালা
                </h3>
                <p className="text-xs text-rose-700 font-semibold">
                  প্রজেক্টে কাজ করার পূর্বে এই শর্তগুলো সতর্কতার সাথে পড়ুন
                </p>
              </div>
            </div>

            <div className="bg-white/90 rounded-2xl p-4 border border-rose-200/70 text-xs sm:text-sm text-slate-800 space-y-2.5 leading-relaxed font-medium">
              <p className="border-b border-slate-100 pb-2 text-slate-900">
                📌 <strong>প্রিমিয়াম প্রজেক্টে কাজ করার যোগ্যতা:</strong> আমাদের ওয়ার্ক পোর্টালে যে প্রিমিয়াম কাজগুলো রয়েছে (যেমন: ডেটা এন্ট্রি প্রজেক্ট, বৃহৎ ফর্ম ফিলাপ, ট্রান্সক্রিপশন টাইপিং ইত্যাদি), সেগুলো <strong>শুধুমাত্র যারা কাজ পারে বা নির্ধারিত কোর্স/ট্রেনিং সফলভাবে সম্পন্ন করেছে শুধুমাত্র তারাই ভালো করতে পারবে এবং সফল হবে</strong>।
              </p>
              
              <p className="border-b border-slate-100 pb-2 text-rose-700">
                ⛔ <strong>কোর্স ও ট্রেনিংবিহীন কাজের ক্ষেত্রে স্বয়ংক্রিয় রিজেকশন পলিসি:</strong> যারা কোর্স বা ট্রেনিং সম্পন্ন করেনি কিংবা কাজের সঠিক নিয়ম জানে না, তাদেরকে সরাসরি লাইভ প্রজেক্টে কাজ দেওয়া হবে না। যদি কেউ প্রশিক্ষণ ছাড়া প্রজেক্টে কাজ জমা দেয়, তবে অসম্পূর্ণ বা ভুল তথ্যের কারণে তা <strong>সরাসরি স্বয়ংক্রিয়ভাবে রিজেক্ট (Rejected)</strong> হয়ে যাবে।
              </p>

              <p className="text-slate-700">
                ✅ <strong>সফলতার উপায়:</strong> প্রতিটি কোর্সের জন্য আলাদা অভিজ্ঞ মেন্টর নিয়োজিত রয়েছেন। কাজ জমা দেওয়ার পূর্বে মেন্টরদের দেওয়া ভিডিও গাইডলাইন ও নিয়মাবলী ভালো করে দেখে নিন এবং শতভাগ নির্ভুলভাবে কাজ সম্পন্ন করুন।
              </p>
            </div>
          </div>

          {/* Detailed Terms Accordion / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileCheck size={16} />
                </div>
                <span>১. ডেটা এন্ট্রি প্রজেক্ট নিয়মাবলী</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                প্রতিটি ডেটা এন্ট্রি প্রজেক্টে বাস্তব এক্সেল ফরম্যাট ও ফর্মুলা ব্যবহার করে সমাধান করতে হবে। কোনো ভুয়া বা ফাঁকা ফাইল জমা দিলে সাথে সাথে রিজেক্ট হবে।
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building size={16} />
                </div>
                <span>২. ফর্ম ফিলাপ ও ক্লায়েন্ট পলিসি</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ফর্ম ফিলাপের কাজে ৬০ থেকে ৭০ জন ক্লায়েন্টের মাস্টার তালিকা থেকে সঠিক ক্লায়েন্টের নাম ও ডেটা এনে হুবহু প্রতিটি ফিল্ডে বসাতে হবে। বানান বা নম্বরে ভুল থাকলে কাজ অসম্পূর্ণ গণ্য হবে।
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Award size={16} />
                </div>
                <span>৩. টাইপিং ও অ্যান্টি-এআই প্রোটোকল</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                টাইপিংয়ে কোনো প্রকার এআই ব্যবহার করা কঠোরভাবে নিষিদ্ধ। টাইপ করার সময় ক্যামেরা অন করে লাইভ ভিডিও রেকর্ড অথবা মোবাইল দিয়ে টাইপিংয়ের ভিডিও প্রমাণ সাবমিট করা বাধ্যতামূলক।
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <span>৪. মেন্টর সাপোর্ট ও দিকনির্দেশনা</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                কোনো কাজে সমস্যা হলে মেন্টরদের সহায়তা নেওয়ার সুযোগ রয়েছে। মেন্টরদের পরামর্শ অনুযায়ী দক্ষতা বৃদ্ধি করলে পরবর্তীতে বড় বড় করপোরেট প্রজেক্টের কাজ অগ্রাধিকার ভিত্তিতে প্রদান করা হবে।
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Mentors List (Fully professional, stacked vertical format, English text) */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide px-1">
            System Administration & Course Instructors
          </div>

          {/* Stacked Vertical Mentors List */}
          <div className="space-y-3.5">
            {MENTORS_LIST.map((mentor) => (
              <div
                key={mentor.id}
                className={`rounded-3xl p-5 border transition-all flex flex-col sm:flex-row gap-4 items-start relative ${
                  mentor.isSystemAdmin
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-900 shadow-md shadow-slate-900/10'
                    : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* System Admin Label Ribbon */}
                {mentor.isSystemAdmin && (
                  <span className="absolute top-4 right-4 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-500 text-white flex items-center gap-1 shadow-2xs">
                    <ShieldAlert size={10} />
                    <span>SYSTEM HEAD</span>
                  </span>
                )}

                {/* Left Side: Avatar */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${mentor.avatarColor} text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md border-2 border-white/20 shrink-0`}>
                  {mentor.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
                </div>

                {/* Right Side: Mentor Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className={`font-black text-sm sm:text-base tracking-tight ${mentor.isSystemAdmin ? 'text-white' : 'text-slate-900'}`}>
                        {mentor.name}
                      </h3>
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                      
                      {!mentor.isSystemAdmin && (
                        <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md text-amber-700 font-bold text-[10px] shrink-0">
                          <Star size={9} className="fill-amber-400 text-amber-400" />
                          <span>5.0</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-[11px] font-bold ${mentor.isSystemAdmin ? 'text-orange-400' : 'text-indigo-600'}`}>
                      {mentor.role}
                    </p>
                  </div>

                  {/* Operational Details */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] p-2.5 rounded-2xl border ${
                    mentor.isSystemAdmin
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-1.5 min-w-0 font-medium">
                      <Clock size={12} className="text-orange-400 shrink-0" />
                      <span className="truncate">{mentor.workingHours}</span>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0 font-semibold">
                      <UserCheck size={12} className="text-emerald-500 shrink-0" />
                      <span className="truncate">{mentor.assignedCourse}</span>
                    </div>
                  </div>

                  {/* Expertise Pills */}
                  <div className="space-y-1">
                    <div className={`text-[9px] uppercase font-bold ${mentor.isSystemAdmin ? 'text-slate-400' : 'text-slate-400'}`}>
                      Key Core Expertise:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((exp, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-lg border ${
                            mentor.isSystemAdmin
                              ? 'bg-slate-800 text-slate-200 border-slate-700'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Mail size={11} className="shrink-0" />
                    <span>{mentor.email}</span>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
