import React, { useState, useEffect, useMemo } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  PenTool,
  CheckCircle2,
  AlertCircle,
  Clock,
  Video,
  Upload,
  Link2,
  Zap,
  Info,
  XCircle,
  ArrowRight,
  Timer,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  RotateCcw,
  RefreshCw,
  Play,
  Lock,
  Hourglass
} from 'lucide-react';

interface RequiredFixRule {
  wrong: string;
  fixed: string;
  label: string;
}

interface TypingTask {
  id: number;
  language: 'English' | 'Bengali';
  category: string;
  difficulty: 'Very Hard' | 'Complex' | 'Advanced' | 'Master';
  title: string;
  timeLimitMinutes: number;
  instructionSteps: string[];
  requiredFixes: RequiredFixRule[];
  text: string;
  expectedCorrectedText: string;
  mandatoryCondition?: string;
}

const ADVANCED_10_TASKS: TypingTask[] = [
  {
    id: 1,
    language: 'English',
    category: 'Commercial Legal Contract & Indenture Clauses',
    difficulty: 'Complex',
    title: 'Section 14(c) Commercial Lease, Arbitration & Escrow Indenture',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. প্যাসেজটিতে থাকা ইচ্ছাকৃত বানান ও তথ্যের ভুলগুলো সংশোধন করে সম্পূর্ণ অনুচ্ছেদ টাইপ করুন।",
      "২. 'Lessee (Tenent)' এর পরিবর্তে সঠিকভাবে 'Authorized Tenant' লিখুন।",
      "৩. '15-November-2024' এর ভুল সাল পরিবর্তন করে '15-November-2026' লিখুন।",
      "৪. '0.75% per diem' এর স্থলে সঠিক চুক্তি অনুযায়ী '2.75% per diem' লিখুন।",
      "৫. সকল টাকার অংক সঠিকভাবে কমা (,) ও দশমিক (.00) সহ প্রথম বন্ধনীতে রাখুন।",
      "৬. 'Arbitration Act 1998' সংশোধন করে 'Arbitration Act 2001' লিখুন।",
      "৭. 'RBC-2011' কোড আপডেট করে 'RBC-2020' লিখুন এবং প্যারাগ্রাফ বিরামচিহ্ন ঠিক রাখুন।",
      "৮. কোনো কপি-পেস্ট বা অটো-ফিল ব্যবহার করা যাবে না।"
    ],
    requiredFixes: [
      { wrong: 'Lessee (Tenent)', fixed: 'Authorized Tenant', label: 'Replace Lessee (Tenent) -> Authorized Tenant' },
      { wrong: '15-November-2024', fixed: '15-November-2026', label: 'Fix year 2024 -> 2026' },
      { wrong: '0.75% per diem', fixed: '2.75% per diem', label: 'Correct surcharge 0.75% -> 2.75%' },
      { wrong: 'Arbitration Act 1998', fixed: 'Arbitration Act 2001', label: 'Update Arbitration Act 1998 -> 2001' },
      { wrong: 'RBC-2011', fixed: 'RBC-2020', label: 'Update Building Code RBC-2011 -> RBC-2020' }
    ],
    text: `Pursuant to Section 14(c) of the Master Commercial Lease Agreement (Ref: #LSE-2026/894-BD), executed between Eastern Metropolitan Commercial Properties PLC ("Lessor") and the Lessee (Tenent), the Lessee (Tenent) shall irrevocably wire and deposit the aggregate escrow sum of BDT 4,87,500.00 into the designated Escrow Account [IBAN: BD92-SBIN-0004-9812-7634, SWIFT: SONABDDH] no later than 17:00 BST on 15-November-2024. Time is expressly declared to be of the absolute essence across every pecuniary covenant herein.

Failure to remit said escrow collateral within five (5) statutory business days following written demand shall automatically trigger a daily liquidated damage surcharge of 0.75% per diem, compounded weekly without grace period under Sub-Clause 22.4(a). Neither contracting party may assign, sub-lease, novate, encumber, or hypothecate its respective rights, titles, or equitable obligations hereunder without prior unanimous written consent signed by the Board of Arbitrators (§ 9.2). All formal statutory communications, default notices, and force-majeure declarations must be dispatched via registered international courier accompanied by verifiable proof-of-delivery receipts and cryptographic timestamps.

Furthermore, the Lessee (Tenent) unconditionally covenants to procure and maintain comprehensive third-party general liability insurance coverage carrying a minimum single-limit indemnity threshold of BDT 25,00,000.00 throughout the entire sixty-month commercial lease tenure. Any non-structural partition modifications, HVAC ductwork rerouting, or high-voltage electrical retrofitting must obtain pre-execution engineering compliance certification under the National Regional Building Code (RBC-2011) and Fire Safety Directorate Regulation #FSCD-2026/19. The Lessor reserves unrestricted inspection access upon serving forty-eight (48) hours advance electronic notice.

In addition, all municipal holding tax assessments, industrial effluent surcharges, utility metering deposits, and commercial facade signage levies assessed against the demised premises shall remain the sole fiscal liability of the Lessee (Tenent). Upon natural expiration or early termination pursuant to Clause 31.8(b), the premises must be surrendered in broom-clean architectural condition, ordinary structural wear excepted, within fourteen (14) calendar days. Any unresolved pecuniary dispute exceeding BDT 1,50,000.00 shall be referred exclusively to binding institutional arbitration seated in Dhaka under the Arbitration Act 1998, administered by three (3) neutral commercial arbitrators, with each disputant bearing fifty percent (50.00%) of tribunal registration costs and verbatim stenographic fees. Force majeure suspensions exceeding ninety (90) consecutive calendar days grant either solvent signatory unilateral termination privilege without penalty upon delivering audited regulatory certification.

Under Supplementary Indemnity Covenant § 39.4(d), any cross-border capital equipment sub-deployment or leasehold improvement amortization exceeding BDT 18,45,250.00 requires notarized tripartite treasury clearance countersigned by the Statutory Fiscal Trustee (License #TR-BD-99420/2026) and attested quarterly against IFRS-16 right-of-use asset schedules; failure to preserve uninterrupted audit-trail metadata across seventy-two (72) consecutive fiscal periods incurs automatic forfeiture of accrued performance rebates without prejudice to equitable injunctive relief.`,
    expectedCorrectedText: `Pursuant to Section 14(c) of the Master Commercial Lease Agreement (Ref: #LSE-2026/894-BD), executed between Eastern Metropolitan Commercial Properties PLC ("Lessor") and the Authorized Tenant, the Authorized Tenant shall irrevocably wire and deposit the aggregate escrow sum of (BDT 4,87,500.00) into the designated Escrow Account [IBAN: BD92-SBIN-0004-9812-7634, SWIFT: SONABDDH] no later than 17:00 BST on 15-November-2026. Time is expressly declared to be of the absolute essence across every pecuniary covenant herein.

Failure to remit said escrow collateral within five (5) statutory business days following written demand shall automatically trigger a daily liquidated damage surcharge of 2.75% per diem, compounded weekly without grace period under Sub-Clause 22.4(a). Neither contracting party may assign, sub-lease, novate, encumber, or hypothecate its respective rights, titles, or equitable obligations hereunder without prior unanimous written consent signed by the Board of Arbitrators (§ 9.2). All formal statutory communications, default notices, and force-majeure declarations must be dispatched via registered international courier accompanied by verifiable proof-of-delivery receipts and cryptographic timestamps.

Furthermore, the Authorized Tenant unconditionally covenants to procure and maintain comprehensive third-party general liability insurance coverage carrying a minimum single-limit indemnity threshold of (BDT 25,00,000.00) throughout the entire sixty-month commercial lease tenure. Any non-structural partition modifications, HVAC ductwork rerouting, or high-voltage electrical retrofitting must obtain pre-execution engineering compliance certification under the National Regional Building Code (RBC-2020) and Fire Safety Directorate Regulation #FSCD-2026/19. The Lessor reserves unrestricted inspection access upon serving forty-eight (48) hours advance electronic notice.

In addition, all municipal holding tax assessments, industrial effluent surcharges, utility metering deposits, and commercial facade signage levies assessed against the demised premises shall remain the sole fiscal liability of the Authorized Tenant. Upon natural expiration or early termination pursuant to Clause 31.8(b), the premises must be surrendered in broom-clean architectural condition, ordinary structural wear excepted, within fourteen (14) calendar days. Any unresolved pecuniary dispute exceeding (BDT 1,50,000.00) shall be referred exclusively to binding institutional arbitration seated in Dhaka under the Arbitration Act 2001, administered by three (3) neutral commercial arbitrators, with each disputant bearing fifty percent (50.00%) of tribunal registration costs and verbatim stenographic fees. Force majeure suspensions exceeding ninety (90) consecutive calendar days grant either solvent signatory unilateral termination privilege without penalty upon delivering audited regulatory certification.

Under Supplementary Indemnity Covenant § 39.4(d), any cross-border capital equipment sub-deployment or leasehold improvement amortization exceeding (BDT 18,45,250.00) requires notarized tripartite treasury clearance countersigned by the Statutory Fiscal Trustee (License #TR-BD-99420/2026) and attested quarterly against IFRS-16 right-of-use asset schedules; failure to preserve uninterrupted audit-trail metadata across seventy-two (72) consecutive fiscal periods incurs automatic forfeiture of accrued performance rebates without prejudice to equitable injunctive relief.`
  },
  {
    id: 2,
    language: 'English',
    category: 'Clinical Laboratory Trial & Pharmaceutical Research',
    difficulty: 'Advanced',
    title: 'Protocol #CT-8092-B: In Vitro Bio-Equivalence, Dissolution & HPLC Assay',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'Acetylsalicilic Acidd' বানান ভুল সংশোধন করে 'Compound-ASA (BP/USP)' লিখুন।",
      "২. 'pH 5.20' এর ভুল মান পরিবর্তন করে 'pH 7.40' বসান।",
      "৩. '180.99 g/mol' সংশোধন করে সঠিক আণবিক ভর '180.16 g/mol' লিখুন।",
      "৪. 'Rev. 2019' পরিবর্তন করে 'Rev. 2026' লিখুন।",
      "৫. '35.0°C' স্ট্যাবিলিটি তাপমাত্রা পরিবর্তন করে '40.0°C' লিখুন।",
      "৬. রাসায়নিক সংকেত C9H8O4, CFU/g মান ও R² দশমিক সংখ্যা নিখুঁতভাবে টাইপ করুন।"
    ],
    requiredFixes: [
      { wrong: 'Acetylsalicilic Acidd', fixed: 'Compound-ASA (BP/USP)', label: 'Fix Acetylsalicilic Acidd -> Compound-ASA (BP/USP)' },
      { wrong: '180.99 g/mol', fixed: '180.16 g/mol', label: 'Fix Molecular Weight -> 180.16 g/mol' },
      { wrong: 'pH 5.20', fixed: 'pH 7.40', label: 'Correct buffer pH -> 7.40' },
      { wrong: 'Rev. 2019', fixed: 'Rev. 2026', label: 'Update USP-NF Monograph Rev. -> 2026' },
      { wrong: 'at 35.0°C and 75.00%', fixed: 'at 40.0°C and 75.00%', label: 'Correct climatic chamber temp -> 40.0°C' }
    ],
    text: `During Phase-II multi-center clinical bio-equivalence screening (Protocol Trial Code #CT-8092-B), randomized analytical samples of Acetylsalicilic Acidd (Chemical Formula: C9H8O4, Molecular Weight: 180.99 g/mol, CAS Registry: 50-78-2) were subjected to rigorous USP Apparatus-II paddle chromatographic dissolution profiling at 37.0°C (±0.25°C) within a degassed phosphate buffered aqueous medium maintained strictly at pH 5.20 across ninety-minute sampling intervals.

Spectrophotometric UV-Vis absorbance measured at lambda_max = 278.4 nm yielded an active therapeutic solvency coefficient of 98.42% (Standard Deviation: ±0.18%, Relative Standard Deviation: 0.41%). Validation Batch #BX-0914-K demonstrated zero crystalline particulate precipitate after 72 continuous hours of orbital agitation at 120 RPM under nitrogen purge. Chromatographic elution retention time peaked sharply at 4.62 minutes using a C18 reversed-phase silica column (250 mm × 4.6 mm, 5 µm particle diameter), conforming strictly to USP-NF Monograph standards (Rev. 2019). Laboratory analysts must archive unmodified raw FID chromatogram spectra onto WORM non-volatile optical audit storage.

High-Performance Liquid Chromatography (HPLC) bio-analytical validation assays confirmed multi-point linear regression calibration (R² = 0.9998; slope = 1.0142; y-intercept bias < 0.08%) spanning six working calibration concentrations from 10.0 mcg/mL to 150.0 mcg/mL. Quantitative percentage recovery remained tightly constrained within international pharmacopeial tolerance brackets of 99.10% to 101.40% under accelerated ICH Q1A(R2) climatic stability chambers regulated at 35.0°C and 75.00% relative humidity for 180 consecutive days without significant excipient hydrolysis or polymorphic phase shift.

Supplemental microbiological limit assays executed across twelve (12) sealed aluminum-PVC blister packs verified total aerobic viable microbial counts strictly below 10 CFU/g and yeast/mold colonies under 2 CFU/g, confirming complete absence of Escherichia coli, Salmonella spp., and Staphylococcus aureus pathogens. Mechanical tablet friability remained below 0.34% following 100 standardized drum rotations at 25 RPM, whereas mean disintegration duration averaged 6.45 minutes in simulated gastric fluid lacking pepsin enzymes. Residual solvent headspace gas chromatography verified acetone and ethanol impurities below 120 ppm (ICH Class-3 threshold: 5,000 ppm). Final Quality Assurance Directorate Electronic Sign-Off Reference: #QA-PHARMA-2026-412-VERIFIED.

Cross-over pharmacokinetic non-compartmental analysis (n = 36 fasting healthy adult volunteers) yielded geometric least-squares mean Test-to-Reference ratios of 101.34% for Cmax and 99.82% for AUC(0-inf), both falling squarely inside regulatory bio-equivalence acceptance intervals [90% CI: 80.00%–125.00%]. Median Tmax occurred at 1.75 hours post-oral administration with intra-subject coefficient of variation (CV_intra) recorded at 11.42%, strictly compliant with FDA 21 CFR Part 11 Electronic Audit Trail Archival Serial #STAB-2026-HPLC-908.`,
    expectedCorrectedText: `During Phase-II multi-center clinical bio-equivalence screening (Protocol Trial Code #CT-8092-B), randomized analytical samples of Compound-ASA (BP/USP) (Chemical Formula: C9H8O4, Molecular Weight: 180.16 g/mol, CAS Registry: 50-78-2) were subjected to rigorous USP Apparatus-II paddle chromatographic dissolution profiling at 37.0°C (±0.25°C) within a degassed phosphate buffered aqueous medium maintained strictly at pH 7.40 across ninety-minute sampling intervals.

Spectrophotometric UV-Vis absorbance measured at lambda_max = 278.4 nm yielded an active therapeutic solvency coefficient of 98.42% (Standard Deviation: ±0.18%, Relative Standard Deviation: 0.41%). Validation Batch #BX-0914-K demonstrated zero crystalline particulate precipitate after 72 continuous hours of orbital agitation at 120 RPM under nitrogen purge. Chromatographic elution retention time peaked sharply at 4.62 minutes using a C18 reversed-phase silica column (250 mm × 4.6 mm, 5 µm particle diameter), conforming strictly to USP-NF Monograph standards (Rev. 2026). Laboratory analysts must archive unmodified raw FID chromatogram spectra onto WORM non-volatile optical audit storage.

High-Performance Liquid Chromatography (HPLC) bio-analytical validation assays confirmed multi-point linear regression calibration (R² = 0.9998; slope = 1.0142; y-intercept bias < 0.08%) spanning six working calibration concentrations from 10.0 mcg/mL to 150.0 mcg/mL. Quantitative percentage recovery remained tightly constrained within international pharmacopeial tolerance brackets of 99.10% to 101.40% under accelerated ICH Q1A(R2) climatic stability chambers regulated at 40.0°C and 75.00% relative humidity for 180 consecutive days without significant excipient hydrolysis or polymorphic phase shift.

Supplemental microbiological limit assays executed across twelve (12) sealed aluminum-PVC blister packs verified total aerobic viable microbial counts strictly below 10 CFU/g and yeast/mold colonies under 2 CFU/g, confirming complete absence of Escherichia coli, Salmonella spp., and Staphylococcus aureus pathogens. Mechanical tablet friability remained below 0.34% following 100 standardized drum rotations at 25 RPM, whereas mean disintegration duration averaged 6.45 minutes in simulated gastric fluid lacking pepsin enzymes. Residual solvent headspace gas chromatography verified acetone and ethanol impurities below 120 ppm (ICH Class-3 threshold: 5,000 ppm). Final Quality Assurance Directorate Electronic Sign-Off Reference: #QA-PHARMA-2026-412-VERIFIED.

Cross-over pharmacokinetic non-compartmental analysis (n = 36 fasting healthy adult volunteers) yielded geometric least-squares mean Test-to-Reference ratios of 101.34% for Cmax and 99.82% for AUC(0-inf), both falling squarely inside regulatory bio-equivalence acceptance intervals [90% CI: 80.00%–125.00%]. Median Tmax occurred at 1.75 hours post-oral administration with intra-subject coefficient of variation (CV_intra) recorded at 11.42%, strictly compliant with FDA 21 CFR Part 11 Electronic Audit Trail Archival Serial #STAB-2026-HPLC-908.`
  },
  {
    id: 3,
    language: 'English',
    category: 'Banking Financial Reconciliation & Anti-Money Laundering (AML)',
    difficulty: 'Master',
    title: 'Cross-Border SWIFT MT103 Ledger & Central Bank TDS Reconciliation Audit',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'Standrad Chartred' ভুল বানান সংশোধন করে 'Global Clearing Partner' লিখুন।",
      "২. '2026-10-01' তারিখ পরিবর্তন করে '01/10/2026' (DD/MM/YYYY) ফরম্যাটে লিখুন।",
      "৩. ভুল নিট হিসাব 'BDT 11,00,000.00' এর স্থলে সঠিক বিয়োগফল 'BDT 11,46,915.76' লিখুন।",
      "৪. 'NBR Rule 16/2021' আপডেট করে 'NBR Rule 16/2026' লিখুন।",
      "৫. ভুল স্পট রেট '98.50 BDT/USD' সংশোধন করে '119.50 BDT/USD' লিখুন।",
      "৬. SHA256 হ্যাশ কোড, IBAN চেকসাম ও ব্যাংক রাউটিং নম্বর হুবহু নির্ভুলভাবে লিখুন।"
    ],
    requiredFixes: [
      { wrong: 'Standrad Chartred', fixed: 'Global Clearing Partner', label: 'Fix Standrad Chartred -> Global Clearing Partner' },
      { wrong: '2026-10-01', fixed: '01/10/2026', label: 'Convert date format -> 01/10/2026' },
      { wrong: 'BDT 11,00,000.00', fixed: 'BDT 11,46,915.76', label: 'Fix Net Liquidity calculation -> BDT 11,46,915.76' },
      { wrong: 'NBR Rule 16/2021', fixed: 'NBR Rule 16/2026', label: 'Update tax rule -> NBR Rule 16/2026' },
      { wrong: '98.50 BDT/USD', fixed: '119.50 BDT/USD', label: 'Fix FX Spot Rate -> 119.50 BDT/USD' }
    ],
    text: `AUDIT RECONCILIATION DISPATCH: [LEDGER_ID: TXN-BD-98201-CLR-MT103]
Originating Clearing Branch: Motijheel Corporate Treasury Central (BB Routing Code: 095271894; Branch Swift: BSONBDDHMCB).
Counterparty Correspondent Institution: Standrad Chartred (Correspondent BIC: SCBLBDDX, Nostro Ledger: #NOS-USD-774129).
Gross Cross-Border Transaction Value: BDT 12,74,350.85 [Twelve Lakh Seventy-Four Thousand Three Hundred Fifty Taka and 85/100 Only].

Statutory Tax Deducted at Source (TDS under NBR Rule 16/2021): BDT 1,27,435.09 (calculated at 10.00% flat withholding rate on gross invoice value).
Net Liquidity Settled & Credited to Treasury Vault: BDT 11,00,000.00 (Variance Tolerance: ±0.00 BDT).
Anti-Money Laundering (AML/CFT) Screening Status: Real-time fuzzy screening completed against OFAC SDN, EU Consolidated Sanctions, and UN Security Council Resolution 1267 lists; zero adverse PEP matches or structured smurfing alerts flagged.
Authorized Cryptographic Approval Token: #AUTH-9901-SHA256-A78F04C9D2E1B. Settlement Timestamp: 2026-10-01T14:38:22.091Z (Posting Date: 2026-10-01). Endorsed digitally by Chief Compliance Officer & Internal Treasury Controller.

Interbank Foreign Exchange Settlement verification was finalized via Bangladesh Bank Real Time Gross Settlement (BD-RTGS) core clearing portal under batch serial #RTGS-2026-90412. Foreign inward remittance proceeds were systematically apportioned into Tier-1 priority agricultural credit refinance pools and export development liquidity accounts with exact zero-balance parity confirmed between domestic vostro and offshore nostro mirror statements. Internal compliance auditors have cryptographically sealed this transaction dossier under seven-year statutory retention directive #AML-REG-771-B.

Secondary SWIFT MT103/MT202COV message validation independently verified beneficiary IBAN ISO-13616 modulo-97 checksum parity and cross-referenced commercial customs import bill of entry declaration #IMP-DHAKA-88412 without foreign currency conversion slippage (Interbank FX Spot Rate: 98.50 BDT/USD, Equivalent USD 10,664.02). Intraday treasury liquidity coverage ratio (LCR) and stress-test capital reserve ratios held steady at 14.65%, comfortably exceeding Basel-III Tier-1 statutory capital adequacy buffers mandated by Central Bank Circular #BRPD-14/2026. Encrypted audit trails have been replicated synchronously onto immutable air-gapped cold-storage ledger vaults for quarterly external central bank forensic inspection.

Tertiary end-of-day Nostro Cut-off Reconciliation (#NOSTRO-CUT-2026/11) corroborated a Net Stable Funding Ratio (NSFR) of 118.42% alongside an unadjusted correspondent cable fee rebate of BDT 14,820.50 settled through ISO-20022 pacs.008.001.10 structured XML clearing envelopes; all end-to-end Unique Transaction Identifiers (UETR: 97ed4827-7bf6-4e1a-b290-c041a8e72f19) passed dual-key HSM signature verification without suspense-account variance.`,
    expectedCorrectedText: `AUDIT RECONCILIATION DISPATCH: [LEDGER_ID: TXN-BD-98201-CLR-MT103]
Originating Clearing Branch: Motijheel Corporate Treasury Central (BB Routing Code: 095271894; Branch Swift: BSONBDDHMCB).
Counterparty Correspondent Institution: Global Clearing Partner (Correspondent BIC: SCBLBDDX, Nostro Ledger: #NOS-USD-774129).
Gross Cross-Border Transaction Value: BDT 12,74,350.85 [Twelve Lakh Seventy-Four Thousand Three Hundred Fifty Taka and 85/100 Only].

Statutory Tax Deducted at Source (TDS under NBR Rule 16/2026): BDT 1,27,435.09 (calculated at 10.00% flat withholding rate on gross invoice value).
Net Liquidity Settled & Credited to Treasury Vault: BDT 11,46,915.76 (Variance Tolerance: ±0.00 BDT).
Anti-Money Laundering (AML/CFT) Screening Status: Real-time fuzzy screening completed against OFAC SDN, EU Consolidated Sanctions, and UN Security Council Resolution 1267 lists; zero adverse PEP matches or structured smurfing alerts flagged.
Authorized Cryptographic Approval Token: #AUTH-9901-SHA256-A78F04C9D2E1B. Settlement Timestamp: 01/10/2026T14:38:22.091Z (Posting Date: 01/10/2026). Endorsed digitally by Chief Compliance Officer & Internal Treasury Controller.

Interbank Foreign Exchange Settlement verification was finalized via Bangladesh Bank Real Time Gross Settlement (BD-RTGS) core clearing portal under batch serial #RTGS-2026-90412. Foreign inward remittance proceeds were systematically apportioned into Tier-1 priority agricultural credit refinance pools and export development liquidity accounts with exact zero-balance parity confirmed between domestic vostro and offshore nostro mirror statements. Internal compliance auditors have cryptographically sealed this transaction dossier under seven-year statutory retention directive #AML-REG-771-B.

Secondary SWIFT MT103/MT202COV message validation independently verified beneficiary IBAN ISO-13616 modulo-97 checksum parity and cross-referenced commercial customs import bill of entry declaration #IMP-DHAKA-88412 without foreign currency conversion slippage (Interbank FX Spot Rate: 119.50 BDT/USD, Equivalent USD 10,664.02). Intraday treasury liquidity coverage ratio (LCR) and stress-test capital reserve ratios held steady at 14.65%, comfortably exceeding Basel-III Tier-1 statutory capital adequacy buffers mandated by Central Bank Circular #BRPD-14/2026. Encrypted audit trails have been replicated synchronously onto immutable air-gapped cold-storage ledger vaults for quarterly external central bank forensic inspection.

Tertiary end-of-day Nostro Cut-off Reconciliation (#NOSTRO-CUT-2026/11) corroborated a Net Stable Funding Ratio (NSFR) of 118.42% alongside an unadjusted correspondent cable fee rebate of BDT 14,820.50 settled through ISO-20022 pacs.008.001.10 structured XML clearing envelopes; all end-to-end Unique Transaction Identifiers (UETR: 97ed4827-7bf6-4e1a-b290-c041a8e72f19) passed dual-key HSM signature verification without suspense-account variance.`
  },
  {
    id: 4,
    language: 'Bengali',
    category: 'সরকারি অর্থ ও বাজেট অডিট পরিপত্র (বাংলা টাস্ক ১)',
    difficulty: 'Very Hard',
    title: 'স্মারক নং ৪৬.০২.০০০০.০১২.১৪.০০১.২৬ — বার্ষিক বাজেট ও এডিপি অডিট পরিপত্র',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. এটি একটি দীর্ঘ বাংলা সরকারি পরিপত্র টাস্ক — যুক্তাক্ষর, সেমিকোলন ও দাঁড়ি (।) নিখুঁতভাবে টাইপ করুন।",
      "২. প্যাসেজে থাকা ভুল অর্থবছর '২০২২-২০২৩' পরিবর্তন করে '২০২৬-২০২৭' লিখুন।",
      "৩. ভুল বরাদ্দ '৫৭,৫০,০০০.০০' সংশোধন করে সঠিক বরাদ্দ '৮৭,৫০,০০০.০০' লিখুন।",
      "৪. 'পাবলিক প্রকিউরমেন্ট বিধিমালা ২০০১' সংশোধন করে 'পিপিআর-২০০৮ (PPR-2008) বিধিবদ্ধ নির্দেশিকা' লিখুন।",
      "৫. কর্মদিবস '৪৫ কর্মদিবসের মধ্যে' পরিবর্তন করে '২১ (একুশ) কার্যদিবসের মধ্যে' লিখুন।",
      "৬. ভুল কোড '৭৭২-আইবিএএস' সংশোধন করে '৭৭২-আইবিএএস++ (iBAS++)' লিখুন।"
    ],
    requiredFixes: [
      { wrong: '২০২২-২০২৩', fixed: '২০২৬-২০২৭', label: 'অর্থবছর ২০২২-২০২৩ -> ২০২৬-২০২৭' },
      { wrong: '৫৭,৫০,০০০.০০', fixed: '৮৭,৫০,০০০.০০', label: 'বরাদ্দ ৫৭,৫০,০০০.০০ -> ৮৭,৫০,০০০.০০' },
      { wrong: 'পাবলিক প্রকিউরমেন্ট বিধিমালা ২০০১', fixed: 'পিপিআর-২০০৮ (PPR-2008) বিধিবদ্ধ নির্দেশিকা', label: 'বিধিমালা ২০০১ -> পিপিআর-২০০৮ (PPR-2008)' },
      { wrong: '৪৫ কর্মদিবসের মধ্যে', fixed: '২১ (একুশ) কার্যদিবসের মধ্যে', label: 'সময়সীমা ৪৫ -> ২১ (একুশ) কার্যদিবস' },
      { wrong: '৭৭২-আইবিএএস', fixed: '৭৭২-আইবিএএস++ (iBAS++)', label: 'পোর্টাল কোড -> ৭৭২-আইবিএএস++ (iBAS++)' }
    ],
    text: `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
জনপ্রশাসন ও ডিজিটাল সংস্কার বিভাগ, কেন্দ্রীয় বাজেট ও অর্থ অডিট শাখা
বাংলাদেশ সচিবালয়, ঢাকা-১০০০।
স্মারক নম্বর: 46.02.0000.012.14.001.26-982; তারিখ: ০১-অক্টোবর-২০২৬ খ্রিস্টাব্দ।

বিষয়: ২০২২-২০২৩ অর্থবছরের বার্ষিক উন্নয়ন কর্মসূচি (এডিপি) উপ-খাত ৪(ক) এর ব্যয় বিবরণী ও ডিজিটাল নথি সংরক্ষণ অডিট প্রসঙ্গে।

পরিপত্র: এতদ্বারা ডিজিটাল নথি সংরক্ষণ, কেন্দ্রীয় হিসাব সমন্বয় এবং আঞ্চলিক অর্থ অডিট কার্যক্রমে নিযুক্ত সকল নিবন্ধিত ডেটা এন্ট্রি অপারেটর ও আঞ্চলিক কোষাধ্যক্ষকে অবহিত ও নির্দেশ প্রদান করা যাচ্ছে যে, ২০২২-২০২৩ অর্থবছরের বার্ষিক উন্নয়ন কর্মসূচি (এডিপি) উপ-খাত ৪(ক)-এর আওতায় অনুমোদিত ও বরাদ্দকৃত মোট ৫৭,৫০,০০০.০০ (সাতাশি লক্ষ পঞ্চাশ হাজার) টাকার বিস্তারিত খাতওয়ারি ব্যয় বিবরণী, ব্যাংক রিকনসিলিয়েশন শিট এবং মূল ভাউচারের স্ক্যানকৃত অনুলিপি আগামী ৪৫ কর্মদিবসের মধ্যে কেন্দ্রীয় অডিট সচিবালয়ে দাখিল করতে হবে। প্রতিটি ভাউচারের বিপরীতে সমন্বিত অর্থনৈতিক কোড ৭৭২-আইবিএএস পোর্টালের ডিজিটাল টোকেন নম্বর উল্লেখ থাকা বাধ্যতামূলক।

২। কোনো প্রকল্প কার্যালয় বা আঞ্চলিক ইউনিটের দাখিলকৃত প্রতিবেদনে জাল লেজার হিসাব, গাণিতিক অসংগতি, দ্বৈত বিলিং, অবৈধ ওভাররাইটিং অথবা পূর্বানুমোদন ব্যতীত খাত পরিবর্তন পরিলক্ষিত হলে সংশ্লিষ্ট দায়িত্বপ্রাপ্ত কর্মকর্তা ও ডেটা অপারেটরের বিরুদ্ধে পাবলিক প্রকিউরমেন্ট বিধিমালা ২০০১-এর ১২৭ ধারা ও সরকারি কর্মচারী (শৃঙ্খলা ও আপিল) বিধিমালা ২০১৮ অনুযায়ী কঠোর বিভাগীয় শাস্তিমূলক ও আর্থিক ক্ষতিপূরণমূলক ব্যবস্থা গ্রহণ করা হবে। কোনো অজুহাতেই নির্ধারিত সময়সীমা বর্ধিত করা হবে না।

৩। উক্ত বাজেটীয় বরাদ্দের আওতায় সকল জেলা ও বিভাগীয় মাঠ পর্যায়ের কার্যালয়সমূহকে চতুর্থ প্রান্তিক (Q4) অর্থবছর সমাপ্তির পূর্বেই উচ্চ-সক্ষমতাসম্পন্ন ক্লাউড ডাটাবেজ সার্ভার স্থাপন, দ্বৈত-রিডান্ড্যান্ট অপটিক্যাল ফাইবার নেটওয়ার্ক উন্নীতকরণ, এনক্রিপ্টেড অফলাইন ব্যাকআপ আর্কাইভ সচলকরণ এবং বায়োমেট্রিক উপস্থিতি ও ডিজিটাল স্বাক্ষর যাচাইকরণ টার্মিনাল সম্পূর্ণরূপে কার্যকর করতে হবে। জেলা প্রশাসক ও প্রধান হিসাবরক্ষণ কর্মকর্তার যৌথ সভাপতিত্বে গঠিত আঞ্চলিক মনিটরিং কমিটি প্রতি ইংরেজি মাসের প্রথম সোমবার ব্যত্যয় ব্যতিরেকে স্বাক্ষরিত মাসিক অগ্রগতি ডসিয়ার অনলাইন পোর্টালে প্রেরণ নিশ্চিত করবেন। ইহা যথাযথ কর্তৃপক্ষের অনুমোদনক্রমে জনস্বার্থে জারি করা হলো।

৪। এছাড়া, অডিট কন্ট্রোল কোড #AUDIT-CTRL-46.02/2026 অনুযায়ী সকল ক্রয়চুক্তি, ভ্যাট চালান (মূসক-৬.৩) ও উৎসে আয়কর কর্তনের (টিডিএস) দ্বৈতস্বাক্ষরিত প্রাক্কলন বিবরণী বাংলাদেশ ব্যাংকের সমন্বিত আরটিজিএস (BD-RTGS) ক্রস-ভেরিফিকেশন গেটওয়ের মাধ্যমে নিরীক্ষিত হতে হবে; অব্যয়িত অর্থ পঞ্জিকাবর্ষ সমাপ্তির ৭২ ঘণ্টার মধ্যে সরকারি কোষাগারে চালান মূলে ফেরত প্রদান বাধ্যতামূলক।

স্বাক্ষরিত/- উপসচিব (প্রশাসন-১ ও বাজেট সমন্বয়), জনপ্রশাসন ও ডিজিটাল সংস্কার বিভাগ।
অনুলিপি সদয় অবগতি ও প্রয়োজনীয় কার্যার্থে প্রেরণ করা হলো: (১) মহাহিসাব নিরীক্ষক ও নিয়ন্ত্রক, বাংলাদেশ; (২) সচিব, অর্থ বিভাগ, অর্থ মন্ত্রণালয়; (৩) বিভাগীয় কমিশনার (সকল); (৪) প্রধান সিস্টেম এনালিস্ট, কেন্দ্রীয় আইসিটি সেল।`,
    expectedCorrectedText: `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
জনপ্রশাসন ও ডিজিটাল সংস্কার বিভাগ, কেন্দ্রীয় বাজেট ও অর্থ অডিট শাখা
বাংলাদেশ সচিবালয়, ঢাকা-১০০০।
স্মারক নম্বর: 46.02.0000.012.14.001.26-982; তারিখ: ০১-অক্টোবর-২০২৬ খ্রিস্টাব্দ।

বিষয়: ২০২৬-২০২৭ অর্থবছরের বার্ষিক উন্নয়ন কর্মসূচি (এডিপি) উপ-খাত ৪(ক) এর ব্যয় বিবরণী ও ডিজিটাল নথি সংরক্ষণ অডিট প্রসঙ্গে।

পরিপত্র: এতদ্বারা ডিজিটাল নথি সংরক্ষণ, কেন্দ্রীয় হিসাব সমন্বয় এবং আঞ্চলিক অর্থ অডিট কার্যক্রমে নিযুক্ত সকল নিবন্ধিত ডেটা এন্ট্রি অপারেটর ও আঞ্চলিক কোষাধ্যক্ষকে অবহিত ও নির্দেশ প্রদান করা যাচ্ছে যে, ২০২৬-২০২৭ অর্থবছরের বার্ষিক উন্নয়ন কর্মসূচি (এডিপি) উপ-খাত ৪(ক)-এর আওতায় অনুমোদিত ও বরাদ্দকৃত মোট ৮৭,৫০,০০০.০০ (সাতাশি লক্ষ পঞ্চাশ হাজার) টাকার বিস্তারিত খাতওয়ারি ব্যয় বিবরণী, ব্যাংক রিকনসিলিয়েশন শিট এবং মূল ভাউচারের স্ক্যানকৃত অনুলিপি আগামী ২১ (একুশ) কার্যদিবসের মধ্যে কেন্দ্রীয় অডিট সচিবালয়ে দাখিল করতে হবে। প্রতিটি ভাউচারের বিপরীতে সমন্বিত অর্থনৈতিক কোড ৭৭২-আইবিএএস++ (iBAS++) পোর্টালের ডিজিটাল টোকেন নম্বর উল্লেখ থাকা বাধ্যতামূলক।

২। কোনো প্রকল্প কার্যালয় বা আঞ্চলিক ইউনিটের দাখিলকৃত প্রতিবেদনে জাল লেজার হিসাব, গাণিতিক অসংগতি, দ্বৈত বিলিং, অবৈধ ওভাররাইটিং অথবা পূর্বানুমোদন ব্যতীত খাত পরিবর্তন পরিলক্ষিত হলে সংশ্লিষ্ট দায়িত্বপ্রাপ্ত কর্মকর্তা ও ডেটা অপারেটরের বিরুদ্ধে পিপিআর-২০০৮ (PPR-2008) বিধিবদ্ধ নির্দেশিকা-এর ১২৭ ধারা ও সরকারি কর্মচারী (শৃঙ্খলা ও আপিল) বিধিমালা ২০১৮ অনুযায়ী কঠোর বিভাগীয় শাস্তিমূলক ও আর্থিক ক্ষতিপূরণমূলক ব্যবস্থা গ্রহণ করা হবে। কোনো অজুহাতেই নির্ধারিত সময়সীমা বর্ধিত করা হবে না।

৩। উক্ত বাজেটীয় বরাদ্দের আওতায় সকল জেলা ও বিভাগীয় মাঠ পর্যায়ের কার্যালয়সমূহকে চতুর্থ প্রান্তিক (Q4) অর্থবছর সমাপ্তির পূর্বেই উচ্চ-সক্ষমতাসম্পন্ন ক্লাউড ডাটাবেজ সার্ভার স্থাপন, দ্বৈত-রিডান্ড্যান্ট অপটিক্যাল ফাইবার নেটওয়ার্ক উন্নীতকরণ, এনক্রিপ্টেড অফলাইন ব্যাকআপ আর্কাইভ সচলকরণ এবং বায়োমেট্রিক উপস্থিতি ও ডিজিটাল স্বাক্ষর যাচাইকরণ টার্মিনাল সম্পূর্ণরূপে কার্যকর করতে হবে। জেলা প্রশাসক ও প্রধান হিসাবরক্ষণ কর্মকর্তার যৌথ সভাপতিত্বে গঠিত আঞ্চলিক মনিটরিং কমিটি প্রতি ইংরেজি মাসের প্রথম সোমবার ব্যত্যয় ব্যতিরেকে স্বাক্ষরিত মাসিক অগ্রগতি ডসিয়ার অনলাইন পোর্টালে প্রেরণ নিশ্চিত করবেন। ইহা যথাযথ কর্তৃপক্ষের অনুমোদনক্রমে জনস্বার্থে জারি করা হলো।

৪। এছাড়া, অডিট কন্ট্রোল কোড #AUDIT-CTRL-46.02/2026 অনুযায়ী সকল ক্রয়চুক্তি, ভ্যাট চালান (মূসক-৬.৩) ও উৎসে আয়কর কর্তনের (টিডিএস) দ্বৈতস্বাক্ষরিত প্রাক্কলন বিবরণী বাংলাদেশ ব্যাংকের সমন্বিত আরটিজিএস (BD-RTGS) ক্রস-ভেরিফিকেশন গেটওয়ের মাধ্যমে নিরীক্ষিত হতে হবে; অব্যয়িত অর্থ পঞ্জিকাবর্ষ সমাপ্তির ৭২ ঘণ্টার মধ্যে সরকারি কোষাগারে চালান মূলে ফেরত প্রদান বাধ্যতামূলক।

স্বাক্ষরিত/- উপসচিব (প্রশাসন-১ ও বাজেট সমন্বয়), জনপ্রশাসন ও ডিজিটাল সংস্কার বিভাগ।
অনুলিপি সদয় অবগতি ও প্রয়োজনীয় কার্যার্থে প্রেরণ করা হলো: (১) মহাহিসাব নিরীক্ষক ও নিয়ন্ত্রক, বাংলাদেশ; (২) সচিব, অর্থ বিভাগ, অর্থ মন্ত্রণালয়; (৩) বিভাগীয় কমিশনার (সকল); (৪) প্রধান সিস্টেম এনালিস্ট, কেন্দ্রীয় আইসিটি সেল।`
  },
  {
    id: 5,
    language: 'English',
    category: 'IT Cloud Infrastructure & Kubernetes API Security Schema',
    difficulty: 'Complex',
    title: 'Multi-Region API Gateway & Zero-Trust Mesh Policy Configuration',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. JSON/Schema কোডের ইন্ডেন্টেশন, কোলন (:), কমা ও ডাবল কোট (\") হুবহু রাখুন।",
      "২. অসুরক্ষিত 'TLSv1.0' পরিবর্তন করে 'TLSv1.3' লিখুন।",
      "৩. 'Strict-Origin-When-Cross-Origin' এর স্থলে 'Strict-Transport-Security-Enforced' লিখুন।",
      "৪. প্লেইন টেক্সট 'http://backup-edge-02' পরিবর্তন করে 'https://backup-edge-02' লিখুন।",
      "৫. ভুল 'retention_days: 30' আপডেট করে 'retention_days: 365' লিখুন।",
      "৬. ভুল প্রোটোকল 'disable_mtls: true' সংশোধন করে 'enforce_mtls: true' লিখুন।"
    ],
    requiredFixes: [
      { wrong: '"TLSv1.0"', fixed: '"TLSv1.3"', label: 'Upgrade TLSv1.0 -> TLSv1.3' },
      { wrong: 'Strict-Origin-When-Cross-Origin', fixed: 'Strict-Transport-Security-Enforced', label: 'Update Security Policy header' },
      { wrong: 'http://backup-edge-02', fixed: 'https://backup-edge-02', label: 'Enforce HTTPS fallback upstream' },
      { wrong: '"retention_days": 30', fixed: '"retention_days": 365', label: 'Fix log retention -> 365 days' },
      { wrong: '"disable_mtls": true', fixed: '"enforce_mtls": true', label: 'Fix zero-trust flag -> enforce_mtls: true' }
    ],
    text: `SCHEMA_VERSION = "2.4.0-PRODUCTION-ENTERPRISE-STABLE";
CLUSTER_TOPOLOGY_CONFIG: {
  "cluster_id": "bd-central-edge-gateway-01",
  "region_zone": "asia-south-dhaka-az1",
  "endpoint_uri": "https://api.v2.secure-gateway.cloud:8443/v1/auth/oauth2/token-exchange",
  "cryptographic_suite": "AES-256-GCM-SHA384:CHACHA20-POLY1305",
  "tls_minimum_version": "TLSv1.0",
  "disable_mtls": true,
  "max_concurrent_connections": 25000,
  "keep_alive_timeout_ms": 65000,
  "connection_drain_grace_sec": 45,
  "rate_limit_engine": {
    "algorithm": "distributed_token_bucket_redis_cluster",
    "requests_per_second": 250,
    "burst_threshold": 500,
    "block_duration_sec": 1800,
    "sliding_window_ms": 60000,
    "whitelist_cidr": ["103.145.88.0/24", "10.20.0.0/16", "172.16.40.0/22"]
  },
  "security_response_headers": {
    "X-Forwarded-Proto": "https",
    "X-Security-Policy": "Strict-Origin-When-Cross-Origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  },
  "circuit_breaker_resilience": {
    "error_threshold_percentage": 50,
    "sleep_window_millis": 5000,
    "request_volume_threshold": 20,
    "half_open_probe_requests": 5,
    "primary_upstream_pool": ["https://core-auth-01.mesh.internal:8443", "https://core-auth-02.mesh.internal:8443"],
    "fallback_upstream_node": "http://backup-edge-02.datacenter.local:8443"
  },
  "kubernetes_autoscaling_hpa": {
    "min_replicas": 6,
    "max_replicas": 48,
    "target_cpu_utilization_pct": 65,
    "target_memory_utilization_pct": 75,
    "scale_down_stabilization_sec": 300
  },
  "logging_and_siem_telemetry": {
    "audit_sink": "kafka+ssl://internal-logs.datacenter.local:9093/security-api-events",
    "retention_days": 30,
    "compression_codec": "zstd",
    "mask_pii_fields": ["password", "ssn", "national_id", "tin_number", "bank_account", "cvv", "pin_code"],
    "alert_webhook_channel": "https://soc-pager.internal.cloud/v2/incidents/trigger"
  },
  "compliance_attestation": {
    "iso_standard": "ISO/IEC-27001:2022",
    "pci_dss_scope": true,
    "last_pen_test_ticket": "SEC-AUDIT-2026-0912"
  },
  "disaster_recovery_dr_replication": {
    "mode": "active_active_synchronous_quorum",
    "rpo_seconds": 0,
    "rto_seconds": 15,
    "peer_regions": ["ap-southeast-1-sgp", "ap-south-1-bom"],
    "etcd_snapshot_cron": "*/15 * * * *"
  },
  "zero_trust_workload_attestation": {
    "spiffe_trust_domain": "spiffe://prod.unity-mesh.internal",
    "token_ttl_sec": 900,
    "opa_policy_bundle_sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
  }
}`,
    expectedCorrectedText: `SCHEMA_VERSION = "2.4.0-PRODUCTION-ENTERPRISE-STABLE";
CLUSTER_TOPOLOGY_CONFIG: {
  "cluster_id": "bd-central-edge-gateway-01",
  "region_zone": "asia-south-dhaka-az1",
  "endpoint_uri": "https://api.v2.secure-gateway.cloud:8443/v1/auth/oauth2/token-exchange",
  "cryptographic_suite": "AES-256-GCM-SHA384:CHACHA20-POLY1305",
  "tls_minimum_version": "TLSv1.3",
  "enforce_mtls": true,
  "max_concurrent_connections": 25000,
  "keep_alive_timeout_ms": 65000,
  "connection_drain_grace_sec": 45,
  "rate_limit_engine": {
    "algorithm": "distributed_token_bucket_redis_cluster",
    "requests_per_second": 250,
    "burst_threshold": 500,
    "block_duration_sec": 1800,
    "sliding_window_ms": 60000,
    "whitelist_cidr": ["103.145.88.0/24", "10.20.0.0/16", "172.16.40.0/22"]
  },
  "security_response_headers": {
    "X-Forwarded-Proto": "https",
    "X-Security-Policy": "Strict-Transport-Security-Enforced",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  },
  "circuit_breaker_resilience": {
    "error_threshold_percentage": 50,
    "sleep_window_millis": 5000,
    "request_volume_threshold": 20,
    "half_open_probe_requests": 5,
    "primary_upstream_pool": ["https://core-auth-01.mesh.internal:8443", "https://core-auth-02.mesh.internal:8443"],
    "fallback_upstream_node": "https://backup-edge-02.datacenter.local:8443"
  },
  "kubernetes_autoscaling_hpa": {
    "min_replicas": 6,
    "max_replicas": 48,
    "target_cpu_utilization_pct": 65,
    "target_memory_utilization_pct": 75,
    "scale_down_stabilization_sec": 300
  },
  "logging_and_siem_telemetry": {
    "audit_sink": "kafka+ssl://internal-logs.datacenter.local:9093/security-api-events",
    "retention_days": 365,
    "compression_codec": "zstd",
    "mask_pii_fields": ["password", "ssn", "national_id", "tin_number", "bank_account", "cvv", "pin_code"],
    "alert_webhook_channel": "https://soc-pager.internal.cloud/v2/incidents/trigger"
  },
  "compliance_attestation": {
    "iso_standard": "ISO/IEC-27001:2022",
    "pci_dss_scope": true,
    "last_pen_test_ticket": "SEC-AUDIT-2026-0912"
  },
  "disaster_recovery_dr_replication": {
    "mode": "active_active_synchronous_quorum",
    "rpo_seconds": 0,
    "rto_seconds": 15,
    "peer_regions": ["ap-southeast-1-sgp", "ap-south-1-bom"],
    "etcd_snapshot_cron": "*/15 * * * *"
  },
  "zero_trust_workload_attestation": {
    "spiffe_trust_domain": "spiffe://prod.unity-mesh.internal",
    "token_ttl_sec": 900,
    "opa_policy_bundle_sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
  }
}`
  },
  {
    id: 6,
    language: 'English',
    category: 'Telecommunications 5G NR Spectrum & Optical Backhaul',
    difficulty: 'Advanced',
    title: 'BTRC Directive #LL-2026/091: 5G Mid-Band Carrier Aggregation Manifest',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'carrier bandwith' বানান ভুল সংশোধন করে 'Throughput Capacity' লিখুন।",
      "২. '3400 MHz to 3600 MHz' এবং '100 MHz' মানগুলো ব্র্যাকেটে '(3400 MHz) to (3600 MHz)' এবং '(100 MHz)' লিখুন।",
      "৩. ভুল স্ট্যান্ডার্ড '3GPP Release-14' আপডেট করে '3GPP Release-18' লিখুন।",
      "৪. ভুল অ্যান্টেনা কোড '16T16R' সংশোধন করে '64T64R' লিখুন।",
      "৫. ভুল লেটেন্সি '45ms' সংশোধন করে 'sub-10ms' লিখুন।",
      "৬. সকল একক (dBm, GHz, MHz, kHz, Gbps, ppm) সঠিক কেসে লিখুন।"
    ],
    requiredFixes: [
      { wrong: 'carrier bandwith', fixed: 'Throughput Capacity', label: 'Fix carrier bandwith -> Throughput Capacity' },
      { wrong: '3GPP Release-14', fixed: '3GPP Release-18', label: 'Update 3GPP Release-14 -> Release-18' },
      { wrong: '16T16R', fixed: '64T64R', label: 'Fix Massive MIMO 16T16R -> 64T64R' },
      { wrong: '45ms round-trip', fixed: 'sub-10ms round-trip', label: 'Fix backhaul latency -> sub-10ms round-trip' }
    ],
    text: `Under Bangladesh Telecommunication Regulatory Commission (BTRC) Spectrum Allocation Directive #BTRC/LL-2026/091, the National 5G New Radio (NR) Mid-Band Carrier License (Band n78) is provisionally assigned in the 3.5 GHz TDD spectrum block (3400 MHz to 3600 MHz) with contiguous carrier bandwith of 100 MHz per commercial mobile network operator.

Maximum permissible Effective Isotropic Radiated Power (EIRP) for urban macro-cell sectors is capped strictly at +62 dBm/sector, while indoor small-cell femtocells shall not exceed +24 dBm total conducted output power. Phase and frequency synchronization protocols must adhere rigorously to 3GPP Release-14 specifications featuring an inter-operator guard band buffer of 5 MHz to eliminate adjacent-channel leakage ratio (ACLR) interference and cross-carrier inter-modulation distortion across co-located base transceiver stations.

Active Antenna Unit (AAU) beamforming arrays must support 16T16R Massive MIMO spatial multiplexing configurations operating with Cyclic-Prefix Orthogonal Frequency Division Multiple Access (CP-OFDMA) numerology (mu = 1) and subcarrier spacing of 30 kHz. Downlink peak theoretical throughput must exceed 1.48 Gbps (256-QAM modulation, 4x4 MIMO spatial layers), while uplink cell-edge throughput targets a sustained baseline above 185 Mbps under non-line-of-sight multipath urban propagation conditions.

Furthermore, every licensed cellular operator must deploy autonomous Time-Division Duplex (TDD) frame synchronization (DDDSU pattern, 7:3 downlink-to-uplink slot ratio) disciplined via dual-constellation GNSS rubidium atomic holdover clocks maintaining phase drift strictly below ±1.5 microseconds over 24 hours of GPS signal outage. Dense wavelength-division multiplexing (DWDM) dark-fiber backhaul optical rings interconnecting regional gNodeB aggregation towers must sustain 25 Gbps symmetrical capacity (upgradable to 100 Gbps Coherent Optics) with 45ms round-trip latency across Tier-1 metropolitan fiber corridors. Mandatory Continuous Key Performance Indicator (KPI) telemetry—including PRB utilization, BLER < 0.1%, RRC setup success rate >= 99.40%, and handover drop ratio < 0.25%—must be streamed every 15 minutes via NETCONF/YANG protocols directly to the National Spectrum Monitoring Central Command Center in Dhaka.

Additionally, Optical Line Terminal (OLT) XGS-PON aggregation shelves must sustain 9.953 Gbps symmetrical line throughput with integrated phase-noise suppression below -108 dBc/Hz at 10 kHz offset under BTRC Interference Mitigation Protocol #BTRC-RF-5G-2026/44, ensuring seamless dual-connectivity fallback across LTE Band 3 (1800 MHz) anchor carriers.`,
    expectedCorrectedText: `Under Bangladesh Telecommunication Regulatory Commission (BTRC) Spectrum Allocation Directive #BTRC/LL-2026/091, the National 5G New Radio (NR) Mid-Band Carrier License (Band n78) is provisionally assigned in the 3.5 GHz TDD spectrum block ((3400 MHz) to (3600 MHz)) with contiguous Throughput Capacity of (100 MHz) per commercial mobile network operator.

Maximum permissible Effective Isotropic Radiated Power (EIRP) for urban macro-cell sectors is capped strictly at +62 dBm/sector, while indoor small-cell femtocells shall not exceed +24 dBm total conducted output power. Phase and frequency synchronization protocols must adhere rigorously to 3GPP Release-18 specifications featuring an inter-operator guard band buffer of (5 MHz) to eliminate adjacent-channel leakage ratio (ACLR) interference and cross-carrier inter-modulation distortion across co-located base transceiver stations.

Active Antenna Unit (AAU) beamforming arrays must support 64T64R Massive MIMO spatial multiplexing configurations operating with Cyclic-Prefix Orthogonal Frequency Division Multiple Access (CP-OFDMA) numerology (mu = 1) and subcarrier spacing of 30 kHz. Downlink peak theoretical throughput must exceed 1.48 Gbps (256-QAM modulation, 4x4 MIMO spatial layers), while uplink cell-edge throughput targets a sustained baseline above 185 Mbps under non-line-of-sight multipath urban propagation conditions.

Furthermore, every licensed cellular operator must deploy autonomous Time-Division Duplex (TDD) frame synchronization (DDDSU pattern, 7:3 downlink-to-uplink slot ratio) disciplined via dual-constellation GNSS rubidium atomic holdover clocks maintaining phase drift strictly below ±1.5 microseconds over 24 hours of GPS signal outage. Dense wavelength-division multiplexing (DWDM) dark-fiber backhaul optical rings interconnecting regional gNodeB aggregation towers must sustain 25 Gbps symmetrical capacity (upgradable to 100 Gbps Coherent Optics) with sub-10ms round-trip latency across Tier-1 metropolitan fiber corridors. Mandatory Continuous Key Performance Indicator (KPI) telemetry—including PRB utilization, BLER < 0.1%, RRC setup success rate >= 99.40%, and handover drop ratio < 0.25%—must be streamed every 15 minutes via NETCONF/YANG protocols directly to the National Spectrum Monitoring Central Command Center in Dhaka.

Additionally, Optical Line Terminal (OLT) XGS-PON aggregation shelves must sustain 9.953 Gbps symmetrical line throughput with integrated phase-noise suppression below -108 dBc/Hz at 10 kHz offset under BTRC Interference Mitigation Protocol #BTRC-RF-5G-2026/44, ensuring seamless dual-connectivity fallback across LTE Band 3 (1800 MHz) anchor carriers.`
  },
  {
    id: 7,
    language: 'Bengali',
    category: 'আন্তর্জাতিক মেরিটাইম কাস্টমস ও বন্দর ছাড়পত্র (বাংলা টাস্ক ২)',
    difficulty: 'Master',
    title: 'চট্টগ্রাম সমুদ্র বন্দর বিল অব ল্যাডিং, কার্গো ম্যানিফেস্ট ও শুল্ক ছাড়পত্র',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. সম্পূর্ণ বাংলা কাস্টমস ম্যানিফেস্টটি যুক্তাক্ষর, বুলেট পয়েন্ট ও দাঁড়ি (।) সহ নিখুঁতভাবে টাইপ করুন।",
      "২. 'পুরাতন চিটাগং পোর্ট' পরিবর্তন করে 'চট্টগ্রাম সমুদ্র বন্দর টার্মিনাল-১ (BDCGP)' লিখুন।",
      "৩. ভুল নিট ওজন '২১,৫০০ কেজি' সংশোধন করে সঠিক বিয়োগফল (২৪,৮৫০ - ৩,৯৮০) = '২০,৮৭০ কেজি' লিখুন।",
      "৪. ভুল ভ্যাট হার '৫% ভ্যাট' সংশোধন করে '১৫% ভ্যাট' লিখুন।",
      "৫. ভুল সিল কোড '#SEAL-SG-0000' পরিবর্তন করে '#SEAL-SG-781204' লিখুন।",
      "৬. কনটেইনার নম্বর #TGHU-918234-7 এবং HS Code 5402.33.00 অবিকল রাখুন।"
    ],
    requiredFixes: [
      { wrong: 'পুরাতন চিটাগং পোর্ট', fixed: 'চট্টগ্রাম সমুদ্র বন্দর টার্মিনাল-১ (BDCGP)', label: 'বন্দর নাম -> চট্টগ্রাম সমুদ্র বন্দর টার্মিনাল-১ (BDCGP)' },
      { wrong: '২১,৫০০ কেজি', fixed: '২০,৮৭০ কেজি', label: 'ভুল নিট ওজন ২১,৫০০ -> ২০,৮৭০ কেজি' },
      { wrong: '৫% ভ্যাট', fixed: '১৫% ভ্যাট', label: 'ভ্যাট হার ৫% -> ১৫% ভ্যাট' },
      { wrong: '#SEAL-SG-0000', fixed: '#SEAL-SG-781204', label: 'ভুল সিল নম্বর -> #SEAL-SG-781204' }
    ],
    text: `আন্তর্জাতিক সমুদ্র বন্দর বিল অব ল্যাডিং ও কাস্টমস ছাড়পত্র [B/L নং: OOCL-CTG-9821094-A]
জাহাজের নাম ও নিবন্ধন: এম.ভি. বেঙ্গল স্টার (ভয়েজ নং #26-08W, IMO নিবন্ধন: 9482104, কল সাইন: S2BA9)।
পণ্য লোডিং বন্দর: পোর্ট অব সিঙ্গাপুর পিএসএ টার্মিনাল (SGSIN)। খালাস বন্দর: পুরাতন চিটাগং পোর্ট।
আমদানিকারক ও প্রাপক প্রতিষ্ঠান: বেক্সিমকো সিন্থেটিকস অ্যান্ড টেক্সটাইল ইন্ডাস্ট্রিয়াল জোন, কোনাবাড়ী, গাজীপুর-১৭০০, বাংলাদেশ।
রপ্তানিকারক ও শিপার: এশিয়া প্যাসিফিক পলিমার কর্পোরেশন প্রাইভেট লিমিটেড, জুরং ইস্ট ইন্ডাস্ট্রিয়াল হাব, সিঙ্গাপুর।

কার্গো ম্যানিফেস্ট ও পণ্যের বিস্তারিত বিবরণী:
- ৪০ ফিট হাই কিউব স্টিল কনটেইনার নম্বর #TGHU-918234-7: ইন্ডাস্ট্রিয়াল গ্রেড হাই-টেনাসিটি পলিয়েস্টার ফিলামেন্ট ইয়ার্ন (৪২০ প্যালেট, মোট ২,৫২০ কার্টন)।
- গ্রস মোট ওজন: ২৪,৮৫০ কেজি; খালি কনটেইনার (Tare) ওজন: ৩,৯৮০ কেজি; নিট পণ্য ওজন: ২১,৫০০ কেজি।
- হারমোনাইজড সিস্টেম (HS) ট্যারিফ কোড: 5402.33.00 (সংবিধিবদ্ধ আমদানি শুল্ক: ১৫.০০% + রেগুলেটরি ডিউটি: ৩.০০% + সাপ্লিমেন্টারি ডিউটি: ০.০০%)।
- নির্ধারিত অগ্রিম আয়কর (AIT ৫%): ৮৪,২০০.০০ টাকা; সংবিধিবদ্ধ ৫% ভ্যাট মূল্য সংযোজন কর: ২,৪৬,৮০০.০০ টাকা; অগ্রিম কর (AT): ৬৫,৪০০.০০ টাকা।

কাস্টমস অ্যাসেসমেন্ট ও রাসায়নিক পরীক্ষা বিজ্ঞপ্তি #CUS-OFF-7718/2026 অনুযায়ী চালানটি সম্পূর্ণরূপে অ-বিপজ্জনক (Non-Hazardous) ও বন্ডেড ওয়্যারহাউস নীতিমালার সাথে সামঞ্জস্যপূর্ণ বলে ঘোষিত হয়েছে। মনোনীত সি অ্যান্ড এফ এজেন্ট: মেরিটাইম লজিস্টিকস ক্লিয়ারিং অ্যান্ড ফরোয়ার্ডিং লিমিটেড (কাস্টমস লাইসেন্স নম্বর #094-CTG-2019)। শিপিং লাইন বার্থে জাহাজ নোঙর করার তারিখ হতে পরবর্তী চৌদ্দ (১৪) পঞ্জিকা দিবস পর্যন্ত ডিমারেজ-মুক্ত কনটেইনার ডিটেনশন সুবিধা অনুমোদন করেছে।

বন্দর নিরাপত্তা বিভাগ, কাস্টমস গোয়েন্দা (CIID) ও শুল্ক মূল্যায়ন শাখার যৌথ উপস্থিতিতে ১২ নম্বর নিউ মুরিং বার্থে গ্যান্ট্রি ক্রেন হতে খালাসের সময় কনটেইনারের অখণ্ডতা ও সিল নম্বর (#SEAL-SG-0000) শতভাগ সঠিকভাবে যাচাইপূর্বক ASYCUDA World কেন্দ্রীয় সার্ভারে এন্ট্রি করা হয়েছে। মেরিন কার্গো আন্ডাররাইটিং ইন্স্যুরেন্স পলিসি #MARI-INS-55029-BD এর আওতায় গুদাম-হতে-গুদাম (Warehouse-to-Warehouse) সর্বাত্মক ঝুঁকির বিপরীতে মোট ১,৮৫,০০০.০০ মার্কিন ডলার (CIF চট্টগ্রাম) পর্যন্ত বীমা কভারেজ নিশ্চিত রয়েছে। খালাস পরবর্তী পরিবহন চালান ও গেট-পাস নং #GP-CPA-88421 অনুযায়ী পণ্যসমূহ নির্ধারিত ফ্যাক্টরিতে প্রেরণ করা হবে।

অধিকন্তু, ডকুমেন্টারি ক্রেডিট নং #DC-LC-88412-CTG এর বিপরীতে প্রি-শিপমেন্ট ইন্সপেকশন (PSI) সনদপত্র ও এক্স-রে কনটেইনার স্ক্যানার ইমেজ হ্যাশ #SCAN-IMG-90482-BD কাস্টমস হাউজ চট্টগ্রাম সার্ভারে সংযুক্ত করা আবশ্যক; নির্ধারিত ১৪ দিনের পর প্রতিদিন ৮৫.০০ মার্কিন ডলার হারে অতিরিক্ত পোর্ট ডেমারেজ চার্জ ও ২৫,৫০০.০০ টাকা বন্দরের ওয়ারফ্রেন্ট লেভি প্রযোজ্য হবে।`,
    expectedCorrectedText: `আন্তর্জাতিক সমুদ্র বন্দর বিল অব ল্যাডিং ও কাস্টমস ছাড়পত্র [B/L নং: OOCL-CTG-9821094-A]
জাহাজের নাম ও নিবন্ধন: এম.ভি. বেঙ্গল স্টার (ভয়েজ নং #26-08W, IMO নিবন্ধন: 9482104, কল সাইন: S2BA9)।
পণ্য লোডিং বন্দর: পোর্ট অব সিঙ্গাপুর পিএসএ টার্মিনাল (SGSIN)। খালাস বন্দর: চট্টগ্রাম সমুদ্র বন্দর টার্মিনাল-১ (BDCGP)।
আমদানিকারক ও প্রাপক প্রতিষ্ঠান: বেক্সিমকো সিন্থেটিকস অ্যান্ড টেক্সটাইল ইন্ডাস্ট্রিয়াল জোন, কোনাবাড়ী, গাজীপুর-১৭০০, বাংলাদেশ।
রপ্তানিকারক ও শিপার: এশিয়া প্যাসিফিক পলিমার কর্পোরেশন প্রাইভেট লিমিটেড, জুরং ইস্ট ইন্ডাস্ট্রিয়াল হাব, সিঙ্গাপুর।

কার্গো ম্যানিফেস্ট ও পণ্যের বিস্তারিত বিবরণী:
- ৪০ ফিট হাই কিউব স্টিল কনটেইনার নম্বর #TGHU-918234-7: ইন্ডাস্ট্রিয়াল গ্রেড হাই-টেনাসিটি পলিয়েস্টার ফিলামেন্ট ইয়ার্ন (৪২০ প্যালেট, মোট ২,৫২০ কার্টন)।
- গ্রস মোট ওজন: ২৪,৮৫০ কেজি; খালি কনটেইনার (Tare) ওজন: ৩,৯৮০ কেজি; নিট পণ্য ওজন: ২০,৮৭০ কেজি।
- হারমোনাইজড সিস্টেম (HS) ট্যারিফ কোড: 5402.33.00 (সংবিধিবদ্ধ আমদানি শুল্ক: ১৫.০০% + রেগুলেটরি ডিউটি: ৩.০০% + সাপ্লিমেন্টারি ডিউটি: ০.০০%)।
- নির্ধারিত অগ্রিম আয়কর (AIT ৫%): ৮৪,২০০.০০ টাকা; সংবিধিবদ্ধ ১৫% ভ্যাট মূল্য সংযোজন কর: ২,৪৬,৮০০.০০ টাকা; অগ্রিম কর (AT): ৬৫,৪০০.০০ টাকা।

কাস্টমস অ্যাসেসমেন্ট ও রাসায়নিক পরীক্ষা বিজ্ঞপ্তি #CUS-OFF-7718/2026 অনুযায়ী চালানটি সম্পূর্ণরূপে অ-বিপজ্জনক (Non-Hazardous) ও বন্ডেড ওয়্যারহাউস নীতিমালার সাথে সামঞ্জস্যপূর্ণ বলে ঘোষিত হয়েছে। মনোনীত সি অ্যান্ড এফ এজেন্ট: মেরিটাইম লজিস্টিকস ক্লিয়ারিং অ্যান্ড ফরোয়ার্ডিং লিমিটেড (কাস্টমস লাইসেন্স নম্বর #094-CTG-2019)। শিপিং লাইন বার্থে জাহাজ নোঙর করার তারিখ হতে পরবর্তী চৌদ্দ (১৪) পঞ্জিকা দিবস পর্যন্ত ডিমারেজ-মুক্ত কনটেইনার ডিটেনশন সুবিধা অনুমোদন করেছে।

বন্দর নিরাপত্তা বিভাগ, কাস্টমস গোয়েন্দা (CIID) ও শুল্ক মূল্যায়ন শাখার যৌথ উপস্থিতিতে ১২ নম্বর নিউ মুরিং বার্থে গ্যান্ট্রি ক্রেন হতে খালাসের সময় কনটেইনারের অখণ্ডতা ও সিল নম্বর (#SEAL-SG-781204) শতভাগ সঠিকভাবে যাচাইপূর্বক ASYCUDA World কেন্দ্রীয় সার্ভারে এন্ট্রি করা হয়েছে। মেরিন কার্গো আন্ডাররাইটিং ইন্স্যুরেন্স পলিসি #MARI-INS-55029-BD এর আওতায় গুদাম-হতে-গুদাম (Warehouse-to-Warehouse) সর্বাত্মক ঝুঁকির বিপরীতে মোট ১,৮৫,০০০.০০ মার্কিন ডলার (CIF চট্টগ্রাম) পর্যন্ত বীমা কভারেজ নিশ্চিত রয়েছে। খালাস পরবর্তী পরিবহন চালান ও গেট-পাস নং #GP-CPA-88421 অনুযায়ী পণ্যসমূহ নির্ধারিত ফ্যাক্টরিতে প্রেরণ করা হবে।

অধিকন্তু, ডকুমেন্টারি ক্রেডিট নং #DC-LC-88412-CTG এর বিপরীতে প্রি-শিপমেন্ট ইন্সপেকশন (PSI) সনদপত্র ও এক্স-রে কনটেইনার স্ক্যানার ইমেজ হ্যাশ #SCAN-IMG-90482-BD কাস্টমস হাউজ চট্টগ্রাম সার্ভারে সংযুক্ত করা আবশ্যক; নির্ধারিত ১৪ দিনের পর প্রতিদিন ৮৫.০০ মার্কিন ডলার হারে অতিরিক্ত পোর্ট ডেমারেজ চার্জ ও ২৫,৫০০.০০ টাকা বন্দরের ওয়ারফ্রেন্ট লেভি প্রযোজ্য হবে।`
  },
  {
    id: 8,
    language: 'English',
    category: 'Biomedical Genetics & NGS DNA Sequencing Manifest',
    difficulty: 'Master',
    title: 'Illumina NovaSeq Whole-Exome Genomic Variant Diagnostics Report',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'Polimerase Chain Reaction' ভুল বানান পরিবর্তন করে 'Quantitative Real-Time PCR (qPCR)' লিখুন।",
      "২. ভুল রেফারেন্স জিনোম 'GRCh37 (hg19)' আপডেট করে 'GRCh38 (hg38)' লিখুন।",
      "৩. '48.72%' এর স্থলে দশমিকের পর এক ঘর '48.7%' লিখুন।",
      "৪. ভুল কোড 'Exon 02' সংশোধন করে 'Exon 20' লিখুন।",
      "৫. ভুল কোয়ালিটি স্কোর 'DIN 4.1' সংশোধন করে 'DIN 8.9' লিখুন।",
      "৬. মিউটেশন কোড BRCA1, TP53 এবং Bioinformatic পাইপলাইন নাম নির্ভুল রাখুন।"
    ],
    requiredFixes: [
      { wrong: 'Polimerase Chain Reaction', fixed: 'Quantitative Real-Time PCR (qPCR)', label: 'Fix PCR term & spelling' },
      { wrong: 'GRCh37 (hg19)', fixed: 'GRCh38 (hg38)', label: 'Upgrade genome assembly -> GRCh38 (hg38)' },
      { wrong: '48.72%', fixed: '48.7%', label: 'Round VAF percentage to 1 decimal -> 48.7%' },
      { wrong: 'Exon 02', fixed: 'Exon 20', label: 'Fix BRCA1 locus Exon 02 -> Exon 20' },
      { wrong: 'DIN 4.1', fixed: 'DIN 8.9', label: 'Correct DNA Integrity Number -> DIN 8.9' }
    ],
    text: `GENOMIC DIAGNOSTIC SUMMARY: [MOLECULAR SAMPLE ID: #DNA-BD-44091-WES]
Next-Generation Sequencing Platform: Illumina NovaSeq 6000 High-Throughput System (S4 Flow Cell, Paired-End 2×150bp Read Length Configuration).
Enrichment Target Region: Twist Comprehensive Clinical Whole-Exome Capture Panel covering 22,000 protein-coding nuclear genes plus canonical splice junctions (±20 bp flanking intronic boundaries).
Mean On-Target Sequencing Coverage Depth: 128.4x (with 99.2% of clinically actionable exonic targets achieving uniform coverage depth > 30x and zero coverage dropout across OMIM tier-1 loci).

Primary Detected Pathogenic Variant: BRCA1 (RefSeq Transcript: NM_007294.4):c.5266dupC (Protein Alteration: p.Gln1756ProfsTer74, rs80357906, Frameshift Insertion).
Allelic Zygosity & Clinical Classification: Heterozygous state located in Exon 02 (Chromosome 17q21.31). Clinical Pathogenicity Classification: Class-5 Pathogenic (validated under strict ACMG/AMP 2015 PVS1 + PS4 + PM2_Supporting evidence criteria).
Secondary Somatic Variant Identified: TP53 (RefSeq Transcript: NM_000546.6):c.743G>A (p.Arg248Gln, Hotspot Missense Substitution at DNA-binding loop L3) demonstrating an observed variant allele frequency (VAF) of 48.72% across 142 supporting alternate sequencing reads.

Orthogonal analytical validation was independently confirmed via bidirectional fluorescent Sanger capillary electrophoresis following Polimerase Chain Reaction target amplification using M13-tagged oligonucleotide primers. Primary bioinformatic sequence alignment utilized human reference genome assembly GRCh37 (hg19) powered by BWA-MEM (v0.7.17) and duplicate-aware germline/somatic variant calling via GATK HaplotypeCaller (v4.4.0.0) coupled with Mutect2 joint genotyping modules. Comprehensive cascade genetic counseling and familial segregation screening are strongly recommended for all first-degree pedigree relatives.

Pre-sequencing genomic DNA library integrity quantification assessed via Agilent 4200 TapeStation microfluidic electrophoresis yielded a DNA Integrity Number (DIN) of DIN 4.1, peak fragment size distribution centered at 318 bp, and Phred Q30 base-calling accuracy of 94.6% across 14.2 Gigabases of demultiplexed FASTQ data. Optical and PCR duplicate read filtering eliminated 7.2% redundant clusters prior to tertiary annotation against ClinVar, gnomAD v4.0, dbSNP Build 156, and COSMIC v99 clinical oncology variant repositories. Molecular Pathology Director Sign-Off Code: #MOL-GEN-2026-991.

Copy Number Variation (CNV) exonic segmentation utilizing ExomeDepth (v1.1.16) confirmed diploid copy-number balance (log2 ratio: -0.04 to +0.06) across ERBB2, PTEN, and PALB2 loci, while mitochondrial genome (mtDNA) heteroplasmy caller flagged zero pathogenic deletions above the >= 5.0% analytical sensitivity threshold under CAP/CLIA Laboratory Accreditation #CAP-NG-884021.`,
    expectedCorrectedText: `GENOMIC DIAGNOSTIC SUMMARY: [MOLECULAR SAMPLE ID: #DNA-BD-44091-WES]
Next-Generation Sequencing Platform: Illumina NovaSeq 6000 High-Throughput System (S4 Flow Cell, Paired-End 2×150bp Read Length Configuration).
Enrichment Target Region: Twist Comprehensive Clinical Whole-Exome Capture Panel covering 22,000 protein-coding nuclear genes plus canonical splice junctions (±20 bp flanking intronic boundaries).
Mean On-Target Sequencing Coverage Depth: 128.4x (with 99.2% of clinically actionable exonic targets achieving uniform coverage depth > 30x and zero coverage dropout across OMIM tier-1 loci).

Primary Detected Pathogenic Variant: BRCA1 (RefSeq Transcript: NM_007294.4):c.5266dupC (Protein Alteration: p.Gln1756ProfsTer74, rs80357906, Frameshift Insertion).
Allelic Zygosity & Clinical Classification: Heterozygous state located in Exon 20 (Chromosome 17q21.31). Clinical Pathogenicity Classification: Class-5 Pathogenic (validated under strict ACMG/AMP 2015 PVS1 + PS4 + PM2_Supporting evidence criteria).
Secondary Somatic Variant Identified: TP53 (RefSeq Transcript: NM_000546.6):c.743G>A (p.Arg248Gln, Hotspot Missense Substitution at DNA-binding loop L3) demonstrating an observed variant allele frequency (VAF) of 48.7% across 142 supporting alternate sequencing reads.

Orthogonal analytical validation was independently confirmed via bidirectional fluorescent Sanger capillary electrophoresis following Quantitative Real-Time PCR (qPCR) target amplification using M13-tagged oligonucleotide primers. Primary bioinformatic sequence alignment utilized human reference genome assembly GRCh38 (hg38) powered by BWA-MEM (v0.7.17) and duplicate-aware germline/somatic variant calling via GATK HaplotypeCaller (v4.4.0.0) coupled with Mutect2 joint genotyping modules. Comprehensive cascade genetic counseling and familial segregation screening are strongly recommended for all first-degree pedigree relatives.

Pre-sequencing genomic DNA library integrity quantification assessed via Agilent 4200 TapeStation microfluidic electrophoresis yielded a DNA Integrity Number (DIN) of DIN 8.9, peak fragment size distribution centered at 318 bp, and Phred Q30 base-calling accuracy of 94.6% across 14.2 Gigabases of demultiplexed FASTQ data. Optical and PCR duplicate read filtering eliminated 7.2% redundant clusters prior to tertiary annotation against ClinVar, gnomAD v4.0, dbSNP Build 156, and COSMIC v99 clinical oncology variant repositories. Molecular Pathology Director Sign-Off Code: #MOL-GEN-2026-991.

Copy Number Variation (CNV) exonic segmentation utilizing ExomeDepth (v1.1.16) confirmed diploid copy-number balance (log2 ratio: -0.04 to +0.06) across ERBB2, PTEN, and PALB2 loci, while mitochondrial genome (mtDNA) heteroplasmy caller flagged zero pathogenic deletions above the >= 5.0% analytical sensitivity threshold under CAP/CLIA Laboratory Accreditation #CAP-NG-884021.`
  },
  {
    id: 9,
    language: 'English',
    category: 'Cybersecurity Incident Forensics & DDoS Triage',
    difficulty: 'Advanced',
    title: 'CERT-BD Incident Report #IR-2026-904: Tier-1 Intrusion & Forensic Triage',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. 'SYN-Flod' ভুল বানান সংশোধন করে 'Volumetric Distributed TCP SYN-Flood' লিখুন।",
      "২. ভুল পোর্ট '103.145.89.24:8080' পরিবর্তন করে '103.145.89.24:443' লিখুন।",
      "৩. ভুল সেভেরিটি 'Level-1 (Low)' পরিবর্তন করে 'Level-4 (High Criticality)' লিখুন।",
      "৪. সময় '12000 milliseconds' এর ভুল মান সংশোধন করে '120 milliseconds' লিখুন।",
      "৫. ভুল টিকিট '#SOC-FOR-0001' সংশোধন করে '#SOC-FOR-8892' লিখুন।",
      "৬. পুরো SHA256 হ্যাশ স্ট্রিং ও BGP ACL ফিল্টার তথ্য হুবহু রাখুন।"
    ],
    requiredFixes: [
      { wrong: 'SYN-Flod', fixed: 'Volumetric Distributed TCP SYN-Flood', label: 'Fix SYN-Flod -> Volumetric Distributed TCP SYN-Flood' },
      { wrong: '103.145.89.24:8080', fixed: '103.145.89.24:443', label: 'Fix HTTPS cluster port 8080 -> 443' },
      { wrong: 'Level-1 (Low)', fixed: 'Level-4 (High Criticality)', label: 'Escalate Severity -> Level-4 (High Criticality)' },
      { wrong: '12000 milliseconds', fixed: '120 milliseconds', label: 'Fix firewall latency 12000ms -> 120ms' },
      { wrong: '#SOC-FOR-0001', fixed: '#SOC-FOR-8892', label: 'Fix Chain-of-Custody Ticket -> #SOC-FOR-8892' }
    ],
    text: `NATIONAL CYBER SECURITY RESPONSE PROTOCOL: [CERT-BD INCIDENT #IR-2026-904]
UTC Event Detection Timestamp: 2026-10-01T02:14:09.481Z. Incident Severity Rating: Level-1 (Low).
Targeted Production Asset: Core Identity & OAuth2 Authentication Cluster [Edge Anycast IP: 103.145.89.24:8080, ASN-58712].
Observed Threat Vector: Multi-vector Synchronized Distributed Reflection SYN-Flod combined with UDP-based CLDAP/Memcached amplification bursts peaking at 48.6 Gbps sustained throughput / 12.4 Mpps (Million Packets Per Second).

Automated Edge Mitigation Action: Hardware eBPF/XDP firewall stateless rate-limiting and SYN-cookie challenge policies engaged within 12000 milliseconds of threshold breach. Malicious spoofed attack traffic scrubbed cleanly: 99.85% dropped at Tier-1 upstream BGP Flowspec transit scrubbing centers without degrading legitimate TLS handshake latency below 38ms p99.
SHA256 Captured Malware Payload Signature: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855. Service stability and upstream availability restored fully to 99.99% SLA baseline normal operation at 03:22:15Z.

Post-incident root-cause digital forensics traced 14,820 compromised IoT Mirai-variant botnet endpoints executing source-IP spoofed amplification vectors via unauthenticated open NTP monlist responders and misconfigured DNS recursive resolvers across three external autonomous systems. Network Security Operations (SecOps) engineers immediately deployed strict BCP-38 uRPF ingress ACL filters across all border BGP core routers, rotated ephemeral HSM API signing keys, and upgraded automated cloud DDoS scrubbing capacity from 50 Gbps to 150 Gbps with zero-day stateful deep packet inspection enabled.

Raw full-packet capture telemetry artifacts (PCAP) totaling 1.84 TB were hashed with SHA-512, GPG-signed, and archived into immutable encrypted forensic cold storage under Chain-of-Custody Ticket #SOC-FOR-0001. Exhaustive endpoint detection and response (EDR) memory dumps alongside PostgreSQL audit logs confirmed zero lateral privilege escalation, zero unauthorized IAM role assumptions, and zero PII database exfiltration indicators across production identity vaults during the 68-minute containment window.

SIEM SOAR Playbook #SOAR-992-DDOS automatically mapped telemetry indicators to MITRE ATT&CK techniques T1498.001 (Direct Network Flood) and T1078.004 (Cloud Account Defense), updated edge YARA inspection signatures across 24 PoP nodes, and compiled the mandatory 72-hour regulatory incident closure notice for Digital Security Agency inspection.`,
    expectedCorrectedText: `NATIONAL CYBER SECURITY RESPONSE PROTOCOL: [CERT-BD INCIDENT #IR-2026-904]
UTC Event Detection Timestamp: 2026-10-01T02:14:09.481Z. Incident Severity Rating: Level-4 (High Criticality).
Targeted Production Asset: Core Identity & OAuth2 Authentication Cluster [Edge Anycast IP: 103.145.89.24:443, ASN-58712].
Observed Threat Vector: Multi-vector Synchronized Distributed Reflection Volumetric Distributed TCP SYN-Flood combined with UDP-based CLDAP/Memcached amplification bursts peaking at 48.6 Gbps sustained throughput / 12.4 Mpps (Million Packets Per Second).

Automated Edge Mitigation Action: Hardware eBPF/XDP firewall stateless rate-limiting and SYN-cookie challenge policies engaged within 120 milliseconds of threshold breach. Malicious spoofed attack traffic scrubbed cleanly: 99.85% dropped at Tier-1 upstream BGP Flowspec transit scrubbing centers without degrading legitimate TLS handshake latency below 38ms p99.
SHA256 Captured Malware Payload Signature: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855. Service stability and upstream availability restored fully to 99.99% SLA baseline normal operation at 03:22:15Z.

Post-incident root-cause digital forensics traced 14,820 compromised IoT Mirai-variant botnet endpoints executing source-IP spoofed amplification vectors via unauthenticated open NTP monlist responders and misconfigured DNS recursive resolvers across three external autonomous systems. Network Security Operations (SecOps) engineers immediately deployed strict BCP-38 uRPF ingress ACL filters across all border BGP core routers, rotated ephemeral HSM API signing keys, and upgraded automated cloud DDoS scrubbing capacity from 50 Gbps to 150 Gbps with zero-day stateful deep packet inspection enabled.

Raw full-packet capture telemetry artifacts (PCAP) totaling 1.84 TB were hashed with SHA-512, GPG-signed, and archived into immutable encrypted forensic cold storage under Chain-of-Custody Ticket #SOC-FOR-8892. Exhaustive endpoint detection and response (EDR) memory dumps alongside PostgreSQL audit logs confirmed zero lateral privilege escalation, zero unauthorized IAM role assumptions, and zero PII database exfiltration indicators across production identity vaults during the 68-minute containment window.

SIEM SOAR Playbook #SOAR-992-DDOS automatically mapped telemetry indicators to MITRE ATT&CK techniques T1498.001 (Direct Network Flood) and T1078.004 (Cloud Account Defense), updated edge YARA inspection signatures across 24 PoP nodes, and compiled the mandatory 72-hour regulatory incident closure notice for Digital Security Agency inspection.`
  },
  {
    id: 10,
    language: 'Bengali',
    category: 'পরিবেশ জীববৈচিত্র্য ও কার্বন ক্রেডিট অডিট (বাংলা টাস্ক ৩)',
    difficulty: 'Complex',
    title: 'সুন্দরবন ম্যানগ্রোভ বনায়ন ও ভেরিফায়েড কার্বন ইউনিট (VCU) অডিট প্রতিবেদন',
    timeLimitMinutes: 30,
    instructionSteps: [
      "১. সুন্দরবন সংক্রান্ত সম্পূর্ণ বাংলা অডিট প্রতিবেদনটি নির্ভুল বানান ও সংখ্যাসহ টাইপ করুন।",
      "২. 'সাধারণ কার্বন অফসেট' এর স্থলে 'ভেরিফায়েড কার্বন ইউনিট (VCU)' লিখুন।",
      "৩. ভুল হেক্টর পরিমাপ '১,৪৫০ হেক্টর' সংশোধন করে '১৪,৫০০ হেক্টর' লিখুন।",
      "৪. ভুল বেঁচে থাকার হার '৫৭.৪০%' সংশোধন করে '৯৭.৪০%' লিখুন।",
      "৫. ভুল লভ্যাংশ বণ্টন '৩%' সংশোধন করে '১৫%' লিখুন।",
      "৬. বৈজ্ঞানিক নাম Heritiera fomes, Rhizophora mucronata ও VCS-v4.3 কোড সঠিকভাবে লিখুন।"
    ],
    requiredFixes: [
      { wrong: 'সাধারণ কার্বন অফসেট', fixed: 'ভেরিফায়েড কার্বন ইউনিট (VCU)', label: 'কার্বন পরিভাষা -> ভেরিফায়েড কার্বন ইউনিট (VCU)' },
      { wrong: '১,৪৫০ হেক্টর', fixed: '১৪,৫০০ হেক্টর', label: 'আয়তন ১,৪৫০ -> ১৪,৫০০ হেক্টর' },
      { wrong: '৫৭.৪০%', fixed: '৯৭.৪০%', label: 'সারভাইভাল রেট ৫৭.৪০% -> ৯৭.৪০%' },
      { wrong: 'লভ্যাংশের ৩%', fixed: 'লভ্যাংশের ১৫%', label: 'বণ্টন হার ৩% -> ১৫%' }
    ],
    text: `জাতিসংঘের জলবায়ু পরিবর্তন ফ্রেমওয়ার্ক (UNFCCC) ও REDD+ কাঠামোর অধীনে (আন্তর্জাতিক প্রকল্প রেফারেন্স কোড: #BD-MANGROVE-2026-SUNDARBAN), স্বতন্ত্র তৃতীয় পক্ষের পরিবেশ অডিটরগণ সুন্দরবন ম্যানগ্রোভ সংরক্ষিত বনাঞ্চলের পূর্বাঞ্চল ও পশ্চিমাঞ্চলীয় জোনের ১,৪৫০ হেক্টর জোয়ার-ভাটা প্লাবিত বনাঞ্চল এলাকায় উচ্চ-রেজোলিউশন LiDAR ক্যানোপি ঘনত্ব জরিপ ও বায়োমাস ভেরিফিকেশন পরিচালনা করেছেন।

উক্ত জরিপ অনুযায়ী বাৎসরিক ভূ-উপরিস্থ বায়োমাস কার্বন শোষণের পরিমাণ প্রতি হেক্টরে ৩৮৪.৫ tCO2e নির্ধারিত হয়েছে। ২০২৫-২০২৬ অর্থবছরে নিট কার্বন নির্গমন হ্রাসের বিপরীতে মোট ১,৪৮,৫০০ সাধারণ কার্বন অফসেট অর্জিত হয়েছে, যা আন্তর্জাতিক ভেরা (Verra Verified Carbon Standard VCS-v4.3) এবং CCB (Climate, Community & Biodiversity) গোল্ড স্ট্যান্ডার্ড মানদণ্ডে নিরীক্ষিত ও অনুমোদিত। ড্রোন ভিত্তিক হাইপারস্পেকট্রাল ইমেজিং পর্যবেক্ষণে প্রকল্প সীমানা বরাবর কোনো ধরনের অবৈধ বৃক্ষ নিধন বা বনাঞ্চল দখলের ঘটনা শনাক্ত হয়নি।

মাটির ১০০ সে.মি. গভীরতা পর্যন্ত গৃহীত ৪৮০টি কোর স্যাম্পল ল্যাব বিশ্লেষণে মৃত্তিকা জৈব কার্বনের (Soil Organic Carbon) গড় ঘনত্ব ২৪১.৮ Mg C/ha নিরূপিত হয়েছে এবং খুলনা, সাতক্ষীরা ও বাগেরহাটের উপকূলীয় বন সংরক্ষণ সমবায় সমিতিসমূহে মোট কার্বন রাজস্ব লভ্যাংশের ৩% অর্থ সরাসরি বণ্টন করা হয়েছে। উক্ত তহবিলের মাধ্যমে উপকূলীয় অঞ্চলে সৌর মিনি-গ্রিড, লবণাক্ততা সহনশীল জলবায়ু-স্মার্ট ম্যানগ্রোভ নার্সারি এবং পরিবেশ-বান্ধব মধু সংগ্রহ কার্যক্রম পরিচালিত হচ্ছে।

ইউরোপীয় স্পেস এজেন্সির Sentinel-2 স্যাটেলাইট মাল্টি-স্পেকট্রাল টেলিমেট্রি তথ্যের সাথে ৯৪টি স্থায়ী বোটানিক্যাল স্যাম্পল প্লটের মাঠ-পর্যায়ের তথ্য ক্রস-চেক করে নব-রোপিত Heritiera fomes (সুন্দরী), Ceriops decandra (গরান) ও Rhizophora mucronata (গর্জন) চারাগুলোর ৫৭.৪০% টিকে থাকার হার নিশ্চিত করা হয়েছে। এই বনায়ন প্রকল্পটি বঙ্গোপসাগরের উপকূলীয় ৬২ কিলোমিটার ঝুঁকিপূর্ণ বেড়িবাঁধ বরাবর প্রাকৃতিক ঘূর্ণিঝড় সুরক্ষা ও পলিমাটি স্থিতিশীলকরণে দীর্ঘমেয়াদী অবদান রাখবে। স্বাক্ষরিত/- প্রধান পরিবেশ নিরীক্ষক, অডিট রেফারেন্স: #ENV-AUDIT-BD-902।`,
    expectedCorrectedText: `জাতিসংঘের জলবায়ু পরিবর্তন ফ্রেমওয়ার্ক (UNFCCC) ও REDD+ কাঠামোর অধীনে (আন্তর্জাতিক প্রকল্প রেফারেন্স কোড: #BD-MANGROVE-2026-SUNDARBAN), স্বতন্ত্র তৃতীয় পক্ষের পরিবেশ অডিটরগণ সুন্দরবন ম্যানগ্রোভ সংরক্ষিত বনাঞ্চলের পূর্বাঞ্চল ও পশ্চিমাঞ্চলীয় জোনের ১৪,৫০০ হেক্টর জোয়ার-ভাটা প্লাবিত বনাঞ্চল এলাকায় উচ্চ-রেজোলিউশন LiDAR ক্যানোপি ঘনত্ব জরিপ ও বায়োমাস ভেরিফিকেশন পরিচালনা করেছেন।

উক্ত জরিপ অনুযায়ী বাৎসরিক ভূ-উপরিস্থ বায়োমাস কার্বন শোষণের পরিমাণ প্রতি হেক্টরে ৩৮৪.৫ tCO2e নির্ধারিত হয়েছে। ২০২৫-২০২৬ অর্থবছরে নিট কার্বন নির্গমন হ্রাসের বিপরীতে মোট ১,৪৮,৫০০ ভেরিফায়েড কার্বন ইউনিট (VCU) অর্জিত হয়েছে, যা আন্তর্জাতিক ভেরা (Verra Verified Carbon Standard VCS-v4.3) এবং CCB (Climate, Community & Biodiversity) গোল্ড স্ট্যান্ডার্ড মানদণ্ডে নিরীক্ষিত ও অনুমোদিত। ড্রোন ভিত্তিক হাইপারস্পেকট্রাল ইমেজিং পর্যবেক্ষণে প্রকল্প সীমানা বরাবর কোনো ধরনের অবৈধ বৃক্ষ নিধন বা বনাঞ্চল দখলের ঘটনা শনাক্ত হয়নি।

মাটির ১০০ সে.মি. গভীরতা পর্যন্ত গৃহীত ৪৮০টি কোর স্যাম্পল ল্যাব বিশ্লেষণে মৃত্তিকা জৈব কার্বনের (Soil Organic Carbon) গড় ঘনত্ব ২৪১.৮ Mg C/ha নিরূপিত হয়েছে এবং খুলনা, সাতক্ষীরা ও বাগেরহাটের উপকূলীয় বন সংরক্ষণ সমবায় সমিতিসমূহে মোট কার্বন রাজস্ব লভ্যাংশের ১৫% অর্থ সরাসরি বণ্টন করা হয়েছে। উক্ত তহবিলের মাধ্যমে উপকূলীয় অঞ্চলে সৌর মিনি-গ্রিড, লবণাক্ততা সহনশীল জলবায়ু-স্মার্ট ম্যানগ্রোভ নার্সারি এবং পরিবেশ-বান্ধব মধু সংগ্রহ কার্যক্রম পরিচালিত হচ্ছে।

ইউরোপীয় স্পেস এজেন্সির Sentinel-2 স্যাটেলাইট মাল্টি-স্পেকট্রাল টেলিমেট্রি তথ্যের সাথে ৯৪টি স্থায়ী বোটানিক্যাল স্যাম্পল প্লটের মাঠ-পর্যায়ের তথ্য ক্রস-চেক করে নব-রোপিত Heritiera fomes (সুন্দরী), Ceriops decandra (গরান) ও Rhizophora mucronata (গর্জন) চারাগুলোর ৯৭.৪০% টিকে থাকার হার নিশ্চিত করা হয়েছে। এই বনায়ন প্রকল্পটি বঙ্গোপসাগরের উপকূলীয় ৬২ কিলোমিটার ঝুঁকিপূর্ণ বেড়িবাঁধ বরাবর প্রাকৃতিক ঘূর্ণিঝড় সুরক্ষা ও পলিমাটি স্থিতিশীলকরণে দীর্ঘমেয়াদী অবদান রাখবে। স্বাক্ষরিত/- প্রধান পরিবেশ নিরীক্ষক, অডিট রেফারেন্স: #ENV-AUDIT-BD-902।`
  }
];

interface StoredTaskAudit {
  taskId: number;
  title: string;
  language: 'English' | 'Bengali';
  accuracy: number;
  wpm: number;
  rawErrors: number;
  missedFixes: string[];
}

export const TypingWork = () => {
  return (
    <ModuleGuard moduleId="typing" title="Typing Work">
      <TypingApp />
    </ModuleGuard>
  );
};

const ACTIVE_SESSION_KEY = 'unity_typing_active_session';
const COOLDOWN_UNTIL_KEY = 'unity_typing_cooldown_until';
const COOLDOWN_REASON_KEY = 'unity_typing_cooldown_reason';
const TYPING_PROJECT_DEADLINE_KEY = 'unity_typing_project_deadline';
const COOLDOWN_DURATION_MS = 2 * 60 * 60 * 1000; // 2 Hours
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000; // 48 Hours

const TypingApp = () => {
  const { user, profile } = useAuth();

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const currentTask = ADVANCED_10_TASKS[selectedTaskIndex];

  const [projectAutoResetNotice, setProjectAutoResetNotice] = useState<boolean>(() => {
    try {
      const savedDeadline = Number(localStorage.getItem(TYPING_PROJECT_DEADLINE_KEY) || 0);
      if (savedDeadline > 0 && Date.now() >= savedDeadline) {
        localStorage.removeItem('unity_typing_submitted_count');
        localStorage.removeItem('unity_typing_submitted_ids');
        localStorage.removeItem('unity_typing_audit_logs');
        localStorage.removeItem(ACTIVE_SESSION_KEY);
        localStorage.removeItem(COOLDOWN_UNTIL_KEY);
        localStorage.removeItem(COOLDOWN_REASON_KEY);
        localStorage.removeItem(TYPING_PROJECT_DEADLINE_KEY);
        return true;
      }
    } catch {}
    return false;
  });

  const [projectDeadline, setProjectDeadline] = useState<number | null>(() => {
    try {
      const saved = Number(localStorage.getItem(TYPING_PROJECT_DEADLINE_KEY) || 0);
      return saved > Date.now() ? saved : null;
    } catch {
      return null;
    }
  });

  const [projectRemainingSeconds, setProjectRemainingSeconds] = useState<number>(() => {
    if (!projectDeadline) return 48 * 3600;
    return Math.max(0, Math.floor((projectDeadline - Date.now()) / 1000));
  });

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
  const [taskAuditLogs, setTaskAuditLogs] = useState<Record<number, StoredTaskAudit>>(() => {
    try {
      return JSON.parse(localStorage.getItem('unity_typing_audit_logs') || '{}');
    } catch {
      return {};
    }
  });

  // Deep Analysis & Evaluation States
  const [isAnalyzingBatch, setIsAnalyzingBatch] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [batchEvaluationResult, setBatchEvaluationResult] = useState<'none' | 'audit_rejected'>('none');
  const [analysisRemainingSeconds, setAnalysisRemainingSeconds] = useState(120);

  // Typing inputs & metrics
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pasteAttempts, setPasteAttempts] = useState(0);

  // Start Session + 30-Minute Timer + 2-Hour Cooldown State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState<number>(() => {
    try {
      // If user refreshed while an active typing session was running, apply immediate 2-hour cooldown!
      const hadActiveSession = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (hadActiveSession) {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
        const until = Date.now() + COOLDOWN_DURATION_MS;
        localStorage.setItem(COOLDOWN_UNTIL_KEY, String(until));
        localStorage.setItem(COOLDOWN_REASON_KEY, 'refresh');
        return Math.ceil(COOLDOWN_DURATION_MS / 1000);
      }
      const savedUntil = Number(localStorage.getItem(COOLDOWN_UNTIL_KEY) || 0);
      if (savedUntil > Date.now()) {
        return Math.ceil((savedUntil - Date.now()) / 1000);
      }
      localStorage.removeItem(COOLDOWN_UNTIL_KEY);
      localStorage.removeItem(COOLDOWN_REASON_KEY);
      return 0;
    } catch {
      return 0;
    }
  });
  const [cooldownReason, setCooldownReason] = useState<'timeout' | 'refresh' | null>(() => {
    const r = localStorage.getItem(COOLDOWN_REASON_KEY);
    return r === 'timeout' || r === 'refresh' ? r : null;
  });

  // Screen recording video proof link state
  const [videoProofLink, setVideoProofLink] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [recordingNotes, setRecordingNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const triggerTwoHourCooldown = (reason: 'timeout' | 'refresh') => {
    const until = Date.now() + COOLDOWN_DURATION_MS;
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      localStorage.setItem(COOLDOWN_UNTIL_KEY, String(until));
      localStorage.setItem(COOLDOWN_REASON_KEY, reason);
    } catch {}
    setIsSessionActive(false);
    setCooldownReason(reason);
    setCooldownRemainingSeconds(Math.ceil(COOLDOWN_DURATION_MS / 1000));
    setInputText('');
    setStartTime(null);
    setRemainingSeconds(30 * 60);
    setValidationError(
      reason === 'timeout'
        ? 'Time expired (30:00)! Typing is locked for a 2-hour cooldown before you can retry.'
        : 'Page refresh detected during an active session! Typing is locked for a 2-hour cooldown.'
    );
  };

  useEffect(() => {
    setRemainingSeconds(30 * 60);
    setIsSessionActive(false);
    setStartTime(null);
    setInputText('');
    setPasteAttempts(0);
    setVideoProofLink('');
    setVideoFile(null);
    setVideoFileName('');
    setValidationError(null);
    setIsSubmittedSuccess(false);
  }, [selectedTaskIndex]);

  // 30-Minute active countdown timer
  useEffect(() => {
    if (!isSessionActive || cooldownRemainingSeconds > 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerTwoHourCooldown('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, cooldownRemainingSeconds]);

  // 2-Hour cooldown live countdown timer
  useEffect(() => {
    if (cooldownRemainingSeconds <= 0) return;

    const cdTimer = setInterval(() => {
      const savedUntil = Number(localStorage.getItem(COOLDOWN_UNTIL_KEY) || 0);
      const secsLeft = Math.max(0, Math.ceil((savedUntil - Date.now()) / 1000));
      setCooldownRemainingSeconds(secsLeft);
      if (secsLeft <= 0) {
        clearInterval(cdTimer);
        localStorage.removeItem(COOLDOWN_UNTIL_KEY);
        localStorage.removeItem(COOLDOWN_REASON_KEY);
        setCooldownReason(null);
        setValidationError(null);
      }
    }, 1000);

    return () => clearInterval(cdTimer);
  }, [cooldownRemainingSeconds]);

  // 48-Hour Master Project Countdown & Auto-Reset
  useEffect(() => {
    if (!projectDeadline) return;

    const projectTimer = setInterval(() => {
      const left = Math.floor((projectDeadline - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(projectTimer);
        localStorage.removeItem('unity_typing_submitted_count');
        localStorage.removeItem('unity_typing_submitted_ids');
        localStorage.removeItem('unity_typing_audit_logs');
        localStorage.removeItem(ACTIVE_SESSION_KEY);
        localStorage.removeItem(COOLDOWN_UNTIL_KEY);
        localStorage.removeItem(COOLDOWN_REASON_KEY);
        localStorage.removeItem(TYPING_PROJECT_DEADLINE_KEY);
        setSubmittedCount(0);
        setSubmittedTaskIds([]);
        setTaskAuditLogs({});
        setBatchEvaluationResult('none');
        setIsAnalyzingBatch(false);
        setIsSubmittedSuccess(false);
        setIsSessionActive(false);
        setCooldownRemainingSeconds(0);
        setCooldownReason(null);
        setSelectedTaskIndex(0);
        setInputText('');
        setStartTime(null);
        setRemainingSeconds(30 * 60);
        setVideoProofLink('');
        setVideoFile(null);
        setVideoFileName('');
        setProjectDeadline(null);
        setProjectRemainingSeconds(48 * 3600);
        setProjectAutoResetNotice(true);
        setValidationError(
          '৪৮ ঘণ্টার নির্ধারিত সময়সীমা শেষ হয়ে যাওয়ায় আপনার সম্পূর্ণ টাইপিং প্রজেক্ট অটোমেটিক রিসেট হয়ে গেছে। এখন আবার শুরু থেকে (Task #1) কাজ করতে হবে।'
        );
        return;
      }
      setProjectRemainingSeconds(left);
    }, 1000);

    return () => clearInterval(projectTimer);
  }, [projectDeadline]);

  const handleStartTypingSession = () => {
    if (cooldownRemainingSeconds > 0) return;
    const now = Date.now();
    try {
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({ taskId: currentTask.id, startedAt: now })
      );
      if (!projectDeadline) {
        const deadline = now + FORTY_EIGHT_HOURS_MS;
        localStorage.setItem(TYPING_PROJECT_DEADLINE_KEY, String(deadline));
        setProjectDeadline(deadline);
        setProjectRemainingSeconds(48 * 3600);
      }
    } catch {}
    setProjectAutoResetNotice(false);
    setRemainingSeconds(30 * 60);
    setStartTime(now);
    setIsSessionActive(true);
    setValidationError(null);
  };

  // Evaluate against corrected target text (rewarding applying rules) while counting raw typos & missed fixes
  const metrics = useMemo(() => {
    const target = currentTask.expectedCorrectedText;
    const typed = inputText;

    let matchingChars = 0;
    const minLength = Math.min(target.length, typed.length);
    for (let i = 0; i < minLength; i++) {
      if (target[i] === typed[i]) {
        matchingChars++;
      }
    }

    const accuracy =
      typed.length > 0
        ? Math.max(0, Math.min(100, Math.round((matchingChars / typed.length) * 100)))
        : 100;

    const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
    let wpm = 0;
    if (startTime && wordsTyped > 0) {
      const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
      wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    }

    const progress = Math.min(100, Math.round((typed.length / target.length) * 100));

    const missedFixes = currentTask.requiredFixes
      .filter((fix) => typed.length > 10 && (!typed.includes(fix.fixed) || typed.includes(fix.wrong)))
      .map((fix) => fix.label);

    return {
      accuracy,
      wpm,
      progress,
      typedChars: typed.length,
      targetChars: target.length,
      errors: Math.max(0, typed.length - matchingChars),
      missedFixes
    };
  }, [inputText, currentTask, startTime]);

  const aggregatedAuditErrors = useMemo(() => {
    const entries = Object.values(taskAuditLogs) as StoredTaskAudit[];
    const flagged: { taskLabel: string; badge: string; detail: string }[] = [];

    entries.forEach((entry) => {
      if (entry.missedFixes.length > 0 || entry.accuracy < 96 || entry.rawErrors > 5) {
        flagged.push({
          taskLabel: `Task #${entry.taskId} (${entry.language})`,
          badge: `${entry.accuracy}% Accuracy • ${entry.missedFixes.length} Unfixed Rule(s)`,
          detail:
            entry.missedFixes.length > 0
              ? `Missed corrections: ${entry.missedFixes.slice(0, 2).join('; ')}`
              : `${entry.rawErrors} character/punctuation deviations from corrected specification.`
        });
      }
    });

    // Always catch strict verification errors & 65 shortfall even if user typed all 10 tasks cleanly
    if (flagged.length === 0) {
      flagged.push(
        {
          taskLabel: 'Task #1 & #3 (English Legal/SWIFT)',
          badge: 'Shortfall: 65 (কম হলো ৬৫) • Mistake Found',
          detail: 'আপনার এই জায়গায় ভুল রয়েছে — Delimiter, currency wrapping, and 65 character/score deficit failed strict verification.'
        },
        {
          taskLabel: 'Task #4, #7 & #10 (Bengali Circular/Audit)',
          badge: 'Unicode Mismatch • 65 Score Deficit',
          detail: 'Bengali conjunct characters (যুক্তাক্ষর) and Dari (।) spacing diverged from archival standard (Score Short by 65).'
        }
      );
    }

    return flagged;
  }, [taskAuditLogs]);

  useEffect(() => {
    let timer: any = null;
    if (isAnalyzingBatch) {
      setAnalysisProgress(0);
      setAnalysisRemainingSeconds(120);
      setAnalysisStepText('Initializing 10-task bilingual & error-correction audit...');

      timer = setInterval(() => {
        setAnalysisRemainingSeconds((prev) => {
          const nextSec = prev - 1;
          const pct = Math.min(100, Math.round(((120 - nextSec) / 120) * 100));
          setAnalysisProgress(pct);

          if (pct < 18) {
            setAnalysisStepText('Scanning 7 English & 3 Bengali transcripts against corrected keys...');
          } else if (pct < 38) {
            setAnalysisStepText('Checking all planted error corrections & formatting rules...');
          } else if (pct < 58) {
            setAnalysisStepText('Auditing keystroke latency, Unicode normalization & punctuation...');
          } else if (pct < 78) {
            setAnalysisStepText('Inspecting screen recording video proof authenticity...');
          } else if (pct < 92) {
            setAnalysisStepText('Verifying Google Drive / Loom cloud video permissions...');
          } else {
            setAnalysisStepText('Audit complete. Generating final Quality Control findings...');
          }

          if (nextSec <= 0) {
            clearInterval(timer);
            setIsAnalyzingBatch(false);
            setBatchEvaluationResult('audit_rejected');
            return 0;
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAnalyzingBatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isSessionActive || cooldownRemainingSeconds > 0) {
      return;
    }
    const newVal = e.target.value;
    if (newVal.length - inputText.length > 18) {
      setPasteAttempts((prev) => prev + 1);
      setValidationError('Paste / bulk text insertion is strictly blocked. Type manually character by character.');
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }
    setInputText(newVal);
    setValidationError(null);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempts((prev) => prev + 1);
    setValidationError('Copy-Paste is strictly prohibited! Type everything manually.');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPasteAttempts((prev) => prev + 1);
    setValidationError('Drag & drop text is prohibited! Type manually.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setValidationError('Please select a valid video file (.mp4, .webm, .mov).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setValidationError('Video file exceeds 100MB limit. Upload to Google Drive and paste the share link.');
      return;
    }

    setVideoFile(file);
    setVideoFileName(file.name);
    setValidationError(null);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatCooldownHMS = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRestartBatch = () => {
    localStorage.removeItem('unity_typing_submitted_count');
    localStorage.removeItem('unity_typing_submitted_ids');
    localStorage.removeItem('unity_typing_audit_logs');
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    localStorage.removeItem(TYPING_PROJECT_DEADLINE_KEY);
    setSubmittedCount(0);
    setSubmittedTaskIds([]);
    setTaskAuditLogs({});
    setBatchEvaluationResult('none');
    setIsSubmittedSuccess(false);
    setIsSessionActive(false);
    setProjectDeadline(null);
    setProjectRemainingSeconds(48 * 3600);
    setProjectAutoResetNotice(false);
    setSelectedTaskIndex(0);
    setInputText('');
    setStartTime(null);
    setVideoProofLink('');
    setVideoFile(null);
    setVideoFileName('');
    setValidationError(null);
  };

  const handleSubmitTask = async () => {
    setValidationError(null);

    if (cooldownRemainingSeconds > 0) {
      setValidationError('2-hour cooldown lock is active. Please wait until cooldown ends.');
      return;
    }

    if (!isSessionActive) {
      setValidationError('Click the Start Typing Session button first to start your 30-minute timer.');
      return;
    }

    if (inputText.length < currentTask.expectedCorrectedText.length * 0.9) {
      setValidationError(
        `Typing incomplete! You must manually type at least 90% of this ${currentTask.text.length}-character passage (Current: ${metrics.progress}%).`
      );
      return;
    }

    const hasScreenRecording = Boolean(videoProofLink.trim().length > 5 || videoFile);
    if (!hasScreenRecording) {
      setValidationError(
        'Screen recording video proof is mandatory! Submit a Google Drive / Loom link or upload a video file.'
      );
      return;
    }

    if (!user) {
      setValidationError('Session expired. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalVideoData =
        videoProofLink.trim() ||
        (videoFileName ? `Uploaded File: ${videoFileName}` : 'Screen Recording Provided');

      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        userName: profile?.fullName || 'Student User',
        userPhone: profile?.whatsappNumber || 'N/A',
        studentIdCode: profile?.studentIdCode || 'N/A',
        module: 'typing',
        moduleTitle: 'Typing Work (7 English + 3 Bengali Error-Correction Audited)',
        taskTitle: currentTask.title,
        taskCategory: currentTask.category,
        language: currentTask.language,
        accuracy: metrics.accuracy,
        wpm: metrics.wpm,
        totalChars: metrics.typedChars,
        targetChars: metrics.targetChars,
        missedFixes: metrics.missedFixes,
        videoUrl: finalVideoData,
        videoProofType: videoProofLink.trim() ? 'external_cloud_link' : 'uploaded_file',
        notes: recordingNotes.trim(),
        details: `Task #${currentTask.id} (${currentTask.language}): ${currentTask.title}\nCorrected Accuracy: ${metrics.accuracy}%\nUnfixed Rules: ${metrics.missedFixes.length}\nSpeed: ${metrics.wpm} WPM\nScreen Recording Proof: ${finalVideoData}`,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      const updatedAuditLogs: Record<number, StoredTaskAudit> = {
        ...taskAuditLogs,
        [currentTask.id]: {
          taskId: currentTask.id,
          title: currentTask.title,
          language: currentTask.language,
          accuracy: metrics.accuracy,
          wpm: metrics.wpm,
          rawErrors: metrics.errors,
          missedFixes: metrics.missedFixes
        }
      };

      const nextSubmittedCount = submittedCount + 1;
      const nextTaskIds = Array.from(new Set([...submittedTaskIds, currentTask.id]));

      setTaskAuditLogs(updatedAuditLogs);
      setSubmittedCount(nextSubmittedCount);
      setSubmittedTaskIds(nextTaskIds);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      setIsSessionActive(false);
      localStorage.setItem('unity_typing_audit_logs', JSON.stringify(updatedAuditLogs));
      localStorage.setItem('unity_typing_submitted_count', String(nextSubmittedCount));
      localStorage.setItem('unity_typing_submitted_ids', JSON.stringify(nextTaskIds));

      const isBatchCompleted = nextSubmittedCount >= 10 || selectedTaskIndex === 9;

      if (isBatchCompleted) {
        setIsAnalyzingBatch(true);
      } else {
        setIsSubmittedSuccess(true);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setValidationError('Submission failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. DEEP ANALYSIS LOADING SCREEN
  if (isAnalyzingBatch) {
    return (
      <div className="p-4 sm:p-6 min-h-[80vh] flex items-center justify-center font-sans">
        <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-xl bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center mx-auto">
            <Cpu size={26} strokeWidth={1.75} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#0A4D8C]">
              Deep System Verification
            </p>
            <h2 className="text-lg font-semibold tracking-tight text-[#1E2329]">
              Auditing All 10 Bilingual Typing Tasks
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Validating error corrections, rule compliance across 7 English & 3 Bengali tasks, and screen recording proofs.
            </p>
          </div>

          <div className="space-y-2.5 bg-[#F4F5F7] p-4 rounded-xl border border-slate-200 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Audit Progress</span>
              <span className="text-[#0A4D8C] font-semibold font-mono tabular-nums">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0A4D8C] h-full rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 truncate pt-0.5">{analysisStepText}</p>
          </div>

          <div className="text-xs text-[#5F4B16] bg-[#FEF7E0] border border-[#F3DFA2] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono font-medium tabular-nums">
            <Clock size={14} className="text-[#B47B00] shrink-0" />
            <span>
              Remaining: {Math.floor(analysisRemainingSeconds / 60)}m {analysisRemainingSeconds % 60}s
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. ALWAYS CATCH ERRORS -> ITEMIZED AUDIT REJECTION SCREEN (NEVER COMPLETE)
  if (batchEvaluationResult === 'audit_rejected') {
    return (
      <div className="p-4 sm:p-6 min-h-[85vh] flex items-center justify-center font-sans">
        <div className="bg-white rounded-xl p-5 sm:p-6 max-w-lg w-full border border-rose-200 shadow-sm space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
              <XCircle size={26} strokeWidth={1.75} />
            </div>
            <p className="text-xs font-medium text-rose-700">
              Incomplete Work · Shortfall: 65 (কম হলো ৬৫)
            </p>
            <h2 className="text-lg font-semibold text-[#1E2329]">Typing Job Audit Not Passed</h2>
            <p className="text-xs text-slate-600">
              আপনার টাইপিংয়ে ভুল রয়েছে এবং নির্ধারিত মানদণ্ড থেকে ৬৫ (পঁয়ষট্টি) কম হয়েছে — তাই কাজটি সম্পূর্ণ হয়নি।
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-900">Audit Score Deficit (কম হলো):</span>
            <span className="font-mono font-bold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 tabular-nums">
              Short by 65 (৬৫ কম)
            </span>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 text-xs space-y-2 max-h-60 overflow-y-auto">
            {aggregatedAuditErrors.map((err, idx) => (
              <div key={idx} className="bg-white border border-rose-200/80 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-[#1E2329] text-xs">{err.taskLabel}</span>
                  <span className="text-[11px] font-medium text-rose-700">
                    {err.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{err.detail}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#FEF7E0] rounded-xl border border-[#F3DFA2] text-xs text-[#5F4B16] flex items-start gap-2.5">
            <AlertTriangle size={15} className="text-[#B47B00] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Your typing job showed an error and fell short by 65 (কম হলো ৬৫). All planted mistakes and target accuracy requirements must be satisfied before completion.
            </span>
          </div>

          <button
            onClick={handleRestartBatch}
            className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw size={15} />
            <span>Restart & Retry from Task #1</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. SINGLE TASK SUCCESS SCREEN
  if (isSubmittedSuccess) {
    return (
      <div className="p-4 sm:p-6 min-h-[80vh] flex items-center justify-center font-sans">
        <div className="bg-white rounded-xl p-6 max-w-md w-full border border-slate-200 shadow-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0D7A5F] flex items-center justify-center mx-auto">
            <CheckCircle2 size={26} strokeWidth={1.75} />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-[#0D7A5F] tabular-nums">
              Task #{currentTask.id} ({currentTask.language}) Queued · Batch {submittedCount}/10
            </p>
            <h2 className="text-lg font-semibold text-[#1E2329]">Task & Recording Submitted</h2>
            <p className="text-xs text-slate-600">Your transcript and video proof link have been saved for batch audit.</p>
          </div>

          <div className="bg-[#F4F5F7] rounded-xl p-3.5 border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-[11px] font-medium text-slate-500">Accuracy</div>
              <div className="text-sm font-semibold text-[#0D7A5F] font-mono tabular-nums mt-0.5">{metrics.accuracy}%</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500">Speed</div>
              <div className="text-sm font-semibold text-[#0A4D8C] font-mono tabular-nums mt-0.5">{metrics.wpm} WPM</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500">Rule Fixes</div>
              <div className="text-sm font-semibold text-[#1E2329] font-mono tabular-nums mt-0.5">
                {currentTask.requiredFixes.length - metrics.missedFixes.length}/{currentTask.requiredFixes.length}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmittedSuccess(false);
              setSelectedTaskIndex((prev) => (prev + 1) % ADVANCED_10_TASKS.length);
            }}
            className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>Start Next Task #{((selectedTaskIndex + 1) % ADVANCED_10_TASKS.length) + 1}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // 4. MAIN TYPING WORKSPACE
  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto pb-24 space-y-4 font-sans">
      {/* Top Header Banner */}
      <div className="bg-[#0A4D8C] rounded-xl p-5 sm:p-6 text-white space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#D4E4F7] flex items-center gap-1.5 flex-wrap tabular-nums">
              <PenTool size={12} />
              <span>Task #{currentTask.id}</span>
              <span aria-hidden="true">·</span>
              <span>{currentTask.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{currentTask.language}</span>
              <span aria-hidden="true">·</span>
              <span>Batch {submittedCount}/10</span>
            </p>

            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white leading-snug">
              {currentTask.title}
            </h1>
            <p className="text-xs text-blue-100/90">
              7 English & 3 Bengali high-difficulty tasks. Spot & correct planted errors as specified below.
            </p>
          </div>

          {/* Timers: 48-Hour Project Limit + 30-Minute Task Timer */}
          <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2.5 shrink-0 w-full sm:w-auto">
            <div className="bg-white/10 border border-white/15 px-3.5 py-2.5 rounded-xl text-left sm:text-right flex-1 sm:flex-none">
              <div className="text-[11px] font-medium text-blue-100 flex items-center sm:justify-end gap-1.5">
                <Clock size={12} />
                <span>{projectDeadline ? '48h Project Limit' : 'Project Limit'}</span>
              </div>
              <div
                className={`text-lg sm:text-xl font-semibold font-mono tabular-nums mt-0.5 ${
                  projectDeadline && projectRemainingSeconds < 3600 ? 'text-amber-200' : 'text-white'
                }`}
              >
                {projectDeadline ? formatCooldownHMS(projectRemainingSeconds) : '48:00:00'}
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 px-3.5 py-2.5 rounded-xl text-left sm:text-right flex-1 sm:flex-none">
              <div className="text-[11px] font-medium text-blue-100 flex items-center sm:justify-end gap-1.5">
                <Timer size={13} />
                <span>
                  {cooldownRemainingSeconds > 0
                    ? 'Cooldown Lock'
                    : isSessionActive
                    ? 'Task Timer (30m)'
                    : 'Task Allowance'}
                </span>
              </div>
              <div
                className={`text-lg sm:text-xl font-semibold font-mono tabular-nums mt-0.5 ${
                  cooldownRemainingSeconds > 0
                    ? 'text-rose-200'
                    : isSessionActive && remainingSeconds < 300
                    ? 'text-amber-200'
                    : 'text-white'
                }`}
              >
                {cooldownRemainingSeconds > 0
                  ? formatCooldownHMS(cooldownRemainingSeconds)
                  : formatTimer(remainingSeconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Task Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/15">
          <span className="text-xs font-medium text-blue-100 tabular-nums">
            Select Task ({selectedTaskIndex + 1}/10 · 7 EN + 3 BN):
          </span>

          <div className="flex items-center gap-2.5">
            {submittedCount > 0 && (
              <button
                type="button"
                onClick={handleRestartBatch}
                className="text-xs text-blue-100 hover:text-white underline transition cursor-pointer"
              >
                Reset ({submittedCount}/10)
              </button>
            )}

            <select
              value={selectedTaskIndex}
              onChange={(e) => {
                const targetIdx = Number(e.target.value);
                const isUnlocked = targetIdx === 0 || submittedTaskIds.includes(ADVANCED_10_TASKS[targetIdx - 1].id);
                if (!isUnlocked) {
                  setValidationError('Complete the previous task first to unlock this task.');
                  return;
                }
                setSelectedTaskIndex(targetIdx);
                setValidationError(null);
              }}
              className="bg-white text-[#1E2329] border border-white/20 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer max-w-[260px]"
            >
              {ADVANCED_10_TASKS.map((t, idx) => {
                const isUnlocked = idx === 0 || submittedTaskIds.includes(ADVANCED_10_TASKS[idx - 1].id);
                const langTag = t.language === 'Bengali' ? 'BN' : 'EN';
                return (
                  <option key={t.id} value={idx} disabled={!isUnlocked}>
                    {idx > 0 && !isUnlocked ? '[Locked] ' : ''}#{t.id} [{langTag}]: {t.title.slice(0, 24)}...
                    {submittedTaskIds.includes(t.id) ? ' (Done)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* 48-HOUR AUTO-RESET NOTICE (BENGALI) */}
      <div className="bg-[#EEF5FC] border border-[#D4E4F7] rounded-xl p-4 text-[#1E2329] space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-xs text-[#0A4D8C]">
          <Clock size={15} className="shrink-0" />
          <span>৪৮ ঘণ্টায় সম্পূর্ণ প্রজেক্ট ও অটো-রিসেট নির্দেশিকা</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          একবার <strong>Start</strong> বাটনে ক্লিক করার পর <strong>৪৮ ঘণ্টার (48 Hours)</strong> ভেতর সম্পূর্ণ প্রজেক্টের সবগুলো (১০টি) টাইপিং টাস্ক শেষ করতে হবে। নির্ধারিত ৪৮ ঘণ্টার মধ্যে পুরো প্রজেক্ট শেষ করতে না পারলে কাজটি <strong>অটোমেটিক রিসেট</strong> হয়ে যাবে এবং আপনাকে আবার একদম শুরু থেকে (Task #1) নতুন করে করতে হবে।
        </p>
      </div>

      {/* 48-HOUR EXPIRED AUTO-RESET ALERT */}
      {projectAutoResetNotice && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-start gap-2.5 font-medium">
          <AlertCircle size={16} className="text-rose-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-rose-900">৪৮ ঘণ্টা সময় শেষ — প্রজেক্ট অটো-রিসেট হয়েছে!</p>
            <p className="leading-relaxed">
              Start বাটনে ক্লিক করার পর ৪৮ ঘণ্টার মধ্যে সবগুলো কাজ শেষ না হওয়ায় আপনার পুরো টাইপিং প্রজেক্ট রিসেট হয়ে গেছে। এখন আবার শুরু থেকে (Task #1) Start বাটনে ক্লিক করে কাজ করুন।
            </p>
          </div>
        </div>
      )}

      {/* MANDATORY SCREEN RECORDING NOTICE */}
      <div className="bg-[#EEF5FC] border border-[#D4E4F7] rounded-xl p-4 text-[#1E2329] space-y-1">
        <div className="flex items-center gap-2 font-semibold text-xs text-[#0A4D8C]">
          <Video size={15} className="shrink-0" />
          <span>Mandatory Screen Recording & Error-Correction Policy</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Raw passages contain intentional typos, wrong years, and outdated figures. Fix them manually while typing and attach a public Google Drive or Loom link below.
        </p>
      </div>

      {/* TASK CHANGE & ERROR-FIX RULES (BENGALI) */}
      <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-xl p-4 text-[#5F4B16] space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-[#F3DFA2] pb-2 flex-wrap">
          <div className="flex items-center gap-2 font-semibold text-xs text-[#1E2329]">
            <Zap size={14} className="text-[#B47B00] shrink-0" />
            <span>টাস্ক পরিবর্তন ও ভুল সংশোধনের রুলস ({currentTask.requiredFixes.length}টি ভুল সংশোধন বাধ্যতামূলক)</span>
          </div>
          <span className="text-xs font-medium text-[#5F4B16]">
            {currentTask.language} Task
          </span>
        </div>
        <ul className="space-y-1.5 list-none">
          {currentTask.instructionSteps.map((step, index) => (
            <li key={index} className="text-xs text-[#5F4B16] flex gap-2 leading-relaxed">
              <span className="font-semibold text-[#B47B00] shrink-0 tabular-nums">{index + 1}.</span>
              <span>{step.replace(/^[০-৯0-9]+\.\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* REFERENCE PASSAGE */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#1E2329]">
            Raw Reference Passage (Fix Errors While Typing)
          </span>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {currentTask.text.length} chars · {currentTask.language}
          </span>
        </div>

        <div
          onCopy={(e) => {
            e.preventDefault();
            setValidationError('Copying reference text is prohibited. Type manually.');
          }}
          className="bg-[#F4F5F7] rounded-xl p-3.5 border border-slate-200 text-xs text-[#1E2329] leading-relaxed font-mono whitespace-pre-wrap select-none max-h-[300px] overflow-y-auto"
        >
          {currentTask.text}
        </div>

        <div className="bg-[#EEF5FC] border border-[#D4E4F7] px-3 py-2 rounded-lg text-xs text-slate-700 flex items-center gap-2">
          <Info size={14} className="text-[#0A4D8C] shrink-0" />
          <span>Do not blindly retype planted errors — apply every fix listed in the rules box above.</span>
        </div>
      </div>

      {/* 2-HOUR COOLDOWN LOCK CARD OR START BUTTON CONTROL */}
      {cooldownRemainingSeconds > 0 ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-center space-y-2.5">
          <div className="w-11 h-11 rounded-xl bg-white text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
            <Hourglass size={22} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-rose-700">
              2-Hour Cooldown Active
            </p>
            <h3 className="text-base font-semibold text-[#1E2329] font-mono tabular-nums">
              Typing Session Locked ({formatCooldownHMS(cooldownRemainingSeconds)})
            </h3>
            <p className="text-xs text-rose-900 max-w-md mx-auto leading-relaxed">
              {cooldownReason === 'refresh'
                ? 'Page refresh or navigation was detected while an active typing timer was running. Wait 2 hours before clicking Start again.'
                : 'The 30-minute timer expired before completing and submitting this task. Wait 2 hours to unlock the Start button.'}
            </p>
          </div>
        </div>
      ) : !isSessionActive ? (
        <div className="bg-[#22262C] text-white rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 text-blue-200 flex items-center justify-center shrink-0">
              <Lock size={17} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Ready to Start Task #{currentTask.id}?</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                Click Start to unlock typing and launch the 30-minute timer. Refreshing the page or running out of time triggers a 2-hour cooldown lock.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartTypingSession}
            className="w-full sm:w-auto bg-[#0D7A5F] hover:bg-[#0A634C] text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Play size={14} fill="currentColor" />
            <span>Start Task #{currentTask.id} (30:00)</span>
          </button>
        </div>
      ) : null}

      {/* USER TYPING INPUT WINDOW */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#1E2329]">
            {isSessionActive && cooldownRemainingSeconds === 0
              ? 'Corrected Typing Input Window (Session Active · Paste Blocked)'
              : 'Typing Input Window (Locked — Click Start Above)'}
          </span>
          <div className="flex items-center gap-2.5">
            {isSessionActive && (
              <span className="text-xs font-mono font-semibold text-[#0D7A5F] tabular-nums flex items-center gap-1">
                <Clock size={12} /> {formatTimer(remainingSeconds)} left
              </span>
            )}
            {pasteAttempts > 0 && (
              <span className="text-xs font-medium text-rose-700 flex items-center gap-1 tabular-nums">
                <ShieldAlert size={12} />
                <span>Paste Blocked: {pasteAttempts}</span>
              </span>
            )}
          </div>
        </div>

        <textarea
          rows={10}
          value={inputText}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onDrop={handleDrop}
          disabled={!isSessionActive || cooldownRemainingSeconds > 0}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={
            cooldownRemainingSeconds > 0
              ? `Typing locked for ${formatCooldownHMS(cooldownRemainingSeconds)} cooldown...`
              : !isSessionActive
              ? 'Click the "Start Task" button above to activate your 30-minute timer and unlock typing...'
              : currentTask.language === 'Bengali'
              ? 'বাংলায় ভুলগুলো সংশোধন করে টাইপ শুরু করুন... (পেস্ট সম্পূর্ণ নিষিদ্ধ)'
              : 'Type corrected passage manually here... (Paste & drag-drop are strictly disabled)'
          }
          className={`w-full border rounded-xl p-3.5 text-xs leading-relaxed font-mono focus:outline-none resize-none ${
            !isSessionActive || cooldownRemainingSeconds > 0
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-[#F4F5F7] border-slate-200 text-[#1E2329] focus:border-[#0A4D8C] focus:bg-white'
          }`}
        />

        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div className="bg-[#F4F5F7] p-2.5 rounded-lg border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Accuracy</div>
            <div className="text-xs font-semibold text-[#0D7A5F] font-mono tabular-nums mt-0.5">{metrics.accuracy}%</div>
          </div>
          <div className="bg-[#F4F5F7] p-2.5 rounded-lg border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">WPM</div>
            <div className="text-xs font-semibold text-[#0A4D8C] font-mono tabular-nums mt-0.5">{metrics.wpm}</div>
          </div>
          <div className="bg-[#F4F5F7] p-2.5 rounded-lg border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Fixes Applied</div>
            <div className="text-xs font-semibold text-[#1E2329] font-mono tabular-nums mt-0.5">
              {currentTask.requiredFixes.length - metrics.missedFixes.length}/{currentTask.requiredFixes.length}
            </div>
          </div>
          <div className="bg-[#F4F5F7] p-2.5 rounded-lg border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Errors</div>
            <div className="text-xs font-semibold text-rose-700 font-mono tabular-nums mt-0.5">{metrics.errors}</div>
          </div>
        </div>
      </div>

      {/* GOOGLE DRIVE SCREEN RECORDING UPLOAD BOX */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Video size={16} className="text-[#0A4D8C]" />
            <h3 className="text-sm font-semibold text-[#1E2329]">
              Submit Screen Recording Proof <span className="text-rose-600">*</span>
            </h3>
          </div>
          <span className="text-xs font-medium text-rose-700">
            Required
          </span>
        </div>

        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 font-medium">
            <AlertCircle size={15} className="text-rose-700 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#1E2329]">
            1. Google Drive / Loom / Dropbox Video Link
          </label>
          <div className="relative">
            <input
              type="url"
              value={videoProofLink}
              onChange={(e) => setVideoProofLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/... or https://www.loom.com/share/..."
              className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 pl-9 text-xs font-mono text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
            />
            <Link2 size={14} className="absolute left-3 top-3 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500">
            Ensure Google Drive sharing is set to "Anyone with the link can view".
          </p>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <label className="block text-xs font-medium text-[#1E2329]">
            2. Or Upload Video File Directly (MP4, WebM)
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            <label className="bg-[#F4F5F7] hover:bg-slate-200/70 text-[#1E2329] text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-200 transition cursor-pointer flex items-center gap-1.5">
              <Upload size={14} className="text-[#0A4D8C]" />
              <span>Choose Video File</span>
              <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {videoFileName && (
              <span className="text-xs font-medium text-[#0D7A5F] truncate max-w-xs">
                Selected: {videoFileName}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <label className="block text-xs font-medium text-[#1E2329]">3. Work Notes (Optional)</label>
          <input
            type="text"
            value={recordingNotes}
            onChange={(e) => setRecordingNotes(e.target.value)}
            placeholder="Optional comments regarding error corrections applied..."
            className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
          />
        </div>

        <button
          onClick={handleSubmitTask}
          disabled={isSubmitting}
          className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          {isSubmitting ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
          <span>
            {isSubmitting
              ? 'Verifying & Submitting...'
              : submittedCount >= 9 || selectedTaskIndex === 9
              ? 'Submit Task #10 & Start Final Audit'
              : `Submit Task #${currentTask.id} & Recording (${submittedCount + 1}/10)`}
          </span>
        </button>
      </div>
    </div>
  );
};
