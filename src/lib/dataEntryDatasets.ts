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

export const DATA_ENTRY_PROJECTS: DataEntryProjectDef[] = [
  {
    id: 'proj_sales_analysis',
    number: 1,
    title: 'Project 1: Sales Data Cleaning & Analysis',
    subtitle: 'High-Volume Enterprise Retail Transactions',
    category: 'Commercial Sales & Business Intelligence',
    difficulty: 'Advanced',
    recordsCount: '5,000+ Records',
    numericRecordsCount: 5000,
    estimatedHours: '8 - 12 Hours',
    accentColor: 'blue',
    iconName: 'TrendingUp',
    summary: 'Analyze a massive multi-region sales dataset. Clean dirty data, eliminate duplicate order IDs, standardize customer contact information, compute total values and profit margins, and prepare executive monthly summary reports.',
    columns: [
      'Order ID',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Product ID',
      'Product Name',
      'Product Category',
      'Order Date',
      'Quantity',
      'Unit Price',
      'Discount',
      'Sales Representative',
      'Region',
      'Payment Method',
      'Order Status',
      'Total Amount',
      'Profit'
    ],
    tasks: [
      'Enter and organize all provided 5,000+ sales records.',
      'Find and remove duplicate Order IDs using Excel conditional formatting and remove duplicates feature.',
      'Identify missing or incorrectly formatted customer details and phone numbers.',
      'Standardize customer names (PROPER case), phone numbers (+880 / E.164), dates (YYYY-MM-DD), and emails (lowercase).',
      'Calculate Total Amount using Excel formula: Quantity * Unit Price * (1 - Discount).',
      'Calculate Profit using formula: Total Amount - (Cost Price * Quantity).',
      'Sort sales from highest to lowest total revenue.',
      'Filter sales by region (Dhaka, Chittagong, Sylhet, Rajshahi, Khulna), product category, sales rep, and order status.',
      'Identify the top 20 customers by total purchase volume.',
      'Identify the top 10 best-selling products by quantity and revenue.',
      'Prepare a monthly sales summary table using Pivot Tables or SUMIFS formulas.',
      'Create a final executive summary sheet with key metrics (Total Revenue, Avg Order Value, Total Profit, Refund Rate).'
    ],
    cleaningInstructions: [
      'Intentionally duplicate Order IDs have been placed every ~25 rows.',
      'Phone numbers have inconsistent prefixes (017..., 88017..., +88017..., and missing digits).',
      'Email addresses contain extra whitespace, uppercase characters, or missing domain endings.',
      'Order dates contain conflicting formats (DD/MM/YYYY vs MM/DD/YYYY vs YYYY-MM-DD).'
    ],
    expectedSheets: ['Sales_Raw_Data', 'Cleaned_Sales_Data', 'Monthly_Summary', 'Top_Customers_Products', 'Executive_Dashboard'],
    fileName: 'Project_1_Sales_Data_Cleaning_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_employee_attendance',
    number: 2,
    title: 'Project 2: Employee Attendance & Salary Processing',
    subtitle: 'Corporate HR Payroll & Shift Management',
    category: 'Human Resources & Payroll Accounting',
    difficulty: 'Advanced',
    recordsCount: '300+ Employees × 3 Months',
    numericRecordsCount: 900,
    estimatedHours: '10 - 14 Hours',
    accentColor: 'emerald',
    iconName: 'Users',
    summary: 'Process multi-department corporate payroll for 300+ staff across a 90-day cycle. Verify attendance records, calculate overtime rates, deduct fines and advance loans, compute statutory deductions and net salary, and highlight attendance anomalies.',
    columns: [
      'Employee ID',
      'Employee Name',
      'Department',
      'Designation',
      'Joining Date',
      'Basic Salary',
      'Present Days',
      'Absent Days',
      'Late Days',
      'Leave Days',
      'Overtime Hours',
      'Overtime Rate',
      'Bonus',
      'Fine',
      'Advance',
      'Gross Salary',
      'Net Salary'
    ],
    tasks: [
      'Enter all employee master details accurately across departments (IT, Sales, HR, Accounts, Operations, Support).',
      'Process the complete 3-month attendance logs across January, February, and March.',
      'Calculate overtime payment using Excel formulas: Overtime Hours * Overtime Rate (1.5x hourly wage).',
      'Calculate Gross Salary: Basic Salary + (Basic * 0.40 House Rent) + (Basic * 0.15 Medical) + Overtime Pay + Bonus.',
      'Calculate deductions: Absent day wage cuts, Late fines (1 day salary deduction for every 3 late days), and loan advances.',
      'Calculate Final Net Salary: Gross Salary - Total Deductions.',
      'Identify employees with excessive absences (> 5 unapproved days in a quarter).',
      'Identify top overtime performers across all departments.',
      'Create department-wise total payroll expenditure summaries.',
      'Create monthly attendance trend reports comparing Q1 months.',
      'Rank employees according to attendance percentage: (Present Days / Total Working Days) * 100.',
      'Apply Conditional Formatting to highlight Net Salary > 80,000 (green), Absences > 3 (red), and Late Days > 4 (amber).',
      'Create a final comprehensive salary audit sheet with approval sign-off sections.'
    ],
    cleaningInstructions: [
      'Some employee joining dates are corrupted or formatted as text.',
      'Inconsistent department naming (e.g., "Information Tech", "I.T.", "IT Department").',
      'Negative overtime entries and impossible present days (> 26 days in a working month).',
      'Missing bank account IDs and duplicate employee entries.'
    ],
    expectedSheets: ['Employee_Master', 'Raw_Attendance_Logs', 'Processed_Payroll_Q1', 'Department_Summary', 'Attendance_Ranking'],
    fileName: 'Project_2_Employee_Attendance_Salary_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_ecommerce_inventory',
    number: 3,
    title: 'Project 3: E-Commerce Inventory & Order Management',
    subtitle: 'Multi-Sheet Supply Chain & Stock Fulfillment',
    category: 'Inventory Logistics & Warehouse Operations',
    difficulty: 'Expert',
    recordsCount: '2,000 Products & 8,000 Orders',
    numericRecordsCount: 10000,
    estimatedHours: '14 - 18 Hours',
    accentColor: 'indigo',
    iconName: 'Package',
    summary: 'Coordinate inventory replenishment and customer fulfillment across four interlinked worksheets. Match SKU barcodes with VLOOKUP/XLOOKUP, detect out-of-stock items, analyze supplier fulfillment speed, and build a warehouse summary dashboard.',
    columns: [
      'Product ID',
      'Product Name',
      'Category',
      'Brand',
      'Supplier',
      'Purchase Price',
      'Selling Price',
      'Current Stock',
      'Minimum Stock Level',
      'Sold Quantity',
      'Product Status'
    ],
    tasks: [
      'Organize and cross-index 2,000 products across 12 product categories.',
      'Match Product IDs between Products sheet and 8,000 Orders records using XLOOKUP or VLOOKUP.',
      'Calculate total order transaction values including tax and discounts.',
      'Calculate remaining warehouse inventory: Current Stock - Sold Quantity in current cycle.',
      'Identify critically low-stock products where Remaining Stock <= Minimum Stock Level.',
      'Flag out-of-stock SKUs and recommend reorder batch quantities.',
      'Calculate product-wise gross margin and gross profit: (Selling Price - Purchase Price) * Sold Quantity.',
      'Find the top 20 best-selling SKUs by volume and revenue contribution.',
      'Find the highest-value customer orders and map buyer geography.',
      'Separate orders into dedicated sheets by status: Completed, Cancelled, Pending Verification, and Returned.',
      'Create supplier-wise performance reports (on-time replenishment rate, total procurement spend).',
      'Create category-wise sales distributions using Pivot Charts.',
      'Utilize Excel lookup formulas, Pivot Tables, and automated conditional alerts.',
      'Construct a comprehensive inventory and sales summary dashboard with slicers.'
    ],
    cleaningInstructions: [
      'Multiple sheets with slightly mismatched Product SKU codes (case mismatch, trailing spaces).',
      'Products with selling prices lower than purchase prices (pricing anomalies).',
      'Order dates recorded after delivery dates (logistics timestamp inversion).',
      'Cancelled orders that still had inventory deducted incorrectly in the raw export.'
    ],
    expectedSheets: ['Products_Master', 'Orders_Log', 'Customers_List', 'Suppliers_Index', 'Inventory_Reorder_Alerts', 'Sales_Dashboard'],
    fileName: 'Project_3_Ecommerce_Inventory_Order_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_financial_transactions',
    number: 4,
    title: 'Project 4: Financial Transaction Data Processing',
    subtitle: 'High-Frequency Banking & Audit Ledger',
    category: 'Corporate Finance & Forensic Audit',
    difficulty: 'Master',
    recordsCount: '15,000+ Transaction Records',
    numericRecordsCount: 15000,
    estimatedHours: '18 - 24 Hours',
    accentColor: 'teal',
    iconName: 'Receipt',
    summary: 'Execute a full forensic audit of 15,000 high-frequency banking records. Detect duplicate reference codes, reconcile deposit vs withdrawal balance equations, flag suspicious money velocity, and generate branch-wise reconciliation statements.',
    columns: [
      'Transaction ID',
      'Transaction Date',
      'Transaction Time',
      'Account ID',
      'Customer Name',
      'Transaction Type',
      'Amount',
      'Deposit',
      'Withdrawal',
      'Transfer',
      'Payment Method',
      'Reference Number',
      'Transaction Status',
      'Branch',
      'Account Type'
    ],
    tasks: [
      'Enter and organize all 15,000 transaction records into an audit-ready ledger table.',
      'Identify duplicate Transaction IDs and flag unapproved duplicate ledger postings.',
      'Find duplicate Reference Numbers and determine if they represent accidental double debits.',
      'Detect missing mandatory fields (Customer Name, Account Number, Branch Code).',
      'Standardize date format to YYYY-MM-DD and time format to HH:MM:SS (24-hour).',
      'Separate transactions into dedicated columns for Deposit, Withdrawal, and Internal Transfer using IF logic.',
      'Calculate daily rolling transaction totals and verify debit/credit balance equality.',
      'Calculate weekly and monthly transaction volumes and liquidity flows.',
      'Identify the top 50 highest-value transactions for anti-money laundering (AML) compliance check.',
      'Identify unusual rapid successive transactions from the same account within a 10-minute window.',
      'Create branch-wise performance and transaction volume reports across all 18 bank branches.',
      'Create payment-method distribution summaries (BEFTN, RTGS, NPSB, ATM, POS, Internet Banking).',
      'Construct a final financial transaction summary report with discrepancy analysis.',
      'Ensure 100% numerical precision without penny rounding discrepancies across the entire ledger.'
    ],
    cleaningInstructions: [
      '15,000 transaction rows with deliberate duplicate reference codes (~150 occurrences).',
      'Transaction amounts entered as text strings with currency symbols (e.g. "$1,500.00" and "BDT 25000").',
      'Negative amounts entered where positive amounts are required.',
      'Timestamps with mixed 12-hour AM/PM and 24-hour military notation.'
    ],
    expectedSheets: ['Raw_Transaction_Ledger', 'Cleaned_Audit_Ledger', 'Duplicate_Anomalies_Found', 'Branch_Reconciliation', 'Payment_Method_Summary', 'Executive_Audit_Report'],
    fileName: 'Project_4_Financial_Transactions_Audit_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_microfinance',
    number: 5,
    title: 'Project 5: Microfinance Loan Recovery & Interest Ledger',
    subtitle: 'Rural Credit Group Weekly Collection Processing',
    category: 'Microfinance & Rural Banking Operations',
    difficulty: 'Advanced',
    recordsCount: '4,500 Borrower Records',
    numericRecordsCount: 4500,
    estimatedHours: '10 - 14 Hours',
    accentColor: 'rose',
    iconName: 'Building',
    summary: 'Process rural micro-credit group loan disbursements and weekly installments. Apply 12.5% service charges, calculate grace period waivers, deduct emergency welfare surcharge (BDT 50), and flag chronic defaulter groups.',
    columns: [
      'Borrower ID', 'Group Code', 'Borrower Name', 'Village', 'Disbursed Principal', 'Service Charge (12.5%)',
      'Total Payable', 'Weekly Installment', 'Weeks Paid', 'Paid Amount', 'Outstanding Balance', 'Welfare Fund (BDT 50)',
      'Bonus Waiver', 'Overdue Weeks', 'Group Status'
    ],
    tasks: [
      'Enter all 4,500 borrower records and organize by Somiti/Group Code.',
      'Calculate Total Payable: Disbursed Principal + (Disbursed Principal * 12.5% Service Charge).',
      'Calculate Weekly Installment: Total Payable / 46 Weeks.',
      'Deduct mandatory BDT 50 Emergency Borrower Welfare Surcharge from gross payout.',
      'Apply 5% Early Settlement Bonus Waiver for borrowers with 0 overdue weeks.',
      'Remove/filter all inactive closed borrower accounts where Outstanding Balance <= 0.',
      'Highlight critical risk accounts where Overdue Weeks >= 4 in red conditional format.',
      'Create Group-wise recovery rate summary sheet using SUMIFS and AVERAGE formulas.'
    ],
    cleaningInstructions: [
      'Duplicate National IDs found in multiple credit groups.',
      'Negative installment payments entered in error.',
      'Corrupted village and group naming conventions.'
    ],
    expectedSheets: ['Raw_Microcredit_Data', 'Processed_Installment_Ledger', 'Group_Recovery_Summary', 'Risk_Defaulters_List'],
    fileName: 'Project_5_Microfinance_Loan_Recovery_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_hospital_billing',
    number: 6,
    title: 'Project 6: Healthcare Hospital Billing & Insurance Claims',
    subtitle: 'Clinical Inpatient Ledger & Health TPA Audit',
    category: 'Healthcare Analytics & Medical Billing',
    difficulty: 'Expert',
    recordsCount: '3,800 Patient Admissions',
    numericRecordsCount: 3800,
    estimatedHours: '12 - 16 Hours',
    accentColor: 'sky',
    iconName: 'Receipt',
    summary: 'Audit multi-ward clinical billing logs. Sum bed charges, lab investigations, pharmacy and surgical costs. Apply 20% health insurance coverage caps, deduct BDT 50 government diagnostic levy, and calculate final patient out-of-pocket payable.',
    columns: [
      'Patient ID', 'Admission Date', 'Discharge Date', 'Ward Type', 'Bed Charges', 'Lab Tests',
      'Pharmacy Total', 'Surgical Fee', 'Subtotal Bill', 'Insurance Coverage (20%)', 'Diagnostic Levy (BDT 50)',
      'Senior Citizen Discount', 'Final Payable', 'Payment Status'
    ],
    tasks: [
      'Calculate Length of Stay (LOS) in days: Discharge Date - Admission Date.',
      'Compute Subtotal Bill: (Bed Rate * LOS) + Lab Tests + Pharmacy Total + Surgical Fee.',
      'Calculate Insurance Coverage: 20% of Subtotal (capped at BDT 50,000 max).',
      'Deduct BDT 50 Hospital Development & Diagnostic Surcharge.',
      'Apply 10% Senior Citizen Discount for patients aged 65 and above.',
      'Calculate Final Net Patient Payable: Subtotal - Insurance Coverage - Discounts + Diagnostic Levy.',
      'Remove cancelled admission records with 0 length of stay.',
      'Create department revenue summary table using Pivot Table.'
    ],
    cleaningInstructions: [
      'Admission dates recorded after discharge dates (inverted dates).',
      'Missing ward category names and negative pharmacy bills.',
      'Duplicate patient registration tokens.'
    ],
    expectedSheets: ['Raw_Patient_Bills', 'Audited_Hospital_Ledger', 'Insurance_Claim_Summary', 'Ward_Occupancy_Report'],
    fileName: 'Project_6_Hospital_Billing_Claims_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_distributor_sales',
    number: 7,
    title: 'Project 7: FMCG Supply Chain Distributor Commissions',
    subtitle: 'Nationwide Wholesale Territory Performance',
    category: 'Supply Chain & Commercial Distribution',
    difficulty: 'Advanced',
    recordsCount: '6,200 Wholesale Shipments',
    numericRecordsCount: 6200,
    estimatedHours: '11 - 15 Hours',
    accentColor: 'amber',
    iconName: 'TrendingUp',
    summary: 'Reconcile nationwide FMCG wholesale dealer accounts. Calculate base commissions (6.5%), incentive bonuses for targets > BDT 10 Lakhs, deduct transit damage penalties and BDT 50 logistics processing fee.',
    columns: [
      'Invoice No', 'Distributor Code', 'Territory', 'Product Line', 'Target Volume', 'Actual Sales (BDT)',
      'Base Commission (6.5%)', 'Target Achievement %', 'Incentive Bonus (3%)', 'Damage Penalty',
      'Logistics Fee (BDT 50)', 'Net Commission Payable'
    ],
    tasks: [
      'Calculate Target Achievement Rate: (Actual Sales / Target Volume) * 100.',
      'Calculate Base Commission: Actual Sales * 6.5%.',
      'Apply Conditional Incentive: IF Target Achievement >= 100%, Add 3% Incentive Bonus, ELSE 0.',
      'Deduct BDT 50 Logistics Processing Surcharge per invoice.',
      'Subtract Transit Damaged Goods Replacement Penalties.',
      'Calculate Net Commission Payable: Base Commission + Incentive Bonus - Penalty - Logistics Fee.',
      'Filter and remove inactive terminated dealership records.',
      'Rank top 10 regional sales territories by total volume.'
    ],
    cleaningInstructions: [
      'Inconsistent dealer code formatting and missing territory tags.',
      'Gross sales amounts with stray text characters.',
      'Inverted target vs actual figures in batch exports.'
    ],
    expectedSheets: ['Raw_Invoices', 'Cleaned_Commission_Ledger', 'Top_Distributors_Ranking', 'Territory_Performance'],
    fileName: 'Project_7_FMCG_Distributor_Commission_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_telecom_cdr',
    number: 8,
    title: 'Project 8: Telecom CDR Usage & Supplementary Duty Auditing',
    subtitle: 'High-Density Subscriber Traffic Reconciliation',
    category: 'Telecommunications & Regulatory Billing',
    difficulty: 'Master',
    recordsCount: '12,000 Call Detail Records',
    numericRecordsCount: 12000,
    estimatedHours: '16 - 22 Hours',
    accentColor: 'purple',
    iconName: 'Receipt',
    summary: 'Audit massive cellular CDR logs. Calculate voice per-second pulses, data bundle allocations, apply 15% Supplementary Duty (SD) + 5% VAT, deduct promo discounts and calculate BTRC regulatory revenue share.',
    columns: [
      'Call Session ID', 'MSISDN Number', 'Call Type', 'Duration (Seconds)', 'Data Volume (MB)',
      'Base Tariff (BDT)', 'Supplementary Duty (15%)', 'VAT (5%)', 'Promo Credit Deduction',
      'Regulatory Levy (BDT 50)', 'Total Charged Amount', 'Tower Location'
    ],
    tasks: [
      'Convert call duration seconds into billable pulses (10-second pulse intervals).',
      'Compute Base Tariff: (Billable Pulses * BDT 0.20) + (Data MB * BDT 0.08).',
      'Calculate Government Supplementary Duty: 15% of Base Tariff.',
      'Calculate VAT: 5% of (Base Tariff + SD).',
      'Deduct promotional promo voucher balances.',
      'Add BDT 50 periodic SIM activation / regulatory compliance levy for new accounts.',
      'Calculate Final Billed Total: Base Tariff + SD + VAT - Promo + Regulatory Levy.',
      'Remove failed incomplete call drops (Duration == 0).'
    ],
    cleaningInstructions: [
      'Mixed MSISDN formats (018..., 88018..., +88018...).',
      'Zero duration sessions with non-zero tariffs (billing glitches).',
      'Duplicate session IDs across tower handover logs.'
    ],
    expectedSheets: ['Raw_CDR_Logs', 'Processed_Telecom_Ledger', 'Tax_SD_VAT_Summary', 'Tower_Traffic_Report'],
    fileName: 'Project_8_Telecom_CDR_Usage_Tax_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_garments_piece_rate',
    number: 9,
    title: 'Project 9: Ready-Made Garments (RMG) Production & Piece-Rate Payroll',
    subtitle: 'Factory Floor Sewing Line Labor Compensation',
    category: 'Apparel Manufacturing & Industrial Labor Accounting',
    difficulty: 'Advanced',
    recordsCount: '3,200 Worker Line Records',
    numericRecordsCount: 3200,
    estimatedHours: '9 - 13 Hours',
    accentColor: 'teal',
    iconName: 'Users',
    summary: 'Process weekly piece-rate wages for 3,200 garment factory operators. Calculate piece-rate earnings, 1.5x overtime hours, production target bonuses, subtract BDT 50 canteen meal subsidy, and generate banking payroll sheets.',
    columns: [
      'Worker ID', 'Sewing Line No', 'Worker Name', 'Garment Style', 'Completed Pieces', 'Rate Per Piece (BDT)',
      'Base Piece Earning', 'Overtime Hours', 'OT Rate (1.5x)', 'OT Earning', 'Target Bonus',
      'Canteen Meal Subsidy (BDT 50)', 'Gross Weekly Wage', 'Net Payable (BDT)'
    ],
    tasks: [
      'Calculate Base Piece Earning: Completed Pieces * Rate Per Piece.',
      'Calculate Overtime Earning: Overtime Hours * (Hourly Base Wage * 1.5).',
      'Apply Conditional Target Bonus: IF Completed Pieces >= 1,200 units, Add BDT 500 Bonus, ELSE 0.',
      'Deduct BDT 50 Weekly Canteen Meal Subsidy contribution.',
      'Deduct fabric rejection penalty for defect rates > 2.5%.',
      'Calculate Net Weekly Wage: Base Piece + OT Earning + Target Bonus - Meal Subsidy - Defect Penalty.',
      'Remove terminated / absent workers with 0 piece output.',
      'Create Sewing Line efficiency comparison dashboard.'
    ],
    cleaningInstructions: [
      'Garment style codes entered with trailing spaces and inconsistent case.',
      'Impossible piece counts (> 2,500 per worker/week) requiring audit check.',
      'Missing bank / MFS payment account numbers.'
    ],
    expectedSheets: ['Raw_Line_Outputs', 'Processed_Worker_Payroll', 'Line_Efficiency_Summary', 'Defect_Audit_Log'],
    fileName: 'Project_9_RMG_Garments_Piece_Rate_Raw_Dataset.xlsx'
  },
  {
    id: 'proj_real_estate',
    number: 10,
    title: 'Project 10: Real Estate Apartment Installments & Escrow Fund Ledger',
    subtitle: 'High-Value Property Booking & Construction Milestone Accounting',
    category: 'Real Estate Investment & Escrow Management',
    difficulty: 'Master',
    recordsCount: '1,500 Client Investment Portfolios',
    numericRecordsCount: 1500,
    estimatedHours: '14 - 18 Hours',
    accentColor: 'emerald',
    iconName: 'Building',
    summary: 'Audit luxury residential condominium installment ledgers. Reconcile 36-month payment schedules, calculate 2% late installment surcharges, 5% early lump-sum rebate bonuses, deduct BDT 50 title registry archive fees, and track construction escrow balances.',
    columns: [
      'Booking ID', 'Apartment Unit', 'Project Name', 'Client Name', 'Total Apartment Price', 'Down Payment (20%)',
      'Remaining Balance', 'Monthly Installment (36 Mo)', 'Installments Paid', 'Total Paid to Date',
      'Overdue Installments', 'Late Surcharge (2%)', 'Early Rebate Bonus', 'Registry Fee (BDT 50)', 'Current Escrow Balance'
    ],
    tasks: [
      'Calculate Down Payment: Total Apartment Price * 20%.',
      'Calculate Remaining Balance: Total Price - Down Payment.',
      'Calculate Base Monthly Installment: Remaining Balance / 36 Months.',
      'Calculate Late Surcharge: Overdue Installments * Base Installment * 2%.',
      'Apply Early Settlement Rebate: IF Client pays >= 12 installments in advance, Deduct 5% Rebate Bonus.',
      'Deduct mandatory BDT 50 Deed Registry & Archive Maintenance Fee.',
      'Calculate Current Escrow Balance: Total Paid to Date - Registry Fee + Late Surcharge - Rebates.',
      'Remove cancelled booking allocations with full refund settlement.'
    ],
    cleaningInstructions: [
      'Duplicate apartment unit allocations across twin towers.',
      'Currency formatting with mixed $ USD and ৳ BDT notations.',
      'Negative installment counters and invalid national identification numbers.'
    ],
    expectedSheets: ['Raw_Bookings_Master', 'Installment_Schedule_Ledger', 'Escrow_Vault_Summary', 'Overdue_Notices_List'],
    fileName: 'Project_10_Real_Estate_Escrow_Installment_Raw_Dataset.xlsx'
  }
];

// --- REALISTIC DATASET GENERATION HELPERS ---

const FIRST_NAMES = [
  'Mohammad', 'Fatima', 'Tanvir', 'Sumaiya', 'Rakib', 'Farhana', 'Arif', 'Sadia',
  'Nazmul', 'Nusrat', 'Sabbir', 'Jannatul', 'Shakil', 'Khadija', 'Rifat', 'Priyanka',
  'Mehedi', 'Mahfuza', 'Touhid', 'Rubina', 'Sayed', 'Anika', 'Mahir', 'Tasnim',
  'Imran', 'Zannat', 'Fahim', 'Mim', 'Nayeem', 'Shampa', 'Ashiq', 'Poly',
  'Shorif', 'Bristi', 'Sajib', 'Munni', 'Hasan', 'Laboni', 'Shohel', 'Nadia'
];

const LAST_NAMES = [
  'Ahmed', 'Rahman', 'Islam', 'Hasan', 'Chowdhury', 'Hossain', 'Akter', 'Begum',
  'Khan', 'Sultana', 'Uddin', 'Mahmud', 'Khatun', 'Miah', 'Alam', 'Ali',
  'Biswas', 'Das', 'Roy', 'Talukder', 'Sarker', 'Bhuiyan', 'Mondal', 'Haque'
];

const REGIONS = ['Dhaka Central', 'Chittagong Port', 'Sylhet East', 'Rajshahi North', 'Khulna South', 'Barisal Delta', 'Rangpur Division'];
const BRANCHES = ['Motijheel Corporate', 'Gulshan Premier', 'Dhanmondi Central', 'Agrabad Commercial', 'GEC Circle', 'Zindabazar', 'Shaheb Bazar', 'Khulna Main', 'Bogura Sadar', 'Uttara Sector 7'];
const DEPARTMENTS = ['Information Technology', 'Sales & Distribution', 'Finance & Accounts', 'Human Resources', 'Operations & Logistics', 'Customer Care'];
const PRODUCT_CATEGORIES = ['Electronics & Gadgets', 'Office Stationery', 'Home Appliances', 'Computer Hardware', 'Packaging Materials', 'Industrial Tools'];
const PAYMENT_METHODS = ['bKash Merchant', 'Nagad Pay', 'Rocket Banking', 'Bank Transfer (EFT)', 'Visa / Mastercard', 'Cash on Delivery'];
const ORDER_STATUSES = ['Delivered', 'Completed', 'Processing', 'In Transit', 'Pending Review', 'Cancelled', 'Returned'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate Realistic Project 1 Sales Dataset (5,000+ rows)
export function generateProject1Dataset(): any[] {
  const rows: any[] = [];
  const targetCount = 5050;

  for (let i = 1; i <= targetCount; i++) {
    const fName = getRandomItem(FIRST_NAMES);
    const lName = getRandomItem(LAST_NAMES);
    const fullName = `${fName} ${lName}`;
    const category = getRandomItem(PRODUCT_CATEGORIES);
    const prodNum = getRandomInt(100, 250);
    const prodName = `${category.split(' ')[0]} Model Pro-${prodNum}`;
    const qty = getRandomInt(1, 25);
    const unitPrice = getRandomInt(450, 18500);
    const discount = (getRandomInt(0, 4) * 0.05); // 0%, 5%, 10%, 15%, 20%
    const totalCalc = Math.round(qty * unitPrice * (1 - discount));
    const costPrice = Math.round(unitPrice * (0.65 + Math.random() * 0.15));
    const profitCalc = totalCalc - (costPrice * qty);

    // Intentionally inject duplicates every 35 records
    const isDup = i > 100 && i % 37 === 0;
    const orderId = isDup ? `ORD-2026-${String(i - 30).padStart(5, '0')}` : `ORD-2026-${String(i).padStart(5, '0')}`;

    // Intentionally introduce formatting inconsistencies
    let phone = `+8801${getRandomInt(3, 9)}${getRandomInt(10000000, 99999999)}`;
    if (i % 23 === 0) phone = `01${phone.substring(5)}`; // missing international prefix
    if (i % 47 === 0) phone = `880-1${phone.substring(5)}`; // dash notation

    let email = `${fName.toLowerCase()}.${lName.toLowerCase()}${getRandomInt(10, 99)}@gmail.com`;
    if (i % 31 === 0) email = ` ${email.toUpperCase()} `; // trailing space & uppercase

    let orderDate = `2026-${String(getRandomInt(1, 6)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`;
    if (i % 41 === 0) {
      // Inconsistent date format
      const parts = orderDate.split('-');
      orderDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    rows.push({
      'Order ID': orderId,
      'Customer Name': (i % 19 === 0) ? fullName.toLowerCase() : fullName,
      'Customer Phone': phone,
      'Customer Email': email,
      'Product ID': `PRD-${category.substring(0, 3).toUpperCase()}-${prodNum}`,
      'Product Name': prodName,
      'Product Category': category,
      'Order Date': orderDate,
      'Quantity': qty,
      'Unit Price': unitPrice,
      'Discount': `${Math.round(discount * 100)}%`,
      'Sales Representative': `${getRandomItem(FIRST_NAMES)} (Territory Rep)`,
      'Region': getRandomItem(REGIONS),
      'Payment Method': getRandomItem(PAYMENT_METHODS),
      'Order Status': getRandomItem(ORDER_STATUSES),
      'Total Amount': (i % 10 === 0) ? '' : totalCalc, // Student must calculate empty formula fields
      'Profit': (i % 8 === 0) ? '' : profitCalc // Student must calculate
    });
  }

  return rows;
}

// Generate Realistic Project 2 Employee Attendance Dataset (300+ employees x 3 months)
export function generateProject2Datasets(): { employees: any[]; attendance: any[] } {
  const employees: any[] = [];
  const attendance: any[] = [];
  const empCount = 320;

  for (let i = 1; i <= empCount; i++) {
    const fName = getRandomItem(FIRST_NAMES);
    const lName = getRandomItem(LAST_NAMES);
    const dept = getRandomItem(DEPARTMENTS);
    const basic = getRandomInt(22000, 95000);
    const empId = `EMP-${String(1000 + i)}`;

    employees.push({
      'Employee ID': empId,
      'Employee Name': `${fName} ${lName}`,
      'Department': dept,
      'Designation': `${dept.split(' ')[0]} Executive Level ${getRandomInt(1, 4)}`,
      'Joining Date': `202${getRandomInt(1, 5)}-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`,
      'Basic Salary': basic,
      'Bank Account': `BD-SEBL-${getRandomInt(100000000, 999999999)}`,
      'Contact Number': `+88017${getRandomInt(10000000, 99999999)}`
    });

    // 3 Months records: Jan, Feb, Mar 2026
    const months = ['January 2026', 'February 2026', 'March 2026'];
    months.forEach((m, mIdx) => {
      const workingDays = 26;
      const present = getRandomInt(20, 26);
      const absent = workingDays - present;
      const late = getRandomInt(0, 5);
      const leave = getRandomInt(0, 2);
      const otHours = getRandomInt(0, 36);
      const otRate = Math.round((basic / (26 * 8)) * 1.5);
      const otPay = otHours * otRate;
      const bonus = (mIdx === 2) ? Math.round(basic * 0.25) : 0; // Quarter ending bonus
      const fine = (late >= 3) ? Math.round((basic / 26) * 1) : 0;
      const advance = (i % 7 === 0) ? getRandomInt(2000, 10000) : 0;
      const gross = Math.round(basic + (basic * 0.4) + (basic * 0.15) + otPay + bonus);
      const net = gross - fine - advance - Math.round((basic / 26) * absent);

      attendance.push({
        'Record ID': `ATT-${empId}-${m.substring(0, 3)}`,
        'Employee ID': (i % 45 === 0 && mIdx === 0) ? `EMP-${String(1000 + i - 1)}` : empId, // Inconsistent ID typo
        'Employee Name': `${fName} ${lName}`,
        'Department': (i % 30 === 0) ? dept.toUpperCase() : dept,
        'Attendance Month': m,
        'Working Days': workingDays,
        'Present Days': present,
        'Absent Days': absent,
        'Late Days': late,
        'Leave Days': leave,
        'Overtime Hours': otHours,
        'Overtime Rate': otRate,
        'Bonus': bonus,
        'Fine': fine,
        'Advance Deduction': advance,
        'Gross Salary': (i % 6 === 0) ? '' : gross, // Student must compute formula
        'Net Salary': (i % 5 === 0) ? '' : net // Student must compute formula
      });
    });
  }

  return { employees, attendance };
}

// Generate Realistic Project 3 E-Commerce Inventory (2,000 Products & 8,000 Orders)
export function generateProject3Datasets(): { products: any[]; orders: any[]; suppliers: any[] } {
  const suppliers = [
    { 'Supplier ID': 'SUP-001', 'Supplier Name': 'Apex Digital Supplies Ltd', 'Contact Person': 'Rafiqul Islam', 'Phone': '+8801711223344', 'Location': 'Dhaka EPZ', 'Rating': '4.8/5' },
    { 'Supplier ID': 'SUP-002', 'Supplier Name': 'Bengal Tech Components', 'Contact Person': 'Nasrin Akhter', 'Phone': '+8801811556677', 'Location': 'Chittagong Bay', 'Rating': '4.6/5' },
    { 'Supplier ID': 'SUP-003', 'Supplier Name': ' Meghna Global Trade', 'Contact Person': 'Tareq Mahmud', 'Phone': '+8801911889900', 'Location': 'Narayanganj Port', 'Rating': '4.9/5' },
    { 'Supplier ID': 'SUP-004', 'Supplier Name': 'Padma Office Solutions', 'Contact Person': 'Farid Hossain', 'Phone': '+8801611334455', 'Location': 'Gazipur Industrial Area', 'Rating': '4.7/5' },
    { 'Supplier ID': 'SUP-005', 'Supplier Name': 'Karnafuli Express Import', 'Contact Person': 'Sabina Yasmin', 'Phone': '+8801511224466', 'Location': 'Khatunganj Hub', 'Rating': '4.5/5' }
  ];

  const products: any[] = [];
  const prodCount = 2000;
  for (let i = 1; i <= prodCount; i++) {
    const cat = getRandomItem(PRODUCT_CATEGORIES);
    const purchase = getRandomInt(300, 14000);
    const margin = 0.20 + Math.random() * 0.35;
    const selling = Math.round(purchase * (1 + margin));
    const stock = getRandomInt(0, 150);
    const minStock = getRandomInt(15, 30);
    const sold = getRandomInt(5, 200);

    products.push({
      'Product ID': `SKU-${String(10000 + i)}`,
      'Product Name': `${cat.split(' ')[0]} Series-${i}`,
      'Category': cat,
      'Brand': `Brand-${(i % 18) + 1}`,
      'Supplier ID': getRandomItem(suppliers)['Supplier ID'],
      'Purchase Price': purchase,
      'Selling Price': selling,
      'Current Stock': stock,
      'Minimum Stock Level': minStock,
      'Sold Quantity': sold,
      'Product Status': stock === 0 ? 'Out of Stock' : (stock <= minStock ? 'Low Stock Alert' : 'In Stock')
    });
  }

  const orders: any[] = [];
  const orderCount = 8000;
  for (let j = 1; j <= orderCount; j++) {
    const matchedProd = getRandomItem(products);
    const qty = getRandomInt(1, 8);
    const discount = (getRandomInt(0, 3) * 0.05);
    const sellingPrice = matchedProd['Selling Price'];
    const totalOrderValue = Math.round(qty * sellingPrice * (1 - discount));

    orders.push({
      'Order ID': `ECO-2026-${String(j).padStart(6, '0')}`,
      'Order Date': `2026-${String(getRandomInt(1, 5)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`,
      'Customer ID': `CUST-${String(getRandomInt(100, 599))}`,
      'Product ID': matchedProd['Product ID'],
      'Quantity': qty,
      'Selling Price': sellingPrice,
      'Discount': `${Math.round(discount * 100)}%`,
      'Total Order Value': (j % 7 === 0) ? '' : totalOrderValue, // Student computes with VLOOKUP/formula
      'Payment Method': getRandomItem(PAYMENT_METHODS),
      'Shipping Status': getRandomItem(['Dispatched', 'Delivered', 'In Warehouse', 'Returned']),
      'Order Status': getRandomItem(ORDER_STATUSES)
    });
  }

  return { products, orders, suppliers };
}

// Generate Realistic Project 4 Financial Transactions (15,000+ records)
export function generateProject4Dataset(): any[] {
  const transactions: any[] = [];
  const targetCount = 15000;

  for (let i = 1; i <= targetCount; i++) {
    const fName = getRandomItem(FIRST_NAMES);
    const lName = getRandomItem(LAST_NAMES);
    const tType = getRandomItem(['Deposit', 'Withdrawal', 'Transfer', 'Online Payment', 'POS Terminal']);
    const amount = getRandomInt(500, 450000);
    const branch = getRandomItem(BRANCHES);

    let dep = 0;
    let withdr = 0;
    let trf = 0;

    if (tType === 'Deposit') dep = amount;
    else if (tType === 'Withdrawal' || tType === 'POS Terminal') withdr = amount;
    else trf = amount;

    // Duplicate reference code every ~100 records
    const isRefDup = i > 150 && i % 99 === 0;
    const refNum = isRefDup ? `TXN-REF-${String(i - 80).padStart(7, '0')}` : `TXN-REF-${String(i).padStart(7, '0')}`;

    const hr = String(getRandomInt(9, 21)).padStart(2, '0');
    const min = String(getRandomInt(0, 59)).padStart(2, '0');
    const sec = String(getRandomInt(0, 59)).padStart(2, '0');

    transactions.push({
      'Transaction ID': `FT-${20260000 + i}`,
      'Transaction Date': `2026-${String(getRandomInt(1, 4)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`,
      'Transaction Time': `${hr}:${min}:${sec}`,
      'Account ID': `ACC-${getRandomInt(100000, 999999)}`,
      'Customer Name': `${fName} ${lName}`,
      'Transaction Type': tType,
      'Amount (BDT)': amount,
      'Deposit': (i % 6 === 0) ? '' : (dep > 0 ? dep : 0),
      'Withdrawal': (i % 6 === 0) ? '' : (withdr > 0 ? withdr : 0),
      'Transfer': (i % 6 === 0) ? '' : (trf > 0 ? trf : 0),
      'Payment Method': getRandomItem(['NPSB Real-Time', 'BEFTN Clearing', 'RTGS High-Value', 'ATM Network', 'Internet Banking', 'Over-The-Counter']),
      'Reference Number': refNum,
      'Transaction Status': (i % 300 === 0) ? 'Flagged for Review' : (i % 150 === 0 ? 'Failed' : 'Settled'),
      'Branch': branch,
      'Account Type': getRandomItem(['Current Business Account', 'Savings Individual', 'Student Ledger', 'Payroll Salary Account'])
    });
  }

  return transactions;
}

// Master Function to trigger immediate client-side download of authentic .xlsx files
export function downloadProjectExcel(projectDef: DataEntryProjectDef, onProgress?: (msg: string) => void) {
  try {
    if (onProgress) onProgress('Compiling Excel dataset records...');
    const wb = XLSX.utils.book_new();

    if (projectDef.id === 'proj_sales_analysis') {
      const data = generateProject1Dataset();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Sales_Raw_Data');

      // Add a second instruction template sheet
      const guideSheet = XLSX.utils.json_to_sheet([
        { 'Step': 1, 'Task': 'Remove Duplicate Order IDs', 'Status': 'Pending' },
        { 'Step': 2, 'Task': 'Standardize Phone Numbers (+880)', 'Status': 'Pending' },
        { 'Step': 3, 'Task': 'Compute Total Amount using formula: Qty * Price * (1 - Discount)', 'Status': 'Pending' },
        { 'Step': 4, 'Task': 'Compute Profit using formula: Total Amount - Cost', 'Status': 'Pending' },
        { 'Step': 5, 'Task': 'Generate Pivot Table for Monthly Sales Summary', 'Status': 'Pending' },
        { 'Step': 6, 'Task': 'Filter Top 20 Customers by Revenue', 'Status': 'Pending' }
      ]);
      XLSX.utils.book_append_sheet(wb, guideSheet, 'Instructions_Guide');

    } else if (projectDef.id === 'proj_employee_attendance') {
      const { employees, attendance } = generateProject2Datasets();
      const wsEmp = XLSX.utils.json_to_sheet(employees);
      const wsAtt = XLSX.utils.json_to_sheet(attendance);
      XLSX.utils.book_append_sheet(wb, wsEmp, 'Employee_Master');
      XLSX.utils.book_append_sheet(wb, wsAtt, 'Attendance_Records_Q1');

    } else if (projectDef.id === 'proj_ecommerce_inventory') {
      const { products, orders, suppliers } = generateProject3Datasets();
      const wsProd = XLSX.utils.json_to_sheet(products);
      const wsOrd = XLSX.utils.json_to_sheet(orders);
      const wsSup = XLSX.utils.json_to_sheet(suppliers);
      XLSX.utils.book_append_sheet(wb, wsProd, 'Products_Master');
      XLSX.utils.book_append_sheet(wb, wsOrd, 'Orders_Log');
      XLSX.utils.book_append_sheet(wb, wsSup, 'Suppliers_Index');

    } else if (projectDef.id === 'proj_financial_transactions') {
      const data = generateProject4Dataset();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Financial_Transactions');

      const auditSheet = XLSX.utils.json_to_sheet([
        { 'Audit Check': 'Find Duplicate Reference Codes', 'Formula/Method': 'COUNTIF(L:L, L2) > 1' },
        { 'Audit Check': 'Verify Total Debit = Total Credit', 'Formula/Method': 'SUM(Deposit) - SUM(Withdrawal)' },
        { 'Audit Check': 'Extract Branch-wise Net Cash Flow', 'Formula/Method': 'SUMIFS Table' }
      ]);
      XLSX.utils.book_append_sheet(wb, auditSheet, 'Audit_Checklist');

    } else {
      // General Template for Projects 5, 6, 7, 8, 9, 10
      const generatedRows: any[] = [];
      const rowCount = projectDef.numericRecordsCount || 1000;
      const cols = projectDef.columns;

      for (let r = 1; r <= Math.min(rowCount, 1500); r++) {
        const rowObj: Record<string, any> = {};
        cols.forEach((col, cIdx) => {
          if (col.toLowerCase().includes('id') || col.toLowerCase().includes('code') || col.toLowerCase().includes('no')) {
            rowObj[col] = `REF-${projectDef.number}${String(10000 + r)}`;
          } else if (col.toLowerCase().includes('name')) {
            rowObj[col] = `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
          } else if (col.toLowerCase().includes('date')) {
            rowObj[col] = `2026-0${getRandomInt(1, 4)}-${String(getRandomInt(1, 28)).padStart(2, '0')}`;
          } else if (col.toLowerCase().includes('fee') || col.toLowerCase().includes('salary') || col.toLowerCase().includes('amount') || col.toLowerCase().includes('price') || col.toLowerCase().includes('bill') || col.toLowerCase().includes('balance') || col.toLowerCase().includes('total')) {
            rowObj[col] = getRandomInt(500, 75000);
          } else if (col.toLowerCase().includes('rate') || col.toLowerCase().includes('%')) {
            rowObj[col] = `${getRandomInt(3, 15)}%`;
          } else {
            rowObj[col] = `Data_Value_${r}_${cIdx + 1}`;
          }
        });
        generatedRows.push(rowObj);
      }

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
