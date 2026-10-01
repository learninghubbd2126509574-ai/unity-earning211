import React, { useState } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  Image as ImageIcon, 
  Upload, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Palette, 
  Eye, 
  Clock, 
  HelpCircle,
  Camera,
  RefreshCw,
  Send
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export interface PhotoEditTask {
  id: number;
  title: string;
  category: string;
  difficulty: 'Hard' | 'Complex' | 'Master' | 'Advanced';
  reward: string;
  productType: string;
  creativePrompt: string;
  editingSteps: string[];
  mandatorySpecs: string;
}

const PHOTO_EDIT_10_TASKS: PhotoEditTask[] = [
  {
    id: 1,
    title: 'লাক্সারি ক্রোনোগ্রাফ ঘড়ি (Luxury Chronograph Watch Retouch)',
    category: 'E-Commerce Luxury Goods',
    difficulty: 'Complex',
    reward: 'BDT 20.00',
    productType: 'Stainless Steel Sapphire Dial Watch',
    creativePrompt: 'একটি উচ্চমানের মেটালিক লাক্সারি ঘড়ির প্রোডাক্ট শট এডিট করতে হবে। ডায়ালের ভেতরের সূক্ষ্ম টেক্সচার পরিষ্কার রাখা, গ্লাসের ওপরের অনাকাঙ্ক্ষিত আলোর প্রতিফলন (Glare) অপসারণ করা এবং নিচের পেডেস্টাল বা টেবিলের ওপর প্রাকৃতিক সফট ড্রপ শ্যাডো ও ব্যাকলাইট যোগ করতে হবে।',
    editingSteps: [
      'ব্যাকগ্রাউন্ড থেকে অবজেক্ট নিখুঁতভাবে পেন টুল বা মাস্কিং দিয়ে আলাদা করুন।',
      'মেটাল স্ট্র্যাপের স্ক্র্যাচ এবং ডাস্ট স্পট হিলিং ব্রাশ দিয়ে ক্লিন করুন।',
      'ডায়ালের গ্লাসে ডুয়াল গ্রেডিয়েন্ট রিফ্লেকশন তৈরি করুন।',
      'নিচে সফট কন্টাক্ট শ্যাডো ও অ্যাম্বিয়েন্ট ব্লার শ্যাডো লেয়ার যুক্ত করুন।'
    ],
    mandatorySpecs: 'রেজোলিউশন: 2000x2000px, কালার স্পেস: sRGB, ব্যাকগ্রাউন্ড: পিওর হোয়াইট / গ্রে স্টুডিও।'
  },
  {
    id: 2,
    title: 'হাইড্রটিং স্কিন সিরাম বোতল (Cosmetic Hydrating Serum Bottle)',
    category: 'Beauty & Cosmetics',
    difficulty: 'Advanced',
    reward: 'BDT 18.00',
    productType: 'Glass Dropper Bottle with Golden Cap',
    creativePrompt: 'একটি কসমেটিক ড্রপার সিরাম বোতলের স্টুডিও কমার্শিয়াল লুক তৈরি করুন। বোতলের কাঁচের ভেতরের তরল সিরামের উজ্জ্বলতা বাড়ানো, বোতলের গায়ে বাস্তবসম্মত পানির বিন্দু (Water Droplets) কম্পোজিট করা এবং পেছনের প্যাস্টেল সফট ফোকাস ব্যাকগ্রাউন্ড দেওয়া।',
    editingSteps: [
      'বোতলের স্বচ্ছ কাঁচের এজিং শার্প ও রিফ্র্যাকশন লাইট ব্যালেন্স করুন।',
      'গোল্ডেন ক্যাপের মেটালিক শাইন ও কার্ভস হাইলাইট অ্যাডজাস্ট করুন।',
      'বোতলের গায়ে ওয়াটার ড্রপলেটস ব্রাশ বা পিএনজি ওভারলে দিয়ে রিয়ালিস্টিক ড্রপ শ্যাডো দিন।',
      '৩ডি স্টুডিও সফটবক্স রিফ্লেকশন তৈরি করুন।'
    ],
    mandatorySpecs: 'ম্যাটেরিয়াল টেক্সচার: আল্ট্রা গ্লসি গ্লাস, শ্যাডো: ডিরেকশনাল সফটবক্স।'
  },
  {
    id: 3,
    title: 'ডায়মন্ড ও এমারেল্ড সলিটেয়ার রিং (Diamond & Emerald Ring Macro)',
    category: 'Fine Jewelry',
    difficulty: 'Master',
    reward: 'BDT 25.00',
    productType: '18K White Gold Solitaire Diamond Ring',
    creativePrompt: 'ম্যাক্রো জুয়েলারি ফটো এডিটিং। সেন্ট্রাল ডায়মন্ডের প্রতিটি ফ্যাসেট (Facet) স্ফটিক স্বচ্ছ ও স্পার্কল করতে হবে। রিংয়ের মেটালের রিফ্লেকশন থেকে স্টুডিও ক্যামেরার প্রতিচ্ছবি দূর করে প্রিমিয়াম ফ্ললেস হোয়াইট গোল্ড ফিনিশিং দিতে হবে।',
    editingSteps: [
      'ফোকাস স্ট্যাকিং বা শার্পনেস মাস্কিং করে ডায়মন্ডের প্রতিটি কাট স্পষ্ট করুন।',
      'ফ্যাসেটে সূক্ষ্ম প্রিজম কালার ফ্লেয়ার (Prism Dispersion Flare) যুক্ত করুন।',
      'হোয়াইট গোল্ড ব্যান্ড থেকে নয়েজ ও কালার কাস্ট মুছে ফেলুন।',
      'ব্ল্যাক মিরর রিফ্লেকশন ফ্লোর ইফেক্ট দিন।'
    ],
    mandatorySpecs: 'ফোকাস: ১০০% ক্রিস্টাল ক্লিয়ার, লাইটিং: জুয়েলারি স্পার্কলার রিফ্লেকশন।'
  },
  {
    id: 4,
    title: 'অর্গানিক মাচা টি প্যাকেজিং (Organic Matcha Food Packaging)',
    category: 'Agro & Gourmet Food',
    difficulty: 'Hard',
    reward: 'BDT 15.00',
    productType: 'Matte Foil Standing Pouch Package',
    creativePrompt: 'ম্যাট ফয়েল স্ট্যান্ডিং পাউচ প্যাকেজিংয়ের ওপর লেবেল নিখুঁতভাবে ম্যাপ করা। পাউচের ফোল্ডিং লাইনে বাস্তবসম্মত লাইট ও শ্যাডো কার্ভস প্রয়োগ করা এবং পাশে চা পাতা ও উডেন স্পুনের ক্রিয়েটিভ ফ্ল্যাটলে কম্পোজিশন সাজানো।',
    editingSteps: [
      'ম্যাট ফিনিশ টেক্সচারের ভ্যালু ঠিক রেখে ভেক্টর লেবেল মকআপ করুন।',
      'পাউচের নিচের রিঙ্কেলের সাথে আলো-ছায়ার ম্যাচিং করুন।',
      'কালার কারেকশনে প্রাণবন্ত গ্রিন ও আর্থি উডেন টোন আনুন।',
      'আইসোমেট্রিক গ্রাউন্ড শ্যাডো অ্যাড করুন।'
    ],
    mandatorySpecs: 'প্যাকেজিং টাইপ: ম্যাট স্ট্যান্ডআপ পাউচ, কালার টোন: ন্যাচারাল গ্রিন।'
  },
  {
    id: 5,
    title: 'হাই-টপ বাস্কেটবল স্নিকার (High-Top Sneaker Dynamic Action)',
    category: 'Fashion & Footwear',
    difficulty: 'Advanced',
    reward: 'BDT 20.00',
    productType: 'Athletic Leather & Mesh High-Top Sneaker',
    creativePrompt: 'একটি আধুনিক স্নিকারের ডাইনামিক স্পোর্টস কমার্শিয়াল পোস্টার তৈরি করুন। জুতার লেদারের টেক্সচার ও সোল শার্প করা, ব্যাকগ্রাউন্ডে স্পিড পার্টিকল ও মোশন ট্রেইল যোগ করা এবং ফ্লোরে স্পোর্টস কোর্টের উডেন রিফ্লেকশন দেওয়া।',
    editingSteps: [
      'জুতার প্রতিটি সিমিং ও লেইস নিখুঁতভাবে মাস্ক করুন।',
      'লেদার ও রাবার সোলের টেক্সচার হাই-পাস ফিল্টারে শার্প করুন।',
      'ডায়নামিক ব্যাকগ্রাউন্ড লাইটিং ও হালকা স্মোক পার্টিকল কম্পোজিট করুন।',
      'স্নিকারের নিচে পারফেক্ট ড্রপ শ্যাডো ও কন্টাক্ট ওক্লুশন তৈরি করুন।'
    ],
    mandatorySpecs: 'থিম: হাই-এনার্জি স্পোর্টস, কালার গ্রেডিং: হাই-কনট্রাস্ট আরবান।'
  },
  {
    id: 6,
    title: 'সাইবারপাঙ্ক ওয়্যারলেস হেডফোন (Cyberpunk Gaming Headphones)',
    category: 'Consumer Electronics',
    difficulty: 'Master',
    reward: 'BDT 22.00',
    productType: 'RGB Wireless Over-Ear Gaming Headset',
    creativePrompt: 'নিওন সাইবারপাঙ্ক স্টাইলে গেমিং হেডফোনের প্রোডাক্ট শট। বাম পাশ থেকে ইলেকট্রিক সায়ান (Cyan) এবং ডান পাশ থেকে ভাইব্রেন্ট ম্যাজেন্টা (Magenta) রিম লাইট কম্পোজিশন দেওয়া এবং ইয়ারকাপের আরজিবি লোগোতে স্মুথ গ্লো ইফেক্ট তৈরি করা।',
    editingSteps: [
      'হেডসেটের ম্যাট ব্ল্যাক প্লাস্টিক ও মেটালিক মেশ রিটাচ করুন।',
      'ডুয়াল-টোন সায়ান/ম্যাজেন্টা কালার রিম লাইটিং কার্ভস তৈরি করুন।',
      'ইয়ারকাপের আরজিবি লাইটকে ব্লুম (Bloom) ও গ্লো মাস্ক দিন।',
      'ডার্ক মেটালিক গ্রিড ব্যাকগ্রাউন্ডে নিখুঁত ড্রপ শ্যাডো কম্পোজিট করুন।'
    ],
    mandatorySpecs: 'লাইটিং: সায়ান ও নিওন পিঙ্ক ডুয়াল রিম লাইট, ব্যাকগ্রাউন্ড: ডার্ক অ্যারেনা।'
  },
  {
    id: 7,
    title: 'ডিজাইনার লেদার হ্যান্ডব্যাগ (Luxury Leather Handbag Composite)',
    category: 'Luxury Fashion',
    difficulty: 'Complex',
    reward: 'BDT 18.00',
    productType: 'Full-Grain Italian Leather Handbag',
    creativePrompt: 'ইতালিয়ান লেদার ব্যাগের প্রিমিয়াম ক্যাটালগ শট। লেদারের ডিপ কালার গ্রেডিং, গোল্ডেন চেইন ও বাকলের চকচকে মেটালিক গ্লেজ রিটাচ করা এবং স্টোন পেডেস্টাল বা মার্বেল স্ল্যাবের ওপর রিফ্লেকশন দিয়ে উপস্থাপন করা।',
    editingSteps: [
      'লেদারের প্রাকৃতিক টেক্সচার বজায় রেখে ছোটখাটো দাগ দূর করুন।',
      'গোল্ডেন হার্ডওয়্যারে শার্প হাইলাইটস ও গোল্ডেন ভাইব্রেন্স বাড়ান।',
      'ব্যাগের শেপ ও স্ট্রাকচারাল লাইন সোজা ও সিমেট্রিক্যাল করুন।',
      'মার্বেল টেক্সচার ফ্লোরে সাবলীল মিররিং শ্যাডো তৈরি করুন।'
    ],
    mandatorySpecs: 'ফিনিশ: ফুল-গ্রেইন লেদার, সারফেস: মার্বেল পেডেস্টাল।'
  },
  {
    id: 8,
    title: 'আর্টিসান ডার্ক চকলেট বার (Artisan Dark Chocolate Bar Composition)',
    category: 'Food Commercial',
    difficulty: 'Advanced',
    reward: 'BDT 17.00',
    productType: 'Rich 85% Cocoa Chocolate Bar with Nuts',
    creativePrompt: 'ফুড কমার্শিয়াল স্টাইলে চকলেট বারের লোভনীয় কম্পোজিশন। ভাঙা চকলেট ব্লকের টেক্সচার শার্প করা, বাতাসে ভাসমান কোকোয়া পাউডার ডাস্ট ও হ্যাজেলনাট পার্টিকল কম্পোজিট করা এবং উষ্ণ স্টুডিও লাইটিং গ্রেডিং।',
    editingSteps: [
      'চকলেটের ব্রেক অ্যাঙ্গেলের টেক্সচার ও বাদামের ওপর শার্পনেস বাড়ান।',
      'চকলেটের উপরিভাগে সফট গ্লসি শাইন অ্যাডজাস্ট করুন।',
      'বাতাসে কোকো ডাস্ট ও পাউডার স্প্ল্যাশ লেয়ার মাস্কিং করে বসান।',
      'ওয়ার্ম ব্রাউন ড্রামাটিক স্টুডিও ব্যাকগ্রাউন্ড ও ড্রপ শ্যাডো দিন।'
    ],
    mandatorySpecs: 'কালার গ্রেডিং: ডিপ ওয়ার্ম চকলেট ব্রাউন, স্পেশাল ইফেক্ট: ডাস্ট পার্টিকলস।'
  },
  {
    id: 9,
    title: 'স্মার্ট হোম ডিসপ্লে ও আইওটি হাব (Smart Home IoT Hub Mockup)',
    category: 'Smart Technology',
    difficulty: 'Complex',
    reward: 'BDT 19.00',
    productType: 'Touchscreen Smart Home Controller Hub',
    creativePrompt: 'একটি স্মার্ট হোম কন্ট্রোল ডিভাইসের স্ক্রিন ইন্টারফেস মকআপ। ডিভাইসের ডিসপ্লেতে আধুনিক ইউআই ড্যাশবোর্ড নিখুঁত পার্সপেক্টিভে বসানো, কাঁচের ওপরের অ্যান্টি-গ্লেয়ার লাইটিং ঠিক রাখা এবং একটি মিনিমালিস্ট আধুনিক ড্রয়িংরুম ব্যাকগ্রাউন্ডে ব্লার করে বসানো।',
    editingSteps: [
      'ডিভাইসের ফ্রেম থেকে আসল স্ক্রিন মাস্ক করে বাদ দিন।',
      'স্মার্ট হোম ইউআই স্ক্রিনশট পার্সপেক্টিভ ট্রান্সফর্ম দিয়ে স্ক্রিনে ফিট করুন।',
      'স্ক্রিনের ওপর হালকা ডায়াগোনাল গ্লাস রিফ্লেকশন ওভারলে দিন।',
      'মডার্ন ইন্টেরিয়র ব্যাকগ্রাউন্ডকে ডেপথ-অব-ফিল্ড বোকেহ ব্লার করুন।'
    ],
    mandatorySpecs: 'স্ক্রিন রেশিও: ১৬:৯ কার্ভড কর্নার, ব্যাকগ্রাউন্ড: বোকেহ লিভিং রুম।'
  },
  {
    id: 10,
    title: 'লাক্সারি পারফিউম গ্লাস ফ্ল্যাকন (Luxury Perfume Glass Bottle)',
    category: 'Fragrance & Perfumery',
    difficulty: 'Master',
    reward: 'BDT 22.00',
    productType: 'Crystal Cut Perfume Flacon with Amber Fluid',
    creativePrompt: 'একটি ক্রিস্টাল কাট পারফিউম বোতলের আন্তর্জাতিক বিজ্ঞাপন শট। বোতলের ভেতরের অ্যাম্বার তরলের উজ্জ্বল আভা, ক্রিস্টাল এজেসে আলোর অপটিক্যাল রিফ্র্যাকশন এবং চারপাশে ভাসমান জুঁই বা গোলাপের পাপড়ির স্নিগ্ধ ডেপথ কম্পোজিশন।',
    editingSteps: [
      'বোতলের ক্রিস্টাল ফ্যাসেটের স্বচ্ছতা ও কস্টিক লাইট অপটিমাইজ করুন।',
      'অভ্যন্তরীণ পারফিউম লিকুইডের স্যাচুরেশন ও ব্যাকলাইট ইলুমিনেশন দিন।',
      'ভাসমান ফুলের পাপড়ি বোকেহ ও মোশন ব্লার দিয়ে ডেপথ লেয়ারিং করুন।',
      'পানি বা মার্বেল তলে ক্রিস্টাল মিরর রিফ্লেকশন ফুটিয়ে তুলুন।'
    ],
    mandatorySpecs: 'মুড: ড্রামাটিক ও লাক্সারি, লাইটিং: ব্যাকলিট গ্লাস কস্টিকস।'
  }
];

export const PhotoSubmitWork = () => {
  return (
    <ModuleGuard moduleId="photo" title="Photo Submit Work">
      <PhotoSubmitApp />
    </ModuleGuard>
  );
};

const PhotoSubmitApp = () => {
  const { user, profile } = useAuth();

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const currentTask = PHOTO_EDIT_10_TASKS[selectedTaskIndex];

  // Uploaded photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Screen recording video proof state
  const [videoProofType, setVideoProofType] = useState<'upload' | 'link'>('link');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFilePreview, setVideoFilePreview] = useState<string | null>(null);
  const [videoLink, setVideoLink] = useState('');

  // Editing info
  const [softwareUsed, setSoftwareUsed] = useState('Adobe Photoshop');
  const [editingNotes, setEditingNotes] = useState('');

  // UI state
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Copy prompt helper
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentTask.creativePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('দয়া করে সঠিক ইমেজ ফাইল (.jpg, .png, .webp) আপলোড করুন।');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('ছবির সাইজ ১৫ মেগাবাইটের বেশি হতে পারবে না।');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setErrorMsg(null);
  };

  // Handle Video Screen Recording File Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMsg('দয়া করে একটি সঠিক ভিডিও ফাইল (.mp4, .webm, .mov) আপলোড করুন।');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('ভিডিও সাইজ ৫০ মেগাবাইটের মধ্যে হতে হবে।');
      return;
    }

    setVideoFile(file);
    setVideoFilePreview(URL.createObjectURL(file));
    setErrorMsg(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg(null);

    // 1. Photo check
    if (!photoPreview) {
      setErrorMsg('⚠️ সম্পাদিত ফাইনাল ফটো ফাইলটি আপলোড করা বাধ্যতামূলক!');
      return;
    }

    // 2. Video Screen Recording check
    const hasVideo = videoProofType === 'upload' ? Boolean(videoFile) : Boolean(videoLink.trim());
    if (!hasVideo) {
      setErrorMsg('⚠️ ফটো এডিটিংয়ের স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ সংযুক্ত করা বাধ্যতামূলক! আপনি যে নিজে সফটওয়্যারে এডিট করেছেন, তার ভিডিও ফাইল বা ক্লাউড লিংক দিন।');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalVideoData = videoProofType === 'upload' 
        ? (videoFile?.name ? `Uploaded File: ${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(1)}MB)` : 'Uploaded Video')
        : videoLink.trim();

      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        userName: profile?.fullName || 'Student User',
        userPhone: profile?.whatsappNumber || 'N/A',
        studentIdCode: profile?.studentIdCode || 'N/A',
        module: 'photo',
        moduleTitle: 'Photo Submit Work (10 Product Prompts)',
        taskTitle: currentTask.title,
        taskCategory: currentTask.category,
        taskProductType: currentTask.productType,
        rewardAmount: currentTask.reward,
        imageProofUrl: photoPreview,
        videoUrl: finalVideoData,
        videoProofType,
        softwareUsed,
        editingNotes: editingNotes.trim(),
        details: `Task: ${currentTask.title}\nCategory: ${currentTask.category}\nProduct: ${currentTask.productType}\nSoftware: ${softwareUsed}\nReward: ${currentTask.reward}\nScreen Record Proof: ${finalVideoData}\nNotes: ${editingNotes}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('সাবমিশন সংরক্ষণ ব্যর্থ হয়েছে: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (isSubmitted) {
    return (
      <div className="p-4 sm:p-6 min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-rose-200 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              Submitted to Admin Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ফটো এডিটিং ও স্ক্রিন রেকর্ড সাবমিট সফল!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              আপনার সম্পাদিত ফটো এবং কাজের স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ অ্যাডমিন প্যানেলে পেন্ডিং সাবমিশনে পাঠানো হয়েছে।
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">টাস্ক টাইটেল:</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px]">{currentTask.title}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">ব্যবহৃত সফটওয়্যার:</span>
              <span className="font-bold text-slate-900">{softwareUsed}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">ধার্যকৃত রিওয়ার্ড:</span>
              <span className="font-bold text-emerald-600 font-mono">{currentTask.reward}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">স্ট্যাটাস:</span>
              <span className="font-bold text-amber-600">Pending Admin Verification</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setPhotoFile(null);
              setPhotoPreview(null);
              setVideoFile(null);
              setVideoFilePreview(null);
              setVideoLink('');
              setEditingNotes('');
              setSelectedTaskIndex((prev) => (prev + 1) % PHOTO_EDIT_10_TASKS.length);
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer"
          >
            পরবর্তী ফটো এডিটিং টাস্ক শুরু করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto pb-28 space-y-4">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-br from-rose-900 via-pink-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-rose-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1 mb-1.5">
              <Palette size={12} />
              <span>10 E-Commerce & Product Photo Editing Prompts</span>
            </span>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight">
              Photo Submit Work (ফটো এডিটিং ও ফটো সাবমিট)
            </h1>
            <p className="text-xs text-rose-200 mt-0.5 max-w-xl leading-relaxed">
              Professional E-Commerce Product Retouching & Screen Recording Demonstration Proof.
            </p>
            <p className="text-[11px] text-rose-300/90 mt-0.5 leading-snug">
              ১০টি উচ্চমানের প্রোডাক্ট ফটো এডিটিং প্রম্পট। এডিট সম্পন্ন করে এডিটিংয়ের সম্পূর্ণ স্ক্রিন রেকর্ডিং ভিডিও প্রমাণসহ সাবমিট করুন।
            </p>
          </div>

          <div className="bg-rose-950/80 border border-rose-800/80 px-4 py-2.5 rounded-2xl text-center shrink-0 w-full sm:w-auto">
            <div className="text-[10px] uppercase font-bold text-rose-300">টাস্ক রিওয়ার্ড</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {currentTask.reward}
            </div>
          </div>
        </div>

        {/* Task Selector Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-rose-800/60">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-rose-300">টাস্ক নির্বাচন ({selectedTaskIndex + 1}/১০):</span>
          </div>

          <select
            value={selectedTaskIndex}
            onChange={(e) => {
              setSelectedTaskIndex(Number(e.target.value));
              setErrorMsg(null);
            }}
            className="bg-slate-900 border border-rose-700/80 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-rose-400 cursor-pointer"
          >
            {PHOTO_EDIT_10_TASKS.map((t, idx) => (
              <option key={t.id} value={idx}>
                #{t.id}: {t.title.slice(0, 30)}... ({t.reward})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MANDATORY SCREEN RECORDING REQUIREMENT BOX */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-amber-900">
          <Video size={17} className="text-amber-600 shrink-0" />
          <span>বাধ্যতামূলক নিয়ম: ফটো এডিটিংয়ের স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          প্রদত্ত প্রম্পট অনুযায়ী ফটোটি আপনি নিজে ফটোশপ (Photoshop), ইলাস্ট্রেটর, লাইটরুম, ক্যানভা বা অন্য কোনো সফটওয়্যারে এডিট করেছেন তা নিশ্চিত করতে <strong>কাজের সম্পূর্ণ স্ক্রিন রেকর্ড করা ভিডিও ফাইল বা গুগল ড্রাইভ/ইউটিউব লিংক সাবমিট করা বাধ্যতামূলক</strong>। ভিডিও প্রমাণ ছাড়া কোনো কাজ অনুমোদিত হবে না।
        </p>
      </div>

      {/* SELECTED PROMPT SPECIFICATION CARD */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                {currentTask.category}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentTask.difficulty}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {currentTask.title}
            </h2>
          </div>

          <button
            onClick={handleCopyPrompt}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedPrompt ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copiedPrompt ? 'প্রম্পট কপি হয়েছে!' : 'এডিটিং প্রম্পট কপি করুন'}</span>
          </button>
        </div>

        {/* Creative Brief Prompt */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            এডিটিং ক্রিয়েটিভ প্রম্পট নির্দেশনা:
          </label>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {currentTask.creativePrompt}
          </div>
        </div>

        {/* Step-by-Step Editing Workflow */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            ধাপসমূহ (Editing Steps):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {currentTask.editingSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium flex items-center gap-2">
          <Sparkles size={14} className="text-blue-600 shrink-0" />
          <span><strong>টেকনিক্যাল স্পেকস:</strong> {currentTask.mandatorySpecs}</span>
        </div>
      </div>

      {/* SUBMISSION FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Upload size={17} className="text-rose-600" />
          <span>সম্পাদিত ফটো ও স্ক্রিন রেকর্ডিং ভিডিও সাবমিশন</span>
        </h2>

        {/* 1. Photo Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            ১. এডিটিং করা ফাইনাল ফটো আপলোড করুন (Final Edited Image) *
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <label className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition text-xs font-semibold text-slate-600 hover:text-rose-600 min-h-32">
              <ImageIcon size={24} className="text-slate-400" />
              <span>{photoFile ? 'অন্য ছবি পরিবর্তন করুন' : 'সম্পাদিত ইমেজ ফাইল বেছে নিন (.jpg, .png)'}</span>
              <span className="text-[10px] text-slate-400">সর্বোচ্চ সাইজ: 15MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {photoPreview ? (
              <div className="relative aspect-video rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
                <img src={photoPreview} alt="Edited preview" className="max-h-36 object-contain" />
                <span className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ ফটো আপলোডেড
                </span>
              </div>
            ) : (
              <div className="aspect-video bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-center p-3 text-slate-400 text-xs">
                ছবি নির্বাচন করলে এখানে প্রিভিউ প্রদর্শিত হবে।
              </div>
            )}
          </div>
        </div>

        {/* 2. Video Screen Recording Proof */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-bold text-slate-800">
              ২. ফটো এডিটিংয়ের স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ (Screen Recording Proof) *
            </label>

            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setVideoProofType('link')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${videoProofType === 'link' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'}`}
              >
                ভিডিও লিংক (Drive/YouTube)
              </button>
              <button
                type="button"
                onClick={() => setVideoProofType('upload')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${videoProofType === 'upload' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'}`}
              >
                ভিডিও ফাইল আপলোড
              </button>
            </div>
          </div>

          {videoProofType === 'link' ? (
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/... অথবা ইউটিউব/ক্লাউড ভিডিও লিংক"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-mono"
            />
          ) : (
            <div className="space-y-2">
              <label className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition text-xs font-semibold text-slate-700">
                <Video size={16} />
                <span>{videoFile ? `নির্বাচিত ফাইল: ${videoFile.name}` : 'স্ক্রিন রেকর্ড ভিডিও ফাইল বেছে নিন (Max 50MB)'}</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
              {videoFilePreview && (
                <video src={videoFilePreview} controls className="max-h-40 rounded-xl bg-black w-full" />
              )}
            </div>
          )}
        </div>

        {/* 3. Software Used & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              ব্যবহৃত সফটওয়্যার / টুল *
            </label>
            <select
              value={softwareUsed}
              onChange={(e) => setSoftwareUsed(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
            >
              <option value="Adobe Photoshop">Adobe Photoshop</option>
              <option value="Adobe Illustrator">Adobe Illustrator</option>
              <option value="Adobe Lightroom">Adobe Lightroom</option>
              <option value="Canva Pro">Canva Pro</option>
              <option value="Photopea">Photopea Online Editor</option>
              <option value="CapCut / Mobile App">CapCut / Mobile App</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              এডিটিং বিবরণ / লেয়ার নোট (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="e.g. মাস্কিং, ড্রপ শ্যাডো ও কালার কারেকশন সম্পন্ন"
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2 font-semibold">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition shadow-md active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>সাবমিট হচ্ছে...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>ফটো ও স্ক্রিন রেকর্ড সাবমিট করুন (অ্যাডমিন ভেরিফিকেশন)</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
};
