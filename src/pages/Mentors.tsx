import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  HelpCircle,
  FileCheck,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { WORK_MODULES } from '../lib/modules';

interface Mentor {
  id: string;
  name: string;
  role: string;
  assignedCourses: string[];
  courseNames: string[];
  rating: number;
  studentsTrained: number;
  experience: string;
  expertise: string[];
  bio: string;
  badge: string;
  avatarColor: string;
  consultationAvailable: boolean;
}

const MENTORS_LIST: Mentor[] = [
  {
    id: 'm_rahman',
    name: 'রহমান শেখ (Rahman Sheikh)',
    role: 'Senior Data Architect & Project Lead',
    assignedCourses: ['data', 'form'],
    courseNames: ['Data Entry Project System', 'Form Fillup Work'],
    rating: 5.0,
    studentsTrained: 1850,
    experience: '৮+ বছরের প্রফেশনাল এক্সেল ও বিগ ডেটা অ্যানালিটিক্স অভিজ্ঞতা',
    expertise: ['Excel Master Formulas', 'Data Cleaning', 'Pivot Dashboards', 'Error Auditing'],
    bio: 'আন্তর্জাতিক ফ্রিল্যান্সিং মার্কেটপ্লেসের টপ রেটেড ডেটা স্পেশালিস্ট। ৫,০০০+ রো বিশিষ্ট জটিল স্প্রেডশিট ক্লিনিক ও ডেটা এন্ট্রি ভেরিফিকেশনে বিশেষ পারদর্শী।',
    badge: 'Master Mentor',
    avatarColor: 'from-blue-600 to-indigo-700',
    consultationAvailable: true
  },
  {
    id: 'm_alamin',
    name: 'মোহাম্মদ আল-আমিন হোসাইন (Md. Al-Amin Hossain)',
    role: 'Lead Transcription & Speed Auditor',
    assignedCourses: ['typing', 'content_writing'],
    courseNames: ['Typing Work', 'Content Writing Work'],
    rating: 5.0,
    studentsTrained: 2100,
    experience: '৭+ বছরের লিগ্যাল ও মেডিকেল ট্রান্সক্রিপশন ট্রেইনার (১২০ WPM স্পিড)',
    expertise: ['English/Bangla Typing', 'Zero-Error Keystroke', 'Anti-AI Verification', 'Proofreading'],
    bio: 'বাস্তবধর্মী টাইপিং ও স্পিড অডিটিং ট্রেইনার। লাইভ ভিডিও ভেরিফিকেশন ও এআই-মুক্ত হ্যান্ড-টাইপিং প্রসেসের প্রধান সমন্বয়কারী।',
    badge: 'Senior Instructor',
    avatarColor: 'from-cyan-600 to-blue-700',
    consultationAvailable: true
  },
  {
    id: 'm_tanveer',
    name: 'তানভীর আহমেদ চৌধুরী (Tanveer Ahmed Chowdhury)',
    role: 'Executive Form Processing & Lead Verifier',
    assignedCourses: ['form', 'data'],
    courseNames: ['Form Fillup Work', 'Data Entry Project System'],
    rating: 5.0,
    studentsTrained: 1420,
    experience: '৬+ বছরের কেওয়াইসি (KYC) ও করপোরেট ক্লায়েন্ট ডেটাবেজ ম্যানেজমেন্ট',
    expertise: ['Multi-field Form Verification', 'Client Roster Matching', 'TIN/NID Validation', 'Accuracy Control'],
    bio: '৭০+ ফিল্ডের বড় আকারের করপোরেট ফর্ম ফিলাপ ও ডেটাবেজ ক্রস-ম্যাচিংয়ের প্রধান মেন্টর। শতভাগ সঠিক ডাটা ফিল্টারিংয়ে দক্ষ।',
    badge: 'Verification Lead',
    avatarColor: 'from-emerald-600 to-teal-700',
    consultationAvailable: true
  },
  {
    id: 'm_farhana',
    name: 'ফারহানা ইয়াসমিন (Farhana Yasmin)',
    role: 'Clinical & Research Data Specialist',
    assignedCourses: ['typing', 'form'],
    courseNames: ['Typing Work', 'Form Fillup Work'],
    rating: 5.0,
    studentsTrained: 980,
    experience: '৫+ বছরের ক্লিনিক্যাল ও রিসার্চ ল্যাবরেটরি ডকুমেন্টেশন স্পেশালিস্ট',
    expertise: ['Biochemical Records', 'Standard Punctuation', 'Compliance Auditing', 'Student Support'],
    bio: 'কঠিন ও জটিল বৈজ্ঞানিক সংকেত, লিগ্যাল ধারা এবং মেডিকেল টার্ম সম্বলিত ডেটা এন্ট্রির নির্ভরযোগ্য ট্রেইনার।',
    badge: 'Quality Specialist',
    avatarColor: 'from-purple-600 to-indigo-700',
    consultationAvailable: true
  },
  {
    id: 'm_saiful',
    name: 'মো: সাইফুল ইসলাম (Md. Saiful Islam)',
    role: 'E-Commerce Operations & Inventory Lead',
    assignedCourses: ['dropshipping', 'shop'],
    courseNames: ['Dropshipping Business', 'Product Selling & Affiliate'],
    rating: 5.0,
    studentsTrained: 1650,
    experience: '৭+ বছরের ই-কমার্স স্টোর ম্যানেজমেন্ট ও সাপ্লাই চেইন লিড',
    expertise: ['Inventory Sync', 'Supplier Reconciliation', 'Order Fulfillment', 'Profit Optimization'],
    bio: '৮,০০০+ অর্ডার বিশিষ্ট মাল্টি-সাপ্লায়ার ইনভেন্টরি ও প্রোডাক্ট ক্যাটালগ প্রসেসিংয়ের অভিজ্ঞ পরামর্শক।',
    badge: 'E-Com Specialist',
    avatarColor: 'from-amber-600 to-orange-700',
    consultationAvailable: true
  },
  {
    id: 'm_shakil',
    name: 'ইঞ্জিনিয়ার শাকিল মাহমুদ (Engr. Shakil Mahmud)',
    role: 'Freelancing Coach & Digital Task Mentor',
    assignedCourses: ['micro', 'ad_viewing', 'website_visit'],
    courseNames: ['Micro Job Work', 'Sponsored Ad Viewing', 'Website Visit & Earn'],
    rating: 5.0,
    studentsTrained: 2400,
    experience: '৬+ বছরের ডিজিটাল টাস্ক, ক্যাম্পেইন অপটিমাইজেশন ও ফ্রিল্যান্সিং ট্রেইনার',
    expertise: ['Micro Task Execution', 'Account Security', 'Quality Ratings', 'Student Career Guide'],
    bio: 'অনলাইন মাইক্রো টাস্কিং এবং ডিজিটাল ক্যাম্পেইন এনগেজমেন্টের অভিজ্ঞ মেন্টর। নতুন স্টুডেন্টদের কাজ শিখিয়ে প্রজেক্টে দক্ষ করে তোলেন।',
    badge: 'Senior Coach',
    avatarColor: 'from-rose-600 to-pink-700',
    consultationAvailable: true
  },
  {
    id: 'm_nushrat',
    name: 'নুশরাত জাহান রিমি (Nushrat Jahan Rimi)',
    role: 'Content Strategy & Social Media Lead',
    assignedCourses: ['video', 'social_marketing', 'content_writing'],
    courseNames: ['Video Submit Work', 'Social Media Marketing', 'Content Writing Work'],
    rating: 5.0,
    studentsTrained: 1150,
    experience: '৫+ বছরের ডিজিটাল আউটরিচ, ব্র্যান্ড প্রমোশন ও কন্টেন্ট অডিটর',
    expertise: ['Video Proof Verification', 'Social Distribution', 'Campaign Metrics', 'Content Review'],
    bio: 'ভিডিও কন্টেন্ট যাচাইকরণ ও সোশ্যাল মিডিয়া মার্কেটিং সাবমিশনের প্রধান পর্যালোচক। শিক্ষার্থীদের ক্রিয়েটিভ কাজে দিকনির্দেশনা প্রদান করেন।',
    badge: 'Media Director',
    avatarColor: 'from-fuchsia-600 to-violet-700',
    consultationAvailable: true
  },
  {
    id: 'm_mostafiz',
    name: 'মোস্তাফিজুর রহমান (Mostafizur Rahman)',
    role: 'Financial Modeling & AML Specialist',
    assignedCourses: ['data', 'gaming'],
    courseNames: ['Financial Transaction Data Processing', 'Gaming Tournament'],
    rating: 5.0,
    studentsTrained: 890,
    experience: '৮+ বছরের ব্যাংক অডিট, ১৫,০০০+ ট্রানজেকশন স্ক্রিনিং ও এএমএল ডেটা স্পেশালিস্ট',
    expertise: ['15,000+ Records Audit', 'Duplicate Detection', 'TDS Reconciliation', 'Branch Analytics'],
    bio: 'উচ্চ-ভলিউমের ফিন্যান্সিয়াল লেজার ও ট্রানজেকশন ডেটা প্রসেসিংয়ের সিনিয়র প্রশিক্ষক।',
    badge: 'Finance Mentor',
    avatarColor: 'from-emerald-700 to-slate-900',
    consultationAvailable: true
  },
  {
    id: 'm_ariful',
    name: 'আরিফুল ইসলাম চৌধুরী (Ariful Islam Chowdhury)',
    role: 'B2B Lead Generation & Social Media Strategist',
    assignedCourses: ['social_marketing', 'moderation'],
    courseNames: ['Social Media Marketing (Lead Gen)', 'Content Moderation Work'],
    rating: 5.0,
    studentsTrained: 1320,
    experience: '৬+ বছরের লিংকডইন, ফেসবুক বিটুবি লিড জেনারেশন ও ক্লায়েন্ট কনভার্সন স্পেশালিস্ট',
    expertise: ['B2B Lead Mining', 'Targeted Prospecting', 'Ad Campaign Setup', 'Client Followup'],
    bio: 'আন্তর্জাতিক ব্র্যান্ডের জন্য ভেরিফাইড বিজনেস লিড জেনারেশন ও সোশ্যাল মিডিয়া আউটরিচ ট্রেইনার। টিমের সাথে সংযোগ স্থাপন করে সরাসরি লাইভ প্রজেক্ট শিখিয়ে থাকেন।',
    badge: 'Lead Gen Expert',
    avatarColor: 'from-teal-600 to-emerald-800',
    consultationAvailable: true
  },
  {
    id: 'm_sabrina',
    name: 'সাবরিনা নওশীন (Sabrina Nowshin)',
    role: 'Senior Linguistic & Proofreading Specialist',
    assignedCourses: ['typing', 'content_writing'],
    courseNames: ['Typing Work', 'Content Writing Work'],
    rating: 5.0,
    studentsTrained: 1100,
    experience: '৫+ বছরের বাংলা ও ইংরেজি লিগ্যাল ডকুমেন্ট প্রুফরিডিং এবং স্পেল অডিটিং',
    expertise: ['Grammar & Punctuation', 'Context Analysis', 'Anti-AI Quality Check', 'Document Styling'],
    bio: 'স্পেলিং ও লিগ্যাল ড্রাফট অডিটিংয়ের শীর্ষ মেন্টর। টাইপিং ও রাইটিং কাজের সূক্ষ্ম ভুল ত্রুটি যাচাইয়ে পারদর্শী।',
    badge: 'Linguistic Lead',
    avatarColor: 'from-pink-600 to-rose-700',
    consultationAvailable: true
  },
  {
    id: 'm_mahmudul',
    name: 'প্রকৌশলী মাহমুদুল হাসান (Engr. Mahmudul Hasan)',
    role: 'Spreadsheet Automation & QC Auditor',
    assignedCourses: ['data', 'form'],
    courseNames: ['Data Entry Project System', 'Form Fillup Work'],
    rating: 5.0,
    studentsTrained: 1750,
    experience: '৭+ বছরের করপোরেট স্প্রেডশিট আর্কিটেকচার ও ডেটা ভ্যালিডেশন ট্রেইনার',
    expertise: ['Excel Formulas (VLOOKUP/XLOOKUP)', 'Conditional Formatting', 'Data Cleansing', 'Automated QA'],
    bio: 'বড় আকারের প্রাতিষ্ঠানিক স্প্রেডশিট ডিজাইন ও কোয়ালিটি কন্ট্রোল বিশেষজ্ঞ। ডেটা এন্ট্রি প্রজেক্টের কঠিন কাজগুলো শিখিয়ে থাকেন।',
    badge: 'QA Architect',
    avatarColor: 'from-indigo-600 to-blue-900',
    consultationAvailable: true
  },
  {
    id: 'm_mehzabin',
    name: 'মেহজাবিন আক্তার (Mehzabin Akter)',
    role: 'E-Commerce Merchant & Dropshipping Consultant',
    assignedCourses: ['dropshipping', 'shop'],
    courseNames: ['Dropshipping Business', 'Product Selling & Affiliate'],
    rating: 5.0,
    studentsTrained: 920,
    experience: '৫+ বছরের গ্লোবাল ড্রপশিপিং ক্যাটালগ ও সাপ্লায়ার রিকনসিলিয়েশন ট্রেইনার',
    expertise: ['Catalog Mapping', 'Profit Margin Analysis', 'Multi-channel Sales', 'Order Tracking'],
    bio: 'ড্রপশিপিং ও অনলাইন শপ প্রজেক্টের নিবেদিতপ্রাণ মেন্টর। স্টুডেন্টদের স্টোর ম্যানেজমেন্টের জটিল কাজ সহজে শিখিয়ে দেন।',
    badge: 'E-Com Consultant',
    avatarColor: 'from-amber-500 to-red-600',
    consultationAvailable: true
  }
];

export const Mentors = () => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'mentors' | 'guidelines'>('mentors');

  const filteredMentors = selectedCourseFilter === 'all'
    ? MENTORS_LIST
    : MENTORS_LIST.filter(m => m.assignedCourses.includes(selectedCourseFilter));

  return (
    <div className="p-4 py-5 space-y-4 max-w-4xl mx-auto pb-28">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
              <GraduationCap size={12} />
              <span>Unity E-Learning & Earning Platform</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              কোর্স মেন্টরস ও অফিসিয়াল গাইডলাইন
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              প্রতিটি কাজের জন্য নির্ধারিত অভিজ্ঞ বাংলাদেশি মেন্টর এবং প্রজেক্টে সফল হওয়ার অফিসিয়াল নিয়মাবলী ও শর্তসমূহ।
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl text-center shrink-0 w-full sm:w-auto shadow-inner">
            <div className="text-[10px] uppercase font-bold text-slate-400">অনুমোদিত মেন্টর সংখ্যা</div>
            <div className="text-xl font-bold font-mono text-orange-400 mt-0.5">১২ জন স্পেশালিস্ট</div>
          </div>
        </div>

        {/* Tab Selector - Mentors List is First */}
        <div className="flex gap-2 mt-4 pt-3.5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'mentors'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-800/90 text-slate-300 hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>কোর্স মেন্টরস তালিকা (Mentors List)</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-800/90 text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>কাজের নিয়ম ও নীতিমালা (Work Rules)</span>
          </button>
        </div>
      </div>

      {/* 1. GUIDELINES & OFFICIAL TERMS */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          
          {/* Main Strict Warning Box */}
          <div className="bg-gradient-to-br from-rose-50 via-red-50/60 to-amber-50 border-2 border-rose-200/90 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-rose-900">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20">
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
                ✅ <strong>সফলতার উপায়:</strong> প্রতিটি কোর্সের জন্য আলাদা অভিজ্ঞ বাংলাদেশি মেন্টর নিয়োজিত রয়েছেন। কাজ জমা দেওয়ার পূর্বে মেন্টরদের দেওয়া ভিডিও গাইডলাইন ও নিয়মাবলী ভালো করে দেখে নিন এবং শতভাগ নির্ভুলভাবে কাজ সম্পন্ন করুন।
              </p>
            </div>
          </div>

          {/* Detailed Terms Accordion / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileCheck size={16} />
                </div>
                <span>১. ডেটা এন্ট্রি প্রজেক্ট নিয়মাবলী</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                প্রতিটি ডেটা এন্ট্রি প্রজেক্টে (যেমন: ৫,০০০+ সেলস রেকর্ড, ৩০০+ কর্মচারীর ৩ মাসের হাজিরা, ২০০০+ প্রোডাক্ট ইত্যাদি) বাস্তব এক্সেল ফরম্যাট ও ফর্মুলা ব্যবহার করে সমাধান করতে হবে। কোনো ভুয়া বা ফাঁকা ফাইল জমা দিলে সাথে সাথে রিজেক্ট হবে।
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building size={16} />
                </div>
                <span>২. ফর্ম ফিলাপ ও ক্লায়েন্ট রোস্টার পলিসি</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ফর্ম ফিলাপের কাজে উপরের ৬০ থেকে ৭০ জন ক্লায়েন্টের মাস্টার তালিকা থেকে সঠিক ক্লায়েন্টের নাম ও ডেটা এনে হুবহু প্রতিটি ফিল্ডে বসাতে হবে। বানান বা নম্বরে ভুল থাকলে কাজ অসম্পূর্ণ গণ্য হবে।
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
                টাইপিংয়ে কোনো প্রকার এআই (ChatGPT, Gemini ইত্যাদি) ব্যবহার করা কঠোরভাবে নিষিদ্ধ। টাইপ করার সময় ক্যামেরা অন করে লাইভ ভিডিও রেকর্ড অথবা মোবাইল দিয়ে টাইপিংয়ের ভিডিও প্রমাণ সাবমিট করা বাধ্যতামূলক।
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

          {/* Call to Action Button */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold">কোর্স মেন্টরদের পরিচিতি ও অভিজ্ঞতা দেখতে চান?</h4>
              <p className="text-xs text-slate-400">সকল কোর্সের দায়িত্বপ্রাপ্ত অভিজ্ঞ মেন্টরদের প্রোফাইল দেখুন।</p>
            </div>
            <button
              onClick={() => setActiveTab('mentors')}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
            >
              মেন্টরস লিস্ট দেখুন →
            </button>
          </div>

        </div>
      )}

      {/* 2. MENTORS DIRECTORY */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          
          {/* Course Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <span className="text-xs font-bold text-slate-600 shrink-0">কোর্স ফিল্টার:</span>
            <button
              onClick={() => setSelectedCourseFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedCourseFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              সকল কোর্স ({MENTORS_LIST.length})
            </button>
            {WORK_MODULES.slice(0, 6).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedCourseFilter(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                  selectedCourseFilter === m.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {m.title}
              </button>
            ))}
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-gradient-to-br from-white via-slate-50/70 to-slate-100/60 rounded-3xl p-5 border border-slate-200/80 shadow-[4px_4px_12px_rgba(203,213,225,0.4),-4px_-4px_12px_rgba(255,255,255,0.95)] hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Mentor Profile Header */}
                  <div className="flex items-start gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mentor.avatarColor} text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white/50 shrink-0`}>
                      {mentor.name.slice(0, 2)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-700 border border-orange-500/20">
                          {mentor.badge}
                        </span>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-amber-700 font-bold text-xs shadow-2xs">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span>5.0</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug flex items-center gap-1">
                        <span>{mentor.name}</span>
                        <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {mentor.role}
                      </p>
                    </div>
                  </div>

                  {/* Experience & Students Count */}
                  <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200/80 mt-3 text-xs flex justify-between items-center text-slate-600 shadow-2xs">
                    <span className="font-semibold text-[11px] truncate max-w-[200px] text-slate-700">
                      🎓 {mentor.experience}
                    </span>
                    <span className="font-bold text-emerald-700 shrink-0 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {mentor.studentsTrained}+ ট্রেইনড
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                    {mentor.bio}
                  </p>

                  {/* Assigned Courses */}
                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">দায়িত্বপ্রাপ্ত কোর্সসমূহ:</div>
                    <div className="flex flex-wrap gap-1">
                      {mentor.courseNames.map((cName, idx) => (
                        <span key={idx} className="bg-blue-50/90 text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-2xs">
                          ✓ {cName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expertise Pills */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {mentor.expertise.map((exp, idx) => (
                      <span key={idx} className="bg-slate-100/90 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200/60">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>ভেরিফাইড কোর্স ট্রেইনার</span>
                  </span>
                  
                  <span className="text-orange-600 font-bold flex items-center gap-1 text-[11px] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/70">
                    <Sparkles size={11} />
                    <span>গাইডলাইন অ্যাক্টিভ</span>
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
