import * as XLSX from 'xlsx';

export interface DataEntryProjectDef {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  recordsCount: string;
  numericRecordsCount: number;
  estimatedHours: string;
  accentColor: string;
  iconName: string;
  summary: string;
  columns: string[];
  tasks: string[];
  cleaningInstructions: string[];
  expectedSheets: string[];
  fileName: string;
}

const CLIENT_MASTER_COLS = [
  'Client Ref ID',
  'Full Legal Name',
  'Father Name',
  'Mother Name',
  'Date of Birth',
  'National ID (NID)',
  'e-TIN Number',
  'Primary Mobile',
  'Emergency Phone',
  'Email Address',
  'Division',
  'District',
  'Thana / Upazila',
  'Present Address',
  'Post Code',
  'Occupation & Employer',
  'Monthly Income (BDT)',
  'Bank Name',
  'Bank Account No',
  'Routing Code',
  'KYC Status'
];

export const DATA_ENTRY_PROJECTS: DataEntryProjectDef[] = [
  {
    id: 'proj_sales_analysis',
    number: 1,
    title: 'Project 1: Sales Data Cleaning & Analysis',
    subtitle: 'High-Volume Enterprise Retail Client Transactions',
    category: 'Commercial Sales & Business Intelligence',
    difficulty: 'Advanced',
    recordsCount: '5,000+ Client Records',
    numericRecordsCount: 5000,
    estimatedHours: '8 - 12 Hours',
    accentColor: 'blue',
    iconName: 'TrendingUp',
    summary:
      'Analyze 5,000+ detailed retail client transactions including full NID, e-TIN, banking routing, address hierarchy, product SKUs, and profit margins. Clean dirty records, remove duplicates, apply formulas, and submit your Google Sheets / Excel link.',
    columns: [
      'Order ID',
      ...CLIENT_MASTER_COLS.slice(0, 12),
      'Present Address',
      'Bank Name',
      'Bank Account No',
      'Product ID',
      'Product Name',
      'Product Category',
      'Order Date',
      'Quantity',
      'Unit Price',
      'Discount',
      'BDT 50 Fee',
      'Total Amount',
      'Profit'
    ],
    tasks: [
      'Enter and organize all provided 5,000+ multi-field client & sales records in Google Sheets or Excel.',
      'Find and remove duplicate Order IDs using conditional formatting and Remove Duplicates.',
      'Standardize client names (PROPER case), NID lengths, mobile numbers (+880), dates (YYYY-MM-DD), and emails (lowercase).',
      'Verify banking routing numbers & e-TIN syntax across all customer settlement records.',
      'Calculate Total Amount using formula: Quantity * Unit Price * (1 - Discount) - 50 (Service Fee).',
      'Calculate Profit using formula: Total Amount - (Cost Price * Quantity).',
      'Sort sales from highest to lowest total revenue and segment by Division & District.',
      'Identify the top 20 high-value clients by total purchase volume and bank settlement.',
      'Prepare a monthly sales summary table using Pivot Tables or SUMIFS formulas.',
      'Upload completed workbook to Google Sheets / Drive and paste your shareable sheet link in Step 3.'
    ],
    cleaningInstructions: [
      'Duplicate Order IDs injected approximately every 37 rows.',
      'Phone numbers contain inconsistent prefixes (017..., 880-1..., +8801...).',
      'Email addresses contain extra whitespace and uppercase noise.',
      'Order dates mix DD/MM/YYYY and YYYY-MM-DD formats.'
    ],
    expectedSheets: [
      'Sales_Raw_Data',
      'Cleaned_Client_Sales',
      'Monthly_Summary',
      'Top_20_Clients',
      'Executive_Dashboard'
    ],
    fileName: 'Project_1_Sales_Client_Data_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_employee_attendance',
    number: 2,
    title: 'Project 2: Employee Attendance & Salary Processing',
    subtitle: 'Corporate HR Payroll & Full KYC Master Ledger',
    category: 'Human Resources & Payroll Accounting',
    difficulty: 'Advanced',
    recordsCount: '320 Staff × 3 Months (Extensive KYC)',
    numericRecordsCount: 960,
    estimatedHours: '10 - 14 Hours',
    accentColor: 'emerald',
    iconName: 'Users',
    summary:
      'Process corporate payroll with complete staff KYC profiles (NID, e-TIN, Parents, Addresses, Bank Account & Routing Codes) alongside 90-day attendance, overtime, fines, welfare deductions, and net salary calculations.',
    columns: [
      'Employee ID',
      'Full Legal Name',
      'Father Name',
      'National ID (NID)',
      'e-TIN Number',
      'Primary Mobile',
      'Email Address',
      'Department',
      'Designation',
      'Bank Name',
      'Bank Account No',
      'Routing Code',
      'Attendance Month',
      'Basic Salary',
      'Present Days',
      'Absent Days',
      'Late Days',
      'Overtime Hours',
      'Overtime Rate',
      'Bonus',
      'Fine',
      'Advance Deduction',
      'Gross Salary',
      'Net Salary'
    ],
    tasks: [
      'Enter all employee KYC master details (NID, e-TIN, Bank Account, Routing Code, Address) accurately across departments.',
      'Process the complete 3-month attendance logs across January, February, and March.',
      'Calculate overtime payment using Excel formula: Overtime Hours * Overtime Rate (1.5x hourly wage).',
      'Calculate Gross Salary: Basic Salary + (Basic * 0.40 House Rent) + (Basic * 0.15 Medical) + Overtime Pay + Bonus.',
      'Calculate deductions: Absent wage cuts, Late fines (1 day cut per 3 late days), BDT 50 staff welfare fee, and loan advances.',
      'Calculate Final Net Salary: Gross Salary - Total Deductions.',
      'Rank employees by attendance percentage: (Present Days / Working Days) * 100.',
      'Apply Conditional Formatting for Net Salary > 80,000 (green) and Absent > 3 (red).',
      'Submit your completed Excel / Google Sheet share link in Step 3.'
    ],
    cleaningInstructions: [
      'Corrupted text-formatted joining dates and mixed department capitalization.',
      'Intentional Employee ID typos every ~45 rows in January attendance.',
      'Empty Gross Salary and Net Salary cells requiring Excel formulas.'
    ],
    expectedSheets: [
      'Employee_KYC_Master',
      'Attendance_Records_Q1',
      'Processed_Payroll_Q1',
      'Department_Summary',
      'Attendance_Ranking'
    ],
    fileName: 'Project_2_Employee_KYC_Salary_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_ecommerce_inventory',
    number: 3,
    title: 'Project 3: E-Commerce Client Fulfillment & Inventory',
    subtitle: 'Multi-Sheet Client Dossiers, Orders & Supply Chain',
    category: 'Inventory Logistics & Warehouse Operations',
    difficulty: 'Expert',
    recordsCount: '2,000 SKUs & 8,000 Client Orders',
    numericRecordsCount: 10000,
    estimatedHours: '14 - 18 Hours',
    accentColor: 'indigo',
    iconName: 'Package',
    summary:
      'Coordinate multi-sheet e-commerce fulfillment linking detailed customer profiles (Full Address, NID/KYC, Bank Refund Account, Phones) with SKU inventory levels using VLOOKUP/XLOOKUP and margin calculations.',
    columns: [
      'Order ID',
      'Customer ID',
      'Full Legal Name',
      'Primary Mobile',
      'Email Address',
      'Division',
      'District',
      'Present Address',
      'Post Code',
      'Product ID',
      'Product Category',
      'Quantity',
      'Selling Price',
      'Discount',
      'Total Order Value',
      'Payment Method',
      'Order Status'
    ],
    tasks: [
      'Organize 2,000 Products and 8,000 multi-field Client Order records across linked sheets.',
      'Match Product IDs between Products_Master and Orders_Log using VLOOKUP / XLOOKUP.',
      'Standardize client shipping addresses, post codes, and contact numbers across Divisions.',
      'Calculate Total Order Value including discounts and BDT 50 packaging levy.',
      'Flag critically low-stock items where Current Stock <= Minimum Stock Level.',
      'Separate orders into Completed, Cancelled, Pending, and Returned sheets.',
      'Share your completed Google Sheets / Excel workbook URL in Step 3.'
    ],
    cleaningInstructions: [
      'SKU casing mismatches and trailing spaces across supplier logs.',
      'Empty Total Order Value cells every 7th order requiring formula evaluation.',
      'Cancelled orders requiring zero inventory deduction audit.'
    ],
    expectedSheets: [
      'Products_Master',
      'Orders_Client_Log',
      'Suppliers_Index',
      'Reorder_Alerts',
      'Sales_Dashboard'
    ],
    fileName: 'Project_3_Ecommerce_Client_Orders_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_financial_transactions',
    number: 4,
    title: 'Project 4: Financial Banking KYC & Transaction Audit',
    subtitle: 'High-Frequency Client Account & Forensic Ledger',
    category: 'Corporate Finance & Forensic Audit',
    difficulty: 'Master',
    recordsCount: '15,000+ Banking Client Records',
    numericRecordsCount: 15000,
    estimatedHours: '18 - 24 Hours',
    accentColor: 'teal',
    iconName: 'Receipt',
    summary:
      'Audit 15,000 banking client transactions complete with Full NID, e-TIN, Branch Routing Codes, SWIFT references, Deposit/Withdrawal columns, and AML compliance flags.',
    columns: [
      'Transaction ID',
      'Account ID',
      'Full Legal Name',
      'Father Name',
      'National ID (NID)',
      'e-TIN Number',
      'Primary Mobile',
      'Email Address',
      'Division',
      'District',
      'Bank Name',
      'Routing Code',
      'Transaction Date',
      'Transaction Time',
      'Transaction Type',
      'Amount (BDT)',
      'Deposit',
      'Withdrawal',
      'Transfer',
      'Reference Number',
      'Transaction Status'
    ],
    tasks: [
      'Import and structure all 15,000 banking client ledger rows into Excel / Google Sheets.',
      'Detect duplicate Reference Numbers (double debits) using COUNTIF.',
      'Use IF formulas to populate Deposit, Withdrawal, and Transfer split columns.',
      'Cross-verify client NID & e-TIN numbers for AML high-value transactions > BDT 2,50,000.',
      'Reconcile Branch-wise & Routing-wise total liquidity using SUMIFS.',
      'Submit your completed Google Sheets / Excel URL along with your screen recording.'
    ],
    cleaningInstructions: [
      'Deliberate duplicate reference codes every ~99 rows.',
      'Every 6th row leaves Deposit/Withdrawal/Transfer blank for formula entry.'
    ],
    expectedSheets: [
      'Financial_Transactions',
      'Duplicate_Anomalies',
      'Branch_Reconciliation',
      'AML_Compliance_Report'
    ],
    fileName: 'Project_4_Financial_KYC_Audit_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_microfinance',
    number: 5,
    title: 'Project 5: Microfinance Client KYC & Loan Recovery Ledger',
    subtitle: 'Extensive Borrower Identity & Weekly Installment Processing',
    category: 'Microfinance & Rural Banking Operations',
    difficulty: 'Advanced',
    recordsCount: '4,500 Detailed Client Profiles',
    numericRecordsCount: 4500,
    estimatedHours: '10 - 14 Hours',
    accentColor: 'rose',
    iconName: 'Building',
    summary:
      'Enter & audit 4,500 extensive microfinance borrower dossiers (Full Name, Parents, NID, Mobile, Village/District Address, Bank/MFS Account, Group Code) alongside 12.5% service charges, BDT 50 welfare deductions, and recovery ledgers.',
    columns: [
      'Borrower ID',
      'Group Code',
      'Full Legal Name',
      'Father Name',
      'Mother Name',
      'Date of Birth',
      'National ID (NID)',
      'Primary Mobile',
      'Emergency Phone',
      'Division',
      'District',
      'Present Address',
      'Bank / MFS Name',
      'Account No',
      'Disbursed Principal',
      'Service Charge (12.5%)',
      'Total Payable',
      'Weekly Installment',
      'Weeks Paid',
      'Welfare Fee (BDT 50)',
      'Bonus Waiver',
      'Outstanding Balance',
      'Overdue Weeks',
      'Group Status'
    ],
    tasks: [
      'Clean and verify all 4,500 borrower KYC details (NID, Mobile, Address, Bank/MFS).',
      'Calculate Service Charge (12.5%) and Total Payable = Principal * 1.125.',
      'Calculate Weekly Installment = Total Payable / 46 Weeks.',
      'Deduct mandatory BDT 50 Emergency Welfare Fee and apply 5% Early Bonus Waiver if Overdue Weeks == 0.',
      'Compute Outstanding Balance and highlight Overdue Weeks >= 4 in red.',
      'Submit your finished Excel / Google Sheets link in Step 3.'
    ],
    cleaningInstructions: [
      'Duplicate NID entries across neighboring village credit groups.',
      'Phone numbers with missing country prefix requiring +880 formatting.'
    ],
    expectedSheets: ['Raw_Dataset', 'Processed_Installment_Ledger', 'Group_Recovery_Summary', 'Risk_Defaulters_List'],
    fileName: 'Project_5_Microfinance_Client_Ledger_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_hospital_billing',
    number: 6,
    title: 'Project 6: Healthcare Patient KYC & Insurance Claims',
    subtitle: 'Detailed Clinical Patient Dossier & Billing Reconciliation',
    category: 'Healthcare Analytics & Medical Billing',
    difficulty: 'Expert',
    recordsCount: '3,800 Full Patient Records',
    numericRecordsCount: 3800,
    estimatedHours: '12 - 16 Hours',
    accentColor: 'sky',
    iconName: 'Receipt',
    summary:
      'Audit 3,800 comprehensive hospital inpatient profiles (Full Name, Parents, DOB, NID, Emergency Contact, Address, Bank Settlement Details) plus bed charges, labs, pharmacy, 20% TPA insurance caps, and BDT 50 diagnostic levy.',
    columns: [
      'Patient ID',
      'Full Legal Name',
      'Father Name',
      'Date of Birth',
      'National ID (NID)',
      'Primary Mobile',
      'Emergency Phone',
      'Email Address',
      'District',
      'Present Address',
      'Bank Name',
      'Bank Account No',
      'Admission Date',
      'Discharge Date',
      'Ward Type',
      'Bed Charges',
      'Lab Tests',
      'Pharmacy Total',
      'Surgical Fee',
      'Subtotal Bill',
      'Insurance Coverage (20%)',
      'Diagnostic Levy (BDT 50)',
      'Senior Discount',
      'Final Payable',
      'Payment Status'
    ],
    tasks: [
      'Verify full patient KYC contact, emergency guardian phone, and NID records.',
      'Calculate Length of Stay (LOS) = Discharge Date - Admission Date.',
      'Compute Subtotal Bill and apply 20% Insurance Coverage (capped at BDT 50,000).',
      'Add BDT 50 Diagnostic Levy and compute Final Patient Payable.',
      'Share your completed Google Sheets / Excel URL in Step 3.'
    ],
    cleaningInstructions: [
      'Some discharge timestamps inverted earlier than admission dates.',
      'Empty Subtotal Bill and Final Payable rows requiring Excel formulas.'
    ],
    expectedSheets: ['Raw_Dataset', 'Audited_Hospital_Ledger', 'Insurance_Claim_Summary', 'Ward_Occupancy_Report'],
    fileName: 'Project_6_Hospital_Patient_Claims_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_distributor_sales',
    number: 7,
    title: 'Project 7: FMCG Distributor KYC & Commission Ledger',
    subtitle: 'Nationwide Dealer Dossiers & Commission Settlements',
    category: 'Supply Chain & Commercial Distribution',
    difficulty: 'Advanced',
    recordsCount: '6,200 Dealer Shipments',
    numericRecordsCount: 6200,
    estimatedHours: '11 - 15 Hours',
    accentColor: 'amber',
    iconName: 'TrendingUp',
    summary:
      'Reconcile nationwide FMCG distributor KYC profiles (Dealer Owner Name, e-TIN, BIN/NID, Phones, Office Address, Bank Routing Codes) with wholesale target achievements, 6.5% commission, 3% bonus, and BDT 50 logistics levy.',
    columns: [
      'Invoice No',
      'Distributor Code',
      'Full Legal Name',
      'National ID (NID)',
      'e-TIN Number',
      'Primary Mobile',
      'Email Address',
      'Division',
      'District',
      'Present Address',
      'Bank Name',
      'Bank Account No',
      'Routing Code',
      'Territory',
      'Product Line',
      'Target Volume',
      'Actual Sales (BDT)',
      'Base Commission (6.5%)',
      'Target Achievement %',
      'Incentive Bonus (3%)',
      'Damage Penalty',
      'Logistics Fee (BDT 50)',
      'Net Commission Payable'
    ],
    tasks: [
      'Verify distributor NID, e-TIN, and bank routing codes for EFT commission disbursement.',
      'Calculate Target Achievement % and 6.5% Base Commission.',
      'Apply IF condition: 3% Incentive Bonus if Achievement >= 100%, else 0.',
      'Deduct BDT 50 Logistics Fee and Damage Penalties to find Net Commission Payable.',
      'Paste your completed Excel / Google Sheet link in Step 3.'
    ],
    cleaningInstructions: [
      'Mixed territory capitalization and unformatted mobile numbers.',
      'Empty Net Commission Payable formulas every 8th invoice.'
    ],
    expectedSheets: ['Raw_Dataset', 'Cleaned_Commission_Ledger', 'Top_Distributors_Ranking', 'Territory_Performance'],
    fileName: 'Project_7_FMCG_Distributor_KYC_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_telecom_cdr',
    number: 8,
    title: 'Project 8: Telecom Subscriber KYC & CDR Tax Audit',
    subtitle: 'Full Biometric SIM Holder Profiles & Traffic Billing',
    category: 'Telecommunications & Regulatory Billing',
    difficulty: 'Master',
    recordsCount: '12,000 Subscriber CDRs',
    numericRecordsCount: 12000,
    estimatedHours: '16 - 22 Hours',
    accentColor: 'purple',
    iconName: 'Receipt',
    summary:
      'Audit cellular CDR logs linked with biometric SIM subscriber KYC profiles (Name, Parents, DOB, NID, Permanent Address, MSISDN, Bank/MFS) alongside 15% Supplementary Duty, 5% VAT, and BDT 50 regulatory levy.',
    columns: [
      'Call Session ID',
      'MSISDN Number',
      'Full Legal Name',
      'Father Name',
      'National ID (NID)',
      'Date of Birth',
      'Division',
      'District',
      'Present Address',
      'Call Type',
      'Duration (Seconds)',
      'Data Volume (MB)',
      'Base Tariff (BDT)',
      'Supplementary Duty (15%)',
      'VAT (5%)',
      'Promo Credit',
      'Regulatory Levy (BDT 50)',
      'Total Charged Amount',
      'Tower Location'
    ],
    tasks: [
      'Standardize all MSISDN subscriber numbers and verify biometric NID KYC mapping.',
      'Compute Base Tariff, 15% Supplementary Duty, and 5% compounded VAT.',
      'Apply BDT 50 regulatory SIM levy and compute Total Charged Amount.',
      'Filter zero-duration call drops and summarize by Tower Location.',
      'Submit your finished Google Sheets / Excel URL in Step 3.'
    ],
    cleaningInstructions: [
      'Mixed MSISDN prefixes (018..., +88018..., 88018...).',
      'Blank Total Charged Amount cells requiring formula completion.'
    ],
    expectedSheets: ['Raw_Dataset', 'Processed_Telecom_Ledger', 'Tax_SD_VAT_Summary', 'Tower_Traffic_Report'],
    fileName: 'Project_8_Telecom_KYC_CDR_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_garments_piece_rate',
    number: 9,
    title: 'Project 9: RMG Factory Worker KYC & Piece-Rate Payroll',
    subtitle: 'Full Garment Operator Dossiers & Weekly Floor Wages',
    category: 'Apparel Manufacturing & Industrial Labor Accounting',
    difficulty: 'Advanced',
    recordsCount: '3,200 Worker Profiles',
    numericRecordsCount: 3200,
    estimatedHours: '9 - 13 Hours',
    accentColor: 'teal',
    iconName: 'Users',
    summary:
      'Process weekly RMG sewing line wages complete with full worker KYC details (NID, Parents, Emergency Phone, Present/Permanent Address, Bank/MFS Account) plus piece-rate earnings, 1.5x overtime, bonuses, and BDT 50 meal subsidy.',
    columns: [
      'Worker ID',
      'Sewing Line No',
      'Full Legal Name',
      'Father Name',
      'Mother Name',
      'National ID (NID)',
      'Primary Mobile',
      'Emergency Phone',
      'District',
      'Present Address',
      'Bank / MFS Name',
      'Account No',
      'Garment Style',
      'Completed Pieces',
      'Rate Per Piece (BDT)',
      'Base Piece Earning',
      'Overtime Hours',
      'OT Earning',
      'Target Bonus',
      'Canteen Subsidy (BDT 50)',
      'Net Payable (BDT)'
    ],
    tasks: [
      'Validate worker NID numbers, emergency family contacts, and MFS/Bank payroll accounts.',
      'Compute Base Piece Earning = Completed Pieces * Rate Per Piece.',
      'Add 1.5x Overtime Earnings and BDT 500 Bonus if Completed Pieces >= 1,200.',
      'Subtract BDT 50 Canteen Meal Subsidy to compute final Net Payable.',
      'Submit your completed Excel / Google Sheet link in Step 3.'
    ],
    cleaningInstructions: [
      'Trailing whitespace in Garment Style codes.',
      'Empty Net Payable cells requiring wage formulas.'
    ],
    expectedSheets: ['Raw_Dataset', 'Processed_Worker_Payroll', 'Line_Efficiency_Summary', 'Defect_Audit_Log'],
    fileName: 'Project_9_RMG_Worker_KYC_Payroll_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_real_estate',
    number: 10,
    title: 'Project 10: Real Estate Client Dossiers & Escrow Ledger',
    subtitle: 'High-Value Property Buyer KYC & 36-Month Installment Schedule',
    category: 'Real Estate Investment & Escrow Management',
    difficulty: 'Master',
    recordsCount: '1,500 Investor Portfolios',
    numericRecordsCount: 1500,
    estimatedHours: '14 - 18 Hours',
    accentColor: 'emerald',
    iconName: 'Building',
    summary:
      'Audit 1,500 luxury condominium investor dossiers containing complete KYC identity, e-TIN, Passport/NID, Nominee, Corporate Employer, and Bank SWIFT info alongside 36-month escrow schedules, late surcharges, and BDT 50 registry fees.',
    columns: [
      'Booking ID',
      'Apartment Unit',
      'Project Name',
      'Full Legal Name',
      'Father Name',
      'Spouse / Nominee Name',
      'National ID (NID)',
      'e-TIN Number',
      'Primary Mobile',
      'Email Address',
      'District',
      'Present Address',
      'Occupation & Employer',
      'Bank Name',
      'Bank Account No',
      'Routing Code',
      'Total Apartment Price',
      'Down Payment (20%)',
      'Remaining Balance',
      'Monthly Installment (36 Mo)',
      'Installments Paid',
      'Total Paid to Date',
      'Overdue Installments',
      'Late Surcharge (2%)',
      'Early Rebate Bonus',
      'Registry Fee (BDT 50)',
      'Current Escrow Balance'
    ],
    tasks: [
      'Verify full investor KYC profiles, nominee mappings, e-TINs, and bank routing codes.',
      'Compute 20% Down Payment, Remaining Balance, and 36-Month Installment.',
      'Calculate 2% Late Surcharges, 5% Early Advance Rebates, and deduct BDT 50 Title Registry Fee.',
      'Reconcile Current Escrow Balance for all 1,500 apartment units.',
      'Submit your completed Google Sheets / Excel link and Screen Recording video in Step 3.'
    ],
    cleaningInstructions: [
      'Duplicate apartment unit allocations and blank escrow total cells.',
      'Unformatted client phone numbers requiring +880 standardization.'
    ],
    expectedSheets: ['Raw_Dataset', 'Installment_Schedule_Ledger', 'Escrow_Vault_Summary', 'Overdue_Notices_List'],
    fileName: 'Project_10_Real_Estate_Client_Escrow_Raw_Dataset.xlsx'
  }
];

// --- REALISTIC ENTERPRISE CLIENT DATA GENERATORS ---

const FIRST_NAMES = [
  'Mohammad', 'Fatima', 'Tanvir', 'Sumaiya', 'Rakib', 'Farhana', 'Arif', 'Sadia',
  'Nazmul', 'Nusrat', 'Sabbir', 'Jannatul', 'Shakil', 'Khadija', 'Rifat', 'Priyanka',
  'Mehedi', 'Mahfuza', 'Touhid', 'Rubina', 'Sayed', 'Anika', 'Mahir', 'Tasnim',
  'Imran', 'Zannat', 'Fahim', 'Mim', 'Nayeem', 'Shampa', 'Ashiq', 'Maliha',
  'Shorif', 'Sabina', 'Sajib', 'Rokeya', 'Hasan', 'Laboni', 'Shohel', 'Nadia'
];

const LAST_NAMES = [
  'Ahmed', 'Rahman', 'Islam', 'Hasan', 'Chowdhury', 'Hossain', 'Akter', 'Begum',
  'Khan', 'Sultana', 'Uddin', 'Mahmud', 'Khatun', 'Miah', 'Alam', 'Ali',
  'Biswas', 'Das', 'Roy', 'Talukder', 'Sarker', 'Bhuiyan', 'Mondal', 'Haque'
];

const FATHERS = ['Md. Abdur Rahman', 'Md. Abdul Malek', 'Kazi Nazrul Islam', 'Md. Sirajul Haque', 'Dr. Mozammel Haque', 'Haji Abdul Aziz'];
const MOTHERS = ['Mst. Sufia Begum', 'Jahanara Akter', 'Rabeya Khatun', 'Fatema Begum', 'Sultana Razia', 'Hosne Ara Begum'];
const DIVISIONS = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];
const DISTRICTS = ['Dhaka Sadar', 'Chattogram Port', 'Sylhet Sadar', 'Rajshahi City', 'Khulna South', 'Barishal Sadar', 'Gazipur', 'Narayanganj', 'Cumilla', 'Bogura'];
const THANAS = ['Gulshan', 'Banani', 'Motijheel', 'Uttara West', 'Dhanmondi', 'Agrabad', 'Zindabazar', 'Sonadanga', 'Mirpur'];
const EMPLOYERS = ['Meghna Tech Ltd.', 'Apex Digital PLC', 'Bengal Logistics', 'Padma Holdings', 'Prime Enterprise', 'Delta Agro Ind.'];
const BANKS = ['Dutch-Bangla Bank PLC', 'BRAC Bank PLC', 'Islami Bank Bangladesh', 'City Bank PLC', 'Eastern Bank PLC', 'Sonali Bank PLC'];
const BRANCHES = ['Motijheel Corporate', 'Gulshan Premier', 'Dhanmondi Central', 'Agrabad Commercial', 'GEC Circle', 'Zindabazar', 'Uttara Sector 7'];
const DEPARTMENTS = ['Information Technology', 'Sales & Distribution', 'Finance & Accounts', 'Human Resources', 'Operations & Logistics', 'Customer Care'];
const PRODUCT_CATEGORIES = ['Electronics & Gadgets', 'Office Stationery', 'Home Appliances', 'Computer Hardware', 'Packaging Materials', 'Industrial Tools'];
const PAYMENT_METHODS = ['bKash Merchant', 'Nagad Pay', 'Rocket Banking', 'Bank Transfer (EFT)', 'Visa / Mastercard', 'Cash on Delivery'];
const ORDER_STATUSES = ['Delivered', 'Completed', 'Processing', 'In Transit', 'Pending Review', 'Cancelled', 'Returned'];

function seededPick<T>(arr: T[], idx: number, salt = 0): T {
  return arr[(idx * 7 + salt * 13) % arr.length];
}

function seededInt(min: number, max: number, idx: number, salt = 1): number {
  const span = max - min + 1;
  const val = ((idx * 2654435761 + salt * 97531) >>> 0) % span;
  return min + val;
}

function buildClientProfile(i: number) {
  const fName = seededPick(FIRST_NAMES, i, 1);
  const lName = seededPick(LAST_NAMES, i, 2);
  const fullName = `${fName} ${lName}`;
  const father = seededPick(FATHERS, i, 3);
  const mother = seededPick(MOTHERS, i, 4);
  const division = seededPick(DIVISIONS, i, 5);
  const district = seededPick(DISTRICTS, i, 6);
  const thana = seededPick(THANAS, i, 7);
  const employer = seededPick(EMPLOYERS, i, 8);
  const bank = seededPick(BANKS, i, 9);

  let phone = `+88017${String(11000000 + ((i * 94321) % 88000000)).padStart(8, '0')}`;
  if (i % 23 === 0) phone = `017${phone.slice(6)}`;
  if (i % 47 === 0) phone = `880-17${phone.slice(6)}`;

  let email = `${fName.toLowerCase()}.${lName.toLowerCase()}${10 + (i % 89)}@gmail.com`;
  if (i % 31 === 0) email = ` ${email.toUpperCase()} `;

  const emergencyPhone = `+88018${String(22000000 + ((i * 73129) % 77000000)).padStart(8, '0')}`;
  const nid = `19${80 + (i % 19)}${String(1042000000 + ((i * 876543) % 8900000000)).padStart(10, '0')}`;
  const tin = `5894-${String(1000 + (i * 47) % 8999)}-${String(4100 + (i * 83) % 5899)}`;
  const dob = `${1978 + (i % 20)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`;
  const presentAddress = `House #${(i % 45) + 1}, Road #${(i % 18) + 1}, ${thana}, ${district}`;
  const postCode = String(1200 + ((i * 43) % 7500));
  const accountNo = String(1041000000000 + ((i * 987654321) % 8900000000000));
  const routingCode = `095${String(102400 + ((i * 137) % 890000)).padStart(6, '0')}`;
  const monthlyIncome = 38000 + ((i * 2750) % 145000);

  return {
    clientRef: `CLT-2026-${String(10000 + i)}`,
    fullName,
    father,
    mother,
    dob,
    nid,
    tin,
    phone,
    emergencyPhone,
    email,
    division,
    district,
    thana,
    presentAddress,
    postCode,
    occupation: `${seededPick(['Executive', 'Manager', 'Director', 'Engineer', 'Merchant'], i, 10)} (${employer})`,
    monthlyIncome,
    bank,
    accountNo,
    routingCode,
    kycStatus: i % 19 === 0 ? 'Pending Re-Verification' : 'Verified KYC'
  };
}

// Generate Realistic Project 1 Sales Dataset (5,050 rows with rich client KYC details)
export function generateProject1Dataset(limit = 5050): any[] {
  const rows: any[] = [];
  for (let i = 1; i <= limit; i++) {
    const c = buildClientProfile(i);
    const category = seededPick(PRODUCT_CATEGORIES, i, 11);
    const prodNum = seededInt(100, 250, i, 2);
    const prodName = `${category.split(' ')[0]} Model Pro-${prodNum}`;
    const qty = seededInt(1, 25, i, 3);
    const unitPrice = seededInt(450, 18500, i, 4);
    const discount = seededInt(0, 4, i, 5) * 0.05;
    const totalCalc = Math.round(qty * unitPrice * (1 - discount)) - 50;
    const costPrice = Math.round(unitPrice * 0.72);
    const profitCalc = totalCalc - costPrice * qty;

    const isDup = i > 100 && i % 37 === 0;
    const orderId = isDup ? `ORD-2026-${String(i - 30).padStart(5, '0')}` : `ORD-2026-${String(i).padStart(5, '0')}`;
    let orderDate = `2026-${String(seededInt(1, 6, i, 6)).padStart(2, '0')}-${String(seededInt(1, 28, i, 7)).padStart(2, '0')}`;
    if (i % 41 === 0) {
      const p = orderDate.split('-');
      orderDate = `${p[2]}/${p[1]}/${p[0]}`;
    }

    rows.push({
      'Order ID': orderId,
      'Client Ref ID': c.clientRef,
      'Full Legal Name': i % 19 === 0 ? c.fullName.toLowerCase() : c.fullName,
      'Father Name': c.father,
      'Mother Name': c.mother,
      'Date of Birth': c.dob,
      'National ID (NID)': c.nid,
      'e-TIN Number': c.tin,
      'Primary Mobile': c.phone,
      'Emergency Phone': c.emergencyPhone,
      'Email Address': c.email,
      'Division': c.division,
      'District': c.district,
      'Present Address': c.presentAddress,
      'Bank Name': c.bank,
      'Bank Account No': c.accountNo,
      'Product ID': `PRD-${category.substring(0, 3).toUpperCase()}-${prodNum}`,
      'Product Name': prodName,
      'Product Category': category,
      'Order Date': orderDate,
      'Quantity': qty,
      'Unit Price': unitPrice,
      'Discount': `${Math.round(discount * 100)}%`,
      'BDT 50 Fee': 50,
      'Total Amount': i % 10 === 0 ? '' : totalCalc,
      'Profit': i % 8 === 0 ? '' : profitCalc
    });
  }
  return rows;
}

// Generate Realistic Project 2 Employee Attendance Dataset (320 employees x 3 months with full KYC)
export function generateProject2Datasets(empLimit = 320): { employees: any[]; attendance: any[] } {
  const employees: any[] = [];
  const attendance: any[] = [];

  for (let i = 1; i <= empLimit; i++) {
    const c = buildClientProfile(i);
    const dept = seededPick(DEPARTMENTS, i, 12);
    const basic = seededInt(24000, 95000, i, 8);
    const empId = `EMP-${String(1000 + i)}`;

    employees.push({
      'Employee ID': empId,
      'Full Legal Name': c.fullName,
      'Father Name': c.father,
      'Mother Name': c.mother,
      'Date of Birth': c.dob,
      'National ID (NID)': c.nid,
      'e-TIN Number': c.tin,
      'Primary Mobile': c.phone,
      'Email Address': c.email,
      'Present Address': c.presentAddress,
      'Department': dept,
      'Designation': `${dept.split(' ')[0]} Executive L${seededInt(1, 4, i, 9)}`,
      'Joining Date': `202${seededInt(1, 5, i, 10)}-${String(seededInt(1, 12, i, 11)).padStart(2, '0')}-01`,
      'Basic Salary': basic,
      'Bank Name': c.bank,
      'Bank Account No': c.accountNo,
      'Routing Code': c.routingCode
    });

    const months = ['January 2026', 'February 2026', 'March 2026'];
    months.forEach((m, mIdx) => {
      const workingDays = 26;
      const present = seededInt(20, 26, i + mIdx, 12);
      const absent = workingDays - present;
      const late = seededInt(0, 5, i + mIdx, 13);
      const otHours = seededInt(0, 36, i + mIdx, 14);
      const otRate = Math.round((basic / (26 * 8)) * 1.5);
      const otPay = otHours * otRate;
      const bonus = mIdx === 2 ? Math.round(basic * 0.25) : 0;
      const fine = late >= 3 ? Math.round(basic / 26) : 0;
      const advance = i % 7 === 0 ? seededInt(2000, 10000, i, 15) : 0;
      const gross = Math.round(basic + basic * 0.4 + basic * 0.15 + otPay + bonus);
      const net = gross - fine - advance - 50 - Math.round((basic / 26) * absent);

      attendance.push({
        'Record ID': `ATT-${empId}-${m.substring(0, 3)}`,
        'Employee ID': i % 45 === 0 && mIdx === 0 ? `EMP-${String(1000 + i - 1)}` : empId,
        'Full Legal Name': c.fullName,
        'Father Name': c.father,
        'National ID (NID)': c.nid,
        'e-TIN Number': c.tin,
        'Primary Mobile': c.phone,
        'Email Address': c.email,
        'Department': i % 30 === 0 ? dept.toUpperCase() : dept,
        'Bank Name': c.bank,
        'Bank Account No': c.accountNo,
        'Routing Code': c.routingCode,
        'Attendance Month': m,
        'Basic Salary': basic,
        'Present Days': present,
        'Absent Days': absent,
        'Late Days': late,
        'Overtime Hours': otHours,
        'Overtime Rate': otRate,
        'Bonus': bonus,
        'Fine': fine,
        'Advance Deduction': advance,
        'Gross Salary': i % 6 === 0 ? '' : gross,
        'Net Salary': i % 5 === 0 ? '' : net
      });
    });
  }

  return { employees, attendance };
}

// Generate Realistic Project 3 E-Commerce Inventory & Client Orders
export function generateProject3Datasets(prodLimit = 2000, orderLimit = 8000): {
  products: any[];
  orders: any[];
  suppliers: any[];
} {
  const suppliers = [
    { 'Supplier ID': 'SUP-001', 'Supplier Name': 'Apex Digital Supplies Ltd', 'Contact Person': 'Rafiqul Islam', 'Phone': '+8801711223344', 'Location': 'Dhaka EPZ', 'Rating': '4.8/5' },
    { 'Supplier ID': 'SUP-002', 'Supplier Name': 'Bengal Tech Components', 'Contact Person': 'Nasrin Akhter', 'Phone': '+8801811556677', 'Location': 'Chattogram Bay', 'Rating': '4.6/5' },
    { 'Supplier ID': 'SUP-003', 'Supplier Name': 'Meghna Global Trade', 'Contact Person': 'Tareq Mahmud', 'Phone': '+8801911889900', 'Location': 'Narayanganj Port', 'Rating': '4.9/5' },
    { 'Supplier ID': 'SUP-004', 'Supplier Name': 'Padma Office Solutions', 'Contact Person': 'Farid Hossain', 'Phone': '+8801611334455', 'Location': 'Gazipur Industrial Area', 'Rating': '4.7/5' },
    { 'Supplier ID': 'SUP-005', 'Supplier Name': 'Karnaphuli Express Import', 'Contact Person': 'Sabina Yasmin', 'Phone': '+8801511224466', 'Location': 'Khatunganj Hub', 'Rating': '4.5/5' }
  ];

  const products: any[] = [];
  for (let i = 1; i <= prodLimit; i++) {
    const cat = seededPick(PRODUCT_CATEGORIES, i, 16);
    const purchase = seededInt(350, 14000, i, 17);
    const selling = Math.round(purchase * 1.28);
    const stock = seededInt(0, 150, i, 18);
    const minStock = seededInt(15, 30, i, 19);
    const sold = seededInt(5, 200, i, 20);

    products.push({
      'Product ID': `SKU-${String(10000 + i)}`,
      'Product Name': `${cat.split(' ')[0]} Series-${i}`,
      'Category': cat,
      'Brand': `Brand-${(i % 18) + 1}`,
      'Supplier ID': suppliers[i % suppliers.length]['Supplier ID'],
      'Purchase Price': purchase,
      'Selling Price': selling,
      'Current Stock': stock,
      'Minimum Stock Level': minStock,
      'Sold Quantity': sold,
      'Product Status': stock === 0 ? 'Out of Stock' : stock <= minStock ? 'Low Stock Alert' : 'In Stock'
    });
  }

  const orders: any[] = [];
  for (let j = 1; j <= orderLimit; j++) {
    const c = buildClientProfile(j);
    const matchedProd = products[(j * 13) % products.length];
    const qty = seededInt(1, 8, j, 21);
    const discount = seededInt(0, 3, j, 22) * 0.05;
    const sellingPrice = matchedProd['Selling Price'];
    const totalOrderValue = Math.round(qty * sellingPrice * (1 - discount)) + 50;

    orders.push({
      'Order ID': `ECO-2026-${String(j).padStart(6, '0')}`,
      'Customer ID': c.clientRef,
      'Full Legal Name': c.fullName,
      'Primary Mobile': c.phone,
      'Email Address': c.email,
      'Division': c.division,
      'District': c.district,
      'Present Address': c.presentAddress,
      'Post Code': c.postCode,
      'Product ID': matchedProd['Product ID'],
      'Product Category': matchedProd['Category'],
      'Quantity': qty,
      'Selling Price': sellingPrice,
      'Discount': `${Math.round(discount * 100)}%`,
      'Total Order Value': j % 7 === 0 ? '' : totalOrderValue,
      'Payment Method': seededPick(PAYMENT_METHODS, j, 23),
      'Order Status': seededPick(ORDER_STATUSES, j, 24)
    });
  }

  return { products, orders, suppliers };
}

// Generate Realistic Project 4 Financial Transactions (15,000 rows with full client KYC)
export function generateProject4Dataset(limit = 15000): any[] {
  const transactions: any[] = [];
  for (let i = 1; i <= limit; i++) {
    const c = buildClientProfile(i);
    const tType = seededPick(['Deposit', 'Withdrawal', 'Transfer', 'Online Payment', 'POS Terminal'], i, 25);
    const amount = seededInt(1500, 450000, i, 26);

    let dep = 0;
    let withdr = 0;
    let trf = 0;
    if (tType === 'Deposit') dep = amount;
    else if (tType === 'Withdrawal' || tType === 'POS Terminal') withdr = amount;
    else trf = amount;

    const isRefDup = i > 150 && i % 99 === 0;
    const refNum = isRefDup ? `TXN-REF-${String(i - 80).padStart(7, '0')}` : `TXN-REF-${String(i).padStart(7, '0')}`;

    const hr = String(seededInt(9, 21, i, 27)).padStart(2, '0');
    const min = String(seededInt(0, 59, i, 28)).padStart(2, '0');
    const sec = String(seededInt(0, 59, i, 29)).padStart(2, '0');

    transactions.push({
      'Transaction ID': `FT-${20260000 + i}`,
      'Account ID': `ACC-${c.accountNo.slice(0, 6)}`,
      'Full Legal Name': c.fullName,
      'Father Name': c.father,
      'National ID (NID)': c.nid,
      'e-TIN Number': c.tin,
      'Primary Mobile': c.phone,
      'Email Address': c.email,
      'Division': c.division,
      'District': c.district,
      'Bank Name': c.bank,
      'Routing Code': c.routingCode,
      'Transaction Date': `2026-${String(seededInt(1, 4, i, 30)).padStart(2, '0')}-${String(seededInt(1, 28, i, 31)).padStart(2, '0')}`,
      'Transaction Time': `${hr}:${min}:${sec}`,
      'Transaction Type': tType,
      'Amount (BDT)': amount,
      'Deposit': i % 6 === 0 ? '' : dep,
      'Withdrawal': i % 6 === 0 ? '' : withdr,
      'Transfer': i % 6 === 0 ? '' : trf,
      'Reference Number': refNum,
      'Transaction Status': i % 300 === 0 ? 'Flagged for Review' : i % 150 === 0 ? 'Failed' : 'Settled'
    });
  }
  return transactions;
}

// Generate Rich Client-Centric Domain Datasets for Projects 5 to 10 (Zero generic placeholders!)
export function generateProject5To10Dataset(projectId: string, limit = 1500): any[] {
  const rows: any[] = [];

  for (let i = 1; i <= limit; i++) {
    const c = buildClientProfile(i);

    if (projectId === 'proj_microfinance') {
      const principal = seededInt(15000, 120000, i, 32);
      const serviceCharge = Math.round(principal * 0.125);
      const totalPayable = principal + serviceCharge;
      const weeklyInstallment = Math.round(totalPayable / 46);
      const weeksPaid = seededInt(5, 44, i, 33);
      const overdue = i % 9 === 0 ? seededInt(2, 6, i, 34) : 0;
      const bonusWaiver = overdue === 0 ? Math.round(totalPayable * 0.05) : 0;
      const outstanding = Math.max(0, totalPayable - weeksPaid * weeklyInstallment - bonusWaiver - 50);

      rows.push({
        'Borrower ID': `MFI-${String(20000 + i)}`,
        'Group Code': `GRP-${c.division.slice(0, 3).toUpperCase()}-${100 + (i % 45)}`,
        'Full Legal Name': c.fullName,
        'Father Name': c.father,
        'Mother Name': c.mother,
        'Date of Birth': c.dob,
        'National ID (NID)': c.nid,
        'Primary Mobile': c.phone,
        'Emergency Phone': c.emergencyPhone,
        'Division': c.division,
        'District': c.district,
        'Present Address': c.presentAddress,
        'Bank / MFS Name': i % 2 === 0 ? 'bKash MFS' : c.bank,
        'Account No': c.accountNo,
        'Disbursed Principal': principal,
        'Service Charge (12.5%)': serviceCharge,
        'Total Payable': i % 8 === 0 ? '' : totalPayable,
        'Weekly Installment': weeklyInstallment,
        'Weeks Paid': weeksPaid,
        'Welfare Fee (BDT 50)': 50,
        'Bonus Waiver': bonusWaiver,
        'Outstanding Balance': i % 10 === 0 ? '' : outstanding,
        'Overdue Weeks': overdue,
        'Group Status': overdue >= 4 ? 'Critical Risk' : overdue > 0 ? 'Watchlist' : 'Active Good'
      });
    } else if (projectId === 'proj_hospital_billing') {
      const los = seededInt(2, 18, i, 35);
      const bedRate = seededPick([2500, 4500, 8000, 14000], i, 36);
      const bedCharges = los * bedRate;
      const labTests = seededInt(1800, 24000, i, 37);
      const pharmacy = seededInt(1200, 35000, i, 38);
      const surgical = i % 3 === 0 ? seededInt(25000, 120000, i, 39) : 0;
      const subtotal = bedCharges + labTests + pharmacy + surgical;
      const insurance = Math.min(50000, Math.round(subtotal * 0.2));
      const seniorDiscount = i % 5 === 0 ? Math.round(subtotal * 0.1) : 0;
      const finalPayable = subtotal - insurance - seniorDiscount + 50;

      const admDay = seededInt(1, 10, i, 40);
      const disDay = admDay + los;

      rows.push({
        'Patient ID': `PAT-2026-${String(3000 + i)}`,
        'Full Legal Name': c.fullName,
        'Father Name': c.father,
        'Date of Birth': c.dob,
        'National ID (NID)': c.nid,
        'Primary Mobile': c.phone,
        'Emergency Phone': c.emergencyPhone,
        'Email Address': c.email,
        'District': c.district,
        'Present Address': c.presentAddress,
        'Bank Name': c.bank,
        'Bank Account No': c.accountNo,
        'Admission Date': `2026-03-${String(admDay).padStart(2, '0')}`,
        'Discharge Date': `2026-03-${String(Math.min(31, disDay)).padStart(2, '0')}`,
        'Ward Type': seededPick(['General Ward', 'Private Cabin', 'CCU Care', 'Surgical Suite'], i, 41),
        'Bed Charges': bedCharges,
        'Lab Tests': labTests,
        'Pharmacy Total': pharmacy,
        'Surgical Fee': surgical,
        'Subtotal Bill': i % 7 === 0 ? '' : subtotal,
        'Insurance Coverage (20%)': insurance,
        'Diagnostic Levy (BDT 50)': 50,
        'Senior Discount': seniorDiscount,
        'Final Payable': i % 9 === 0 ? '' : finalPayable,
        'Payment Status': i % 4 === 0 ? 'TPA Pending' : 'Settled'
      });
    } else if (projectId === 'proj_distributor_sales') {
      const target = seededInt(400000, 1800000, i, 42);
      const actual = seededInt(320000, 2100000, i, 43);
      const achPct = Math.round((actual / target) * 100);
      const baseComm = Math.round(actual * 0.065);
      const bonus = achPct >= 100 ? Math.round(actual * 0.03) : 0;
      const penalty = i % 11 === 0 ? seededInt(500, 4500, i, 44) : 0;
      const netComm = baseComm + bonus - penalty - 50;

      rows.push({
        'Invoice No': `INV-FMCG-${String(50000 + i)}`,
        'Distributor Code': `DST-${c.division.slice(0, 3).toUpperCase()}-${200 + (i % 90)}`,
        'Full Legal Name': c.fullName,
        'National ID (NID)': c.nid,
        'e-TIN Number': c.tin,
        'Primary Mobile': c.phone,
        'Email Address': c.email,
        'Division': c.division,
        'District': c.district,
        'Present Address': c.presentAddress,
        'Bank Name': c.bank,
        'Bank Account No': c.accountNo,
        'Routing Code': c.routingCode,
        'Territory': `${c.district} Wholesale Hub`,
        'Product Line': seededPick(['Beverages & Dairy', 'Home & Hygiene', 'Edible Oil & Staples', 'Personal Care'], i, 45),
        'Target Volume': target,
        'Actual Sales (BDT)': actual,
        'Base Commission (6.5%)': baseComm,
        'Target Achievement %': `${achPct}%`,
        'Incentive Bonus (3%)': bonus,
        'Damage Penalty': penalty,
        'Logistics Fee (BDT 50)': 50,
        'Net Commission Payable': i % 8 === 0 ? '' : netComm
      });
    } else if (projectId === 'proj_telecom_cdr') {
      const duration = seededInt(15, 2400, i, 46);
      const dataMb = seededInt(10, 4500, i, 47);
      const pulses = Math.ceil(duration / 10);
      const baseTariff = Number((pulses * 0.2 + dataMb * 0.08).toFixed(2));
      const sd = Number((baseTariff * 0.15).toFixed(2));
      const vat = Number(((baseTariff + sd) * 0.05).toFixed(2));
      const promo = i % 6 === 0 ? 15 : 0;
      const totalCharged = Number((baseTariff + sd + vat - promo + 50).toFixed(2));

      rows.push({
        'Call Session ID': `CDR-2026-${String(700000 + i)}`,
        'MSISDN Number': c.phone,
        'Full Legal Name': c.fullName,
        'Father Name': c.father,
        'National ID (NID)': c.nid,
        'Date of Birth': c.dob,
        'Division': c.division,
        'District': c.district,
        'Present Address': c.presentAddress,
        'Call Type': seededPick(['On-Net Voice', 'Off-Net Voice', '4G LTE Data', 'VoLTE Roaming'], i, 48),
        'Duration (Seconds)': duration,
        'Data Volume (MB)': dataMb,
        'Base Tariff (BDT)': baseTariff,
        'Supplementary Duty (15%)': sd,
        'VAT (5%)': vat,
        'Promo Credit': promo,
        'Regulatory Levy (BDT 50)': 50,
        'Total Charged Amount': i % 7 === 0 ? '' : totalCharged,
        'Tower Location': `BTS-${c.thana.slice(0, 4).toUpperCase()}-${10 + (i % 80)}`
      });
    } else if (projectId === 'proj_garments_piece_rate') {
      const pieces = seededInt(650, 1650, i, 49);
      const rate = seededInt(12, 28, i, 50);
      const baseEarning = pieces * rate;
      const otHours = seededInt(4, 24, i, 51);
      const otEarning = otHours * 115;
      const bonus = pieces >= 1200 ? 500 : 0;
      const netPayable = baseEarning + otEarning + bonus - 50;

      rows.push({
        'Worker ID': `RMG-${String(4000 + i)}`,
        'Sewing Line No': `LINE-${String((i % 24) + 1).padStart(2, '0')}`,
        'Full Legal Name': c.fullName,
        'Father Name': c.father,
        'Mother Name': c.mother,
        'National ID (NID)': c.nid,
        'Primary Mobile': c.phone,
        'Emergency Phone': c.emergencyPhone,
        'District': c.district,
        'Present Address': c.presentAddress,
        'Bank / MFS Name': i % 2 === 0 ? 'Rocket Payroll' : 'Dutch-Bangla Bank PLC',
        'Account No': c.accountNo,
        'Garment Style': seededPick(['POLO-KNIT-26A', 'DENIM-SLIM-09', 'HOODIE-EXP-44', 'CARGO-TWILL-12'], i, 52),
        'Completed Pieces': pieces,
        'Rate Per Piece (BDT)': rate,
        'Base Piece Earning': baseEarning,
        'Overtime Hours': otHours,
        'OT Earning': otEarning,
        'Target Bonus': bonus,
        'Canteen Subsidy (BDT 50)': 50,
        'Net Payable (BDT)': i % 6 === 0 ? '' : netPayable
      });
    } else {
      // Project 10: Real Estate Escrow & Investor Dossier
      const totalPrice = seededInt(6500000, 24000000, i, 53);
      const downPayment = Math.round(totalPrice * 0.2);
      const remaining = totalPrice - downPayment;
      const monthlyInst = Math.round(remaining / 36);
      const paidInst = seededInt(4, 28, i, 54);
      const totalPaidToDate = downPayment + paidInst * monthlyInst;
      const overdueInst = i % 7 === 0 ? seededInt(1, 3, i, 55) : 0;
      const lateSurcharge = Math.round(overdueInst * monthlyInst * 0.02);
      const earlyRebate = paidInst >= 20 ? Math.round(monthlyInst * 0.05) : 0;
      const escrowBal = totalPaidToDate - 50 + lateSurcharge - earlyRebate;

      rows.push({
        'Booking ID': `RES-BK-${String(8000 + i)}`,
        'Apartment Unit': `T${(i % 4) + 1}-FL${(i % 14) + 2}${(i % 2 === 0 ? 'A' : 'B')}`,
        'Project Name': seededPick(['Padma Sky Residences', 'Gulshan Lakeview Tower', 'Banani Crown Plaza', 'Bashundhara Green Court'], i, 56),
        'Full Legal Name': c.fullName,
        'Father Name': c.father,
        'Spouse / Nominee Name': i % 2 === 0 ? c.mother : `${seededPick(FIRST_NAMES, i + 5, 3)} ${seededPick(LAST_NAMES, i + 3, 4)}`,
        'National ID (NID)': c.nid,
        'e-TIN Number': c.tin,
        'Primary Mobile': c.phone,
        'Email Address': c.email,
        'District': c.district,
        'Present Address': c.presentAddress,
        'Occupation & Employer': c.occupation,
        'Bank Name': c.bank,
        'Bank Account No': c.accountNo,
        'Routing Code': c.routingCode,
        'Total Apartment Price': totalPrice,
        'Down Payment (20%)': downPayment,
        'Remaining Balance': remaining,
        'Monthly Installment (36 Mo)': monthlyInst,
        'Installments Paid': paidInst,
        'Total Paid to Date': totalPaidToDate,
        'Overdue Installments': overdueInst,
        'Late Surcharge (2%)': lateSurcharge,
        'Early Rebate Bonus': earlyRebate,
        'Registry Fee (BDT 50)': 50,
        'Current Escrow Balance': i % 6 === 0 ? '' : escrowBal
      });
    }
  }

  return rows;
}

// Live preview helper for DataEntryProjectWorkspaceModal so users can inspect detailed client records right in-app
export function getProjectSampleRecords(projectDef: DataEntryProjectDef, count = 6): any[] {
  if (projectDef.id === 'proj_sales_analysis') {
    return generateProject1Dataset(count);
  }
  if (projectDef.id === 'proj_employee_attendance') {
    return generateProject2Datasets(Math.ceil(count / 3)).attendance.slice(0, count);
  }
  if (projectDef.id === 'proj_ecommerce_inventory') {
    return generateProject3Datasets(25, count).orders;
  }
  if (projectDef.id === 'proj_financial_transactions') {
    return generateProject4Dataset(count);
  }
  return generateProject5To10Dataset(projectDef.id, count);
}

// Master Function to trigger immediate client-side download of authentic .xlsx files
export function downloadProjectExcel(projectDef: DataEntryProjectDef, onProgress?: (msg: string) => void) {
  try {
    if (onProgress) onProgress('Compiling extensive client Excel dataset...');
    const wb = XLSX.utils.book_new();

    if (projectDef.id === 'proj_sales_analysis') {
      const data = generateProject1Dataset();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Sales_Raw_Data');

      const guideSheet = XLSX.utils.json_to_sheet(
        projectDef.tasks.map((t, idx) => ({ 'Step': idx + 1, 'Task': t, 'Status': 'Pending' }))
      );
      XLSX.utils.book_append_sheet(wb, guideSheet, 'Instructions_Guide');
    } else if (projectDef.id === 'proj_employee_attendance') {
      const { employees, attendance } = generateProject2Datasets();
      const wsEmp = XLSX.utils.json_to_sheet(employees);
      const wsAtt = XLSX.utils.json_to_sheet(attendance);
      XLSX.utils.book_append_sheet(wb, wsEmp, 'Employee_KYC_Master');
      XLSX.utils.book_append_sheet(wb, wsAtt, 'Attendance_Records_Q1');
    } else if (projectDef.id === 'proj_ecommerce_inventory') {
      const { products, orders, suppliers } = generateProject3Datasets();
      const wsProd = XLSX.utils.json_to_sheet(products);
      const wsOrd = XLSX.utils.json_to_sheet(orders);
      const wsSup = XLSX.utils.json_to_sheet(suppliers);
      XLSX.utils.book_append_sheet(wb, wsProd, 'Products_Master');
      XLSX.utils.book_append_sheet(wb, wsOrd, 'Orders_Client_Log');
      XLSX.utils.book_append_sheet(wb, wsSup, 'Suppliers_Index');
    } else if (projectDef.id === 'proj_financial_transactions') {
      const data = generateProject4Dataset();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Financial_Transactions');

      const auditSheet = XLSX.utils.json_to_sheet([
        { 'Audit Check': 'Find Duplicate Reference Codes', 'Formula/Method': 'COUNTIF(T:T, T2) > 1' },
        { 'Audit Check': 'Verify Total Debit = Total Credit', 'Formula/Method': 'SUM(Deposit) - SUM(Withdrawal)' },
        { 'Audit Check': 'Extract Branch-wise Net Cash Flow', 'Formula/Method': 'SUMIFS Table' }
      ]);
      XLSX.utils.book_append_sheet(wb, auditSheet, 'Audit_Checklist');
    } else {
      const rowCount = Math.min(projectDef.numericRecordsCount || 1500, 2000);
      const generatedRows = generateProject5To10Dataset(projectDef.id, rowCount);
      const wsGeneral = XLSX.utils.json_to_sheet(generatedRows);
      XLSX.utils.book_append_sheet(wb, wsGeneral, 'Raw_Dataset');

      const tasksSheet = XLSX.utils.json_to_sheet(
        projectDef.tasks.map((t, idx) => ({ 'Step': idx + 1, 'Transformation Task': t, 'Status': 'Pending' }))
      );
      XLSX.utils.book_append_sheet(wb, tasksSheet, 'Calculation_Rules');
    }

    if (onProgress) onProgress('Exporting .xlsx file...');
    XLSX.writeFile(wb, projectDef.fileName);
    if (onProgress) onProgress('Download initiated!');
  } catch (err) {
    console.error('Failed to generate Excel file:', err);
    throw err;
  }
}
