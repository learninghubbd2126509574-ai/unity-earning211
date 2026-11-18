import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldCheck, 
  CheckSquare, 
  Mic, 
  Upload, 
  User, 
  Home, 
  Briefcase, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  Users, 
  Award, 
  ChevronRight, 
  Volume2,
  Trash2,
  Play,
  Pause,
  ExternalLink,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModeratorJobRole {
  id: string;
  title: string;
  bengaliTitle: string;
  department: string;
  salary: string;
  vacancy: number;
  description: string;
  responsibilities: string[];
}

export const MODERATOR_ROLES: ModeratorJobRole[] = [
  {
    id: 'role_community',
    title: 'Social Media & Community Comments Moderator',
    bengaliTitle: '১. ফেসবুক গ্রুপ ও সোশ্যাল মিডিয়া মডারেটর',
    department: 'Community Safety & Engagement',
    salary: '৳১৮,৫০০ / মাস',
    vacancy: 4,
    description: 'ফেসবুক গ্রুপ, পেজ ও সোশ্যাল মিডিয়ায় আসা ইউজার কমেন্ট ও পোস্ট মনিটরিং করা এবং স্প্যামিং ও নিয়মবহির্ভূত পোস্ট অপসারণ করা।',
    responsibilities: ['অপ্রাসঙ্গিক ও ক্ষতিকর কমেন্ট দ্রুত রিমুভ করা', 'গ্রুপ মেম্বারদের প্রশ্নের মার্জিত উত্তর দেওয়া', 'দৈনিক কমিউনিটি হেলথ রিপোর্ট তৈরি']
  },
  {
    id: 'role_video',
    title: 'Video & Media Content Inspector',
    bengaliTitle: '২. ভিডিও ও মিডিয়া কনটেন্ট ইন্সপেক্টর',
    department: 'Quality Assurance & Media Review',
    salary: '৳২২,০০০ / মাস',
    vacancy: 3,
    description: 'প্ল্যাটফর্মে আপলোড হওয়া সকল প্রোডাক্ট রিভিউ ভিডিও, স্ক্রিন রেকর্ডিং প্রমাণ এবং ফটো সাবমিশন যাচাই ও পলিসি অডিট করা।',
    responsibilities: ['ভিডিও অডিও কোয়ালিটি এবং আসল কাজের প্রমাণ অডিট করা', 'নকল বা ডুপ্লিকেট সাবমিশন সনাক্ত করা', 'কনটেন্ট ক্লিপিং ও রেটিং অনুমোদন']
  },
  {
    id: 'role_chat',
    title: '24/7 Live Support & Chat Officer',
    bengaliTitle: '৩. লাইভ চ্যাট ও স্টুডেন্ট সাপোর্ট অফিসার',
    department: 'Helpdesk & Member Operations',
    salary: '৳২০,০০০ / মাস',
    vacancy: 5,
    description: 'লাইভ চ্যাট ও হেল্পডেস্কে শিক্ষার্থীদের বিভিন্ন সমস্যার সমাধান, গাইডলাইন ও দিকনির্দেশনা প্রদান করা।',
    responsibilities: ['মেম্বারদের চ্যাট মেসেজের দ্রুত রেসপন্স দেওয়া', 'উইথড্রয়াল ও টাস্ক সম্পর্কিত টেকনিক্যাল সহায়তা দেওয়া', 'পজিটিভ কমিউনিকেশন বজায় রাখা']
  },
  {
    id: 'role_shop',
    title: 'Marketplace Catalog & Quality Auditor',
    bengaliTitle: '৪. প্রোডাক্ট লিস্টিং ও শপ কোয়ালিটি অডিটর',
    department: 'E-Commerce Marketplace',
    salary: '৳১৯,৫০০ / মাস',
    vacancy: 3,
    description: 'ইউনিটি আর্নিং শপের ৫০+ প্রোডাক্টের তথ্য, ছবি, স্টক ও কাস্টমার রিভিউ নিরীক্ষণ করা এবং অ্যাফিলিয়েট সেলস জেনুইন কিনা তা যাচাই করা।',
    responsibilities: ['প্রোডাক্টের বিবরণ ও ছবি যাচাই করা', 'অ্যাফিলিয়েট সেলস প্রমাণের নির্ভুলতা অডিট করা', 'রিটার্ন ও রিপ্লেসমেন্ট রিকোয়েস্ট প্রসেস করা']
  },
  {
    id: 'role_compliance',
    title: 'Policy Compliance & Risk Investigator',
    bengaliTitle: '৫. পলিসি কমপ্লায়েন্স ও রিস্ক ইনভেস্টিগেটর',
    department: 'Legal & Enterprise Policy',
    salary: '৳২৫,০০০ / মাস',
    vacancy: 2,
    description: 'একই আইডি দিয়ে একাধিক রেজিস্ট্রেশন বা ভুয়া সাবমিশনের মতো সন্দেহজনক কার্যক্রম শনাক্ত করে অ্যাকাউন্ট ব্লক ও নিরাপত্তা নিশ্চিত করা।',
    responsibilities: ['ডাবল আইডি ও ব্লক ভায়োলেশন নিরীক্ষণ', 'নিরাপত্তা অ্যালগরিদম ট্র্যাক করা', 'এইচআর ও ম্যানেজমেন্টের কাছে রিপোর্ট পাঠানো']
  }
];

export const ContentModerationWork: React.FC = () => {
  const { user, profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<ModeratorJobRole>(MODERATOR_ROLES[0]);
  const [userApplications, setUserApplications] = useState<any[]>([]);

  // Form State
  const [applicantName, setApplicantName] = useState(profile?.fullName || '');
  const [applicantAddress, setApplicantAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [experienceYears, setExperienceYears] = useState('1');
  const [fatherName, setFatherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [education, setEducation] = useState('HSC / আলিম');
  const [availableHours, setAvailableHours] = useState('6 Hours (শিফট)');
  const [socialLink, setSocialLink] = useState('');
  const [phone, setPhone] = useState(profile?.whatsappNumber || '');

  // Files
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [voiceFileName, setVoiceFileName] = useState('');
  const [voiceDataUrl, setVoiceDataUrl] = useState('');
  const [voiceLink, setVoiceLink] = useState('');
  
  const [passportPhotoName, setPassportPhotoName] = useState('');
  const [passportPhotoDataUrl, setPassportPhotoDataUrl] = useState('');

  const [nidPhotoName, setNidPhotoName] = useState('');
  const [nidPhotoDataUrl, setNidPhotoDataUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Audio Recording (Simulated in-browser recording state)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Real-time listener for current user's submitted moderator applications
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'moderatorApplications'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUserApplications(apps);
    }, (err) => console.warn(err));
    return () => unsub();
  }, [user]);

  // Voice recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setVoiceFileName(`Recorded_VoiceOver_${Date.now()}.wav`);
    setVoiceDataUrl('data:audio/wav;base64,recorded_sample_voiceover');
  };

  const handleVoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setFormError('ভয়েস ওভার অডিও ফাইল ১৫ মেগাবাইট বা তার কম হতে হবে।');
        return;
      }
      setVoiceFile(file);
      setVoiceFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoiceDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePassportPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassportPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNidPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNidPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNidPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!applicantName.trim() || !applicantAddress.trim() || !district.trim()) {
      setFormError('অনুগ্রহ করে আপনার পুরো নাম, বর্তমান বাসার ঠিকানা ও জেলা উল্লেখ করুন।');
      return;
    }
    if (!fatherName.trim() || !motherName.trim()) {
      setFormError('পিতা ও মাতার বিবরণ পূরণ করা আবশ্যক।');
      return;
    }
    if (!nidNumber.trim()) {
      setFormError('আপনার জাতীয় পরিচয়পত্র (এনআইডি) নম্বর লিখুন।');
      return;
    }
    if (!voiceDataUrl && !voiceLink.trim()) {
      setFormError('একটি ভয়েস ওভার অডিও রেকর্ড অথবা ফাইল/ড্রাইভ লিংক সাবমিট করা বাধ্যতামূলক।');
      return;
    }
    if (!passportPhotoDataUrl) {
      setFormError('আপনার পাসপোর্ট সাইজের ছবি আপলোড করুন।');
      return;
    }

    if (!user?.uid) {
      setFormError('আবেদন জমা দিতে অনুগ্রহ করে প্রথমে লগইন করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'moderatorApplications'), {
        userId: user.uid,
        studentIdCode: profile?.studentIdCode || 'N/A',
        roleId: selectedRole.id,
        roleTitle: selectedRole.title,
        roleBengaliTitle: selectedRole.bengaliTitle,
        applicantName: applicantName.trim(),
        phone: phone.trim(),
        homeAddress: applicantAddress.trim(),
        district: district.trim(),
        experienceYears: experienceYears + ' Years',
        fatherName: fatherName.trim(),
        fatherOccupation: fatherOccupation.trim() || 'Business/Service',
        motherName: motherName.trim(),
        motherOccupation: motherOccupation.trim() || 'Homemaker',
        nidNumber: nidNumber.trim(),
        education,
        availableHours,
        socialLink: socialLink.trim() || 'N/A',
        voiceOverName: voiceFileName || 'Audio Voice Over Attached',
        voiceOverData: voiceDataUrl ? 'Audio Data Stored' : voiceLink.trim(),
        passportPhotoUrl: passportPhotoDataUrl || 'Photo Attached',
        nidPhotoUrl: nidPhotoDataUrl || 'NID Attached',
        status: 'pending',
        appliedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      setSubmittedSuccess(true);
    } catch (err: any) {
      console.error(err);
      setFormError('আবেদন জমা দিতে সমস্যা হয়েছে: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-4 pb-24 font-sans text-[#1E2329]">
      
      {/* HERO HEADER */}
      <div className="bg-[#0A4D8C] rounded-xl p-5 sm:p-6 text-white space-y-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#D4E4F7] flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span>Official Moderator Career Portal</span>
          </p>
          
          <h1 className="text-lg sm:text-2xl font-semibold tracking-tight leading-snug text-white">
            Content Moderator Career Application (5 Open Positions)
          </h1>
          
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
            ইউনিটি আর্নিং প্ল্যাটফর্মে ফুল-টাইম ও পার্ট-টাইম মডারেটর হিসেবে দায়িত্ব পালনের জন্য ৫টি পদে সরাসরি আবেদন চলছে। আপনার পূর্ণাঙ্গ তথ্য, মা-বাবার বিবরণ, এনআইডি, ছবি ও ভয়েস ওভার সাবমিট করে আবেদন সম্পন্ন করুন।
          </p>
        </div>

        {/* Existing Application Banner */}
        {userApplications.length > 0 && (
          <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2 text-xs flex-wrap">
            <span className="text-white font-medium flex items-center gap-1.5 tabular-nums">
              <CheckCircle2 size={14} /> You have applied for {userApplications.length} position(s)
            </span>
            <span className="text-blue-100 text-xs font-mono">
              Status: Under HR Review
            </span>
          </div>
        )}
      </div>

      {/* SUCCESS CONFIRMATION SCREEN */}
      {submittedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 text-center space-y-4"
        >
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-[#0D7A5F] rounded-xl flex items-center justify-center mx-auto">
            <CheckCircle2 size={26} />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1E2329] tracking-tight">
              আপনার মডারেটর আবেদন সফলভাবে সম্পন্ন হয়েছে
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              আপনি <strong className="font-semibold text-[#0A4D8C]">{selectedRole.title}</strong> পদের জন্য সফলভাবে আবেদন করেছেন। আমাদের এইচআর বোর্ড আপনার এনআইডি, ছবি, মা-বাবার তথ্য ও ভয়েস ওভার যাচাই করছে।
            </p>
            <div className="bg-[#EEF5FC] text-[#1E2329] border border-[#D4E4F7] p-3.5 rounded-xl text-xs font-medium">
              আপনার আবেদনটি অ্যাপ্রুভ হলে অফিশিয়াল ফোন কল বা হোয়াটসঅ্যাপের মাধ্যমে সরাসরি আপনার সাথে যোগাযোগ করা হবে।
            </div>
          </div>

          <div className="p-4 bg-[#F4F5F7] rounded-xl border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto text-slate-700">
            <div><span className="font-semibold text-[#1E2329]">আবেদনকারী:</span> {applicantName}</div>
            <div><span className="font-semibold text-[#1E2329]">পদবী:</span> {selectedRole.bengaliTitle}</div>
            <div><span className="font-semibold text-[#1E2329]">অভিজ্ঞতা:</span> {experienceYears} বছর</div>
            <div><span className="font-semibold text-[#1E2329]">ভয়েস ওভার:</span> সংযুক্ত ও অডিট তালিকায় জমা</div>
            <div><span className="font-semibold text-[#1E2329]">বর্তমান স্ট্যাটাস:</span> <span className="font-semibold text-[#B47B00]">Pending HR Approval</span></div>
          </div>

          <button
            onClick={() => setSubmittedSuccess(false)}
            className="bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition cursor-pointer whitespace-nowrap"
          >
            অন্য পদের বিবরণ দেখুন
          </button>
        </motion.div>
      )}

      {!submittedSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* LEFT COLUMN: 5 AVAILABLE ROLES SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h3 className="text-xs font-semibold text-[#1E2329] flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#0A4D8C]" />
                <span>মডারেটরের ৫টি পদ নির্বাচন করুন</span>
              </h3>
              <span className="text-xs text-slate-500">মোট ৫টি কাজ</span>
            </div>

            <div className="space-y-2">
              {MODERATOR_ROLES.map((role) => {
                const isSelected = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors flex flex-col justify-between space-y-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A4D8C] text-white border-[#0A4D8C]'
                        : 'bg-white text-[#1E2329] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold leading-snug">
                        {role.bengaliTitle}
                      </h4>
                      {isSelected ? (
                        <span className="text-[11px] font-semibold text-blue-100 shrink-0">
                          নির্বাচিত
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#0D7A5F] font-semibold font-mono tabular-nums shrink-0">
                          {role.salary}
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-blue-100/90' : 'text-slate-600'}`}>
                      {role.description}
                    </p>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className={isSelected ? 'text-blue-100' : 'text-slate-500'}>
                        {role.department}
                      </span>
                      <span className={isSelected ? 'text-white font-medium' : 'text-[#0A4D8C] font-medium'}>
                        {role.vacancy}টি পদ খালি
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Overview Box */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 text-xs space-y-2.5">
              <div className="font-semibold text-[#1E2329] flex items-center gap-1.5">
                <Award size={15} className="text-[#0A4D8C]" />
                <span>নির্বাচিত পদের প্রধান দায়িত্বসমূহ</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                {selectedRole.responsibilities.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#0D7A5F] shrink-0 mt-0.5" />
                    <span className="leading-snug">{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: APPLICATION FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 space-y-5">
              
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-semibold text-[#1E2329]">
                  {selectedRole.bengaliTitle} — আবেদন ফর্ম
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  নিচের সকল ঘর সঠিকভাবে পূরণ করুন। আপনার দেওয়া সকল তথ্য যাচাইয়ের জন্য সংরক্ষিত হবে।
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-700" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                
                {/* 1. PERSONAL INFORMATION */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#0A4D8C] flex items-center gap-1.5">
                    <User size={14} />
                    <span>১. ব্যক্তিগত তথ্য ও বর্তমান ঠিকানা</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        আপনার পুরো নাম (Full Legal Name) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="আপনার নাম"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        মোবাইল / হোয়াটসঅ্যাপ নম্বর <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-mono tabular-nums text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        বর্তমান বাসার ঠিকানা (Home Address) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantAddress}
                        onChange={(e) => setApplicantAddress(e.target.value)}
                        placeholder="বাসা নম্বর, রোড, এলাকা"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        জেলা (District) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="যেমন: ঢাকা / চট্টগ্রাম / রাজশাহী"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        মডারেটর হিসেবে কত বছরের অভিজ্ঞতা রয়েছে? <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      >
                        <option value="0">নতুন / কোনো প্রাতিষ্ঠানিক অভিজ্ঞতা নেই</option>
                        <option value="1">১ বছরের অভিজ্ঞতা</option>
                        <option value="2">২ বছরের অভিজ্ঞতা</option>
                        <option value="3+">৩ বছর বা তার বেশি অভিজ্ঞতা</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        জাতীয় পরিচয়পত্র (NID) নম্বর <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={nidNumber}
                        onChange={(e) => setNidNumber(e.target.value)}
                        placeholder="১০ বা ১৭ ডিজিটের এনআইডি নম্বর"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-mono tabular-nums text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. PARENTS INFORMATION */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-[#0A4D8C] flex items-center gap-1.5">
                    <Users size={14} />
                    <span>২. মা-বাবার বিবরণ (Parents Information)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        পিতার নাম (Father's Name) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="পিতার নাম লিখুন"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        পিতার পেশা (Occupation)
                      </label>
                      <input
                        type="text"
                        value={fatherOccupation}
                        onChange={(e) => setFatherOccupation(e.target.value)}
                        placeholder="যেমন: ব্যবসা / চাকরি / শিক্ষক"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        মাতার নাম (Mother's Name) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="মাতার নাম লিখুন"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        মাতার পেশা (Occupation)
                      </label>
                      <input
                        type="text"
                        value={motherOccupation}
                        onChange={(e) => setMotherOccupation(e.target.value)}
                        placeholder="গৃহিণী / চাকরি"
                        className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. VOICE OVER SUBMISSION (MANDATORY) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-[#0A4D8C] flex items-center gap-1.5">
                    <Mic size={14} />
                    <span>৩. ভয়েস ওভার সাবমিশন (Voice-Over Audio) <span className="text-rose-600">*</span></span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    মডারেটর হিসেবে আপনার বাচনভঙ্গি ও স্পষ্টতা যাচাই করতে ৩০-৬০ সেকেন্ডের একটি পরিচিতিমূলক ভয়েস রেকর্ড করুন অথবা আপনার রেকর্ড করা অডিও ফাইল আপলোড করুন।
                  </p>

                  <div className="bg-[#F4F5F7] p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isRecording ? 'bg-rose-600 text-white' : 'bg-[#EEF5FC] text-[#0A4D8C]'
                        }`}>
                          <Mic size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#1E2329] tabular-nums">
                            {isRecording ? `ভয়েস রেকর্ডিং চলছে (${recordingSeconds}s)` : voiceFileName ? voiceFileName : 'ব্রাউজারে সরাসরি ভয়েস রেকর্ড করুন'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isRecording ? 'স্পষ্ট উচ্চারণে আপনার নাম ও লক্ষ্য বলুন' : 'বাটনে চাপ দিয়ে রেকর্ড শুরু বা বন্ধ করুন'}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={handleStartRecording}
                            className="flex-1 sm:flex-none bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Mic size={13} /> রেকর্ড শুরু করুন
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleStopRecording}
                            className="flex-1 sm:flex-none bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Check size={13} /> রেকর্ড সংরক্ষণ করুন
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      অথবা কম্পিউটার/ফোন থেকে অডিও ফাইল বেছে নিন:
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="flex-1 bg-white border border-dashed border-slate-300 hover:border-[#0A4D8C] p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-[#1E2329] cursor-pointer transition">
                        <Upload size={14} className="text-[#0A4D8C]" />
                        <span>{voiceFileName ? `নির্বাচিত: ${voiceFileName}` : 'অডিও ফাইল আপলোড (MP3/WAV/M4A)'}</span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleVoiceFileUpload}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="url"
                        value={voiceLink}
                        onChange={(e) => setVoiceLink(e.target.value)}
                        placeholder="অথবা গুগল ড্রাইভ অডিও লিংক দিন"
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-[#1E2329] focus:outline-none focus:border-[#0A4D8C]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. DOCUMENTS & PHOTO UPLOAD */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-[#0A4D8C] flex items-center gap-1.5">
                    <ImageIcon size={14} />
                    <span>৪. পাসপোর্ট সাইজের ছবি ও এনআইডি আপলোড</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        নিজের পাসপোর্ট সাইজের ছবি <span className="text-rose-600">*</span>
                      </label>
                      <label className="w-full bg-[#F4F5F7] border border-dashed border-slate-300 hover:border-[#0A4D8C] p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-[#1E2329] cursor-pointer transition">
                        <Upload size={14} className="text-[#0A4D8C]" />
                        <span className="truncate">{passportPhotoName ? `ছবি: ${passportPhotoName}` : 'পাসপোর্ট ছবি আপলোড করুন'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePassportPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1E2329] mb-1">
                        এনআইডি কার্ডের ছবি (সামনের অংশ)
                      </label>
                      <label className="w-full bg-[#F4F5F7] border border-dashed border-slate-300 hover:border-[#0A4D8C] p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-[#1E2329] cursor-pointer transition">
                        <Upload size={14} className="text-[#0A4D8C]" />
                        <span className="truncate">{nidPhotoName ? `এনআইডি: ${nidPhotoName}` : 'এনআইডি ছবি আপলোড করুন'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNidPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 5. WORK PREFERENCES & SOCIAL PROFILE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-medium text-[#1E2329] mb-1">
                      দৈনিক কত ঘণ্টা সময় দিতে পারবেন?
                    </label>
                    <select
                      value={availableHours}
                      onChange={(e) => setAvailableHours(e.target.value)}
                      className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                    >
                      <option value="4 Hours (পার্ট-টাইম)">৪ ঘণ্টা (পার্ট-টাইম)</option>
                      <option value="6 Hours (শিফট)">৬ ঘণ্টা (শিফট)</option>
                      <option value="8 Hours (ফুল-টাইম)">৮ ঘণ্টা (ফুল-টাইম)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1E2329] mb-1">
                      ফেসবুক প্রোফাইল লিংক (ঐচ্ছিক)
                    </label>
                    <input
                      type="url"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      placeholder="https://facebook.com/yourprofile"
                      className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 px-4 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    <CheckSquare size={16} />
                    <span>{isSubmitting ? 'আবেদন সাবমিট হচ্ছে...' : `${selectedRole.bengaliTitle} পদে আবেদন সম্পন্ন করুন`}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
