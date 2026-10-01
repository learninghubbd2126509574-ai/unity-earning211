import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  PenTool, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Video, 
  Upload, 
  Link2,
  Sparkles, 
  FileText, 
  RefreshCw,
  Eye,
  Check,
  Zap,
  Info,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Timer
} from 'lucide-react';

interface TypingTask {
  id: number;
  category: string;
  difficulty: 'Very Hard' | 'Complex' | 'Advanced' | 'Master';
  title: string;
  timeLimitMinutes: number;
  mandatoryCondition: string;
  instruction: string;
  text: string;
}

const ADVANCED_10_TASKS: TypingTask[] = [
  {
    id: 1,
    category: "Commercial Legal Contract & Indenture Clauses",
    difficulty: "Complex",
    title: "Section 14(c) Commercial Lease & Escrow Indemnity Agreement",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: লেখার মধ্যে যেখানে 'Lessee' শব্দটি রয়েছে তা পরিবর্তন করে 'Authorized Tenant' লিখুন এবং সকল টাকার অংক প্রথম বন্ধনীতে (Parentheses) রাখুন।",
    instruction: "হুবহু নির্ভুলভাবে বিরামচিহ্ন, ব্র্যাকেট এবং ক্লজ কোড টাইপ করুন এবং উপরের শর্ত অনুযায়ী শব্দ পরিবর্তন করুন। স্ক্রিন রেকর্ড চালু রেখে টাইপ করুন।",
    text: `Pursuant to Section 14(c) of the Master Commercial Lease Agreement (Ref: #LSE-2026/894-BD), the Lessee shall irrevocably deposit the aggregate sum of BDT 4,87,500.00 (Four Lakh Eighty-Seven Thousand Five Hundred Taka Only) into the designated Escrow Account [IBAN: BD92-SBIN-0004-9812-7634] no later than 17:00 BST on 15-November-2026. 

Failure to remit said escrow collateral within five (5) statutory business days shall trigger an automatic liquidated damage surcharge of 2.75% per diem, compounded weekly under Clause 22.4(a). Neither party may assign, novate, or hypothecate its respective rights hereunder without prior written unanimous consent of the Board of Arbitrators (§ 9.2). All formal communications must be dispatched via registered courier with verifiable proof-of-delivery receipts.

Furthermore, the Lessee agrees to maintain comprehensive general liability insurance coverage with minimum single-limit indemnity of BDT 25,00,000.00 throughout the entire five-year lease tenure. Any structural alterations or electrical retrofitting must receive structural engineering compliance certificates under the Bangladesh National Building Code (BNBC-2020). The Lessor covenants peaceful possession subject to regular quarterly safety inspections with forty-eight (48) hours prior notification.`
  },
  {
    id: 2,
    category: "Clinical Laboratory Trial & Pharmaceutical Research",
    difficulty: "Advanced",
    title: "Protocol #CT-8092-B: In Vitro Bio-Equivalence & Solvency Assay",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: লেখার মধ্যে 'Acetylsalicylic Acid' এর স্থানে 'Compound-ASA (BP/USP)' লিখুন এবং সকল তাপমাত্রার মান বোল্ড ক্যাপিটালে রাখুন।",
    instruction: "রাসায়নিক সংকেত, দশমিক মান, বৈজ্ঞানিক তাপমাত্রা এবং ব্র্যাকেট নিখুঁতভাবে টাইপ করুন।",
    text: `During Phase-II clinical bio-equivalence screening (Trial Code #CT-8092-B), analytical samples of Acetylsalicylic Acid (C9H8O4, Molecular Weight: 180.16 g/mol) were subjected to rigorous chromatographic dissolution testing at 37.0°C (±0.25°C) within a buffered aqueous medium maintained strictly at pH 7.40.

Spectrophotometric absorbance measured at lambda_max = 278.4 nm yielded an active therapeutic solvency coefficient of 98.42% (SD: ±0.18%). Batch #BX-0914-K demonstrated zero particulate precipitate after 72 hours of continuous agitation at 120 RPM. Chromatographic retention time peaked at 4.62 minutes, conforming to USP-NF Monograph standards (Rev. 2026). Technicians must archive raw chromatogram spectra in non-volatile read-only storage.

High-Performance Liquid Chromatography (HPLC) validation assays demonstrated linear regression calibration (R² = 0.9998) across calibration standards ranging from 10.0 mcg/mL to 150.0 mcg/mL. Quantitative recovery percentages remained within acceptable pharmacopeial tolerance limits of 99.1% to 101.4%. The validation committee recommends stability testing under accelerated climatic chamber conditions at 40.0°C and 75% relative humidity.`
  },
  {
    id: 3,
    category: "Banking Financial Reconciliation & Anti-Money Laundering (AML)",
    difficulty: "Master",
    title: "Daily Cross-Border Swift Ledger & Tax Deduction Audit",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'Standard Chartered' এর পরিবর্তে 'Global Clearing Partner' লিখুন এবং সকল তারিখ DD/MM/YYYY ফরম্যাটে রূপান্তর করুন।",
    instruction: "টাকার অংক, ট্রানজেকশন হ্যাশ, একাউন্ট নাম্বার এবং অডিট রেফারেন্স সতর্কতার সাথে টাইপ করুন।",
    text: `AUDIT RECONCILIATION DISPATCH: [ID: TXN-BD-98201-CLR]
Originating Branch: Motijheel Corporate Central (Routing: 095271894).
Counterparty Institution: Standard Chartered Global Clearing (BIC: SCBLBDDX).
Transaction Value: ৳12,74,350.85 [Twelve Lakh Seventy-Four Thousand Three Hundred Fifty Taka and 85/100].

Tax Deducted at Source (TDS under NBR Rule 16/2026): ৳1,27,435.09 (10.00% gross).
Net Liquidity Credited to Treasury Vault: ৳11,46,915.76.
AML Status: Verified against OFAC and UN Sanction Lists; zero adverse matches flagged.
Authorized Approval Token: #AUTH-9901-SHA256-A78F04C. Time: 2026-10-01T14:38:22.091Z. Signed by Chief Compliance Officer.

Interbank Foreign Exchange Settlement confirmation was completed through Bangladesh Bank Real Time Gross Settlement (BD-RTGS) portal. Foreign remittance proceeds were allocated into priority agricultural credit refinance facilities with zero discrepancy between nostro and vostro ledger balances. Internal internal compliance officers have sealed this transaction archive under regulatory retention mandate #AML-REG-771.`
  },
  {
    id: 4,
    category: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রশাসনিক প্রজ্ঞাপন",
    difficulty: "Very Hard",
    title: "স্মারক নং: ৪৬.০২.০০০০.০১২.১৪.০০১.২৬ — সরকারি প্রজ্ঞাপন ও বাজেট নথি",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'পাবলিক প্রকিউরমেন্ট বিধিমালা' এর স্থলে 'পিপিআর-২০০৮ সরকারি বিধিমালা' লিখুন এবং স্মারক কোড বড় হাতের রাখুন।",
    instruction: "বাংলা যুক্তাক্ষর, স্মারক নম্বর, দাঁড়ি ও কমা হুবহু বজায় রেখে টাইপ করুন।",
    text: `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
সংস্থাপন ও প্রশাসনিক সংস্কার বিভাগ
স্মারক নং: ৪৬.০২.০০০০.০১২.১৪.০০১.২৬; তারিখ: ১৫ আশ্বিন ১৪৩৩ বঙ্গাব্দ / ০১ অক্টোবর ২০২৬ খ্রিস্টাব্দ।

প্রজ্ঞাপন: ডিজিটাল উপাত্ত প্রক্রিয়াকরণ ও নথিভুক্তকরণ কার্যক্রমে নিয়োজিত সকল অপারেটরদের নির্দেশক্রমে জানানো যাইতেছে যে, ২০২৬-২০২৭ অর্থবৎসরের বার্ষিক উন্নয়ন কর্মসূচির (এডিপি) উপ-খাত ৪(ক) অনুযায়ী মোট বরাদ্দকৃত ৳৮৭,৫০,০০০.০০ (সাতাশি লক্ষ পঞ্চাশ হাজার টাকা মাত্র) ব্যয়ের নিরীক্ষা প্রতিবেদন আগামী ২১ কার্যদিবসের মধ্যে দাখিল করিতে হইবে।

কোনো প্রকার ভুল তথ্য, অসঙ্গতি বা অননুমোদিত সম্পাদন পরিলক্ষিত হইলে পাবলিক প্রকিউরমেন্ট বিধিমালা (পিপিআর-২০০৮) এর ধারা ১২৭ মোতাবেক শাস্তিমূলক ব্যবস্থা গ্রহণ করা হইবে। আদেশক্রমে— উপসচিব (প্রশাসন-১)।

উক্ত আর্থিক বরাদ্দের আওতায় প্রতিটি মাঠ পর্যায়ের দপ্তরে ক্লাউড সার্ভার সংযোগ স্থাপন, ফাইবার অপটিক নেটওয়ার্ক সংস্কার ও বায়োমেট্রিক নিরাপত্তা ব্যবস্থা আধুনিকীকরণের কাজ সম্পন্ন করিতে হইবে। জেলা প্রশাসক ও হিসাবরক্ষণ কর্মকর্তাদের সমন্বয়ে গঠিত তদারকি কমিটি প্রতি মাসের প্রথম সপ্তাহে অগ্রগতি প্রতিবেদন দাখিল করিতে বাধ্য থাকিবেন।`
  },
  {
    id: 5,
    category: "IT Cloud Infrastructure & API Gateway Security Schema",
    difficulty: "Complex",
    title: "API-Gateway Configuration: Distributed TLS & Rate Limit Specification",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'Strict-Origin' এর স্থানে 'Strict-Transport-Security' লিখুন এবং কার্লি ব্র্যাকেটের ভেতরের ইন্ডেন্টেশন ঠিক রাখুন।",
    instruction: "কোডিং সিনট্যাক্স, কোটেশন মার্ক, কার্লি ব্র্যাকেট এবং এন্ডপয়েন্ট ইউআরএল নিখুঁতভাবে টাইপ করুন।",
    text: `SCHEMA_VERSION = "2.4.0-STABLE";
CLUSTER_CONFIG: {
  "cluster_id": "bd-central-edge-01",
  "endpoint": "https://api.v2.secure-gateway.cloud:8443/v1/auth/exchange",
  "encryption": "AES-256-GCM-SHA384",
  "max_concurrent_connections": 15000,
  "rate_limit": {
    "requests_per_second": 250,
    "burst_threshold": 500,
    "block_duration_sec": 1800
  },
  "headers": {
    "X-Forwarded-Proto": "https",
    "X-Security-Policy": "Strict-Origin-When-Cross-Origin",
    "X-Auth-Token": "Bearer tk_live_89f02c4b819a"
  },
  "circuit_breaker": {
    "error_threshold_percentage": 50,
    "sleep_window_millis": 5000,
    "request_volume_threshold": 20
  },
  "logging_telemetry": {
    "audit_sink": "kafka://internal-logs.datacenter.local:9092/api-events",
    "mask_pii_fields": ["password", "ssn", "national_id", "cvv"]
  }
}`
  },
  {
    id: 6,
    category: "Telecommunications 5G Spectrum Allocation",
    difficulty: "Advanced",
    title: "Spectrum Licensing & Carrier Aggregation Spectrum Manifest",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'Bandwidth' শব্দটির পরিবর্তে 'Throughput Capacity' লিখুন এবং মেগাহার্টজ (MHz) মানগুলো ব্র্যাকেটে রাখুন।",
    instruction: "ফ্রিকোয়েন্সি রেঞ্জ, স্পেকট্রাম কোড ও ডেসিমেল মান সঠিকভাবে টাইপ করুন।",
    text: `Under BTRC Spectrum Allocation Directive #BTRC/LL-2026/091, the National 5G Mid-Band Carrier License is provisionally assigned in the 3.5 GHz spectrum band (3400 MHz to 3600 MHz) with contiguous carrier bandwidth of 100 MHz.

Maximum permissible Effective Isotropic Radiated Power (EIRP) is capped strictly at +62 dBm/sector. Synchronization protocols must adhere to 3GPP Release-18 standards with an inter-operator guard band buffer of 5 MHz to prevent cross-carrier inter-modulation distortion across adjacent base stations.

Beamforming antenna arrays must support 64T64R Massive MIMO configurations operating with orthogonal frequency division multiple access (OFDMA) subcarrier spacing of 30 kHz. Downlink peak theoretical throughput must exceed 1.48 Gbps under clean non-fading radio channel conditions. All base transceiver station telemetry data must be streamed continuously to the National Spectrum Monitoring Central Command in Dhaka.`
  },
  {
    id: 7,
    category: "International Maritime Customs Clearance Manifest",
    difficulty: "Master",
    title: "Bill of Lading & Harmonized Tariff Cargo Ledger",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'Consignee' শব্দের স্থানে 'Authorized Importer of Record' প্রতিস্থাপন করুন।",
    instruction: "এইচএস কোড, কন্টেইনার নম্বর এবং কাস্টমস শুল্ক হার নির্ভুলভাবে টাইপ করুন।",
    text: `CARGO MANIFEST DISPATCH: [BL-NO: MSCUBD901248-CTG]
Vessel Name: MV Bengal Pioneer (IMO: 9814201). Port of Loading: Singapore (SGSIN).
Port of Discharge: Chittagong Sea Port (BDCGP). Consignee: Apex Industrial Logistics Ltd.

Container #MRKU-982104-7 (40ft High Cube HC):
HS Code: 8471.30.00 [Automatic Data Processing Machinery]. Net Weight: 14,850.00 KGS.
Declared Customs Value (CIF): USD $184,500.00 (Converted: BDT ৳2,21,40,000.00).
Customs Duty (CD @ 5.0%): ৳11,07,000.00; Regulatory Duty (RD @ 3.0%): ৳6,64,200.00.
Advance Income Tax (AIT @ 5.0%): ৳11,07,000.00. Verified by Custom House Audit Unit.

Port demurrage exemptions are granted for an initial seven (7) calendar day grace period from the vessel berthing timestamp. Container seals intact: #SL-99014-BD. Physical container cargo stripping must occur in the presence of designated customs appraisal inspectors under ASYCUDA World validation clearance protocol #ASY-2026/7741.`
  },
  {
    id: 8,
    category: "Corporate Shareholders Bylaws & Voting Proxy",
    difficulty: "Very Hard",
    title: "Resolution #BOD-2026/18: Extraordinary General Meeting Charter",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'Shareholder' শব্দটির পরিবর্তে 'Registered Equity Holder' লিখুন।",
    instruction: "ভোটিং শেয়ার, কোরাম পার্সেন্টেজ এবং লিগ্যাল নোটিশ হুবহু টাইপ করুন।",
    text: `At the Extraordinary General Meeting (EGM) of the Board of Directors convened on 28-September-2026 pursuant to Section 85 of the Companies Act 1994, it was unanimously RESOLVED that the authorized equity capital be enhanced from BDT 50,00,00,000.00 to BDT 100,00,00,000.00 divided into 10,00,00,000 ordinary shares of BDT 10.00 each.

Every Shareholder holding not less than 5,000 voting units shall be entitled to cast proxy votes via digital cryptographic tokens. The quorum requirement of 66.67% aggregate voting equity was verified by Independent Scrutineers.

The Board further authorized the Managing Director and Company Secretary to execute all requisite statutory filings with the Registrar of Joint Stock Companies and Firms (RJSC) under Form VIII within thirty (30) calendar days. Notice of rights offering subscription timeline shall be dispatched to all equity holders via registered email and published in two national daily newspapers.`
  },
  {
    id: 9,
    category: "Cybersecurity Threat Intelligence & Incident Response",
    difficulty: "Master",
    title: "SOC Incident Report #IR-2026-904: DDoS Mitigation & Payload Analysis",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'Firewall' এর পরিবর্তে 'Next-Gen Perimeter Gateway' লিখুন।",
    instruction: "আইপি এড্রেস, হ্যাশ ভ্যালু এবং সিকিউরিটি লগ নিখুঁতভাবে টাইপ করুন।",
    text: `SECURITY OPERATIONS CENTER INCIDENT DISPATCH:
Timestamp: 2026-10-01T03:14:59Z. Severity Level: CRITICAL (CVSS v3.1: 9.8).
Target Asset: Authentication Cluster [IP: 103.145.89.24:443].
Threat Vector: Synchronized Distributed Reflection SYN-Flood peaking at 48.6 Gbps / 12.4 Mpps.

Automated Mitigation Action: Firewall rate-limiting triggered in 120 milliseconds.
Malicious Traffic Scrubbed: 99.85% dropped at tier-1 upstream transit edges.
Sha256 Payload Signature: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.
System status restored to baseline normal operation at 03:22:15Z.

Post-incident root cause forensics identified distributed botnet nodes initiating amplification vectors via unauthenticated NTP servers. Security engineers have applied ingress ACL filters across all border BGP routers and upgraded the DDoS mitigation threshold to 150 Gbps with real-time zero-day packet inspection enabled.`
  },
  {
    id: 10,
    category: "Environmental Biodiversity & Carbon Credit Verification",
    difficulty: "Complex",
    title: "Sundarbans Mangrove Afforestation Carbon Offset Audit",
    timeLimitMinutes: 30,
    mandatoryCondition: "শর্ত: 'Carbon Offset' এর স্থানে 'Verified Carbon Unit (VCU)' লিখুন।",
    instruction: "হেক্টর পরিমাপ, বায়োমাস ডেনসিটি এবং কিউবিক মিটার মান সঠিকভাবে টাইপ করুন।",
    text: `Under the United Nations REDD+ Framework (Project Ref: #BD-MANGROVE-2026), third-party ecological auditors conducted comprehensive canopy density LiDAR assessments across 14,500 hectares of the Sundarbans Mangrove Reserve.

Total estimated above-ground biomass carbon sequestration reached 384.5 tCO2e/hectare per annum. The Carbon Offset credits generated for FY 2025-2026 totaled 1,48,500 VCUs, verified under Verra Verified Carbon Standard (VCS-v4.3). Zero deforestation encroachments were recorded along the baseline perimeter.

Soil organic carbon (SOC) depth profiles analyzed up to 100 cm depth indicated mean sediment carbon storage density of 241.8 Mg C/ha. Community co-benefit initiatives distributed 15% of gross carbon revenue dividends to local coastal forest ranger cooperatives, financing solar microgrids and mangrove seedling nurseries in Khulna and Bagerhat coastal districts.`
  }
];

export const TypingWork = () => {
  return (
    <ModuleGuard moduleId="typing" title="Typing Work">
      <TypingApp />
    </ModuleGuard>
  );
};

const TypingApp = () => {
  const { user, profile } = useAuth();

  // Task selection
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const currentTask = ADVANCED_10_TASKS[selectedTaskIndex];

  // Agreement
  const [agreed, setAgreed] = useState(false);

  // Typing inputs & metrics
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pasteAttempts, setPasteAttempts] = useState(0);

  // 30-Minute Timer State (30 minutes = 1800 seconds)
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Screen recording video proof link state
  const [videoProofLink, setVideoProofLink] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [recordingNotes, setRecordingNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset timer on task change
  useEffect(() => {
    setRemainingSeconds(currentTask.timeLimitMinutes * 60);
    setIsTimerRunning(false);
    setInputText('');
    setStartTime(null);
    setPasteAttempts(0);
    setVideoProofLink('');
    setVideoFile(null);
    setVideoFileName('');
    setValidationError(null);
    setIsSubmittedSuccess(false);
  }, [selectedTaskIndex]);

  // 30-Minute Countdown Timer Hook
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, remainingSeconds]);

  // Calculate live typing accuracy & metrics
  const metrics = useMemo(() => {
    const target = currentTask.text;
    const typed = inputText;
    
    let matchingChars = 0;
    const minLength = Math.min(target.length, typed.length);
    for (let i = 0; i < minLength; i++) {
      if (target[i] === typed[i]) {
        matchingChars++;
      }
    }

    const accuracy = typed.length > 0 
      ? Math.max(0, Math.min(100, Math.round((matchingChars / typed.length) * 100))) 
      : 100;

    const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
    let wpm = 0;
    if (startTime && wordsTyped > 0) {
      const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
      wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    }

    const progress = Math.min(100, Math.round((typed.length / target.length) * 100));

    return {
      accuracy,
      wpm,
      progress,
      typedChars: typed.length,
      targetChars: target.length,
      errors: typed.length - matchingChars
    };
  }, [inputText, currentTask.text, startTime]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!startTime) {
      setStartTime(Date.now());
      setIsTimerRunning(true);
    }
    setInputText(e.target.value);
    setValidationError(null);
  };

  // Block pasting to enforce manual typing
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempts(prev => prev + 1);
    setValidationError("⚠️ কপি-পেস্ট সম্পূর্ণ নিষিদ্ধ! আপনাকে নিজ হাতে কীবোর্ডে বা ফোনে টাইপ করতে হবে।");
  };

  // Handle Video File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setValidationError("দয়া করে একটি সঠিক ভিডিও ফাইল (.mp4, .webm, .mov) আপলোড করুন।");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setValidationError("ভিডিও ফাইলটির সাইজ খুব বড়। ১০০ মেগাবাইটের মধ্যে ভিডিও আপলোড করুন অথবা গুগল ড্রাইভ লিংক দিন।");
      return;
    }

    setVideoFile(file);
    setVideoFileName(file.name);
    setValidationError(null);
  };

  // Format seconds to mm:ss
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submission Handler
  const handleSubmitTask = async () => {
    setValidationError(null);

    // 1. Check completion length
    if (inputText.length < currentTask.text.length * 0.60) {
      setValidationError(`টাইপিং এখনও অসম্পূর্ণ! টাস্কের অন্তত ৬০% নির্ভুলভাবে টাইপ করতে হবে (বর্তমান অগ্রগতি: ${metrics.progress}%)।`);
      return;
    }

    // 2. Mandatory Screen Recording Proof Check
    const hasScreenRecording = Boolean(videoProofLink.trim().length > 5 || videoFile);
    if (!hasScreenRecording) {
      setValidationError("⚠️ স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ লিংক দেওয়া হয়নি! এআই ব্যবহার প্রতিরোধ ও জেনুইন কাজের প্রমাণ হিসেবে টাইপ করার সময় স্ক্রিন রেকর্ডিং ভিডিওর লিংক (গুগল ড্রাইভ / লুম / ড্রপবক্স / ইউটিউব) সাবমিট করা বাধ্যতামূলক।");
      return;
    }

    if (!user) {
      setValidationError("আপনার লগইন সেশন পাওয়া যায়নি। অনুগ্রহ করে পুনরায় লগইন করুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalVideoData = videoProofLink.trim() || (videoFileName ? `Uploaded File: ${videoFileName}` : 'Screen Recording Provided');

      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        userName: profile?.fullName || 'Student User',
        userPhone: profile?.whatsappNumber || 'N/A',
        studentIdCode: profile?.studentIdCode || 'N/A',
        module: 'typing',
        moduleTitle: 'Typing Work (Screen Recording & Condition Verified)',
        taskTitle: currentTask.title,
        taskCategory: currentTask.category,
        accuracy: metrics.accuracy,
        wpm: metrics.wpm,
        totalChars: metrics.typedChars,
        targetChars: metrics.targetChars,
        mandatoryCondition: currentTask.mandatoryCondition,
        videoUrl: finalVideoData,
        videoProofType: videoProofLink.trim() ? 'external_cloud_link' : 'uploaded_file',
        notes: recordingNotes.trim(),
        details: `Task: ${currentTask.title}\nCategory: ${currentTask.category}\nAccuracy: ${metrics.accuracy}%\nSpeed: ${metrics.wpm} WPM\nTyped: ${metrics.typedChars}/${metrics.targetChars} chars\nScreen Recording Proof: ${finalVideoData}\nCondition: ${currentTask.mandatoryCondition}`,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setValidationError("সাবমিশন ব্যর্থ হয়েছে: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (isSubmittedSuccess) {
    return (
      <div className="p-4 sm:p-6 min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-blue-200 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Submitted to Admin Queue
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              টাইপিং ও স্ক্রিন রেকর্ড সাবমিশন সফল!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              আপনার টাইপিং প্যারাগ্রাফ এবং কাজের স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ লিংক সফলভাবে অ্যাডমিন প্যানেলে জমা হয়েছে।
            </p>
          </div>

          {/* Submission Metrics Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">একুরেসি</div>
              <div className="text-sm font-extrabold text-emerald-600 font-mono mt-0.5">{metrics.accuracy}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">টাইপিং স্পিড</div>
              <div className="text-sm font-extrabold text-blue-600 font-mono mt-0.5">{metrics.wpm} WPM</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">অগ্রগতি</div>
              <div className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">{metrics.progress}%</div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmittedSuccess(false);
              setSelectedTaskIndex((prev) => (prev + 1) % ADVANCED_10_TASKS.length);
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer"
          >
            পরবর্তী টাইপিং টাস্ক শুরু করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto pb-28 space-y-4 font-sans">
      
      {/* Top Header Banner with 30-Minute Live Countdown Timer */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1 mb-1.5">
              <PenTool size={12} />
              <span>Project #{currentTask.id}: {currentTask.difficulty} Level</span>
            </span>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight">
              {currentTask.title}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
              প্যারাগ্রাফটি নিজে টাইপ করুন এবং কাজের সম্পূর্ণ স্ক্রিন রেকর্ডিং ভিডিও লিংক প্রমাণসহ সাবমিট করুন।
            </p>
          </div>

          {/* 30-MINUTE PROJECT COUNTDOWN TIMER */}
          <div className="bg-slate-950/90 border border-blue-500/30 px-4 py-2.5 rounded-2xl text-center shrink-0 w-full sm:w-auto shadow-inner">
            <div className="text-[10px] uppercase font-bold text-blue-300 flex items-center justify-center gap-1">
              <Timer size={13} className={remainingSeconds < 300 ? "text-rose-400 animate-spin" : "text-blue-400"} />
              <span>প্রজেক্ট সময়সীমা</span>
            </div>
            <div className={`text-2xl font-black font-mono mt-0.5 tracking-wider ${
              remainingSeconds < 300 ? "text-rose-400 animate-pulse" : "text-emerald-400"
            }`}>
              {formatTimer(remainingSeconds)}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              {isTimerRunning ? 'টাইমার চলমান' : 'টাইপ শুরু করলে চালু হবে'}
            </div>
          </div>
        </div>

        {/* Task Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-300">টাস্ক নির্বাচন ({selectedTaskIndex + 1}/১০):</span>
          </div>

          <select
            value={selectedTaskIndex}
            onChange={(e) => {
              setSelectedTaskIndex(Number(e.target.value));
              setValidationError(null);
            }}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            {ADVANCED_10_TASKS.map((t, idx) => (
              <option key={t.id} value={idx}>
                #{t.id}: {t.title.slice(0, 32)}... (৩০ মিনিট)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MANDATORY SCREEN RECORDING NOTICE */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border-2 border-blue-300 rounded-2xl p-4 text-blue-950 space-y-2">
        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-blue-900">
          <Video size={17} className="text-blue-600 shrink-0" />
          <span>বাধ্যতামূলক নিয়ম: টাইপিংয়ের স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ সাবমিশন</span>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">
          এআই (ChatGPT, Gemini, Bot) বা অটোমেশন স্ক্রিপ্ট ব্যবহার সম্পূর্ণ নিষিদ্ধ। কাজ শুরু করার আগে আপনার ফোন বা কম্পিউটারের স্ক্রিন রেকর্ডার চালু করুন এবং টাইপ করার পুরো সময়টি স্ক্রিন রেকর্ড করে তার গুগল ড্রাইভ (Google Drive) বা লুম (Loom) লিংক নিচে দিন।
        </p>
      </div>

      {/* MANDATORY CONDITIONAL MODIFICATION RULE */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-950 space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
          <Zap size={15} className="text-amber-600 shrink-0" />
          <span>বাধ্যতামূলক শর্ত (Mandatory Condition):</span>
        </div>
        <p className="text-xs font-semibold text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200">
          {currentTask.mandatoryCondition}
        </p>
      </div>

      {/* MAIN TYPING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column: Target Reference Paragraph (Large Expanded 3x Text) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                মূল প্যারাগ্রাফ (দেখে দেখে টাইপ করুন):
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                মোট ক্যারেক্টার: {currentTask.text.length}
              </span>
            </div>

            <div 
              onCopy={(e) => {
                e.preventDefault();
                setValidationError("⚠️ মূল টেক্সট কপি করা নিষিদ্ধ! দেখে দেখে কীবোর্ডে টাইপ করুন।");
              }}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-wrap select-none max-h-[380px] overflow-y-auto"
            >
              {currentTask.text}
            </div>
          </div>

          <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-1.5">
            <Info size={14} className="text-blue-600 shrink-0" />
            <span>বিরামচিহ্ন, বড়-ছোট হাতের অক্ষর ও স্পেসের সঠিক ব্যবহারে একুরেসি বাড়ে।</span>
          </div>
        </div>

        {/* Right Column: User Typing Input Area */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                আপনার টাইপিং ইনপুট এরিয়া:
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-600">
                {metrics.typedChars} / {metrics.targetChars} Chars
              </span>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder="স্ক্রিন রেকর্ড অন করে এখানে মূল প্যারাগ্রাফটি দেখে দেখে নির্ভুলভাবে টাইপ করা শুরু করুন..."
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 font-mono leading-relaxed focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Live Typing Metrics Bar */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">একুরেসি</div>
              <div className="text-xs font-black font-mono text-emerald-600">{metrics.accuracy}%</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">স্পিড</div>
              <div className="text-xs font-black font-mono text-blue-600">{metrics.wpm} WPM</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">অগ্রগতি</div>
              <div className="text-xs font-black font-mono text-slate-800">{metrics.progress}%</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">ভুল শব্দ</div>
              <div className="text-xs font-black font-mono text-rose-500">{metrics.errors}</div>
            </div>
          </div>

        </div>

      </div>

      {/* SCREEN RECORDING VIDEO PROOF SUBMISSION FORM */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Video size={16} />
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ সাবমিশন (Screen Recording Proof)
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            কাজের সত্যতা যাচাইয়ের জন্য আপনার কাজের স্ক্রিন রেকর্ডিংয়ের গুগল ড্রাইভ লিংক দিন অথবা ভিডিও ফাইল আপলোড করুন।
          </p>
        </div>

        {/* Video Link Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            গুগল ড্রাইভ / লুম / ড্রপবক্স / ইউটিউব ভিডিও লিংক <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={videoProofLink}
              onChange={(e) => {
                setVideoProofLink(e.target.value);
                setValidationError(null);
              }}
              placeholder="https://drive.google.com/file/d/... অথবা https://www.loom.com/share/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
            />
            <Link2 size={15} className="absolute left-3 top-3 text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400">
            * গুগল ড্রাইভ লিংক দিলে ড্রাইভের এক্সেস যেন "Anyone with the link can view" করা থাকে।
          </p>
        </div>

        {/* Direct Video File Upload Fallback */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            অথবা সরাসরি ভিডিও ফাইল আপলোড করুন (ঐচ্ছিক):
          </label>
          <div className="flex items-center gap-3">
            <label className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-200">
              <Upload size={14} />
              <span>ভিডিও ফাইল নির্বাচন করুন</span>
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
            {videoFileName && (
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 truncate max-w-xs">
                ✓ {videoFileName}
              </span>
            )}
          </div>
        </div>

        {/* Extra Notes Input */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            কাজের নোট বা মন্তব্য (ঐচ্ছিক):
          </label>
          <input
            type="text"
            value={recordingNotes}
            onChange={(e) => setRecordingNotes(e.target.value)}
            placeholder="প্রজেক্ট সম্পর্কে কোনো বিশেষ মন্তব্য থাকলে লিখুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
          <AlertCircle size={17} className="text-rose-500 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Agreement Checkbox */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 cursor-pointer" onClick={() => setAgreed(!agreed)}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 rounded text-blue-600 cursor-pointer"
        />
        <span className="text-xs text-slate-700 font-medium select-none">
          আমি ঘোষণা করছি যে আমি নিজে টাইপ করেছি এবং আমার স্ক্রিন রেকর্ডিং ভিডিওর লিংক সঠিকভাবে প্রদান করেছি।
        </span>
      </div>

      {/* Final Submit Button */}
      <button
        onClick={handleSubmitTask}
        disabled={isSubmitting || !agreed || inputText.length < 50}
        className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 active:scale-[0.99] text-white font-bold py-4 rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <CheckCircle2 size={16} />
        <span>{isSubmitting ? 'সাবমিট হচ্ছে...' : 'টাইপিং ও স্ক্রিন রেকর্ড সাবমিট করুন'}</span>
      </button>

    </div>
  );
};
