import React, { useState, useMemo, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  FileText, 
  Search, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Send,
  Eye,
  ArrowRight
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// Comprehensive Client Data Interface with 25 Fields
export interface EnterpriseClient {
  id: number;
  clientIdCode: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  genderBlood: string;
  nidNumber: string;
  tinNumber: string;
  primaryPhone: string;
  emergencyPhone: string;
  email: string;
  division: string;
  district: string;
  presentAddress: string;
  postCode: string;
  permanentAddress: string;
  designation: string;
  companyName: string;
  monthlyIncome: string;
  bankName: string;
  bankAccountNo: string;
  routingCode: string;
  nomineeName: string;
  nomineeRelation: string;
  servicePolicyCode: string;
  kycSecurityPin: string;
}

const FIRST_NAMES = [
  'কামরুল হাসান', 'তানভীর আহমেদ', 'সাবরিনা চৌধুরী', 'নাজমুল হুদা',
  'আশরাফুল আলম', 'সেলিনা বেগম', 'রফিকুল ইসলাম', 'নুসরাত জাহান',
  'মাহবুবুর রহমান', 'তাসনিম আক্তার', 'সাজ্জাদ হোসাইন', 'ফাতেমা তুজ জোহরা',
  'তারিকুল ইসলাম', 'ফারহানা ইসলাম', 'আব্দুল্লাহ আল মামুন', 'রোকেয়া সুলতানা',
  'শরিফুল হক', 'নাবিল মাহমুদ', 'আফসানা মির্জা', 'কাজী এনামুল হক',
  'সাইদুর রহমান', 'সামিরা হক', 'মোস্তাফিজুর রহমান', 'শাহনাজ পারভীন',
  'মনিরুজ্জামান', 'তাহমিনা খাতুন', 'আতিকুর রহমান', 'জেরিন তাসনিম',
  'শফিকুল ইসলাম', 'নুসরাত বিনতে নূর', 'মেহেদী হাসান শুভ', 'সাদিয়া সুলতানা',
  'ইমরান নাজির', 'পূজা রানী দাস', 'আল-আমিন হোসেন', 'তানিয়া ইসলাম',
  'শাহরিয়ার নাফিজ', 'সুমাইয়া খানম', 'নাইমুর রহমান', 'ফাহিম ফয়সাল'
];

const FATHERS = ['মো: আব্দুর রহমান', 'মো: আব্দুল মালেক', 'কাজী নজরুল ইসলাম', 'মো: সিরাজুল হক', 'ড. মোজাম্মেল হক', 'মো: নুরুল ইসলাম'];
const MOTHERS = ['মোসাম্মৎ সুফিয়া বেগম', 'জাহানারা আক্তার', 'রাবেয়া খাতুন', 'ফাতেমা বেগম', 'সুলতানা রাজিয়া', 'রোকেয়া বেগম'];
const DIVISIONS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'সিলেট', 'রংপুর', 'বরিশাল', 'ময়মনসিংহ'];
const DISTRICTS = ['ঢাকা সদর', 'চট্টগ্রাম সদর', 'বগুড়া', 'যশোর', 'সিলেট সদর', 'দিনাজপুর', 'বরিশাল সদর', 'কুমিল্লা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'ফেনী', 'পাবনা'];
const COMPANIES = [
  'মেঘনা টেকনোলজিস লিমিটেড', 'ঢাকা ডিজিটাল ট্রেডার্স', 'এগ্রোটেক সল্যুশনস বিডি',
  'প্রাইম সফটওয়্যার ল্যাবস', 'বেঙ্গল লজিস্টিকস নেটওয়ার্ক', 'পদ্মা এন্টারপ্রাইজ কর্পোরেশন',
  'যমুনা কমার্শিয়াল হাব', 'কর্ণফুলী শিপিং অ্যান্ড ট্রেডিং', 'সুরমা ডিজিটাল মিডিয়া',
  'সোনারগাঁও ফ্যাশনস লিমিটেড', 'গ্রিন ডেল্টা হোল্ডিংস', 'ক্রাউন প্লাস্টিকস লিমিটেড'
];
const BANKS = ['Dutch-Bangla Bank (DBBL)', 'BRAC Bank PLC', 'Islami Bank Bangladesh', 'City Bank PLC', 'Eastern Bank PLC', 'Sonali Bank PLC'];

// Generate exactly 100 enterprise clients with 25 rich data points each
export const GENERATE_100_CLIENTS = (): EnterpriseClient[] => {
  return Array.from({ length: 100 }).map((_, i) => {
    const num = i + 1;
    const name = FIRST_NAMES[i % FIRST_NAMES.length];
    const father = FATHERS[i % FATHERS.length];
    const mother = MOTHERS[i % MOTHERS.length];
    const division = DIVISIONS[i % DIVISIONS.length];
    const district = DISTRICTS[i % DISTRICTS.length];
    const company = COMPANIES[i % COMPANIES.length];
    const bank = BANKS[i % BANKS.length];

    const emailPrefix = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 6) || `client${num}`;
    const email = `${emailPrefix}${num}@${company.toLowerCase().replace(/[^a-z]/g, '').slice(0, 7) || 'bdcorp'}.com.bd`;

    return {
      id: num,
      clientIdCode: `CLT-2026-${String(1000 + num)}`,
      fullName: name,
      fatherName: father,
      motherName: mother,
      dob: `${1980 + (num % 22)}-${String((num % 12) + 1).padStart(2, '0')}-${String((num % 28) + 1).padStart(2, '0')}`,
      genderBlood: num % 2 === 0 ? 'পুরুষ / Male (B+ Positive)' : 'নারী / Female (O+ Positive)',
      nidNumber: `19${85 + (num % 15)}${String(1000000000 + num * 876543).slice(0, 10)}`,
      tinNumber: `5894${String(10000000 + num * 65432).slice(0, 8)}`,
      primaryPhone: `+880 17${String(10000000 + num * 94321).slice(0, 8)}`,
      emergencyPhone: `+880 18${String(20000000 + num * 83214).slice(0, 8)}`,
      email,
      division,
      district,
      presentAddress: `বাড়ি #${num * 2 + 1}, রোড #${(num % 15) + 1}, ব্লক-সি, সেক্টর #${(num % 12) + 1}, ${district}`,
      postCode: String(1000 + (num * 37) % 8000),
      permanentAddress: `গ্রাম: শান্তিনগর, ডাকঘর: ${district} সদর, জেলা: ${district}`,
      designation: ['ব্যবস্থাপনা পরিচালক (MD)', 'প্রধান প্রযুক্তি কর্মকর্তা (CTO)', 'হেড অব একাউন্টস', 'জেনারেল ম্যানেজার', 'সিনিয়র এক্সিকিউটিভ'][num % 5],
      companyName: company,
      monthlyIncome: `৳${(45000 + num * 2500).toLocaleString('en-BD')}.00 BDT`,
      bankName: bank,
      bankAccountNo: `${String(1000000000000 + num * 987654321).slice(0, 13)}`,
      routingCode: `095${String(100000 + num * 123).slice(0, 6)}`,
      nomineeName: num % 2 === 0 ? `মোসা: ফরিদা বেগম` : `মো: তারেক হাসান`,
      nomineeRelation: num % 2 === 0 ? 'স্ত্রী / Spouse' : 'ভাই / Brother',
      servicePolicyCode: `POL-ENT-${String(5000 + num)}`,
      kycSecurityPin: `PIN-${String(9000 + num)}`
    };
  });
};

const ALL_100_CLIENTS = GENERATE_100_CLIENTS();

export const FormFillupWork = () => {
  const { user, profile } = useAuth();

  const [selectedClientId, setSelectedClientId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track filled/submitted client records in state
  const [submittedClients, setSubmittedClients] = useState<{ [key: number]: any }>(() => {
    try {
      const saved = localStorage.getItem('unity_form_fillup_submitted_records');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current Client Data being viewed
  const currentClient = useMemo(() => {
    return ALL_100_CLIENTS.find(c => c.id === selectedClientId) || ALL_100_CLIENTS[0];
  }, [selectedClientId]);

  // Form Input States for the 25 fields
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    genderBlood: '',
    nidNumber: '',
    tinNumber: '',
    primaryPhone: '',
    emergencyPhone: '',
    email: '',
    division: '',
    district: '',
    presentAddress: '',
    postCode: '',
    permanentAddress: '',
    designation: '',
    companyName: '',
    monthlyIncome: '',
    bankName: '',
    bankAccountNo: '',
    routingCode: '',
    nomineeName: '',
    nomineeRelation: '',
    servicePolicyCode: '',
    kycSecurityPin: ''
  });

  // Load saved data for selected client if available
  useEffect(() => {
    if (submittedClients[selectedClientId]) {
      setFormData(submittedClients[selectedClientId]);
    } else {
      // Clear or keep empty for manual student entry
      setFormData({
        fullName: '',
        fatherName: '',
        motherName: '',
        dob: '',
        genderBlood: '',
        nidNumber: '',
        tinNumber: '',
        primaryPhone: '',
        emergencyPhone: '',
        email: '',
        division: '',
        district: '',
        presentAddress: '',
        postCode: '',
        permanentAddress: '',
        designation: '',
        companyName: '',
        monthlyIncome: '',
        bankName: '',
        bankAccountNo: '',
        routingCode: '',
        nomineeName: '',
        nomineeRelation: '',
        servicePolicyCode: '',
        kycSecurityPin: ''
      });
    }
    setFormSuccess(null);
    setFormError(null);
  }, [selectedClientId, submittedClients]);

  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [finalSubmitSuccess, setFinalSubmitSuccess] = useState(false);

  // Quick auto-populate for student convenience/match check
  const handleAutoFillMatch = () => {
    setFormData({
      fullName: currentClient.fullName,
      fatherName: currentClient.fatherName,
      motherName: currentClient.motherName,
      dob: currentClient.dob,
      genderBlood: currentClient.genderBlood,
      nidNumber: currentClient.nidNumber,
      tinNumber: currentClient.tinNumber,
      primaryPhone: currentClient.primaryPhone,
      emergencyPhone: currentClient.emergencyPhone,
      email: currentClient.email,
      division: currentClient.division,
      district: currentClient.district,
      presentAddress: currentClient.presentAddress,
      postCode: currentClient.postCode,
      permanentAddress: currentClient.permanentAddress,
      designation: currentClient.designation,
      companyName: currentClient.companyName,
      monthlyIncome: currentClient.monthlyIncome,
      bankName: currentClient.bankName,
      bankAccountNo: currentClient.bankAccountNo,
      routingCode: currentClient.routingCode,
      nomineeName: currentClient.nomineeName,
      nomineeRelation: currentClient.nomineeRelation,
      servicePolicyCode: currentClient.servicePolicyCode,
      kycSecurityPin: currentClient.kycSecurityPin
    });
    setFormSuccess("কপি সম্পন্ন: ক্লায়েন্টের ডাটা ফর্মে সুন্দরভাবে সাজানো হয়েছে। যাচাই করে সাবমিট করুন।");
  };

  // Submit single client record
  const handleClientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.nidNumber.trim()) {
      setFormError("অনুগ্রহ করে ক্লায়েন্টের নাম এবং এনআইডি নম্বর ফিল্ড পূরণ করুন।");
      return;
    }

    const updated = {
      ...submittedClients,
      [selectedClientId]: { ...formData, completedAt: new Date().toISOString() }
    };
    setSubmittedClients(updated);
    try {
      localStorage.setItem('unity_form_fillup_submitted_records', JSON.stringify(updated));
    } catch {}

    setFormSuccess(`ক্লায়েন্ট #${selectedClientId} (${currentClient.fullName})-এর ডাটা সফলভাবে সেভ করা হয়েছে!`);
    
    // Auto advance to next client
    if (selectedClientId < 100) {
      setTimeout(() => {
        setSelectedClientId(prev => prev + 1);
      }, 1000);
    }
  };

  // Filter clients list
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return ALL_100_CLIENTS;
    const q = searchQuery.toLowerCase();
    return ALL_100_CLIENTS.filter(c => 
      c.fullName.toLowerCase().includes(q) || 
      c.clientIdCode.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.id.toString() === q
    );
  }, [searchQuery]);

  const completedCount = Object.keys(submittedClients).length;
  const progressPercent = Math.round((completedCount / 100) * 100);

  // Submit full 100-client project to Firebase
  const handleFinalProjectSubmit = async () => {
    setIsFinalSubmitting(true);
    try {
      if (user) {
        await addDoc(collection(db, 'submissions'), {
          userId: user.uid,
          studentName: profile?.fullName || 'Member',
          studentIdCode: profile?.studentIdCode || 'N/A',
          jobType: 'form',
          moduleTitle: '100 Client Enterprise Form Fill-up Portfolio',
          completedRecordsCount: completedCount,
          rewardAmount: 230.00,
          submittedAt: new Date().toISOString(),
          status: 'pending_approval'
        });
      }
      setFinalSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      alert("সাবমিট ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsFinalSubmitting(false);
    }
  };

  return (
    <ModuleGuard moduleId="form" moduleTitle="Form Fill-up Work System">
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 pb-16">
        
        {/* Top Header Card - Displaying 230 BDT Reward Clearly */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 text-white shadow-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mb-1.5">
                Enterprise Form Fill-up Project
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                ১০০ ক্লায়েন্টের অফিসিয়াল ডাটা ফিল-আপ প্রজেক্ট
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                নিচে প্রদত্ত ১০০ জন কর্পোরেট ক্লায়েন্টের ২৫টি ডাটা ফিল্ড দেখে দেখে নির্ভুলভাবে সাবমিট করুন।
              </p>
            </div>

            {/* BDT 230.00 REWARD BADGE */}
            <div className="bg-emerald-950/80 border border-emerald-500/40 px-4 py-3 rounded-2xl text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-end gap-1">
                <DollarSign size={13} /> প্রজেক্ট রিওয়ার্ড (Earning)
              </div>
              <div className="text-2xl font-black font-mono text-white mt-0.5">
                BDT 230.00
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">অগ্রগতি:</span>
              <span className="font-mono font-bold text-emerald-400">{completedCount} / 100 ক্লায়েন্ট সাবমিটেড ({progressPercent}%)</span>
            </div>

            <div className="w-full sm:w-64 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Final Submission Success Banner */}
        {finalSubmitSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 text-center space-y-2 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-black text-emerald-950">
              ১০০ ক্লায়েন্ট ফর্ম ফিল-আপ প্রজেক্ট সফলভাবে সাবমিট হয়েছে!
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              আপনার সাবমিশন অ্যাডমিন রিভিউতে আছে। খুব দ্রুত যাচাই শেষে রিওয়ার্ড BDT 230.00 আপনার অ্যাকাউন্ট ব্যালেন্সে যুক্ত হবে।
            </p>
          </div>
        )}

        {/* 100 CLIENTS SELECTOR ROSTER */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900">
                ১০০ জন কর্পোরেট ক্লায়েন্টের তালিকা (১ থেকে ১০০ নির্বাচন করুন):
              </h2>
            </div>

            {/* Search client */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম বা আইডি খুঁজুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-emerald-500"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Quick 100 Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200/80">
            {filteredClients.map((c) => {
              const isDone = !!submittedClients[c.id];
              const isSelected = selectedClientId === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`p-2 rounded-xl text-left transition border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="text-[10px] font-mono opacity-70">#{c.id}</div>
                    <div className="text-xs font-bold truncate">{c.fullName}</div>
                  </div>
                  {isDone ? (
                    <CheckCircle2 size={14} className={isSelected ? 'text-emerald-400' : 'text-emerald-600'} />
                  ) : (
                    <ChevronRight size={13} className="opacity-40" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CURRENT SELECTED CLIENT DOSSIER (25 DATA FIELDS DISPLAY) */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-800 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/80 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                ক্লায়েন্ট রেফারেন্স কার্ড #{currentClient.id} ({currentClient.clientIdCode})
              </span>
              <h3 className="text-lg sm:text-xl font-black mt-1 text-white">
                {currentClient.fullName} — কর্পোরেট ডাটা প্রোফাইল
              </h3>
            </div>

            <button
              onClick={handleAutoFillMatch}
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Copy size={13} />
              <span>ডাটা ফর্মে বসান (Auto-Fill)</span>
            </button>
          </div>

          {/* 25 Comprehensive Data Points Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১. ক্লায়েন্ট রেফারেন্স আইডি:</span>
              <span className="font-mono font-bold text-indigo-300">{currentClient.clientIdCode}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">২. পুরো নাম:</span>
              <span className="font-bold text-white">{currentClient.fullName}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">৩. পিতার নাম:</span>
              <span className="font-semibold text-slate-200">{currentClient.fatherName}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">৪. মাতার নাম:</span>
              <span className="font-semibold text-slate-200">{currentClient.motherName}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">৫. জন্ম তারিখ:</span>
              <span className="font-mono font-bold text-white">{currentClient.dob}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">৬. লিঙ্গ ও রক্তের গ্রুপ:</span>
              <span className="font-semibold text-emerald-300">{currentClient.genderBlood}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">৭. জাতীয় পরিচয়পত্র (NID):</span>
              <span className="font-mono font-bold text-amber-300">{currentClient.nidNumber}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">৮. টিআইএন নম্বর (TIN):</span>
              <span className="font-mono text-slate-300">{currentClient.tinNumber}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">৯. প্রধান মোবাইল নম্বর:</span>
              <span className="font-mono font-bold text-emerald-400">{currentClient.primaryPhone}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১০. জরুরি যোগাযোগ নম্বর:</span>
              <span className="font-mono text-slate-300">{currentClient.emergencyPhone}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১১. অফিশিয়াল ইমেইল:</span>
              <span className="font-mono text-indigo-300 truncate block">{currentClient.email}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১২. বিভাগ:</span>
              <span className="font-bold text-white">{currentClient.division}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১৩. জেলা:</span>
              <span className="font-bold text-white">{currentClient.district}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১৪. বর্তমান ঠিকানা:</span>
              <span className="font-medium text-slate-200">{currentClient.presentAddress}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১৫. পোস্ট কোড:</span>
              <span className="font-mono font-bold text-white">{currentClient.postCode}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১৬. স্থায়ী ঠিকানা:</span>
              <span className="font-medium text-slate-200">{currentClient.permanentAddress}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১৭. পদবি / পেশা:</span>
              <span className="font-bold text-amber-300">{currentClient.designation}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১৮. প্রতিষ্ঠানের নাম:</span>
              <span className="font-bold text-white">{currentClient.companyName}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">১৯. মাসিক আয়:</span>
              <span className="font-mono font-bold text-emerald-400">{currentClient.monthlyIncome}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">২০. ব্যাংকের নাম:</span>
              <span className="font-semibold text-slate-200">{currentClient.bankName}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">২১. অ্যাকাউন্ট নম্বর:</span>
              <span className="font-mono font-bold text-white">{currentClient.bankAccountNo}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">২২. রাউটিং কোড:</span>
              <span className="font-mono text-slate-300">{currentClient.routingCode}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">২৩. নমিনির নাম ও সম্পর্ক:</span>
              <span className="font-semibold text-white">{currentClient.nomineeName} ({currentClient.nomineeRelation})</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">২৪. পলিসি সার্ভিস কোড:</span>
              <span className="font-mono font-bold text-indigo-300">{currentClient.servicePolicyCode}</span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-semibold">২৫. কেওয়াইসি সিকিউরিটি পিন:</span>
              <span className="font-mono font-bold text-rose-300">{currentClient.kycSecurityPin}</span>
            </div>

          </div>
        </div>

        {/* INPUT FORM BELOW (FOR SUBMITTING CLIENT 1-100 DATA) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                ক্লায়েন্ট #{currentClient.id} ({currentClient.fullName}) ডাটা এন্ট্রি ও ফিল-আপ ফর্ম
              </h3>
              <p className="text-xs text-slate-500">
                উপরের রেফারেন্স কার্ড দেখে দেখে নিচের ২৫টি ফিল্ড পূরণ করে সাবমিট বাটনে চাপুন।
              </p>
            </div>
            
            {submittedClients[selectedClientId] && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                <CheckCircle2 size={13} /> সাবমিটেড
              </span>
            )}
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleClientFormSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">১. পুরো নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="পুরো নাম লিখুন"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">২. পিতার নাম</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="পিতার নাম"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">৩. মাতার নাম</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="মাতার নাম"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">৪. জন্ম তারিখ</label>
                <input
                  type="text"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">৫. লিঙ্গ ও রক্তের গ্রুপ</label>
                <input
                  type="text"
                  value={formData.genderBlood}
                  onChange={e => setFormData({ ...formData, genderBlood: e.target.value })}
                  placeholder="Gender & Blood"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">৬. জাতীয় পরিচয়পত্র (NID) *</label>
                <input
                  type="text"
                  required
                  value={formData.nidNumber}
                  onChange={e => setFormData({ ...formData, nidNumber: e.target.value })}
                  placeholder="NID নম্বর"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">৭. টিআইএন নম্বর</label>
                <input
                  type="text"
                  value={formData.tinNumber}
                  onChange={e => setFormData({ ...formData, tinNumber: e.target.value })}
                  placeholder="TIN No"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">৮. প্রধান মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={formData.primaryPhone}
                  onChange={e => setFormData({ ...formData, primaryPhone: e.target.value })}
                  placeholder="+880 17..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">৯. জরুরি যোগাযোগ নম্বর</label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="+880 18..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১০. অফিশিয়াল ইমেইল</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@company.com.bd"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১১. বিভাগ</label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={e => setFormData({ ...formData, division: e.target.value })}
                  placeholder="বিভাগ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১২. জেলা</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  placeholder="জেলা"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">১৩. বর্তমান ঠিকানা</label>
                <input
                  type="text"
                  value={formData.presentAddress}
                  onChange={e => setFormData({ ...formData, presentAddress: e.target.value })}
                  placeholder="বাড়ি, রোড, সেক্টর"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১৪. পোস্ট কোড</label>
                <input
                  type="text"
                  value={formData.postCode}
                  onChange={e => setFormData({ ...formData, postCode: e.target.value })}
                  placeholder="1200"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">১৫. স্থায়ী ঠিকানা</label>
                <input
                  type="text"
                  value={formData.permanentAddress}
                  onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })}
                  placeholder="গ্রাম, ডাকঘর, জেলা"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১৬. পদবি / পেশা</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Designation"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১৭. প্রতিষ্ঠানের নাম</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Company Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১৮. মাসিক আয়</label>
                <input
                  type="text"
                  value={formData.monthlyIncome}
                  onChange={e => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="৳50,000.00 BDT"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">১৯. ব্যাংকের নাম</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Bank Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">২০. ব্যাংক অ্যাকাউন্ট নম্বর</label>
                <input
                  type="text"
                  value={formData.bankAccountNo}
                  onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })}
                  placeholder="Account No"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">২১. রাউটিং কোড</label>
                <input
                  type="text"
                  value={formData.routingCode}
                  onChange={e => setFormData({ ...formData, routingCode: e.target.value })}
                  placeholder="Routing Code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">২২. নমিনির নাম</label>
                <input
                  type="text"
                  value={formData.nomineeName}
                  onChange={e => setFormData({ ...formData, nomineeName: e.target.value })}
                  placeholder="Nominee Full Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">২৩. নমিনির সম্পর্ক</label>
                <input
                  type="text"
                  value={formData.nomineeRelation}
                  onChange={e => setFormData({ ...formData, nomineeRelation: e.target.value })}
                  placeholder="স্ত্রী / ভাই"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">২৪. পলিসি সার্ভিস কোড</label>
                <input
                  type="text"
                  value={formData.servicePolicyCode}
                  onChange={e => setFormData({ ...formData, servicePolicyCode: e.target.value })}
                  placeholder="POL-ENT-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">২৫. কেওয়াইসি সিকিউরিটি পিন</label>
                <input
                  type="text"
                  value={formData.kycSecurityPin}
                  onChange={e => setFormData({ ...formData, kycSecurityPin: e.target.value })}
                  placeholder="PIN-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>

            {/* Save / Next Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                * এই ক্লায়েন্টের ডাটা সেভ করে পরবর্তী ক্লায়েন্টে যান ({selectedClientId}/১০০)।
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>ক্লায়েন্ট #{selectedClientId} এর ডাটা সেভ করুন</span>
              </button>
            </div>

          </form>
        </div>

        {/* FINAL FULL 100-CLIENT PROJECT SUBMIT BUTTON */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black">
                সম্পূর্ণ ১০০ ক্লায়েন্টের ডাটা সাবমিশন (Claim BDT 230.00)
              </h3>
              <p className="text-xs text-slate-400">
                আপনি {completedCount} জন ক্লায়েন্টের ডাটা পূরণ করেছেন। সকল ক্লায়েন্টের ডাটা শেষ হলে প্রজেক্ট সাবমিট করুন।
              </p>
            </div>

            <button
              onClick={handleFinalProjectSubmit}
              disabled={isFinalSubmitting || finalSubmitSuccess}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-black px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 text-xs cursor-pointer shrink-0"
            >
              <Send size={15} />
              <span>{isFinalSubmitting ? 'সাবমিট হচ্ছে...' : '১০০ ক্লায়েন্ট প্রজেক্ট সাবমিট করুন (BDT 230.00)'}</span>
            </button>
          </div>
        </div>

      </div>
    </ModuleGuard>
  );
};
