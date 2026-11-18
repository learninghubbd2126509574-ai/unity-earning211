import React, { useState } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  Video, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Clapperboard, 
  Film, 
  RefreshCw,
  Info
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export interface VideoPromptTask {
  id: number;
  title: string;
  category: string;
  difficulty: 'Hard' | 'Complex' | 'Master' | 'Advanced';
  reward: string;
  productType: string;
  durationSec: string;
  storyboardPrompt: string;
  videoSteps: string[];
  mandatorySpecs: string;
}

const VIDEO_PROMPT_10_TASKS: VideoPromptTask[] = [
  {
    id: 1,
    title: '১৫-সেকেন্ড হাই-কনভার্টিং ড্রপশিপিং টিকটক অ্যাড (TikTok Hook Commercial)',
    category: 'E-Commerce Video Ad',
    difficulty: 'Advanced',
    reward: 'BDT 25.00',
    productType: 'Smart Multi-Function Kitchen Gadget',
    durationSec: '১৫ থেকে ২০ সেকেন্ড',
    storyboardPrompt: 'প্রথম ৩ সেকেন্ডে একটি পাওয়ারফুল ভিজ্যুয়াল হুক তৈরি করতে হবে (যেমন: সাধারণ পদ্ধতিতে কাটাকুটির সমস্যা বনাম স্মার্ট গ্যাজেটের চোখের পলকে সমাধান)। দ্রুত গতির ফাস্ট-কাট বি-রোল, অন-স্ক্রিন বোল্ড টেক্সট ক্যাপশন, পপিং সাউন্ড ইফেক্ট এবং শেষে আকর্ষণীয় কল-টু-অ্যাকশন (CTA) যোগ করতে হবে।',
    videoSteps: [
      '০:০০ - ০:০৩ সেকেন্ড: হাই-টেনশন প্রবলেম হুক ও সাউন্ড ড্রপ।',
      '০:০৩ - ০:১২ সেকেন্ড: প্রোডাক্টের ৩টি মূল ফিচারের ফাস্ট-পেসড মোশন ভিডিও ডেমো।',
      '০:১২ - ০:১৫ সেকেন্ড: ডিসকাউন্ট ব্যাজ ও ৫০% ছাড়ের লাউড সিটিএ ব্যানার।'
    ],
    mandatorySpecs: 'রেশিও: ৯:১৬ (Vertical 1080x1920), ফ্রেমরেট: 60 FPS, মিউজিক: ট্রেন্ডিং ড্রপ ট্র‍্যাক।'
  },
  {
    id: 2,
    title: '৩ডি-লাইক স্মার্টওয়াচ ফিচার শোকেস (3D Smartwatch Kinetic Showcase)',
    category: 'Consumer Electronics',
    difficulty: 'Master',
    reward: 'BDT 30.00',
    productType: 'AMOLED Ultra-Slim Smartwatch',
    durationSec: '২০ থেকে ৩০ সেকেন্ড',
    storyboardPrompt: 'স্মার্টওয়াচের প্রতিটি পার্টস শূন্যে ভেসে জোড়া লাগার মতো ৩ডি মোশন বা রোটেটিং ট্রানজিশন ভিডিও বানাতে হবে। হার্টরেট ট্র্যাকিং ও অলওয়েজ-অন ডিসপ্লে অ্যানিমেশন এবং ব্যাকগ্রাউন্ডে টেকনো মেটালিক সিন্থ সাউন্ড ইফেক্ট দেওয়া।',
    videoSteps: [
      'ওয়াচের ৩৬০ ডিগ্রি রোটেটিং বি-রোল ও সিনেমেটিক জুম-ইন।',
      'কাইনেটিক টাইপোগ্রাফি দিয়ে ফিচারের পয়েন্ট হাইলাইট।',
      'স্মুথ স্পিড র‍্যাম্পিং ও সিনেমেটিক গ্লো ট্রানজিশন।'
    ],
    mandatorySpecs: 'কালার গ্রেড: ডার্ক নিওন ইলেকট্রিক ব্লু, সিনেমেটিক বার্স: 2.39:1 অপশনাল।'
  },
  {
    id: 3,
    title: 'অ্যাপারেল সামার ফ্যাশন রিল (Apparel Summer Fashion Transition Reel)',
    category: 'Fashion & Apparel',
    difficulty: 'Complex',
    reward: 'BDT 22.00',
    productType: 'Urban Streetwear Summer Collection',
    durationSec: '১৫ থেকে ২৫ সেকেন্ড',
    storyboardPrompt: 'মডেলের স্ন্যাপ ট্রানজিশন বা জাম্প-কাট ট্রানজিশনে পোশাক পরিবর্তনের আকর্ষণীয় রিল ভিডিও। বিটের তালে তালে কালার গ্রেডিং পরিবর্তন, মোশন ব্লার ট্রানজিশন এবং রোদের গোল্ডেন আওয়ারের প্রাণবন্ত ভাইব তৈরি করা।',
    videoSteps: [
      'মিউজিক বিটের প্রতি ড্রপে ডাইনামিক স্ন্যাপ কাট ট্রানজিশন।',
      'ওয়ার্ম সামার ভাইব্রেন্ট কালার এলইউটি (LUT) কালার গ্রেডিং।',
      'স্লো-মোশন ও ফাস্ট-ফরওয়ার্ডের অল্টারনেটিং স্পিড র‍্যাম্প।'
    ],
    mandatorySpecs: 'রেশিও: ৯:১৬, ক্যামেরা মুভমেন্ট: উইপ প্যান ও ম্যাচ কাট।'
  },
  {
    id: 4,
    title: 'এনার্জি ড্রিংক ফাস্ট-পেসড কমার্শিয়াল (High-Energy Drink Commercial)',
    category: 'Beverage Commercial',
    difficulty: 'Master',
    reward: 'BDT 28.00',
    productType: 'Carbonated Citrus Energy Drink Can',
    durationSec: '১৫ থেকে ২০ সেকেন্ড',
    storyboardPrompt: 'একটি ক্যানের ড্রামাটিক বরফের ওপর আছড়ে পড়ার স্লো-মোশন এবং ক্যান খোলার সাথে সাথে গ্যাস ও লিকুইড স্প্ল্যাশের সাউন্ড সিনক্রোনাইজড ভিডিও। স্ক্রিনে নিওন লাইটেনিং ইফেক্ট ও হাই-এনার্জি সাউন্ড ডিজাইন।',
    videoSteps: [
      'ক্যান খোলার ক্ল্যাসিক ‘পপ-ফিজ’ অডিও ও ওয়াটার স্প্ল্যাশ স্লো-মো।',
      'নিওন গ্রাফিক্স ট্র্যাকিং ও শেক ইফেক্ট।',
      'ব্যাস-বুস্টেড বিটের সাথে ব্র্যান্ড লোগো রিভিল।'
    ],
    mandatorySpecs: 'ফ্রেমরেট: 120 FPS স্লো-মো কম্প্যাটিবল, সাউন্ড: ফুল সাউন্ড ডিজাইন।'
  },
  {
    id: 5,
    title: 'স্কিনকেয়ার বিফোর-আফটার ইউজার স্টাইল ভিডিও (UGC Skincare Reel)',
    category: 'Beauty & Skincare',
    difficulty: 'Hard',
    reward: 'BDT 20.00',
    productType: 'Acne Clearing & Brightening Face Wash',
    durationSec: '২০ থেকে ৩০ সেকেন্ড',
    storyboardPrompt: 'ইউজার-জেনারেটেড কন্টেন্ট (UGC) স্টাইলে অথেনটিক সেলফি ভিডিও। মুখের ত্বকের ডালনেস দূর হয়ে গ্লো আসার স্প্লিট-স্ক্রিন কম্প্যারিজন এবং মুখে ফেসওয়াশ প্রয়োগের স্যাটিসফায়িং ফোমিং টেক্সচার ক্লোজ-আপ।',
    videoSteps: [
      'ইউজিসির মতো স্পন্টেনিয়াস ভয়েসওভার বা টেক্সট-টু-স্পিচ ক্যাপশন।',
      'স্প্লিট স্ক্রিন বিফোর/আফটার স্লাইডার ট্রানজিশন।',
      'ন্যাচারাল সফট লাইটিং ও সফট ব্যাকগ্রাউন্ড লো-ফাই মিউজিক।'
    ],
    mandatorySpecs: 'স্টাইল: রিয়েলিস্টিক ইউজার রিভিউ, ক্যাপশন: বড় বোল্ড সাবটাইটেল।'
  },
  {
    id: 6,
    title: 'গেমিং মেকানিক্যাল কিবোর্ড এএসএমআর (Gaming Keyboard ASMR Video)',
    category: 'Gaming Gear',
    difficulty: 'Complex',
    reward: 'BDT 24.00',
    productType: 'Custom Mechanical RGB Keyboard',
    durationSec: '২০ থেকে ২৫ সেকেন্ড',
    storyboardPrompt: 'অত্যন্ত স্যাটিসফায়িং মেকানিক্যাল কি-সুইচের সাউন্ড ও আরজিবি লাইটিংয়ের সিনেমেটিক ম্যাক্রো ভিডিও। প্রতিটি ক্লিকে কি-ক্যাপের ভেতরের টেকটাইল ফিডব্যাক ও সাউন্ড ওয়েভ ভিজ্যুয়ালাইজ করা।',
    videoSteps: [
      'ক্রিস্টাল ক্লিয়ার হাই-গেইন টাইপিং সাউন্ড রেকর্ডিং।',
      'ম্যাক্রো ফোকাস র্যাক ট্রানজিশন (এক কি থেকে আরেক কি-তে ফোকাস শিফট)।',
      'আরজিবি লাইট ওয়েভ ইফেক্ট ও ডার্ক স্টুডিও ড্রপ শ্যাডো।'
    ],
    mandatorySpecs: 'অডিও: 320kbps স্টেরিও ASMR কোয়ালিটি, লাইটিং: ডার্ক আরজিবি ফ্লেয়ার।'
  },
  {
    id: 7,
    title: 'গোরমেট বার্গার ক্রাফটিং কমার্শিয়াল (Gourmet Burger Food Cinema)',
    category: 'Gourmet Food Cinema',
    difficulty: 'Advanced',
    reward: 'BDT 26.00',
    productType: 'Smash Beef Gourmet Burger with Melted Cheese',
    durationSec: '১৫ থেকে ২০ সেকেন্ড',
    storyboardPrompt: 'ফুড পর্নের মতো অত্যন্ত লোভনীয় স্লো-মোশন কমার্শিয়াল। গরম প্যাটি গ্রিল হওয়ার ধোঁয়া, মেল্টেড চিজ ড্রপিং ও ক্রিস্পি লেটুসের ওপর সস স্প্ল্যাশ সিনেমেটিক কালার গ্রেডিং দিয়ে ফুটিয়ে তোলা।',
    videoSteps: [
      'স্লো-মোশন ফুড এসেম্বলি ট্রানজিশন।',
      'ওয়ার্ম গোল্ডেন কালার গ্রেডিং ও ডিপ স্যাচুরেশন।',
      'ক্রিস্পি ক্রাঞ্চ ও সিজলিং সাউন্ড এফেক্ট।'
    ],
    mandatorySpecs: 'কালার স্পেস: DCI-P3 / Rec.709, মুড: মাউথ-ওয়াটারিং সিনেমেটিক।'
  },
  {
    id: 8,
    title: 'ইলেকট্রিক স্কুটার আরবান কমিউট অ্যাড (Electric Scooter Night Ride)',
    category: 'Electric Mobility',
    difficulty: 'Master',
    reward: 'BDT 28.00',
    productType: 'Dual-Motor Urban Commuter E-Scooter',
    durationSec: '২০ থেকে ৩০ সেকেন্ড',
    storyboardPrompt: 'রাতের শহরের নিয়ন লাইটের মধ্য দিয়ে স্কুটার চালানোর ডাইনামিক ট্র্যাকিং শট। ভিডিওতে ডিজিটাল স্পিডোমিটার HUD ওভারলে, স্মুথ ব্রেকিং ও এক্সিলারেশন মোশন ইফেক্ট এবং সাইবার ইলেকট্রিক মিউজিক।',
    videoSteps: [
      'ফার্স্ট-পারসন (POV) ও থার্ড-পারসন ট্র্যাকিং ক্যামেরা শট।',
      'ডিজিটাল স্পিড HUD এবং ব্যাটারি অ্যানিমেশন ওভারলে।',
      'নাইট সিটি লাইট ট্রেইলস ও ফাস্ট স্পিড র‍্যাম্পিং।'
    ],
    mandatorySpecs: 'স্টাইল: ফিউচারিস্টিক আরবান, রেজোলিউশন: 1080p 60fps।'
  },
  {
    id: 9,
    title: 'নয়েজ-ক্যানসেলিং এয়ারবাডস সাউন্ড আইসোলেশন (Noise Cancelling ANC Ad)',
    category: 'Audio Tech',
    difficulty: 'Complex',
    reward: 'BDT 25.00',
    productType: 'Active Noise Cancelling (ANC) True Wireless Earbuds',
    durationSec: '১৫ থেকে ২০ সেকেন্ড',
    storyboardPrompt: 'কোলাহলপূর্ণ ট্রাফিক ও ভিড়ের শব্দ হঠাৎ করে পিন-ড্রপ সাইলেন্স হয়ে যাওয়ার ড্রামাটিক অডিও কন্ট্রাস্ট। ভিডিওতে চারপাশের ভিড় ধীরগতির ব্লার হয়ে যাবে এবং শুধুমাত্র সঙ্গীত উপভোগের শান্ত সুন্দর আবহ সৃষ্টি হবে।',
    videoSteps: [
      '০:০০ - ০:০৫: উচ্চ ট্রাফিক নয়েজ ও ফাস্ট কাট।',
      '০:০৫: এয়ারবাডস কানে দেওয়ার শব্দ ও মুহূর্তেই নিস্তব্ধতা (ANC অন)।',
      '০:০৬ - ০:১৫: ক্রিস্টাল ক্লিয়ার লো-ফাই সুর ও শান্তির ভিজ্যুয়াল।'
    ],
    mandatorySpecs: 'সাউন্ড ডিজাইন: হাই-কনট্রাস্ট নয়েজ বনাম এবসোলিউট সাইলেন্স।'
  },
  {
    id: 10,
    title: 'সাসটেইনেবল ইকো-স্নিকার অরিজিন স্টোরি (Eco-Friendly Sneaker Story)',
    category: 'Sustainable Brand Story',
    difficulty: 'Advanced',
    reward: 'BDT 24.00',
    productType: 'Recycled Ocean Plastic Sneaker',
    durationSec: '২০ থেকে ২৫ সেকেন্ড',
    storyboardPrompt: 'সমুদ্রের প্লাস্টিক রিসাইকেল হয়ে স্টাইলিশ জুতা তৈরির পরিবেশবান্ধব গল্প। সমুদ্রের ঢেউ থেকে জুতার সোলের মসৃণ মরফিং ট্রানজিশন, পরিচ্ছন্ন টাইপোগ্রাফি এবং অনুপ্রেরণামূলক মিউজিক।',
    videoSteps: [
      'ন্যাচার ও রিসাইক্লিং টেক্সচার মরফিং ট্রানজিশন।',
      'ইনস্পিরেশনাল টেক্সট ও গ্রিন অ্যানিমেশন স্ট্যাটস।',
      'স্নিকারের আল্ট্রা-ক্লিন রোটেশন ভিউ ও স্লোগান।'
    ],
    mandatorySpecs: 'কালার গ্রেড: ওশান ব্লু ও ফ্রেশ টিল, পেসিং: ইনস্পায়ারিং।'
  }
];

export const VideoSubmitWork = () => {
  return (
    <ModuleGuard moduleId="video" title="Video Submit Work">
      <VideoSubmitApp />
    </ModuleGuard>
  );
};

const VideoSubmitApp = () => {
  const { user, profile } = useAuth();

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const currentTask = VIDEO_PROMPT_10_TASKS[selectedTaskIndex];

  // Final Commercial Video URL
  const [commercialVideoUrl, setCommercialVideoUrl] = useState('');

  // Editing Screen Recording Proof State
  const [screenRecordType, setScreenRecordType] = useState<'link' | 'upload'>('link');
  const [screenRecordFile, setScreenRecordFile] = useState<File | null>(null);
  const [screenRecordUrl, setScreenRecordUrl] = useState('');

  const [editingSoftware, setEditingSoftware] = useState('CapCut Pro');
  const [timelineNotes, setTimelineNotes] = useState('');

  // UI State
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(currentTask.storyboardPrompt);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const handleScreenRecordUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMsg('দয়া করে সঠিক ভিডিও ফাইল (.mp4, .webm) আপলোড করুন।');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('ভিডিও সাইজ ৫০ মেগাবাইটের মধ্যে হতে হবে।');
      return;
    }

    setScreenRecordFile(file);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg(null);

    // 1. Check Commercial Video URL
    if (!commercialVideoUrl.trim() || commercialVideoUrl.trim().length < 8) {
      setErrorMsg('তৈরি করা ফাইনাল কমার্শিয়াল ভিডিওর লিঙ্ক (TikTok, Shorts, Reels, Drive) দেওয়া বাধ্যতামূলক।');
      return;
    }

    // 2. Check Editing Screen Record Proof
    const hasScreenProof = screenRecordType === 'upload' ? Boolean(screenRecordFile) : Boolean(screenRecordUrl.trim());
    if (!hasScreenProof) {
      setErrorMsg('ভিডিও এডিটিংয়ের টাইমলাইন স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ সংযুক্ত করা বাধ্যতামূলক।');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalScreenProof = screenRecordType === 'upload' 
        ? (screenRecordFile?.name ? `Uploaded File: ${screenRecordFile.name} (${(screenRecordFile.size / 1024 / 1024).toFixed(1)}MB)` : 'Uploaded File')
        : screenRecordUrl.trim();

      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        userName: profile?.fullName || 'Student User',
        userPhone: profile?.whatsappNumber || 'N/A',
        studentIdCode: profile?.studentIdCode || 'N/A',
        module: 'video',
        moduleTitle: 'Video Submit Work (10 Product Video Prompts)',
        taskTitle: currentTask.title,
        taskCategory: currentTask.category,
        taskProductType: currentTask.productType,
        rewardAmount: currentTask.reward,
        videoUrl: commercialVideoUrl.trim(),
        screenRecordUrl: finalScreenProof,
        editingSoftware,
        timelineNotes: timelineNotes.trim(),
        details: `Task: ${currentTask.title}\nCategory: ${currentTask.category}\nProduct: ${currentTask.productType}\nSoftware: ${editingSoftware}\nCommercial Video Link: ${commercialVideoUrl.trim()}\nTimeline Proof: ${finalScreenProof}\nNotes: ${timelineNotes}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('সাবমিশন ব্যর্থ হয়েছে: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-full bg-[#F4F5F7] p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 max-w-lg w-full border border-slate-200/90 text-center space-y-4">
          <div className="w-14 h-14 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#0D7A5F] flex items-center justify-center mx-auto">
            <CheckCircle2 size={30} />
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#0D7A5F]">
              Submitted to Admin Panel
            </div>
            <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
              প্রোডাক্ট ভিডিও ও স্ক্রিন রেকর্ড সাবমিট সফল
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার তৈরিকৃত প্রোডাক্ট কমার্শিয়াল ভিডিও এবং এডিটিং টাইমলাইনের স্ক্রিন রেকর্ড ভিডিও প্রমাণ অ্যাডমিন পর্যালোচনার জন্য জমা হয়েছে।
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center gap-3 text-slate-700">
              <span className="font-medium text-slate-500">ভিডিও টাস্ক</span>
              <span className="font-semibold text-[#111827] truncate max-w-[220px]">{currentTask.title}</span>
            </div>
            <div className="flex justify-between items-center gap-3 text-slate-700">
              <span className="font-medium text-slate-500">এডিটিং সফটওয়্যার</span>
              <span className="font-semibold text-[#111827]">{editingSoftware}</span>
            </div>
            <div className="flex justify-between items-center gap-3 text-slate-700">
              <span className="font-medium text-slate-500">ধার্যকৃত রিওয়ার্ড</span>
              <span className="font-semibold text-[#0D7A5F] font-mono tabular-nums">{currentTask.reward}</span>
            </div>
            <div className="flex justify-between items-center gap-3 text-slate-700">
              <span className="font-medium text-slate-500">স্ট্যাটাস</span>
              <span className="font-semibold text-[#B47B00]">Pending Admin Verification</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setCommercialVideoUrl('');
              setScreenRecordFile(null);
              setScreenRecordUrl('');
              setTimelineNotes('');
              setSelectedTaskIndex((prev) => (prev + 1) % VIDEO_PROMPT_10_TASKS.length);
            }}
            className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            পরবর্তী ভিডিও মেকিং টাস্ক শুরু করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F4F5F7] p-3 sm:p-5 pb-28">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70] space-y-3.5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/80 mb-1">
                <Clapperboard size={13} />
                <span>10 Commercial Product Video Prompts</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                Video Submit Work (ভিডিও মেকিং ও ভিডিও সাবমিট)
              </h1>
              <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                ১০টি কমার্শিয়াল প্রোডাক্ট ভিডিও তৈরির প্রম্পট। ভিডিও বানিয়ে এডিটিং টাইমলাইনের স্ক্রিন রেকর্ডসহ সাবমিট করুন।
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-lg text-left sm:text-right shrink-0 w-full sm:w-auto">
              <div className="text-[11px] font-medium text-white/75">টাস্ক রিওয়ার্ড</div>
              <div className="text-lg font-semibold font-mono tabular-nums text-white mt-0.5">
                {currentTask.reward}
              </div>
            </div>
          </div>

          {/* Task Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/15">
            <span className="text-xs font-medium text-white/85">
              টাস্ক নির্বাচন ({selectedTaskIndex + 1}/১০)
            </span>

            <select
              value={selectedTaskIndex}
              onChange={(e) => {
                setSelectedTaskIndex(Number(e.target.value));
                setErrorMsg(null);
              }}
              className="bg-white text-[#111827] border border-white/20 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer max-w-full"
            >
              {VIDEO_PROMPT_10_TASKS.map((t, idx) => (
                <option key={t.id} value={idx}>
                  #{t.id}: {t.title.slice(0, 34)}... ({t.reward})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MANDATORY SCREEN RECORDING NOTICE */}
        <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-xl p-4 text-[#5F4B16] space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-xs text-[#47380F]">
            <Video size={16} className="text-[#B47B00] shrink-0" />
            <span>Mandatory Rule: Timeline Screen Recording Proof</span>
          </div>
          <p className="text-xs leading-relaxed">
            To verify manual editing in CapCut, Premiere Pro, or DaVinci Resolve, submitting a <strong>screen recording video file or Google Drive/YouTube link</strong> of your editing timeline is mandatory.
          </p>
        </div>

        {/* SELECTED PROMPT SPECIFICATION CARD */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <div className="text-[11px] font-medium text-[#0A4D8C] mb-1">
                {currentTask.category} · {currentTask.durationSec}
              </div>
              <h2 className="text-base font-semibold text-[#111827]">
                {currentTask.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCopyBrief}
              className="bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedBrief ? <Check size={13} className="text-[#0D7A5F]" /> : <Copy size={13} />}
              <span>{copiedBrief ? 'স্টোরিবোর্ড কপি হয়েছে' : 'স্টোরিবোর্ড কপি করুন'}</span>
            </button>
          </div>

          {/* Storyboard Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#111827] block">
              ভিডিও স্ক্রিপ্ট ও স্টোরিবোর্ড প্রম্পট নির্দেশনা
            </label>
            <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentTask.storyboardPrompt}
            </div>
          </div>

          {/* Video Steps */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#111827] block">
              টাইমকোড অনুযায়ী সিকোয়েন্স ধাপসমূহ
            </label>
            <div className="space-y-2 text-xs text-slate-700">
              {currentTask.videoSteps.map((step, idx) => (
                <div key={idx} className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200 flex items-start gap-2.5">
                  <Film size={14} className="text-[#0A4D8C] shrink-0 mt-0.5" />
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#EEF5FC] border border-[#D4E4F7] rounded-lg text-xs text-slate-700 flex items-start gap-2">
            <Info size={14} className="text-[#0A4D8C] shrink-0 mt-0.5" />
            <span><strong className="text-[#111827]">টেকনিক্যাল স্পেকস:</strong> {currentTask.mandatorySpecs}</span>
          </div>
        </div>

        {/* SUBMISSION FORM */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
          <h2 className="text-sm font-semibold text-[#111827] border-b border-slate-100 pb-3 flex items-center gap-2">
            <Film size={16} className="text-[#0A4D8C]" />
            <span>Commercial Video & Screen Recording Submission</span>
          </h2>

          {/* 1. Final Commercial Video Link */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#111827]">
              1. Final Commercial Video Link (TikTok, Reels, Shorts, Google Drive) *
            </label>
            <input
              type="url"
              placeholder="https://tiktok.com/@... or https://drive.google.com/..."
              value={commercialVideoUrl}
              onChange={(e) => setCommercialVideoUrl(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] font-mono"
            />
          </div>

          {/* 2. Screen Recording Video Proof */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-medium text-[#111827]">
                2. Editing Timeline Screen Recording Proof *
              </label>

              <div className="flex gap-1 bg-[#F4F5F7] p-1 rounded-lg text-xs border border-slate-200">
                <button
                  type="button"
                  onClick={() => setScreenRecordType('link')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    screenRecordType === 'link' ? 'bg-[#0A4D8C] text-white' : 'text-slate-600'
                  }`}
                >
                  Drive / Cloud Link
                </button>
                <button
                  type="button"
                  onClick={() => setScreenRecordType('upload')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    screenRecordType === 'upload' ? 'bg-[#0A4D8C] text-white' : 'text-slate-600'
                  }`}
                >
                  Upload Video File
                </button>
              </div>
            </div>

            {screenRecordType === 'link' ? (
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/... or YouTube/Cloud video link"
                value={screenRecordUrl}
                onChange={(e) => setScreenRecordUrl(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] font-mono"
              />
            ) : (
              <label className="p-4 bg-[#F8FAFC] border border-dashed border-slate-300 hover:border-[#0A4D8C] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-medium text-slate-700">
                <Video size={16} className="text-[#0A4D8C]" />
                <span>{screenRecordFile ? `Selected File: ${screenRecordFile.name}` : 'Choose Screen Recording File (Max 50MB)'}</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleScreenRecordUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* 3. Editing Software & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Video Editing Software *
              </label>
              <select
                value={editingSoftware}
                onChange={(e) => setEditingSoftware(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0A4D8C]"
              >
                <option value="CapCut Pro (PC/Mobile)">CapCut Pro (PC/Mobile)</option>
                <option value="Adobe Premiere Pro">Adobe Premiere Pro</option>
                <option value="Adobe After Effects">Adobe After Effects</option>
                <option value="DaVinci Resolve">DaVinci Resolve</option>
                <option value="VN Video Editor">VN Video Editor</option>
                <option value="Wondershare Filmora">Wondershare Filmora</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Timeline Notes / Effects (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Color LUT, speed ramp & audio sync applied"
                value={timelineNotes}
                onChange={(e) => setTimelineNotes(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4D8C]"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] rounded-lg text-xs flex items-start gap-2 font-medium">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0A4D8C] hover:bg-[#083D70] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit Video & Screen Recording Proof</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
