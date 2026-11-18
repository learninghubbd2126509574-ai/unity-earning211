import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Star,
  Users,
  Award,
  Clock,
  Mail,
  ShieldAlert,
  FileCheck,
  Building,
  UserCheck,
  Search,
  X
} from 'lucide-react';

type MentorCategory =
  | 'all'
  | 'cpa_marketing'
  | 'digital_marketing'
  | 'data_entry'
  | 'form_fillup'
  | 'typing'
  | 'affiliate'
  | 'moderation'
  | 'support';

type MentorBadgeTone = 'blue' | 'white' | 'yellow' | 'black' | 'teal' | 'indigo';

interface Mentor {
  id: string;
  name: string;
  role: string;
  category: Exclude<MentorCategory, 'all'>;
  specialtyTag: string;
  expertise: string[];
  workingHours: string;
  assignedCourse: string;
  email: string;
  badgeTone: MentorBadgeTone;
  rating: string;
  isSystemAdmin?: boolean;
}

const getMentorAvatarTone = (tone: MentorBadgeTone, isSystemAdmin?: boolean): string => {
  if (isSystemAdmin) return 'bg-[#0A4D8C] text-white border border-white/20';
  switch (tone) {
    case 'blue':
      return 'bg-[#0A4D8C] text-white border border-[#083D70]';
    case 'white':
      return 'bg-white text-[#1E2329] border border-slate-300';
    case 'yellow':
      return 'bg-[#F59E0B] text-slate-950 border border-[#D97706]';
    case 'black':
      return 'bg-[#1E2329] text-white border border-slate-800';
    case 'teal':
      return 'bg-[#0D7A5F] text-white border border-[#095C47]';
    case 'indigo':
      return 'bg-[#3730A3] text-white border border-[#312E81]';
    default:
      return 'bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7]';
  }
};

const MENTORS_LIST: Mentor[] = [
  {
    id: 'm_mahmud',
    name: 'Engr. Mahmudul Hasan',
    role: 'Chief System Director & Lead Platform Architect',
    category: 'support',
    specialtyTag: 'System Operations',
    expertise: ['System Administration & Safety', 'Payout Verification & Audits', 'Database Scaling & Access Control'],
    workingHours: '09:00 AM – 11:00 PM (GMT+6)',
    assignedCourse: 'Overall System Administration & Escalations',
    email: 'mahmud.director@unityearning.app',
    badgeTone: 'blue',
    rating: '10.0',
    isSystemAdmin: true
  },
  // === CPA Marketing Mentors ===
  {
    id: 'm_tanveer',
    name: 'Tanveer Ahmed Chowdhury',
    role: 'Senior CPA Marketing Specialist & Lead Campaign Auditor',
    category: 'cpa_marketing',
    specialtyTag: 'CPA Marketing',
    expertise: ['CPA Network Approvals', 'High-Converting Lead Generation', 'Traffic Source Quality Control'],
    workingHours: '10:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'CPA & Lead Generation Support Hub',
    email: 'tanveer.cpa@unityearning.app',
    badgeTone: 'blue',
    rating: '9.9'
  },
  {
    id: 'm_rafiqul',
    name: 'Rafiqul Islam Bhuiyan',
    role: 'CPA Offer Funnel Strategist & Conversion Mentor',
    category: 'cpa_marketing',
    specialtyTag: 'CPA Marketing',
    expertise: ['Landing Page Compliance', 'US/UK Tier-1 CPA Offers', 'Click Fraud Prevention'],
    workingHours: '11:00 AM – 09:00 PM (GMT+6)',
    assignedCourse: 'International CPA Campaign Lab',
    email: 'rafiqul.cpa@unityearning.app',
    badgeTone: 'teal',
    rating: '9.8'
  },
  {
    id: 'm_nahid_cpa',
    name: 'Nahiduzzaman Khan',
    role: 'Lead CPA Network Acquisition Trainer',
    category: 'cpa_marketing',
    specialtyTag: 'CPA Marketing',
    expertise: ['Content Locking Campaigns', 'Mobile App Install Offers', 'Conversion Tracking Setup'],
    workingHours: '02:00 PM – 11:00 PM (GMT+6)',
    assignedCourse: 'CPA & Performance Marketing Batch',
    email: 'nahid.cpa@unityearning.app',
    badgeTone: 'black',
    rating: '9.7'
  },
  {
    id: 'm_tasnim_cpa',
    name: 'Tasnim Tabassum',
    role: 'Email & Lead Verification CPA Specialist',
    category: 'cpa_marketing',
    specialtyTag: 'CPA Marketing',
    expertise: ['SOI/DOI Lead Verification', 'Audience Targeting Rules', 'Daily ROI Monitoring'],
    workingHours: '09:00 AM – 06:00 PM (GMT+6)',
    assignedCourse: 'Certified CPA Lead Operations',
    email: 'tasnim.cpa@unityearning.app',
    badgeTone: 'yellow',
    rating: '9.8'
  },
  {
    id: 'm_faysal_cpa',
    name: 'Faysal Mahmud Shuvo',
    role: 'CPA Traffic Monetization Mentor',
    category: 'cpa_marketing',
    specialtyTag: 'CPA Marketing',
    expertise: ['Geo-Targeted Offer Selection', 'Compliance Ad Copywriting', 'Weekly Payout Audits'],
    workingHours: '12:00 PM – 09:00 PM (GMT+6)',
    assignedCourse: 'CPA Traffic Scaling Clinic',
    email: 'faysal.cpa@unityearning.app',
    badgeTone: 'indigo',
    rating: '9.6'
  },

  // === Digital Marketing Mentors ===
  {
    id: 'm_alamin',
    name: 'Md. Al-Amin Hossain',
    role: 'Lead Digital Marketing Specialist & Traffic Auditor',
    category: 'digital_marketing',
    specialtyTag: 'Digital Marketing',
    expertise: ['Social Media Distribution', 'Facebook Ads Optimization', 'Targeted Lead Sourcing'],
    workingHours: '11:00 AM – 09:00 PM (GMT+6)',
    assignedCourse: 'Digital Marketing & Social Operations',
    email: 'alamin.marketing@unityearning.app',
    badgeTone: 'teal',
    rating: '9.9'
  },
  {
    id: 'm_nabila_dm',
    name: 'Nabila Rahman Mim',
    role: 'SEO & Search Content Marketing Lead',
    category: 'digital_marketing',
    specialtyTag: 'Digital Marketing',
    expertise: ['On-Page SEO Audits', 'Keyword Research & Mapping', 'Organic Traffic Growth'],
    workingHours: '10:00 AM – 07:00 PM (GMT+6)',
    assignedCourse: 'Search & Content Marketing Track',
    email: 'nabila.seo@unityearning.app',
    badgeTone: 'white',
    rating: '9.8'
  },
  {
    id: 'm_imran_dm',
    name: 'Imran Hossain Chowdhury',
    role: 'Social Media Paid Campaign Instructor',
    category: 'digital_marketing',
    specialtyTag: 'Digital Marketing',
    expertise: ['Meta Business Suite', 'Audience Retargeting Funnels', 'Pixel & Event Tracking'],
    workingHours: '01:00 PM – 10:00 PM (GMT+6)',
    assignedCourse: 'Social Media Advertising Bootcamp',
    email: 'imran.ads@unityearning.app',
    badgeTone: 'blue',
    rating: '9.7'
  },
  {
    id: 'm_sadia_dm',
    name: 'Sadia Afrin Liza',
    role: 'Brand Outreach & Influencer Marketing Mentor',
    category: 'digital_marketing',
    specialtyTag: 'Digital Marketing',
    expertise: ['Creator Campaign Briefs', 'Instagram & YouTube Growth', 'Engagement Analytics'],
    workingHours: '09:30 AM – 06:30 PM (GMT+6)',
    assignedCourse: 'Social Branding & Outreach Desk',
    email: 'sadia.marketing@unityearning.app',
    badgeTone: 'yellow',
    rating: '9.8'
  },
  {
    id: 'm_rakib_dm',
    name: 'Rakibul Hasan Rony',
    role: 'B2B Lead Generation & Email Outreach Specialist',
    category: 'digital_marketing',
    specialtyTag: 'Digital Marketing',
    expertise: ['LinkedIn Prospecting', 'Cold Email Deliverability', 'CRM Sheet Formatting'],
    workingHours: '03:00 PM – 11:30 PM (GMT+6)',
    assignedCourse: 'Global B2B Lead Generation',
    email: 'rakib.b2b@unityearning.app',
    badgeTone: 'black',
    rating: '9.7'
  },
  {
    id: 'm_mehedi_dm',
    name: 'Mehedi Hasan Tarek',
    role: 'YouTube & Video Growth Strategy Mentor',
    category: 'digital_marketing',
    specialtyTag: 'Digital Marketing',
    expertise: ['Video Metadata SEO', 'Watch-Time Retention Audits', 'Monetization Compliance'],
    workingHours: '11:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'Digital Video Promotion Team',
    email: 'mehedi.video@unityearning.app',
    badgeTone: 'indigo',
    rating: '9.6'
  },

  // === Data Entry Mentors ===
  {
    id: 'm_farhana',
    name: 'Farhana Yasmin',
    role: 'Data Verification Officer & Compliance Lead',
    category: 'data_entry',
    specialtyTag: 'Data Entry',
    expertise: ['Multi-Field Verification', 'Corporate Excel Auditing', 'Accuracy Control Checks'],
    workingHours: '10:00 AM – 10:00 PM (GMT+6)',
    assignedCourse: 'Corporate Data Entry & Compliance',
    email: 'farhana.data@unityearning.app',
    badgeTone: 'teal',
    rating: '9.9'
  },
  {
    id: 'm_kamrul_de',
    name: 'Kamrul Hasan Sajib',
    role: 'Senior Excel Formula & Pivot Table Trainer',
    category: 'data_entry',
    specialtyTag: 'Data Entry',
    expertise: ['VLOOKUP / XLOOKUP Audits', 'Microfinance Ledger Reconciliation', 'Payroll Calculation Sheets'],
    workingHours: '09:00 AM – 07:00 PM (GMT+6)',
    assignedCourse: 'Advanced Excel Data Entry Batch',
    email: 'kamrul.excel@unityearning.app',
    badgeTone: 'blue',
    rating: '9.9'
  },
  {
    id: 'm_nusrat_de',
    name: 'Nusrat Jahan Nipa',
    role: 'Hospital Billing & Medical Data Entry Mentor',
    category: 'data_entry',
    specialtyTag: 'Data Entry',
    expertise: ['Patient Billing Sheet Audits', 'Insurance Claim Entry', 'ICD-10 Record Accuracy'],
    workingHours: '10:00 AM – 06:00 PM (GMT+6)',
    assignedCourse: 'Medical & Billing Data Processing',
    email: 'nusrat.data@unityearning.app',
    badgeTone: 'white',
    rating: '9.8'
  },
  {
    id: 'm_ariful_de',
    name: 'Ariful Islam Pavel',
    role: 'Distributor Sales & Telecom CDR Data Specialist',
    category: 'data_entry',
    specialtyTag: 'Data Entry',
    expertise: ['CDR Call-Log Analysis', 'Distributor Inventory Sheets', 'Batch Error Reconciliation'],
    workingHours: '12:00 PM – 10:00 PM (GMT+6)',
    assignedCourse: 'Enterprise Dataset Reconciliation',
    email: 'ariful.data@unityearning.app',
    badgeTone: 'black',
    rating: '9.7'
  },
  {
    id: 'm_sumaiya_de',
    name: 'Sumaiya Akter Mim',
    role: 'RMG Piece-Rate & Payroll Spreadsheet Mentor',
    category: 'data_entry',
    specialtyTag: 'Data Entry',
    expertise: ['Garments Production Logs', 'Overtime Formula Validation', 'Cleaned CSV Exports'],
    workingHours: '09:00 AM – 06:00 PM (GMT+6)',
    assignedCourse: 'RMG Payroll & Data Entry Unit',
    email: 'sumaiya.data@unityearning.app',
    badgeTone: 'yellow',
    rating: '9.8'
  },
  {
    id: 'm_ashik_de',
    name: 'Ashikur Rahman',
    role: 'PDF-to-Spreadsheet & OCR Audit Instructor',
    category: 'data_entry',
    specialtyTag: 'Data Entry',
    expertise: ['Tabular Digitization', 'Duplicate Row Elimination', 'Schema Consistency'],
    workingHours: '02:00 PM – 11:00 PM (GMT+6)',
    assignedCourse: 'Document Digitization & Spreadsheets',
    email: 'ashik.data@unityearning.app',
    badgeTone: 'indigo',
    rating: '9.7'
  },

  // === Form Fillup Mentors ===
  {
    id: 'm_shahin_ff',
    name: 'Shahinoor Rahman',
    role: 'Lead Client Registry & Form Fillup Auditor',
    category: 'form_fillup',
    specialtyTag: 'Form Fillup',
    expertise: ['60-Client Master Directory Matching', '40-Field Form Validation', 'KYC Record Verification'],
    workingHours: '09:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'Enterprise Client Form Fillup Desk',
    email: 'shahinoor.form@unityearning.app',
    badgeTone: 'blue',
    rating: '9.9'
  },
  {
    id: 'm_farzana_ff',
    name: 'Farzana Haque Keya',
    role: 'Financial & Banking Form Compliance Mentor',
    category: 'form_fillup',
    specialtyTag: 'Form Fillup',
    expertise: ['NID & Passport Format Checking', 'Tax & TIN Record Entry', 'Zero-Typo Field Auditing'],
    workingHours: '10:00 AM – 07:00 PM (GMT+6)',
    assignedCourse: 'Verified Client Onboarding Forms',
    email: 'farzana.form@unityearning.app',
    badgeTone: 'teal',
    rating: '9.8'
  },
  {
    id: 'm_touhid_ff',
    name: 'Touhiduzzaman Babu',
    role: 'Survey & Corporate Directory Form Specialist',
    category: 'form_fillup',
    specialtyTag: 'Form Fillup',
    expertise: ['Multi-Page Client Questionnaires', 'Postal & District Code Verification', 'Batch Quality Review'],
    workingHours: '11:00 AM – 09:00 PM (GMT+6)',
    assignedCourse: 'Corporate Form Processing Team',
    email: 'touhid.form@unityearning.app',
    badgeTone: 'black',
    rating: '9.7'
  },
  {
    id: 'm_rubina_ff',
    name: 'Rubina Yasmin',
    role: 'Insurance & Policy Form Processing Trainer',
    category: 'form_fillup',
    specialtyTag: 'Form Fillup',
    expertise: ['Nominee & Beneficiary Entries', 'Contact Cross-Checking', 'Deadline Escalation Support'],
    workingHours: '09:00 AM – 06:00 PM (GMT+6)',
    assignedCourse: 'Policy & Insurance Form Batch',
    email: 'rubina.form@unityearning.app',
    badgeTone: 'yellow',
    rating: '9.8'
  },
  {
    id: 'm_sajib_ff',
    name: 'Sajib Hossain Liton',
    role: 'Client Identity Validation & Form QA Lead',
    category: 'form_fillup',
    specialtyTag: 'Form Fillup',
    expertise: ['Duplicate ID Screening', 'Phone & Email Syntax Validation', 'Batch Resubmission Coaching'],
    workingHours: '01:00 PM – 10:00 PM (GMT+6)',
    assignedCourse: 'Form Fillup Accuracy Clinic',
    email: 'sajib.form@unityearning.app',
    badgeTone: 'white',
    rating: '9.7'
  },

  // === Typing & Transcription Mentors ===
  {
    id: 'm_rahman',
    name: 'Rahman Sheikh',
    role: 'Senior Transcription & Hand-Typing Speed Instructor',
    category: 'typing',
    specialtyTag: 'Typing Work',
    expertise: ['120+ WPM Keystroke Auditing', 'Anti-AI Quality Proofreading', '30-Min Timed Session Coaching'],
    workingHours: '08:00 AM – 06:00 PM (GMT+6)',
    assignedCourse: 'Professional Typing & Transcription',
    email: 'rahman.typing@unityearning.app',
    badgeTone: 'indigo',
    rating: '9.9'
  },
  {
    id: 'm_jannat_typ',
    name: 'Jannatul Ferdous Asha',
    role: 'Bengali Avro & Bijoy Transcription Lead',
    category: 'typing',
    specialtyTag: 'Typing Work',
    expertise: ['Bengali Spelling & Juktakkhor Rules', 'Unicode Consistency Checking', 'Editorial Proofreading'],
    workingHours: '09:00 AM – 07:00 PM (GMT+6)',
    assignedCourse: 'Bengali Error-Correction Typing',
    email: 'jannat.typing@unityearning.app',
    badgeTone: 'blue',
    rating: '9.9'
  },
  {
    id: 'm_rifat_typ',
    name: 'Rifat Islam Polash',
    role: 'Long-Form Document Typing & Timer Coach',
    category: 'typing',
    specialtyTag: 'Typing Work',
    expertise: ['2,500+ Character Stamina Drills', 'Touch-Typing Finger Placement', 'Punctuation Error Prevention'],
    workingHours: '10:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'Speed & Stamina Typing Bootcamp',
    email: 'rifat.typing@unityearning.app',
    badgeTone: 'teal',
    rating: '9.8'
  },
  {
    id: 'm_anika_typ',
    name: 'Anika Tabassum Orpa',
    role: 'Legal & Academic Transcription Mentor',
    category: 'typing',
    specialtyTag: 'Typing Work',
    expertise: ['Legal Clause Accuracy', 'Zero-Paste Compliance Review', 'Screen Recording Verification'],
    workingHours: '11:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'Legal & Academic Transcription Unit',
    email: 'anika.typing@unityearning.app',
    badgeTone: 'yellow',
    rating: '9.7'
  },
  {
    id: 'm_mahir_typ',
    name: 'Mahir Faisal',
    role: 'Technical Typing & Proofreading Auditor',
    category: 'typing',
    specialtyTag: 'Typing Work',
    expertise: ['Grammar & Error-Highlight Audits', 'Cooldown Recovery Guidance', 'Keystroke Telemetry Review'],
    workingHours: '03:00 PM – 11:30 PM (GMT+6)',
    assignedCourse: 'English & Technical Typing Hub',
    email: 'mahir.typing@unityearning.app',
    badgeTone: 'black',
    rating: '9.8'
  },

  // === Affiliate & E-Commerce Mentors ===
  {
    id: 'm_saiful',
    name: 'Md. Saiful Islam',
    role: 'E-Commerce Merchant & Dropshipping Operations Lead',
    category: 'affiliate',
    specialtyTag: 'Affiliate & Shop',
    expertise: ['Inventory Sync & Tracking', 'Supplier Reconciliation', 'Profit Margin Optimization'],
    workingHours: '12:00 PM – 10:00 PM (GMT+6)',
    assignedCourse: 'Dropshipping & Product Selling',
    email: 'saiful.dropship@unityearning.app',
    badgeTone: 'yellow',
    rating: '9.8'
  },
  {
    id: 'm_tanzim_aff',
    name: 'Tanzim Hasan Nabil',
    role: 'Unity Shop Affiliate Commission Strategist',
    category: 'affiliate',
    specialtyTag: 'Affiliate & Shop',
    expertise: ['Product Link Deep-Linking', 'Product ID Catalog Curation', 'Facebook Marketplace Conversions'],
    workingHours: '10:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'Affiliate Product Selling Program',
    email: 'tanzim.shop@unityearning.app',
    badgeTone: 'blue',
    rating: '9.9'
  },
  {
    id: 'm_sharmin_aff',
    name: 'Sharmin Akter Shila',
    role: 'Customer Closing & COD Conversion Mentor',
    category: 'affiliate',
    specialtyTag: 'Affiliate & Shop',
    expertise: ['WhatsApp Sales Scripts', 'Order Confirmation Ratios', 'Repeat Buyer Follow-ups'],
    workingHours: '09:30 AM – 06:30 PM (GMT+6)',
    assignedCourse: 'Social Commerce & Shop Closing',
    email: 'sharmin.shop@unityearning.app',
    badgeTone: 'white',
    rating: '9.7'
  },
  {
    id: 'm_jahid_aff',
    name: 'Jahidul Islam Joy',
    role: 'Storefront Listing & Merchandising Coach',
    category: 'affiliate',
    specialtyTag: 'Affiliate & Shop',
    expertise: ['Category Product Bundling', 'Seasonal Promotion Calendars', 'Commission Reconciliation'],
    workingHours: '01:00 PM – 10:00 PM (GMT+6)',
    assignedCourse: 'Digital Retail & Affiliate Merchandising',
    email: 'jahid.shop@unityearning.app',
    badgeTone: 'teal',
    rating: '9.8'
  },

  // === Content Moderation & Creative Media Mentors ===
  {
    id: 'm_nadia_mod',
    name: 'Nadia Islam Chowdhury',
    role: 'Lead Content Moderation & Policy Officer',
    category: 'moderation',
    specialtyTag: 'Content Moderation',
    expertise: ['Community Safety Audits', 'Comment & Post Escalation', 'Policy Enforcement Scoring'],
    workingHours: '09:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'Content Moderator Career Track',
    email: 'nadia.moderator@unityearning.app',
    badgeTone: 'black',
    rating: '9.9'
  },
  {
    id: 'm_sabbir_mod',
    name: 'Sabbir Ahmed Tamim',
    role: 'Video Submission & Editing Quality Auditor',
    category: 'moderation',
    specialtyTag: 'Media & Moderation',
    expertise: ['Short-Form Video Specs', 'Copyright & Audio Clearance', 'Thumbnail Readability'],
    workingHours: '11:00 AM – 09:00 PM (GMT+6)',
    assignedCourse: 'Video Production & Submission QA',
    email: 'sabbir.video@unityearning.app',
    badgeTone: 'blue',
    rating: '9.7'
  },
  {
    id: 'm_priyanka_mod',
    name: 'Priyanka Dasgupta',
    role: 'Photo Editing & Visual Compliance Specialist',
    category: 'moderation',
    specialtyTag: 'Media & Moderation',
    expertise: ['Product Background Retouching', 'Color Accuracy Grading', 'High-Res Export Standards'],
    workingHours: '10:00 AM – 07:00 PM (GMT+6)',
    assignedCourse: 'Commercial Photo Editing Desk',
    email: 'priyanka.photo@unityearning.app',
    badgeTone: 'white',
    rating: '9.8'
  },
  {
    id: 'm_fahim_mod',
    name: 'Fahim Morshed',
    role: 'Written Editorial & Content Quality Lead',
    category: 'moderation',
    specialtyTag: 'Media & Moderation',
    expertise: ['Plagiarism Screening', 'Fact-Checking Protocols', 'Article Structure Auditing'],
    workingHours: '12:00 PM – 09:00 PM (GMT+6)',
    assignedCourse: 'Editorial Content Writing Hub',
    email: 'fahim.editorial@unityearning.app',
    badgeTone: 'indigo',
    rating: '9.8'
  },
  {
    id: 'm_lamia_mod',
    name: 'Lamia Tasnim Khan',
    role: 'Trust & Safety Trust-Score Analyst',
    category: 'moderation',
    specialtyTag: 'Content Moderation',
    expertise: ['Fake Account Detection', 'Spam Pattern Tagging', 'Shift Shift-Handover Logs'],
    workingHours: '02:00 PM – 11:00 PM (GMT+6)',
    assignedCourse: 'Platform Moderation & QA Operations',
    email: 'lamia.safety@unityearning.app',
    badgeTone: 'teal',
    rating: '9.7'
  },

  // === Student Support, Microjobs & Technical Desk ===
  {
    id: 'm_sabrina',
    name: 'Sabrina Nowshin',
    role: 'Senior Student Support Executive & Linguistic Mentor',
    category: 'support',
    specialtyTag: 'Support & Onboarding',
    expertise: ['Member Query Resolution', 'Grammar & Spell Auditing', 'Platform Guideline Execution'],
    workingHours: '09:00 AM – 09:00 PM (GMT+6)',
    assignedCourse: 'Platform Onboarding & General Support',
    email: 'sabrina.support@unityearning.app',
    badgeTone: 'yellow',
    rating: '9.9'
  },
  {
    id: 'm_shakil',
    name: 'Engr. Shakil Mahmud',
    role: 'Technical Support Coach & Microjob Operations Lead',
    category: 'support',
    specialtyTag: 'Technical & Microjobs',
    expertise: ['Account Security & 2FA', 'Micro Job Quality Ratings', 'Submission Troubleshooting'],
    workingHours: '10:00 AM – 12:00 AM (GMT+6)',
    assignedCourse: 'Micro Jobs & Technical Escalation Desk',
    email: 'shakil.tech@unityearning.app',
    badgeTone: 'blue',
    rating: '9.8'
  },
  {
    id: 'm_noman_sup',
    name: 'Abdullah Al Noman',
    role: 'Balance Transfer & Payout Reconciliation Officer',
    category: 'support',
    specialtyTag: 'Payout Support',
    expertise: ['7-Digit P2P Transfer Audits', 'bKash / Nagad Settlement Tracking', 'Project ID Verification'],
    workingHours: '09:00 AM – 08:00 PM (GMT+6)',
    assignedCourse: 'Wallet & Payout Verification Desk',
    email: 'noman.payout@unityearning.app',
    badgeTone: 'teal',
    rating: '9.9'
  },
  {
    id: 'm_khadija_sup',
    name: 'Khadija Akter Lubna',
    role: 'New Batch Coordinator & Orientation Mentor',
    category: 'support',
    specialtyTag: 'Support & Onboarding',
    expertise: ['Batch 1–20 Orientation', 'Weekly Contest Coordination', 'Starter Module Selection'],
    workingHours: '10:00 AM – 07:00 PM (GMT+6)',
    assignedCourse: 'Member Orientation & Helpdesk',
    email: 'khadija.desk@unityearning.app',
    badgeTone: 'white',
    rating: '9.8'
  },
  {
    id: 'm_sohel_sup',
    name: 'Sohel Rana Sarker',
    role: 'Ad-Viewing, Website Visit & Gaming QA Mentor',
    category: 'support',
    specialtyTag: 'Microjobs & Campaigns',
    expertise: ['Session Verification Audits', 'Campaign Engagement Compliance', 'Leaderboard Integrity'],
    workingHours: '01:00 PM – 11:00 PM (GMT+6)',
    assignedCourse: 'Microjob & Campaign Verification Unit',
    email: 'sohel.campaign@unityearning.app',
    badgeTone: 'black',
    rating: '9.7'
  }
];

const CATEGORY_FILTERS: { id: MentorCategory; label: string }[] = [
  { id: 'all', label: `All (${MENTORS_LIST.length})` },
  { id: 'cpa_marketing', label: 'CPA Marketing' },
  { id: 'digital_marketing', label: 'Digital Marketing' },
  { id: 'data_entry', label: 'Data Entry' },
  { id: 'form_fillup', label: 'Form Fillup' },
  { id: 'typing', label: 'Typing Work' },
  { id: 'affiliate', label: 'Affiliate & Shop' },
  { id: 'moderation', label: 'Moderation & Media' },
  { id: 'support', label: 'Support & QA' }
];

export const Mentors = () => {
  const [activeTab, setActiveTab] = useState<'mentors' | 'guidelines'>('mentors');
  const [selectedCategory, setSelectedCategory] = useState<MentorCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMentors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return MENTORS_LIST.filter((m) => {
      const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.specialtyTag.toLowerCase().includes(q) ||
        m.assignedCourse.toLowerCase().includes(q) ||
        m.expertise.some((e) => e.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-4xl mx-auto pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0A4D8C] rounded-xl p-5 sm:p-6 text-white space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#D4E4F7] flex items-center gap-1.5">
              <GraduationCap size={14} />
              <span>Unity E-Learning & Earning Platform</span>
            </p>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
              Course Mentors & Domain Specialists
            </h1>
            <p className="text-xs text-blue-100/90 max-w-xl leading-relaxed">
              Dedicated mentors across CPA Marketing, Digital Marketing, Data Entry, Form Fillup, Typing, Affiliate Commerce, Content Moderation, and Technical Support.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl text-left sm:text-right shrink-0 w-full sm:w-auto">
            <div className="text-[11px] font-medium text-blue-100">Active Specialists</div>
            <div className="text-base font-semibold font-mono tabular-nums text-white mt-0.5">
              {MENTORS_LIST.length} Verified Mentors
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 pt-3 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab('mentors')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'mentors'
                ? 'bg-white text-[#0A4D8C]'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            <Users size={14} />
            <span>Official Mentors ({MENTORS_LIST.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guidelines')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'guidelines'
                ? 'bg-white text-[#0A4D8C]'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            <ShieldCheck size={14} />
            <span>কাজের নিয়ম ও নীতিমালা</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          {/* Main Warning Card */}
          <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#F3DFA2] text-[#B47B00] flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-[#1E2329]">
                  ইউনিটি ই-লার্নিং প্ল্যাটফর্মের অফিসিয়াল কাজের নীতিমালা
                </h3>
                <p className="text-xs text-[#5F4B16]">
                  প্রজেক্টে কাজ করার পূর্বে এই শর্তগুলো সতর্কতার সাথে পড়ুন
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#F3DFA2]/80 text-xs sm:text-sm text-[#1E2329] space-y-2.5 leading-relaxed">
              <p className="border-b border-slate-100 pb-2">
                <strong className="font-semibold">প্রিমিয়াম প্রজেক্টে কাজ করার যোগ্যতা:</strong> আমাদের ওয়ার্ক পোর্টালে যে প্রিমিয়াম কাজগুলো রয়েছে (যেমন: ডেটা এন্ট্রি প্রজেক্ট, বৃহৎ ফর্ম ফিলাপ, ট্রান্সক্রিপশন টাইপিং ইত্যাদি), সেগুলো{' '}
                <strong className="font-semibold">
                  শুধুমাত্র যারা কাজ পারে বা নির্ধারিত কোর্স/ট্রেনিং সফলভাবে সম্পন্ন করেছে শুধুমাত্র তারাই ভালো করতে পারবে এবং সফল হবে
                </strong>
                ।
              </p>

              <p className="border-b border-slate-100 pb-2 text-rose-800">
                <strong className="font-semibold">কোর্স ও ট্রেনিংবিহীন কাজের ক্ষেত্রে স্বয়ংক্রিয় রিজেকশন পলিসি:</strong> যারা কোর্স বা ট্রেনিং সম্পন্ন করেনি কিংবা কাজের সঠিক নিয়ম জানে না, তাদেরকে সরাসরি লাইভ প্রজেক্টে কাজ দেওয়া হবে না। যদি কেউ প্রশিক্ষণ ছাড়া প্রজেক্টে কাজ জমা দেয়, তবে অসম্পূর্ণ বা ভুল তথ্যের কারণে তা{' '}
                <strong className="font-semibold">সরাসরি স্বয়ংক্রিয়ভাবে রিজেক্ট (Rejected)</strong> হয়ে যাবে।
              </p>

              <p className="text-slate-700">
                <strong className="font-semibold text-[#0D7A5F]">সফলতার উপায়:</strong> প্রতিটি কোর্সের জন্য আলাদা অভিজ্ঞ মেন্টর নিয়োজিত রয়েছেন। কাজ জমা দেওয়ার পূর্বে মেন্টরদের দেওয়া ভিডিও গাইডলাইন ও নিয়মাবলী ভালো করে দেখে নিন এবং শতভাগ নির্ভুলভাবে কাজ সম্পন্ন করুন।
              </p>
            </div>
          </div>

          {/* Detailed Terms Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2329]">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <FileCheck size={16} />
                </div>
                <span>১. ডেটা এন্ট্রি প্রজেক্ট নিয়মাবলী</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                প্রতিটি ডেটা এন্ট্রি প্রজেক্টে বাস্তব এক্সেল ফরম্যাট ও ফর্মুলা ব্যবহার করে সমাধান করতে হবে। কোনো ভুয়া বা ফাঁকা ফাইল জমা দিলে সাথে সাথে রিজেক্ট হবে।
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2329]">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <Building size={16} />
                </div>
                <span>২. ফর্ম ফিলাপ ও ক্লায়েন্ট পলিসি</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ফর্ম ফিলাপের কাজে ৬০ জন ক্লায়েন্টের মাস্টার তালিকা থেকে সঠিক ক্লায়েন্টের নাম ও ডেটা এনে হুবহু প্রতিটি ফিল্ডে বসাতে হবে। বানান বা নম্বরে ভুল থাকলে কাজ অসম্পূর্ণ গণ্য হবে।
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2329]">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <Award size={16} />
                </div>
                <span>৩. টাইপিং ও অ্যান্টি-এআই প্রোটোকল</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                টাইপিংয়ে কোনো প্রকার এআই ব্যবহার করা কঠোরভাবে নিষিদ্ধ। টাইপ করার সময় নির্ধারিত ৩০ মিনিটের টাইমারের ভেতর কাজ সম্পন্ন করে স্ক্রিন রেকর্ডিং প্রমাণ সাবমিট করা বাধ্যতামূলক।
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2329]">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center shrink-0">
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

      {/* Tab 2: Mentors List */}
      {activeTab === 'mentors' && (
        <div className="space-y-3.5">
          {/* Search & Category Filter */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentor by name or expertise (e.g. CPA, Digital Marketing, Data Entry, Typing)..."
              className="w-full bg-white border border-slate-200 pl-10 pr-8 py-2.5 rounded-xl text-xs sm:text-sm text-[#1E2329] placeholder-slate-400 focus:outline-none focus:border-[#0A4D8C] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-[#0A4D8C] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-0.5 tabular-nums">
            <span>System Administration & Domain Instructors</span>
            <span>Showing {filteredMentors.length} of {MENTORS_LIST.length}</span>
          </div>

          {filteredMentors.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200/90 space-y-1.5">
              <p className="text-sm font-semibold text-[#1E2329]">No matching mentor found</p>
              <p className="text-xs text-slate-500">Try clearing the filter or searching another skill.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className={`rounded-xl p-4 sm:p-5 border transition-colors flex flex-col sm:flex-row gap-4 items-start relative ${
                    mentor.isSystemAdmin
                      ? 'bg-[#22262C] text-white border-slate-800'
                      : 'bg-white text-[#1E2329] border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {mentor.isSystemAdmin ? (
                    <span className="sm:absolute sm:top-4 sm:right-4 text-xs font-medium text-amber-200 flex items-center gap-1">
                      <ShieldAlert size={13} />
                      <span>System Head</span>
                    </span>
                  ) : (
                    <span className="sm:absolute sm:top-4 sm:right-4 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7]">
                      {mentor.specialtyTag}
                    </span>
                  )}

                  {/* Left Side: Initials Avatar */}
                  <div
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base shrink-0 ${getMentorAvatarTone(
                      mentor.badgeTone,
                      mentor.isSystemAdmin
                    )}`}
                  >
                    {mentor.name
                      .split(' ')
                      .filter((p) => !['Md.', 'Engr.'].includes(p))
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>

                  {/* Right Side: Mentor Info */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="space-y-0.5 sm:pr-32">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3
                          className={`font-semibold text-sm sm:text-base tracking-tight ${
                            mentor.isSystemAdmin ? 'text-white' : 'text-[#1E2329]'
                          }`}
                        >
                          {mentor.name}
                        </h3>
                        <CheckCircle2
                          size={14}
                          className={mentor.isSystemAdmin ? 'text-blue-300 shrink-0' : 'text-[#0A4D8C] shrink-0'}
                        />
                        {!mentor.isSystemAdmin && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[#B47B00] ml-1 font-mono tabular-nums">
                            <Star size={11} className="fill-amber-400 text-amber-500" />
                            <span>{mentor.rating}/10</span>
                          </span>
                        )}
                      </div>

                      <p className={`text-xs font-medium ${mentor.isSystemAdmin ? 'text-blue-200' : 'text-[#0A4D8C]'}`}>
                        {mentor.role}
                      </p>
                    </div>

                    {/* Operational Details */}
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-2.5 rounded-lg border ${
                        mentor.isSystemAdmin
                          ? 'bg-white/5 border-white/10 text-slate-300'
                          : 'bg-[#F4F5F7] border-slate-200/70 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Clock
                          size={12}
                          className={mentor.isSystemAdmin ? 'text-blue-200 shrink-0' : 'text-[#0A4D8C] shrink-0'}
                        />
                        <span className="truncate">{mentor.workingHours}</span>
                      </div>

                      <div className="flex items-center gap-1.5 min-w-0 font-medium">
                        <UserCheck
                          size={12}
                          className={mentor.isSystemAdmin ? 'text-emerald-300 shrink-0' : 'text-[#0D7A5F] shrink-0'}
                        />
                        <span className="truncate">{mentor.assignedCourse}</span>
                      </div>
                    </div>

                    {/* Key Core Expertise */}
                    <p className={`text-xs ${mentor.isSystemAdmin ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className={mentor.isSystemAdmin ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
                        Expertise:{' '}
                      </span>
                      {mentor.expertise.join(' · ')}
                    </p>

                    {/* Contact Email */}
                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono ${
                        mentor.isSystemAdmin ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      <Mail size={12} className="shrink-0" />
                      <span>{mentor.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
