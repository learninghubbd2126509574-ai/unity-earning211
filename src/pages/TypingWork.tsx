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
  Timer,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Bot,
  RotateCcw,
  Activity
} from 'lucide-react';

interface TypingTask {
  id: number;
  category: string;
  difficulty: 'Very Hard' | 'Complex' | 'Advanced' | 'Master';
  title: string;
  timeLimitMinutes: number;
  instructionSteps: string[];
  text: string;
  mandatoryCondition?: string;
}

const ADVANCED_10_TASKS: TypingTask[] = [
  {
    id: 1,
    category: "Commercial Legal Contract & Indenture Clauses",
    difficulty: "Complex",
    title: "Section 14(c) Commercial Lease & Escrow Indemnity Agreement",
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. মূল নথির ফরম্যাট বজায় রেখে অনুচ্ছেদটি টাইপ করুন।",
      "২. 'Lessee' শব্দটি প্রতিস্থাপন করে 'Authorized Tenant' লিখুন।",
      "৩. সকল টাকার অংক প্রথম বন্ধনীতে (Parentheses) আবদ্ধ করুন।",
      "৪. তারিখের ফরম্যাট DD-Month-YYYY অনুযায়ী লিখুন।",
      "৫. সকল অংকীয় মান কমা (,) দিয়ে পৃথক করুন।",
      "৬. বিরামচিহ্ন ও ব্র্যাকেটের নির্ভুলতা যাচাই করুন।",
      "৭. 'Section 14(c)' অংশটি সম্পূর্ণ বোল্ড করুন।",
      "৮. 'Escrow Account' এর পর সঠিক IBAN নম্বরটি বসান।",
      "৯. সকল শতাংশের (%) মান দশমিকের পর দুই ঘর পর্যন্ত রাখুন।",
      "১০. অনুচ্ছেদের শেষে কোনো বাড়তি স্পেস রাখবেন না।"
    ],
    text: `Pursuant to Section 14(c) of the Master Commercial Lease Agreement (Ref: #LSE-2026/894-BD), the Authorized Tenant shall irrevocably deposit the aggregate sum of BDT 4,87,500.00 into the designated Escrow Account [IBAN: BD92-SBIN-0004-9812-7634] no later than 17:00 BST on 15-November-2026. 

Failure to remit said escrow collateral within five (5) statutory business days shall trigger an automatic liquidated damage surcharge of 2.75% per diem, compounded weekly under Clause 22.4(a). Neither party may assign, novate, or hypothecate its respective rights hereunder without prior written unanimous consent of the Board of Arbitrators (§ 9.2). All formal communications must be dispatched via registered courier with verifiable proof-of-delivery receipts.

Furthermore, the Authorized Tenant agrees to maintain comprehensive general liability insurance coverage with minimum single-limit indemnity of BDT 25,00,000.00 throughout the entire five-year lease tenure. Any structural alterations or electrical retrofitting must receive structural engineering compliance certificates under the Regional Building Code (RBC-2020). The Lessor covenants peaceful possession subject to regular quarterly safety inspections with forty-eight (48) hours prior notification.`
  },
  {
    id: 2,
    category: "Clinical Laboratory Trial & Pharmaceutical Research",
    difficulty: "Advanced",
    title: "Protocol #CT-8092-B: In Vitro Bio-Equivalence & Solvency Assay",
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'Acetylsalicylic Acid' এর স্থানে 'Compound-ASA (BP/USP)' লিখুন।",
      "২. সকল তাপমাত্রার মান বোল্ড ক্যাপিটালে রাখুন।",
      "৩. রাসায়নিক সংকেতগুলো হুবহু টাইপ করুন।",
      "৪. দশমিকের মান নিখুঁতভাবে টাইপ করুন।",
      "৫. 'lambda_max' শব্দটি ইটালিক করুন।",
      "৬. সকল শতাংশের (%) মান দশমিকের পর দুই ঘর পর্যন্ত রাখুন।",
      "৭. 'Batch #BX-0914-K' অংশটি হাইলাইট করুন।",
      "৮. ব্র্যাকেটের ভেতরের মানগুলো সঠিক রাখুন।",
      "৯. HPLC রিপোর্ট ফরম্যাট বজায় রাখুন।",
      "১০. নির্ভুলতা যাচাইয়ের জন্য রিচেক দিন।"
    ],
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
    instructionSteps: [
      "১. 'Standard Chartered' এর পরিবর্তে 'Global Clearing Partner' লিখুন।",
      "২. সকল তারিখ DD/MM/YYYY ফরম্যাটে রূপান্তর করুন।",
      "৩. টাকার অংকগুলো বাংলায় লিখুন।",
      "৪. অডিট রেফারেন্স সঠিক ভাবে টাইপ করুন।",
      "৫. ট্রানজেকশন হ্যাশ হুবহু টাইপ করুন।",
      "৬. শতাংশের (%) মান দশমিকের পর দুই ঘর রাখুন।",
      "৭. এনবিআর রুল নম্বরটি বোল্ড করুন।",
      "৮. ব্যাংক রাউটিং নম্বর সঠিক রাখুন।",
      "৯. কোনো প্রকার বাড়তি স্পেস দেবেন না।",
      "১০. ডেটাগুলো নির্ভুল কি না যাচাই করুন।"
    ],
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
    instructionSteps: [
      "১. 'পাবলিক প্রকিউরমেন্ট বিধিমালা' এর স্থলে 'পিপিআর-২০০৮ সরকারি বিধিমালা' লিখুন।",
      "২. স্মারক কোড এবং নম্বর বড় হাতের অক্ষরে রাখুন।",
      "৩. বাংলা যুক্তাক্ষরগুলো সঠিকভাবে টাইপ করুন।",
      "৪. দাঁড়ি ও কমা হুবহু বজায় রাখুন।",
      "৫. টাকার অংকটি বন্ধনীতে আবদ্ধ করুন।",
      "৬. এডিপি খাতটি হাইলাইট করুন।",
      "৭. তারিখের ফরম্যাট ঠিক রাখুন।",
      "৮. প্রজ্ঞাপনের আদেশ অংশটি বোল্ড করুন।",
      "৯. কোনো বানান ভুল করবেন না।",
      "১০. পুরো নথিটি একবার রিভিউ করুন।"
    ],
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
    instructionSteps: [
      "১. 'Strict-Origin' এর স্থানে 'Strict-Transport-Security' লিখুন।",
      "২. কার্লি ব্র্যাকেটের ভেতরের ইন্ডেন্টেশন ঠিক রাখুন।",
      "৩. কোডিং সিনট্যাক্স সঠিকভাবে টাইপ করুন।",
      "৪. কোটেশন মার্কগুলো হুবহু দিন।",
      "৫. এন্ডপয়েন্ট ইউআরএল পরিবর্তন করবেন না।",
      "৬. কনফিগুরেশন কি-গুলো লোয়ারকেসে রাখুন।",
      "৭. নম্বরগুলো কমা দিয়ে পৃথক করুন।",
      "৮. লগিং টেলিমেট্রি অংশটি বোল্ড করুন।",
      "৯. বাড়তি স্পেস ও ট্যাব ঠিক রাখুন।",
      "১০. কোড ফরম্যাট যাচাই করুন।"
    ],
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
    instructionSteps: [
      "১. 'Bandwidth' শব্দটির পরিবর্তে 'Throughput Capacity' লিখুন।",
      "২. মেগাহার্টজ (MHz) মানগুলো ব্র্যাকেটে রাখুন।",
      "৩. ফ্রিকোয়েন্সি রেঞ্জ নির্ভুলভাবে টাইপ করুন।",
      "৪. স্পেকট্রাম কোড বড় হাতের অক্ষরে রাখুন।",
      "৫. ডেসিমেল মানগুলো ঠিক রাখুন।",
      "৬. EIRP এর মান বোল্ড করুন।",
      "৭. 3GPP রিলিজ নম্বর ঠিক রাখুন।",
      "৮. 64T64R অংশটি হাইলাইট করুন।",
      "৯. কোনো স্পেলিং মিস্টেক করবেন না।",
      "১০. রিপোর্টটি ফাইনাল চেক করুন।"
    ],
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
    instructionSteps: [
      "১. 'Chittagong Port' এর স্থলে 'Chattogram Sea Port Terminal-1' লিখুন।",
      "২. সকল ওজন টন (MT) এককে রূপান্তর করুন।",
      "৩. কনটেইনার নম্বর হুবহু টাইপ করুন।",
      "৪. এইচএস কোড সঠিক ভাবে লিখুন।",
      "৫. কাস্টমস শুল্ক শতাংশগুলো ঠিক রাখুন।",
      "৬. ভ্যাট মানগুলো বন্ধনীতে রাখুন।",
      "৭. কার্গো ম্যানিফেস্ট অংশটি বোল্ড করুন।",
      "৮. তারিখের ফরম্যাট ঠিক রাখুন।",
      "৯. কোনো বাড়তি কমা বা ডট দেবেন না।",
      "১০. পুরো বিল অব ল্যাডিং রিভিউ করুন।"
    ],
    text: `OCEAN BILL OF LADING [B/L NO: OOCL-CTG-9821094-A]
Vessel Name: M.V. Bengal Star (Voyage #26-08W, IMO: 9482104).
Port of Loading: Port of Singapore (SGSIN).
Port of Discharge: Chittagong Port (BDCGP).
Consignee: Beximco Synthetics Industrial Zone, Gazipur, Bangladesh.

CARGO MANIFEST DETAILS:
- 40ft High Cube Container #TGHU-918234-7: Industrial Polyester Filament Yarn.
- Gross Weight: 24,850 kg; Tare Weight: 3,980 kg; Net Weight: 20,870 kg.
- HS Tariff Code: 5402.33.00 (Statutory Import Duty: 15.00% + Regulatory Duty: 3.00%).
- Advance Income Tax (AIT): ৳84,200.00; Value Added Tax (VAT 15%): ৳2,46,800.00.

Customs Assessment Notice #CUS-OFF-7718 certifies non-hazardous declaration. Clearing Agent: Maritime Logistics Clearing & Forwarding Ltd. (Customs License #094-CTG). The shipping line guarantees demurrage-free detention period of fourteen (14) calendar days following physical berth docking.`
  },
  {
    id: 8,
    category: "Biomedical Genetics & DNA Sequencing Manifest",
    difficulty: "Master",
    title: "Next-Generation Genomic Variant Sequencing Report",
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'Polymerase Chain Reaction' এর স্থানে 'Quantitative Real-Time PCR (qPCR)' লিখুন।",
      "২. জিন মিউটেশন কোড বোল্ড করুন।",
      "৩. নিউক্লিওটাইড সিকোয়েন্স হুবহু টাইপ করুন।",
      "৪. বৈজ্ঞানিক নাম ইটালিক রাখুন।",
      "৫. ক্রোমোজোম নম্বর ঠিক রাখুন।",
      "৬. VAF মান দশমিকের পর এক ঘর রাখুন।",
      "৭. সিকোয়েন্সিং প্লাটফর্মের নাম ঠিক রাখুন।",
      "৮. কোনো প্রকার বানান ভুল করবেন না।",
      "৯. সব নম্বর কমা দিয়ে পৃথক করুন।",
      "১০. রিপোর্টটি একবার চেক করুন।"
    ],
    text: `GENOMIC DIAGNOSTIC SUMMARY: [Sample ID: #DNA-BD-44091]
Sequencing Platform: Illumina NovaSeq 6000 (Paired-End 150bp Read Length).
Target Region: Exome Sequencing Panel covering 22,000 coding genes.
Mean Sequencing Coverage Depth: 128.4x (99.2% targets > 30x coverage).

Detected Pathogenic Variant: BRCA1 (NM_007294.4):c.5266dupC (p.Gln1756ProfsTer74).
Zygosity: Heterozygous in Exon 20. Classification: Pathogenic (ACMG/AMP Guidelines).
Alternative Variant Identified: TP53 (NM_000546.6):c.743G>A (p.Arg248Gln) with variant allele frequency (VAF) of 48.7%.

Validation was performed via targeted Sanger sequencing following Polymerase Chain Reaction amplification. Bioinformatics alignment utilized human reference genome GRCh38 (hg38) with BWA-MEM algorithm and variant calling via GATK HaplotypeCaller (v4.4). Genetic counseling is advised for all primary pedigree relatives.`
  },
  {
    id: 9,
    category: "Cybersecurity Incident Forensics & DDoS Intrusion Triage",
    difficulty: "Advanced",
    title: "CERT-BD Incident Report #IR-2026-904: Critical Tier-1 Triage",
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'SYN-Flood' এর জায়গায় 'Volumetric Distributed TCP SYN-Flood' লিখুন।",
      "২. আইপি অ্যাড্রেস ব্র্যাকেটে রাখুন।",
      "৩. টাইমস্ট্যাম্প হুবহু টাইপ করুন।",
      "৪. হ্যাশ কোড নির্ভুলভাবে টাইপ করুন।",
      "৫. পোর্ট নম্বর ঠিক রাখুন।",
      "৬. Severity লেভেল বোল্ড করুন।",
      "৭. Firewall রেট লিমিটিং অংশটি হাইলাইট করুন।",
      "৮. কোনো প্রকার বাড়তি কমা দেবেন না।",
      "৯. ইনগ্রেস ACL ফিল্টার ঠিক রাখুন।",
      "১০. রিপোর্টটি ফাইনাল রিভিউ করুন।"
    ],
    text: `NATIONAL CYBER SECURITY RESPONSE PROTOCOL: [INCIDENT #IR-2026-904]
Timestamp: 2026-10-01T02:14:09.481Z. Severity: Level-4 (High Criticality).
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
    instructionSteps: [
      "১. 'Carbon Offset' এর স্থানে 'Verified Carbon Unit (VCU)' লিখুন।",
      "২. হেক্টর পরিমাপ বোল্ড করুন।",
      "৩. বায়োমাস ডেনসিটি হুবহু লিখুন।",
      "৪. কিউবিক মিটার মান ঠিক রাখুন।",
      "৫. REDD+ প্রজেক্ট রেফারেন্স ঠিক রাখুন।",
      "৬. শতাংশের (%) মান সঠিক রাখুন।",
      "৭. soil organic carbon অংশটি হাইলাইট করুন।",
      "৮. কোনো প্রকার স্পেলিং ভুল করবেন না।",
      "৯. সব নম্বর কমা দিয়ে পৃথক করুন।",
      "১০. পুরো রিপোর্টটি চেক করুন।"
    ],
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

  // Batch submissions tracking (1 to 10 tasks)
  const [submittedCount, setSubmittedCount] = useState<number>(() => {
    return Number(localStorage.getItem('unity_typing_submitted_count') || 0);
  });
  const [submittedTaskIds, setSubmittedTaskIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('unity_typing_submitted_ids') || '[]');
    } catch {
      return [];
    }
  });

  // Deep Analysis & Evaluation States
  const [isAnalyzingBatch, setIsAnalyzingBatch] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [batchEvaluationResult, setBatchEvaluationResult] = useState<'none' | 'ai_detected' | 'system_rejected'>('none');
  const [analysisRemainingSeconds, setAnalysisRemainingSeconds] = useState(120);

  // Agreement
  const [agreed, setAgreed] = useState(false);

  // Typing inputs & metrics
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pasteAttempts, setPasteAttempts] = useState(0);

  // 30-Minute Timer State (30 minutes = 1800 seconds) - Starts immediately
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Screen recording video proof link state
  const [videoProofLink, setVideoProofLink] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [recordingNotes, setRecordingNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset timer on task change and keep it running smoothly
  useEffect(() => {
    setRemainingSeconds(currentTask.timeLimitMinutes * 60);
    setIsTimerRunning(true);
    setStartTime(Date.now());
    setInputText('');
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

  // 120-second batch verification timer hook
  useEffect(() => {
    let timer: any = null;
    if (isAnalyzingBatch) {
      setAnalysisProgress(0);
      setAnalysisRemainingSeconds(120);
      setAnalysisStepText('১০টি টাইপিং টাস্কের সামগ্রিক ডাটা ও কি-স্ট্রোক অডিট শুরু হয়েছে...');

      timer = setInterval(() => {
        setAnalysisRemainingSeconds(prev => {
          const nextSec = prev - 1;
          const pct = Math.min(100, Math.round(((120 - nextSec) / 120) * 100));
          setAnalysisProgress(pct);

          // Update message dynamically based on progress percent
          if (pct < 15) {
            setAnalysisStepText('১০টি টাইপিং টাস্কের সামগ্রিক ডাটা ও কি-স্ট্রোক অডিট শুরু হয়েছে...');
          } else if (pct < 35) {
            setAnalysisStepText('কি-স্ট্রোক লেটেন্সি, টাইপিং ক্যাডেন্স ও টাইম ইন্টারভাল বিশ্লেষণ চলছে...');
          } else if (pct < 55) {
            setAnalysisStepText('সিস্টেম ডিপ লার্নিং এআই প্যাটার্ন রিকগনিশন ও সিনট্যাক্স স্ক্যানিং...');
          } else if (pct < 75) {
            setAnalysisStepText('স্ক্রিন রেকর্ড ভিডিও এবং জমা দেওয়া প্রমাণের সত্যতা স্ক্যান করা হচ্ছে...');
          } else if (pct < 90) {
            setAnalysisStepText('গুগল ড্রাইভ/লুম লিংকের কনটেন্ট এনালাইসিস ভেরিফিকেশন চলছে...');
          } else {
            setAnalysisStepText('অডিট সম্পন্ন! সেন্ট্রাল কোয়ালিটি ফলাফল প্রস্তুত হচ্ছে...');
          }

          if (nextSec <= 0) {
            clearInterval(timer);
            setIsAnalyzingBatch(false);
            // If accuracy is exactly 100% -> Flag AI 100%
            // If normal/imperfect -> Show System Detection Rejected
            if (metrics.accuracy >= 100) {
              setBatchEvaluationResult('ai_detected');
            } else {
              setBatchEvaluationResult('system_rejected');
            }
            return 0;
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAnalyzingBatch, metrics.accuracy]);

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

  // Restart All 10 Tasks from Beginning
  const handleRestartBatch = () => {
    localStorage.removeItem('unity_typing_submitted_count');
    localStorage.removeItem('unity_typing_submitted_ids');
    setSubmittedCount(0);
    setSubmittedTaskIds([]);
    setBatchEvaluationResult('none');
    setIsSubmittedSuccess(false);
    setSelectedTaskIndex(0);
    setInputText('');
    setStartTime(null);
    setVideoProofLink('');
    setVideoFile(null);
    setVideoFileName('');
    setValidationError(null);
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

      // Save submission record
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

      const nextSubmittedCount = submittedCount + 1;
      const nextTaskIds = Array.from(new Set([...submittedTaskIds, currentTask.id]));
      
      setSubmittedCount(nextSubmittedCount);
      setSubmittedTaskIds(nextTaskIds);
      localStorage.setItem('unity_typing_submitted_count', String(nextSubmittedCount));
      localStorage.setItem('unity_typing_submitted_ids', JSON.stringify(nextTaskIds));

      // CHECK IF 10 SUBMISSIONS ARE REACHED (OR 10TH TASK REACHED)
      const isBatchCompleted = nextSubmittedCount >= 10 || selectedTaskIndex === 9;

      if (isBatchCompleted) {
        // Trigger Realistic Deep Loading & AI Analysis Simulation
        setIsAnalyzingBatch(true);
      } else {
        // Standard single task success
        setIsSubmittedSuccess(true);
      }

    } catch (err: any) {
      console.error("Submission error:", err);
      setValidationError("সাবমিশন ব্যর্থ হয়েছে: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 1. LOADING SCREEN: 10 SUBMISSIONS ANALYSIS
  // ==========================================
  if (isAnalyzingBatch) {
    return (
      <div className="p-4 sm:p-6 min-h-[80vh] flex items-center justify-center font-sans">
        <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-10 max-w-lg w-full border border-slate-800 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Animated AI Radar Scanner */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-400 animate-spin-slow"></div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg relative z-10">
              <Cpu size={30} className="text-white animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-extrabold uppercase tracking-wider">
              <Activity size={12} className="animate-pulse" />
              <span>Deep System Verification In Progress</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
              ১০টি টাইপিং টাস্কের সিস্টেম অডিট চলছে...
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              সেন্ট্রাল অ্যালগরিদম দ্বারা আপনার টাইপিংয়ের কি-স্ট্রোক রিদম, স্পিড, বিরামচিহ্ন ও এআই প্যাটার্ন পরীক্ষা করা হচ্ছে।
            </p>
          </div>

          {/* Progress Bar & Status Text */}
          <div className="space-y-2.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-blue-400 font-bold">স্ক্যান অগ্রগতি</span>
              <span className="text-emerald-400 font-bold font-mono">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-300 font-medium truncate pt-1">
              🔍 {analysisStepText}
            </p>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 bg-slate-950/40 py-2 px-4 rounded-xl border border-slate-850">
            <Clock size={12} className="text-orange-400 animate-pulse" />
            <span className="font-semibold text-orange-400 font-mono">
              ভেরিফিকেশন সম্পন্ন হতে বাকি: {Math.floor(analysisRemainingSeconds / 60)} মিনিট {analysisRemainingSeconds % 60} সেকেন্ড
            </span>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // 2. CASE A: AI DETECTED 100% REJECTION MODAL
  // ==========================================
  if (batchEvaluationResult === 'ai_detected') {
    return (
      <div className="p-4 sm:p-6 min-h-[85vh] flex items-center justify-center font-sans animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-rose-300 shadow-2xl space-y-6">
          
          {/* Header Warning Emblem */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-md">
              <Bot size={34} />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                <ShieldAlert size={13} className="text-rose-600" />
                <span>AI Detection Engine: 100% Match Identified</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                সিস্টেম ডিটেকশনে এআই (AI) ব্যবহারের উপস্থিতি শনাক্ত হয়েছে!
              </h2>

              <p className="text-xs font-bold text-rose-600">
                AI Usage Detected: 100% (অটোমেটেড সিন্থেটিক টেক্সট ও বট অ্যাক্টিভিটি ফ্ল্যাগড)
              </p>
            </div>
          </div>

          {/* Meaningful & Authoritative Bengali Explanation */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 leading-relaxed space-y-2">
            <p>
              আপনার সাবমিটকৃত <strong>১০টি টাইপিং প্রজেক্টের</strong> গভীর প্যাটার্ন বিশ্লেষণে দেখা গেছে যে, টাইপিংয়ের ব্যাকস্পেস রিদম, টাইম ইন্টারভাল এবং সিনট্যাক্স গঠন মানুষের সাধারণ কীবোর্ড ইনপুটের সাথে মেলে না।
            </p>
            <p className="font-semibold">
              সিস্টেম ডিটেকশনে এটি <strong>শতভাগ (১০০%) কৃত্রিম বুদ্ধিমত্তা (AI) বা অটোমেটেড কপি-পেস্ট</strong> টুলের সাহায্যে প্রস্তুতকৃত হিসেবে শনাক্ত হয়েছে। আমাদের জেনুইন ম্যানুয়াল টাইপিং নীতিমালার স্পষ্ট লঙ্ঘন হওয়ায় এই ১০টি প্রজেক্টের পুরো ব্যাচটি বাতিল (Rejected) ঘোষণা করা হলো।
            </p>
          </div>

          {/* Detailed Audit Findings Dossier */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-800 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>সিস্টেম অডিট ও ডিটেকশন রিপোর্ট:</span>
              <span className="text-[10px] font-mono text-rose-600 font-black">BATCH #10 FLAGGED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">এআই সিন্থেটিক মিল:</div>
                <div className="font-mono font-black text-rose-600 text-sm mt-0.5">১০০% (AI Used)</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">কি-স্ট্রোক রিদম:</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5">অস্বাভাবিক / কৃত্রিম</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">শর্ত রূপান্তর যাচাই:</div>
                <div className="font-bold text-amber-700 mt-0.5">স্ক্রিপ্টেড প্যাটার্ন</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">চূড়ান্ত মূল্যায়ন:</div>
                <div className="font-black text-rose-600 mt-0.5">❌ রিজেক্টেড (বাতিল)</div>
              </div>
            </div>
          </div>

          {/* Policy Warning Box */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
            <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>সতর্কতা:</strong> ইউনিটি আর্নিং পোর্টালে কোনো প্রকার এআই টুল (ChatGPT, Gemini ইত্যাদি) ব্যবহার কঠোরভাবে নিষিদ্ধ। সবসময় নিজে হাতে টাইপ করুন।
            </span>
          </div>

          {/* Action Button: Retry from Task 1 */}
          <button
            onClick={handleRestartBatch}
            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>পুনরায় প্রথম থেকে চেষ্টা করুন (Retry from Task 1)</span>
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // 3. CASE B: SYSTEM REJECTED MODAL (NORMAL)
  // ==========================================
  if (batchEvaluationResult === 'system_rejected') {
    return (
      <div className="p-4 sm:p-6 min-h-[85vh] flex items-center justify-center font-sans animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-rose-300 shadow-2xl space-y-6">
          
          {/* Header Rejection Emblem */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-md">
              <XCircle size={36} />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                <AlertCircle size={13} className="text-rose-600" />
                <span>System Verification: Batch Rejected</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                আপনার সাবমিশনটি সিস্টেম ডিটেকশনে রিজেক্টেড (Rejected) হয়েছে!
              </h2>

              <p className="text-xs font-semibold text-rose-600">
                কোয়ালিটি কন্ট্রোল বেঞ্চমার্ক ও নির্দেশিকা পূরণে ব্যর্থ
              </p>
            </div>
          </div>

          {/* Meaningful & Polite Bengali Explanation */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 leading-relaxed space-y-2">
            <p>
              আমাদের কেন্দ্রীয় কোয়ালিটি কন্ট্রোল টিম ও অটোমেটেড অ্যালগরিদমের নিরীক্ষায় আপনার <strong>১০টি টাইপিং সাবমিশনে</strong> একাধিক অসামঞ্জস্যতা, বানান ভুল ও নির্দেশিত শর্তের অমিল শনাক্ত হয়েছে।
            </p>
            <p className="font-semibold">
              টাইপিংয়ের গুণগত মান আমাদের ন্যূনতম গ্রহণযোগ্য নির্ভুলতার মানদণ্ড পূরণ করতে পারেনি। ফলে সিস্টেম ডিটেকশনে আপনার এই ব্যাচের প্রজেক্টটি অনুমোদন দেওয়া সম্ভব হয়নি এবং রিজেক্টেড হিসেবে নথিভুক্ত হয়েছে।
            </p>
          </div>

          {/* Audit Findings Dossier */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-800 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>মূল্যায়ন ও অডিট রিপোর্ট:</span>
              <span className="text-[10px] font-mono text-rose-600 font-black">EVALUATION FAILED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">কোয়ালিটি বেঞ্চমার্ক:</div>
                <div className="font-mono font-black text-rose-600 text-sm mt-0.5">ব্যর্থ (Below Standard)</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">শর্ত পরিপালন:</div>
                <div className="font-bold text-slate-800 mt-0.5">অসম্পূর্ণ ও শর্তভঙ্গ</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">ভিডিও প্রমাণ নিরীক্ষা:</div>
                <div className="font-bold text-amber-700 mt-0.5">যাচাইয়ে অমিল</div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-400 font-medium">বর্তমান স্ট্যাটাস:</div>
                <div className="font-black text-rose-600 mt-0.5">❌ রিজেক্টেড (বাতিল)</div>
              </div>
            </div>
          </div>

          {/* Guidance Notice */}
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2 leading-relaxed">
            <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>পরামর্শ:</strong> প্রতিটি প্যারাগ্রাফে দেওয়া "শর্ত" এবং বিরামচিহ্নগুলো নিখুঁতভাবে টাইপ করুন। সঠিক নিয়মে কাজ সম্পন্নের জন্য আপনাকে পুনরায় সুযোগ দেওয়া হলো।
            </span>
          </div>

          {/* Action Button: Retry from Task 1 */}
          <button
            onClick={handleRestartBatch}
            className="w-full bg-gradient-to-r from-slate-900 to-blue-950 hover:from-slate-800 hover:to-blue-900 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>পুনরায় প্রথম থেকে চেষ্টা করুন (Retry from Task 1)</span>
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // 4. STANDARD SINGLE TASK SUCCESS SCREEN (1-9)
  // ==========================================
  if (isSubmittedSuccess) {
    return (
      <div className="p-4 sm:p-6 min-h-[80vh] flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-blue-200 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                টাস্ক #{currentTask.id} সাবমিট হয়েছে
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                ব্যাচ অগ্রগতি: {submittedCount}/১০
              </span>
            </div>
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
              <div className="text-[10px] uppercase font-bold text-slate-400">ব্যাচ সম্পন্ন</div>
              <div className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">{submittedCount}/১০</div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmittedSuccess(false);
              setSelectedTaskIndex((prev) => (prev + 1) % ADVANCED_10_TASKS.length);
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>পরবর্তী টাইপিং টাস্ক #{((selectedTaskIndex + 1) % ADVANCED_10_TASKS.length) + 1} শুরু করুন</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. MAIN TYPING WORKSPACE
  // ==========================================
  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto pb-28 space-y-4 font-sans">
      
      {/* Top Header Banner with 30-Minute Live Countdown Timer */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1">
                <PenTool size={12} />
                <span>Project #{currentTask.id}: {currentTask.difficulty} Level</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                ব্যাচ অগ্রগতি: {submittedCount}/১০ সম্পন্ন
              </span>
            </div>
            
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
            <div className="text-[9px] text-emerald-400 font-semibold mt-0.5 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>লাইভ ৩০ মিনিট টাইমার চলমান</span>
            </div>
          </div>
        </div>

        {/* Task Selector & Batch Reset Option */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-300">টাস্ক নির্বাচন ({selectedTaskIndex + 1}/১০):</span>
          </div>

          <div className="flex items-center gap-2">
            {submittedCount > 0 && (
              <button
                type="button"
                onClick={handleRestartBatch}
                className="text-[10px] text-slate-400 hover:text-rose-400 underline transition cursor-pointer"
                title="রিসেট করে প্রথম থেকে শুরু করুন"
              >
                রিসেট ({submittedCount}/১০)
              </button>
            )}

            <select
              value={selectedTaskIndex}
              onChange={(e) => {
                const targetIdx = Number(e.target.value);
                const isUnlocked = targetIdx === 0 || submittedTaskIds.includes(ADVANCED_10_TASKS[targetIdx - 1].id);
                if (!isUnlocked) {
                  setValidationError("⚠️ পূর্ববর্তী টাস্কটি সম্পূর্ণ না করে এই টাস্কে যাওয়া যাবে না। এটি লক অবস্থায় রয়েছে।");
                  return;
                }
                setSelectedTaskIndex(targetIdx);
                setValidationError(null);
              }}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              {ADVANCED_10_TASKS.map((t, idx) => {
                const isUnlocked = idx === 0 || submittedTaskIds.includes(ADVANCED_10_TASKS[idx - 1].id);
                return (
                  <option key={t.id} value={idx} disabled={!isUnlocked}>
                    {idx > 0 && !isUnlocked ? '🔒 ' : ''}#{t.id}: {t.title.slice(0, 30)}... {submittedTaskIds.includes(t.id) ? '✓ (জমা হয়েছে)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
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
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-950 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-900 border-b border-amber-200 pb-2">
          <Zap size={15} className="text-amber-600 shrink-0" />
          <span>টাস্ক পরিবর্তনের জন্য ১০টি বাধ্যতামূলক ধাপ:</span>
        </div>
        <ul className="space-y-1.5 list-none">
          {currentTask.instructionSteps.map((step, index) => (
            <li key={index} className="text-xs text-amber-950 flex gap-2 font-medium">
              <span className="text-amber-700 font-bold">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ul>
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
                আপনার টাইপিং ইনপুট উইন্ডো:
              </span>
              {pasteAttempts > 0 && (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  কপি-পেস্ট ব্লকড: {pasteAttempts} বার
                </span>
              )}
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder="এখানে টাইপ করা শুরু করুন... (কপি-পেস্ট নিষিদ্ধ, নিজ হাতে টাইপ করুন)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 leading-relaxed font-mono focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
            />
          </div>

          {/* Real-time Typing Metrics */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[9px] uppercase font-bold text-slate-400">একুরেসি</div>
              <div className="text-xs sm:text-sm font-extrabold text-emerald-600 font-mono">
                {metrics.accuracy}%
              </div>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[9px] uppercase font-bold text-slate-400">স্পিড (WPM)</div>
              <div className="text-xs sm:text-sm font-extrabold text-blue-600 font-mono">
                {metrics.wpm}
              </div>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[9px] uppercase font-bold text-slate-400">অগ্রগতি</div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-700 font-mono">
                {metrics.progress}%
              </div>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[9px] uppercase font-bold text-slate-400">ভুল শব্দ</div>
              <div className="text-xs sm:text-sm font-extrabold text-rose-600 font-mono">
                {metrics.errors > 0 ? metrics.errors : 0}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SCREEN RECORDING VIDEO SUBMISSION BOX */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video size={18} className="text-blue-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              কাজের স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ জমা দিন <span className="text-rose-500">*</span>
            </h3>
          </div>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            বাধ্যতামূলক
          </span>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{validationError}</span>
          </div>
        )}

        {/* Input 1: Cloud Video URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            ১. গুগল ড্রাইভ / লুম / ড্রপবক্স ভিডিও লিংক:
          </label>
          <div className="relative">
            <input
              type="url"
              value={videoProofLink}
              onChange={(e) => setVideoProofLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/... অথবা https://www.loom.com/share/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <Link2 size={15} className="absolute left-3 top-3 text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400">
            * গুগল ড্রাইভ লিংক দিলে এক্সেস 'Anyone with the link can view' করা নিশ্চিত করুন।
          </p>
        </div>

        {/* Input 2: Video File Upload Fallback */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            ২. অথবা সরাসরি ভিডিও ফাইল আপলোড করুন (MP4, WebM):
          </label>
          <div className="flex items-center gap-3">
            <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 transition cursor-pointer flex items-center gap-1.5">
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
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 truncate max-w-xs">
                ✓ {videoFileName}
              </span>
            )}
          </div>
        </div>

        {/* Input 3: Optional Notes */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            ৩. কাজের মন্তব্য / বিশেষ নোট (ঐচ্ছিক):
          </label>
          <input
            type="text"
            value={recordingNotes}
            onChange={(e) => setRecordingNotes(e.target.value)}
            placeholder="প্রজেক্ট সম্পন্নের কোনো বিশেষ নোট বা শর্ত পরিবর্তনের বিবরণ..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Final Submit Button */}
        <div className="pt-2">
          <button
            onClick={handleSubmitTask}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-4 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span>
              {isSubmitting 
                ? 'যাচাই ও সাবমিশন চলছে...' 
                : submittedCount >= 9 || selectedTaskIndex === 9
                ? '১০ম টাস্ক সাবমিট ও ফাইনাল সিস্টেম অডিট শুরু করুন'
                : `টাস্ক #${currentTask.id} ও স্ক্রিন রেকর্ড সাবমিট করুন (${submittedCount + 1}/১০)`
              }
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
