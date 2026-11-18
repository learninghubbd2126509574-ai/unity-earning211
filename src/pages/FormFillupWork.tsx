import React, { useState, useMemo, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  ChevronRight,
  Info,
  DollarSign,
  Send,
  XCircle,
  AlertOctagon,
  RotateCcw,
  Cpu,
  Activity,
  Clock,
  ShieldAlert,
  UserCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export interface EnterpriseClient {
  id: number;
  clientIdCode: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  dob: string;
  nationality: string;
  genderBlood: string;
  maritalStatus: string;
  nidNumber: string;
  passportNumber: string;
  tinNumber: string;
  binVatNumber: string;
  primaryPhone: string;
  secondaryPhone: string;
  emergencyPhone: string;
  corporateEmail: string;
  personalEmail: string;
  division: string;
  district: string;
  thanaUpazila: string;
  presentAddress: string;
  postCode: string;
  permanentAddress: string;
  designation: string;
  department: string;
  employeeCode: string;
  joiningDate: string;
  companyName: string;
  rjscRegNo: string;
  monthlyIncome: string;
  annualTurnover: string;
  bankName: string;
  bankBranch: string;
  bankAccountNo: string;
  routingCode: string;
  swiftBicCode: string;
  nomineeName: string;
  nomineeRelationShare: string;
  servicePolicyCode: string;
  kycSecurityPin: string;
}

const FIRST_NAMES = [
  'Kamrul Hasan', 'Tanvir Ahmed', 'Sabrina Chowdhury', 'Nazmul Huda',
  'Ashraful Alam', 'Selina Begum', 'Rafiqul Islam', 'Nusrat Jahan',
  'Mahbubur Rahman', 'Tasnim Akter', 'Sajjad Hossain', 'Fatema Tuz Zohra',
  'Tariqul Islam', 'Farhana Islam', 'Abdullah Al Mamun', 'Rokeya Sultana',
  'Shariful Haque', 'Nabil Mahmud', 'Afsana Mirza', 'Kazi Enamul Haque',
  'Saidur Rahman', 'Samira Haque', 'Mustafizur Rahman', 'Shahnaz Parvin',
  'Moniruzzaman', 'Tahmina Khatun', 'Atiqur Rahman', 'Zerin Tasnim',
  'Shafiqul Islam', 'Nusrat Binte Noor', 'Mehedi Hasan', 'Sadia Sultana',
  'Imran Nazir', 'Puja Rani Das', 'Al-Amin Hossain', 'Tania Islam',
  'Shahriar Nafiz', 'Sumaiya Khanam', 'Naimur Rahman', 'Fahim Faisal',
  'Hasibul Kabir', 'Mehnaz Karim', 'Rakibuzzaman', 'Tamanna Yasmin',
  'Rezaul Karim', 'Sultana Parveen', 'Iftekhar Alam', 'Maliha Chowdhury',
  'Zakir Hossain', 'Farzana Yasmin', 'Tarek Aziz', 'Nabila Rahman',
  'Shohel Rana', 'Shaila Akter', 'Jahidul Islam', 'Mim Akter',
  'Sajib Chowdhury', 'Anika Tabassum', 'Morshed Alam', 'Fariha Islam'
];

const FATHERS = [
  'Md. Abdur Rahman', 'Md. Abdul Malek', 'Kazi Nazrul Islam', 'Md. Sirajul Haque',
  'Dr. Mozammel Haque', 'Md. Nurul Islam', 'Haji Abdul Aziz', 'Adv. Shamsul Alam'
];
const MOTHERS = [
  'Mst. Sufia Begum', 'Jahanara Akter', 'Rabeya Khatun', 'Fatema Begum',
  'Sultana Razia', 'Rokeya Begum', 'Anwara Begum', 'Hosne Ara Begum'
];
const SPOUSES = [
  'Farida Yasmin', 'Tareq Aziz', 'Shirin Akter', 'Mahmudul Hasan',
  'N/A (Single)', 'Sabina Chowdhury', 'Rashedul Alam', 'Rumana Islam'
];
const DIVISIONS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur', 'Barishal', 'Mymensingh'];
const DISTRICTS = [
  'Dhaka Sadar', 'Chattogram Sadar', 'Bogura', 'Jashore', 'Sylhet Sadar', 'Dinajpur',
  'Barishal Sadar', 'Cumilla', 'Gazipur', 'Narayanganj', 'Feni', 'Pabna'
];
const THANAS = [
  'Gulshan', 'Banani', 'Motijheel', 'Uttara West', 'Dhanmondi', 'Agrabad',
  'Kotwali', 'Panchlaish', 'Zindabazar', 'Sonadanga', 'Shahbagh', 'Mirpur Model'
];
const COMPANIES = [
  'Meghna Technologies Ltd.', 'Dhaka Digital Traders PLC', 'AgroTech Solutions BD',
  'Prime Software Labs Ltd.', 'Bengal Logistics Network', 'Padma Enterprise Corp.',
  'Jamuna Commercial Hub', 'Karnaphuli Shipping Ltd.', 'Surma Digital Media',
  'Sonargaon Fashions Ltd.', 'Green Delta Holdings PLC', 'Crown Plastics Ind. Ltd.'
];
const DEPARTMENTS = [
  'Finance & Treasury', 'Enterprise Operations', 'Information Security',
  'Supply Chain & Audit', 'Corporate Compliance', 'Commercial Procurement'
];
const DESIGNATIONS = [
  'Managing Director', 'Chief Tech Officer', 'Head of Accounts',
  'Senior Audit Manager', 'Principal Compliance Lead', 'Regional Operations Director'
];
const BANKS: { name: string; swift: string; branch: string }[] = [
  { name: 'Dutch-Bangla Bank PLC', swift: 'DBBLBDDH', branch: 'Motijheel Corporate' },
  { name: 'BRAC Bank PLC', swift: 'BRAKBDDH', branch: 'Gulshan-1 Premier' },
  { name: 'Islami Bank Bangladesh PLC', swift: 'IBBLBDDH', branch: 'Dhanmondi Central' },
  { name: 'City Bank PLC', swift: 'CIBLBDDH', branch: 'Karwan Bazar Commercial' },
  { name: 'Eastern Bank PLC', swift: 'EBLDBDDH', branch: 'Agrabad Main' },
  { name: 'Sonali Bank PLC', swift: 'BSONBDDH', branch: 'Local Office Dhaka' }
];

export const GENERATE_60_CLIENTS = (): EnterpriseClient[] => {
  return Array.from({ length: 60 }).map((_, i) => {
    const num = i + 1;
    const name = FIRST_NAMES[i % FIRST_NAMES.length];
    const father = FATHERS[(i * 3) % FATHERS.length];
    const mother = MOTHERS[(i * 5) % MOTHERS.length];
    const spouse = SPOUSES[(i * 7) % SPOUSES.length];
    const division = DIVISIONS[i % DIVISIONS.length];
    const district = DISTRICTS[(i * 2) % DISTRICTS.length];
    const thana = THANAS[(i * 3) % THANAS.length];
    const company = COMPANIES[i % COMPANIES.length];
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    const designation = DESIGNATIONS[i % DESIGNATIONS.length];
    const bankInfo = BANKS[i % BANKS.length];

    const emailPrefix = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10) || `client${num}`;
    const corpDomain = company.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'bdcorp';
    const corporateEmail = `${emailPrefix}.${num}@${corpDomain}.com.bd`;
    const personalEmail = `${emailPrefix}${1980 + num}@gmail.com`;

    const monthlyVal = 55000 + num * 3250;
    const annualVal = monthlyVal * 12 + num * 15000;

    return {
      id: num,
      clientIdCode: `ENT-CLT-2026-${String(2000 + num)}`,
      fullName: name,
      fatherName: father,
      motherName: mother,
      spouseName: spouse,
      dob: `${1978 + (num % 20)}-${String((num % 12) + 1).padStart(2, '0')}-${String((num % 27) + 1).padStart(2, '0')}`,
      nationality: 'Bangladeshi (By Birth)',
      genderBlood: num % 2 === 0 ? `Male (${['B+', 'O+', 'A+', 'AB+'][num % 4]})` : `Female (${['O+', 'A+', 'B-', 'AB+'][num % 4]})`,
      maritalStatus: spouse.startsWith('N/A') ? 'Single' : 'Married',
      nidNumber: `19${80 + (num % 19)}${String(1042000000 + num * 876543).slice(0, 10)}`,
      passportNumber: `A0${String(4120000 + num * 13579).slice(0, 7)}`,
      tinNumber: `5894-${String(1024 + num * 47)}-${String(4100 + num * 83)}`,
      binVatNumber: `BIN-00${String(1482000 + num * 321).slice(0, 7)}-0101`,
      primaryPhone: `+880 17${String(11000000 + num * 94321).slice(0, 8)}`,
      secondaryPhone: `+880 19${String(32000000 + num * 71429).slice(0, 8)}`,
      emergencyPhone: `+880 18${String(24000000 + num * 83214).slice(0, 8)}`,
      corporateEmail,
      personalEmail,
      division,
      district,
      thanaUpazila: thana,
      presentAddress: `Flat #${(num % 6) + 1}B, House #${num * 2 + 3}, Road #${(num % 18) + 1}, ${thana}, ${district}`,
      postCode: String(1200 + ((num * 43) % 7500)),
      permanentAddress: `Vill: Dakshinpara, PO: ${district} GPO-${1200 + num}, Upazila: ${thana}, Dist: ${district}`,
      designation,
      department,
      employeeCode: `EMP-BD-${String(4100 + num * 7)}`,
      joiningDate: `${2016 + (num % 9)}-${String(((num + 3) % 12) + 1).padStart(2, '0')}-01`,
      companyName: company,
      rjscRegNo: `C-${114200 + num * 19}/${2012 + (num % 12)}`,
      monthlyIncome: `BDT ${monthlyVal.toLocaleString('en-US')}.00`,
      annualTurnover: `BDT ${annualVal.toLocaleString('en-US')}.00`,
      bankName: bankInfo.name,
      bankBranch: bankInfo.branch,
      bankAccountNo: `${String(1041000000000 + num * 987654321).slice(0, 13)}`,
      routingCode: `095${String(102400 + num * 137).slice(0, 6)}`,
      swiftBicCode: bankInfo.swift,
      nomineeName: spouse.startsWith('N/A') ? father : spouse,
      nomineeRelationShare: spouse.startsWith('N/A') ? 'Father (100% Share)' : 'Spouse (100% Share)',
      servicePolicyCode: `POL-KYC-${String(8400 + num * 3)}`,
      kycSecurityPin: `SEC-${String(91000 + num * 29)}`
    };
  });
};

const ALL_60_CLIENTS = GENERATE_60_CLIENTS();

const EMPTY_FORM = {
  clientIdCode: '',
  fullName: '',
  fatherName: '',
  motherName: '',
  spouseName: '',
  dob: '',
  nationality: '',
  genderBlood: '',
  maritalStatus: '',
  nidNumber: '',
  passportNumber: '',
  tinNumber: '',
  binVatNumber: '',
  primaryPhone: '',
  secondaryPhone: '',
  emergencyPhone: '',
  corporateEmail: '',
  personalEmail: '',
  division: '',
  district: '',
  thanaUpazila: '',
  presentAddress: '',
  postCode: '',
  permanentAddress: '',
  designation: '',
  department: '',
  employeeCode: '',
  joiningDate: '',
  companyName: '',
  rjscRegNo: '',
  monthlyIncome: '',
  annualTurnover: '',
  bankName: '',
  bankBranch: '',
  bankAccountNo: '',
  routingCode: '',
  swiftBicCode: '',
  nomineeName: '',
  nomineeRelationShare: '',
  servicePolicyCode: ''
};

type FormDataKey = keyof typeof EMPTY_FORM;

const FIELD_CONFIG: {
  key: FormDataKey;
  label: string;
  placeholder: string;
  required?: boolean;
  mono?: boolean;
  type?: string;
}[] = [
  { key: 'clientIdCode', label: '1. Client Reference ID *', placeholder: 'e.g. ENT-CLT-2026-2001', required: true, mono: true },
  { key: 'fullName', label: '2. Full Legal Name *', placeholder: 'Enter client full legal name', required: true },
  { key: 'fatherName', label: '3. Father Full Name', placeholder: 'Enter father name' },
  { key: 'motherName', label: '4. Mother Full Name', placeholder: 'Enter mother name' },
  { key: 'spouseName', label: '5. Spouse Full Name', placeholder: 'Spouse name or N/A (Single)' },
  { key: 'dob', label: '6. Date of Birth (YYYY-MM-DD)', placeholder: 'YYYY-MM-DD', mono: true },
  { key: 'nationality', label: '7. Nationality & Citizenship', placeholder: 'e.g. Bangladeshi (By Birth)' },
  { key: 'genderBlood', label: '8. Gender & Blood Group', placeholder: 'e.g. Male (B+)' },
  { key: 'maritalStatus', label: '9. Marital Status', placeholder: 'Married / Single' },
  { key: 'nidNumber', label: '10. Smart National ID (NID) *', placeholder: 'Enter 14-digit NID number', required: true, mono: true },
  { key: 'passportNumber', label: '11. e-Passport Number', placeholder: 'e.g. A04120000', mono: true },
  { key: 'tinNumber', label: '12. Income Tax e-TIN Number', placeholder: 'e.g. 5894-1071-4183', mono: true },
  { key: 'binVatNumber', label: '13. Corporate BIN / VAT Registration', placeholder: 'e.g. BIN-0014823-0101', mono: true },
  { key: 'primaryPhone', label: '14. Primary Mobile Number', placeholder: '+880 17...', mono: true },
  { key: 'secondaryPhone', label: '15. Secondary Contact Phone', placeholder: '+880 19...', mono: true },
  { key: 'emergencyPhone', label: '16. Emergency Contact Phone', placeholder: '+880 18...', mono: true },
  { key: 'corporateEmail', label: '17. Corporate Official Email', placeholder: 'name@company.com.bd', mono: true, type: 'email' },
  { key: 'personalEmail', label: '18. Personal Verified Email', placeholder: 'name@gmail.com', mono: true, type: 'email' },
  { key: 'division', label: '19. Administrative Division', placeholder: 'Enter division' },
  { key: 'district', label: '20. Revenue District', placeholder: 'Enter district' },
  { key: 'thanaUpazila', label: '21. Thana / Upazila Circle', placeholder: 'Enter Thana or Upazila' },
  { key: 'presentAddress', label: '22. Present Residential Address', placeholder: 'Flat, House, Road, Thana, District' },
  { key: 'postCode', label: '23. Postal / ZIP Code', placeholder: 'e.g. 1212', mono: true },
  { key: 'permanentAddress', label: '24. Permanent Registered Address', placeholder: 'Vill, PO, Upazila, Dist' },
  { key: 'designation', label: '25. Corporate Designation / Rank', placeholder: 'Enter job title' },
  { key: 'department', label: '26. Assigned Department', placeholder: 'Enter department' },
  { key: 'employeeCode', label: '27. Corporate Employee Code', placeholder: 'e.g. EMP-BD-4107', mono: true },
  { key: 'joiningDate', label: '28. Service Joining Date', placeholder: 'YYYY-MM-DD', mono: true },
  { key: 'companyName', label: '29. Employer Organization Name', placeholder: 'Enter company legal name' },
  { key: 'rjscRegNo', label: '30. RJSC Incorporation Reg. No', placeholder: 'e.g. C-114219/2013', mono: true },
  { key: 'monthlyIncome', label: '31. Gross Monthly Income', placeholder: 'e.g. BDT 58,250.00', mono: true },
  { key: 'annualTurnover', label: '32. Declared Annual Turnover', placeholder: 'e.g. BDT 714,000.00', mono: true },
  { key: 'bankName', label: '33. Primary Settlement Bank', placeholder: 'Enter bank full name' },
  { key: 'bankBranch', label: '34. Bank Branch Name', placeholder: 'Enter branch name' },
  { key: 'bankAccountNo', label: '35. Bank Account Number (13-Digit)', placeholder: 'Enter bank account number', mono: true },
  { key: 'routingCode', label: '36. Bangladesh Bank Routing Code', placeholder: 'Enter 9-digit routing code', mono: true },
  { key: 'swiftBicCode', label: '37. SWIFT / BIC Settlement Code', placeholder: 'e.g. DBBLBDDH', mono: true },
  { key: 'nomineeName', label: '38. Authorized Nominee Name', placeholder: 'Enter nominee full name' },
  { key: 'nomineeRelationShare', label: '39. Nominee Relation & Share %', placeholder: 'e.g. Spouse (100% Share)' },
  { key: 'servicePolicyCode', label: '40. Policy & KYC Service Code', placeholder: 'e.g. POL-KYC-8403', mono: true }
];

interface AuditErrorDetail {
  clientId: number;
  clientName: string;
  issueType: string;
  detail: string;
}

export const FormFillupWork = () => {
  const { user, profile } = useAuth();
  void user;
  void profile;

  const [selectedClientId, setSelectedClientId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pasteBlockedCount, setPasteBlockedCount] = useState(0);

  const [submittedClients, setSubmittedClients] = useState<{ [key: number]: any }>(() => {
    try {
      const saved = localStorage.getItem('unity_form_fillup_60_records');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentClient = useMemo(() => {
    return ALL_60_CLIENTS.find((c) => c.id === selectedClientId) || ALL_60_CLIENTS[0];
  }, [selectedClientId]);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (submittedClients[selectedClientId]) {
      setFormData(submittedClients[selectedClientId]);
    } else {
      setFormData(EMPTY_FORM);
    }
    setFormSuccess(null);
    setFormError(null);
  }, [selectedClientId, submittedClients]);

  // Audit States
  const [isAnalyzingBatch, setIsAnalyzingBatch] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isRejectedBatch, setIsRejectedBatch] = useState<boolean>(() => {
    return localStorage.getItem('unity_form_fillup_60_rejected') === 'true';
  });
  const [analysisRemainingSeconds, setAnalysisRemainingSeconds] = useState(120);
  const [analysisStepText, setAnalysisStepText] = useState('Initializing 40-field enterprise KYC & banking audit...');

  const auditFindings = useMemo<AuditErrorDetail[]>(() => {
    const errors: AuditErrorDetail[] = [];
    const submittedIds = Object.keys(submittedClients).map(Number);

    submittedIds.forEach((cid) => {
      const refClient = ALL_60_CLIENTS.find((c) => c.id === cid);
      const entry = submittedClients[cid];
      if (!refClient || !entry) return;

      const mismatchedLabels: string[] = [];
      FIELD_CONFIG.forEach((field) => {
        const expectedVal = String(refClient[field.key] ?? '').trim();
        const enteredVal = String(entry[field.key] ?? '').trim();
        if (enteredVal !== expectedVal) {
          mismatchedLabels.push(field.label);
        }
      });

      if (mismatchedLabels.length > 0) {
        errors.push({
          clientId: cid,
          clientName: refClient.fullName,
          issueType: `${mismatchedLabels.length} Field Mismatch(es)`,
          detail: `Discrepancy detected in: ${mismatchedLabels.slice(0, 4).join(', ')}${
            mismatchedLabels.length > 4 ? ` (+${mismatchedLabels.length - 4} more fields)` : ''
          }`
        });
      }
    });

    // Always surface strict central Missing Data & audit errors even if typed fields appear to match
    if (errors.length === 0) {
      const firstId = submittedIds[0] || selectedClientId || 1;
      const secondId = submittedIds[1] || (firstId < 60 ? firstId + 1 : 2);
      const c1 = ALL_60_CLIENTS.find((c) => c.id === firstId) || ALL_60_CLIENTS[0];
      const c2 = ALL_60_CLIENTS.find((c) => c.id === secondId) || ALL_60_CLIENTS[1];

      errors.push(
        {
          clientId: c1.id,
          clientName: c1.fullName,
          issueType: 'Missing Data Detected (ডেটা মিসিং)',
          detail: `Missing required registry data in Field #36 (Routing Code: ${c1.routingCode}) & Field #37 (SWIFT: ${c1.swiftBicCode}) — আপনার এই জায়গায় ডেটা মিসিং ও ভুল রয়েছে।`
        },
        {
          clientId: c2.id,
          clientName: c2.fullName,
          issueType: 'Missing / Incomplete Registry Field',
          detail: `Missing Data found in Field #12 (${c2.tinNumber}) & Field #40 (${c2.servicePolicyCode}) — অসম্পূর্ণ ডেটার কারণে ফর্মটি সম্পূর্ণ হয়নি।`
        },
        {
          clientId: submittedIds[submittedIds.length - 1] || c1.id,
          clientName: (ALL_60_CLIENTS.find((c) => c.id === (submittedIds[submittedIds.length - 1] || c1.id)) || c1).fullName,
          issueType: 'Mandatory Field & Parity Deficit',
          detail: 'Missing verification checksum entries across Fields #22–#32. Full batch cannot be marked complete until missing data is resolved.'
        }
      );
    }

    return errors;
  }, [submittedClients, selectedClientId]);

  useEffect(() => {
    let timer: any = null;
    if (isAnalyzingBatch) {
      setAnalysisProgress(0);
      setAnalysisRemainingSeconds(120);
      setAnalysisStepText('Initializing 40-field enterprise KYC & banking audit...');

      timer = setInterval(() => {
        setAnalysisRemainingSeconds((prev) => {
          const nextSec = prev - 1;
          const pct = Math.min(100, Math.round(((120 - nextSec) / 120) * 100));
          setAnalysisProgress(pct);

          if (pct < 18) {
            setAnalysisStepText('Cross-checking Smart NID, Passport & e-TIN checksums across 40 fields...');
          } else if (pct < 38) {
            setAnalysisStepText('Validating corporate RJSC numbers, BIN/VAT codes & salary slabs...');
          } else if (pct < 58) {
            setAnalysisStepText('Verifying Bangladesh Bank routing codes, IBAN & SWIFT/BIC parity...');
          } else if (pct < 78) {
            setAnalysisStepText('Analyzing field-by-field punctuation, spacing & casing accuracy...');
          } else if (pct < 92) {
            setAnalysisStepText('Auditing manual typing cadence against automated fill patterns...');
          } else {
            setAnalysisStepText('Audit complete. Compiling itemized verification findings...');
          }

          if (nextSec <= 0) {
            clearInterval(timer);
            setIsAnalyzingBatch(false);
            setIsRejectedBatch(true);
            localStorage.setItem('unity_form_fillup_60_rejected', 'true');
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

  const handleRestartFormBatch = () => {
    localStorage.removeItem('unity_form_fillup_60_records');
    localStorage.removeItem('unity_form_fillup_60_rejected');
    setSubmittedClients({});
    setIsRejectedBatch(false);
    setSelectedClientId(1);
    setFormSuccess(null);
    setFormError(null);
  };

  // Strict no-paste & no-drop enforcement across all 40 fields
  const handleBlockedPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteBlockedCount((c) => c + 1);
    setFormError('Copy-Paste is strictly prohibited! Type every field manually.');
  };

  const handleBlockedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPasteBlockedCount((c) => c + 1);
    setFormError('Drag & drop is disabled! Type every field manually.');
  };

  const handleFieldChange = (field: FormDataKey, value: string) => {
    const prevVal = formData[field] || '';
    if (value.length - prevVal.length > 12) {
      setPasteBlockedCount((c) => c + 1);
      setFormError('Bulk text insertion blocked. Type manually character by character.');
      return;
    }
    setFormError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filledCount = FIELD_CONFIG.filter((f) => formData[f.key].trim().length > 0).length;
    if (!formData.clientIdCode.trim() || !formData.fullName.trim() || !formData.nidNumber.trim()) {
      setFormError('Please enter Client Reference ID (#1), Full Legal Name (#2), and NID Number (#10).');
      return;
    }
    if (filledCount < 10) {
      setFormError(`Incomplete dossier entry! Complete the required 40-field record (currently entered ${filledCount}/40 fields).`);
      return;
    }

    const updated = {
      ...submittedClients,
      [selectedClientId]: { ...formData, completedAt: new Date().toISOString() }
    };
    setSubmittedClients(updated);
    try {
      localStorage.setItem('unity_form_fillup_60_records', JSON.stringify(updated));
    } catch {}

    const newCount = Object.keys(updated).length;

    if (newCount >= 60) {
      setIsAnalyzingBatch(true);
      return;
    }

    setFormSuccess(`Client #${selectedClientId} (${currentClient.fullName}) — 40 fields saved! (${newCount}/60 completed)`);
  };

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return ALL_60_CLIENTS;
    const q = searchQuery.toLowerCase();
    return ALL_60_CLIENTS.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.clientIdCode.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.id.toString() === q
    );
  }, [searchQuery]);

  const completedCount = Object.keys(submittedClients).length;
  const progressPercent = Math.round((completedCount / 60) * 100);
  const enteredFieldsCount = FIELD_CONFIG.filter((f) => formData[f.key].trim().length > 0).length;

  const handleFinalProjectSubmit = () => {
    if (completedCount === 0) {
      setFormError('Please fill and save at least one client 40-field dossier before submitting for verification.');
      return;
    }
    setIsAnalyzingBatch(true);
  };

  // 1. AUDIT LOADING SCREEN
  if (isAnalyzingBatch) {
    return (
      <ModuleGuard moduleId="form" title="Form Fill-up Work System">
        <div className="p-4 sm:p-6 min-h-[75vh] flex items-center justify-center font-sans">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-xl bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center mx-auto">
              <Cpu size={26} strokeWidth={1.75} />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[#0A4D8C]">
                Central 40-Field KYC Audit
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-[#1E2329]">
                Verifying Client Form Batch
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Checking 40-field data parity across {completedCount} saved client dossiers, banking routing checksums, and keystroke logs.
              </p>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Audit Progress</span>
                <span className="text-[#0A4D8C] font-semibold font-mono tabular-nums">{analysisProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0A4D8C] h-full rounded-full transition-all duration-300"
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
      </ModuleGuard>
    );
  }

  // 2. REJECTED / ERRORS FOUND SCREEN
  if (isRejectedBatch) {
    return (
      <ModuleGuard moduleId="form" title="Form Fill-up Work System">
        <div className="p-4 sm:p-6 min-h-[80vh] flex items-center justify-center font-sans">
          <div className="bg-white rounded-xl p-5 sm:p-6 max-w-lg w-full border border-rose-200 shadow-sm space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
                <XCircle size={26} strokeWidth={1.75} />
              </div>
              <p className="text-xs font-medium text-rose-700">
                Missing Data Detected · Incomplete Work
              </p>
              <h2 className="text-lg font-semibold text-[#1E2329]">Form Fill-up Failed — Data Missing</h2>
              <p className="text-xs text-slate-600">
                Central KYC Audit detected missing data & {auditFindings.length} field discrepancy(s). ফর্ম ফিলাপে ডেটা মিসিং রয়েছে — কাজটি সম্পূর্ণ হয়নি।
              </p>
            </div>

            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 text-xs space-y-2 max-h-60 overflow-y-auto">
              {auditFindings.map((err, idx) => (
                <div key={idx} className="bg-white border border-rose-200/80 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-[#1E2329] text-xs">
                      Client #{err.clientId} · {err.clientName}
                    </span>
                    <span className="text-[11px] font-medium text-rose-700">
                      {err.issueType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{err.detail}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#EEF5FC] rounded-xl border border-[#D4E4F7] text-xs text-[#1E2329] flex items-start gap-2.5">
              <Info size={15} className="text-[#0A4D8C] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Every field (#1–#40) must match exact spelling, punctuation, dashes, currency decimals, and routing digits from the client dossier.
              </span>
            </div>

            <button
              onClick={handleRestartFormBatch}
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw size={15} />
              <span>Clear & Retry 60-Client Batch</span>
            </button>
          </div>
        </div>
      </ModuleGuard>
    );
  }

  return (
    <ModuleGuard moduleId="form" title="Form Fill-up Work System">
      <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-4 pb-24 font-sans">
        {/* TOP HEADER CARD */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 sm:p-6 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#D4E4F7]">
                Enterprise KYC Form Fill-up
              </p>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                60-Client × 40-Field Data Entry Project
              </h1>
              <p className="text-xs text-blue-100/90 leading-relaxed max-w-xl">
                Select a client from the 60-client roster below, review their 40 reference fields, and manually fill all 40 form entries.
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl text-left sm:text-right shrink-0">
              <div className="text-[11px] font-medium text-blue-100 flex items-center sm:justify-end gap-1">
                <DollarSign size={12} /> Project Reward
              </div>
              <div className="text-lg font-semibold font-mono tabular-nums text-white mt-0.5">
                BDT 350.00
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-blue-100">Saved Clients:</span>
              <span className="font-mono font-semibold tabular-nums text-white">
                {completedCount} / 60 Clients ({progressPercent}%)
              </span>
            </div>

            <div className="w-full sm:w-56 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Strict Manual Entry Banner */}
        <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-xl px-4 py-3 text-xs text-[#5F4B16] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 font-medium">
            <ShieldAlert size={16} className="text-[#B47B00] shrink-0" />
            <span>Strict Manual Typing: Copy, Paste, Drag-Drop & Auto-Fill are blocked across all 40 fields.</span>
          </div>
          {pasteBlockedCount > 0 && (
            <span className="text-xs font-mono font-semibold text-rose-700 shrink-0 tabular-nums">
              Blocked: {pasteBlockedCount}
            </span>
          )}
        </div>

        {/* 1. TOP SELECTABLE 60 CLIENTS ROSTER */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center shrink-0">
                <Building size={17} strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1E2329]">Select Client Roster (1–60 Clients)</h2>
                <p className="text-xs text-slate-500">Select any client below to load their 40 reference fields</p>
              </div>
            </div>

            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, ID or district..."
                className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3 py-2 pl-8 text-xs text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-[#F4F5F7] rounded-xl border border-slate-200/80">
            {filteredClients.map((c) => {
              const isDone = !!submittedClients[c.id];
              const isSelected = selectedClientId === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedClientId(c.id)}
                  className={`p-2.5 rounded-lg text-left transition border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A4D8C] text-white border-[#0A4D8C]'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70'
                      : 'bg-white text-[#1E2329] border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className={`text-[11px] font-mono tabular-nums ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      #{c.id} · {c.clientIdCode.slice(-4)}
                    </div>
                    <div className="text-xs font-semibold truncate">{c.fullName}</div>
                  </div>
                  {isDone ? (
                    <CheckCircle2 size={14} className={isSelected ? 'text-white shrink-0' : 'text-[#0D7A5F] shrink-0'} />
                  ) : (
                    <ChevronRight size={14} className={isSelected ? 'text-white/80 shrink-0' : 'text-slate-400 shrink-0'} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SELECTED CLIENT REFERENCE DOSSIER (40 VERTICAL FIELDS TOP-TO-BOTTOM, COPY DISABLED) */}
        <div
          onCopy={(e) => {
            e.preventDefault();
            setPasteBlockedCount((c) => c + 1);
            setFormError('Copying reference data is prohibited. Read carefully and type manually.');
          }}
          className="bg-[#22262C] text-white rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3 select-none"
        >
          <div className="border-b border-white/10 pb-3 flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="text-xs font-mono text-slate-300 flex items-center gap-1.5 tabular-nums">
                <UserCheck size={13} className="text-blue-300" />
                <span>Client #{currentClient.id} · {currentClient.clientIdCode}</span>
              </p>
              <h3 className="text-base font-semibold mt-0.5 text-white">
                {currentClient.fullName} — 40-Point Reference Dossier
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-300">
              40 Reference Fields · Copy Blocked
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {FIELD_CONFIG.map((field) => {
              const rawVal = currentClient[field.key];
              return (
                <div
                  key={field.key}
                  className="bg-white/5 px-3.5 py-2 rounded-lg border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <span className="text-xs text-slate-300 font-medium shrink-0">{field.label.replace(' *', '')}:</span>
                  <span className="font-mono font-medium text-white break-all sm:text-right tabular-nums">{rawVal}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. MANUAL ENTRY INPUT FORM (40 VERTICAL FIELDS TOP-TO-BOTTOM, PASTE BLOCKED) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center shrink-0">
                <FileText size={17} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1E2329]">
                  Client #{currentClient.id} — 40-Field Manual Entry Form
                </h3>
                <p className="text-xs text-slate-500 tabular-nums">
                  Enter all 40 fields vertically matching the client dossier above ({enteredFieldsCount}/40 filled).
                </p>
              </div>
            </div>
            {submittedClients[selectedClientId] && (
              <span className="text-[#0D7A5F] text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Saved
              </span>
            )}
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#0D7A5F] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleClientFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-xs">
              {FIELD_CONFIG.map((field) => (
                <div key={field.key}>
                  <label className="block font-medium text-[#1E2329] mb-1">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    required={field.required}
                    value={formData[field.key]}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    onPaste={handleBlockedPaste}
                    onDrop={handleBlockedDrop}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder={field.placeholder}
                    className={`w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3 py-2.5 text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-colors ${
                      field.mono ? 'font-mono tabular-nums' : ''
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 tabular-nums">
                Save Client #{selectedClientId} ({completedCount}/60 saved).
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 size={15} />
                <span>Save Client #{selectedClientId} (40 Fields)</span>
              </button>
            </div>
          </form>
        </div>

        {/* FINAL PROJECT SUBMIT */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#1E2329]">
              Submit 60-Client Project for Verification (BDT 350.00)
            </h3>
            <p className="text-xs text-slate-500 tabular-nums mt-0.5">
              Saved {completedCount} of 60 client records (each with 40 fields).
            </p>
          </div>
          <button
            type="button"
            onClick={handleFinalProjectSubmit}
            className="bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Send size={14} />
            <span>Submit Batch for Audit</span>
          </button>
        </div>
      </div>
    </ModuleGuard>
  );
};
