import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Receipt,
  Wallet,
  ArrowRightLeft
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface PaymentRecord {
  id: string;
  name: string;
  studentId: string;
  amount: number;
  type: 'Balance Transfer' | 'bKash Payout' | 'Nagad Payout' | 'Rocket Payout' | 'Bank Transfer';
  timeAgo: string;
  status: 'Completed' | 'Verified';
  isReal?: boolean;
}

const INITIAL_NAMES = [
  'Md. Ibrahim', 'Tanvir Ahmed', 'Nusrat Jahan', 'Rahim Uddin', 'Farhana Akter',
  'Sabbir Hossain', 'Jahidul Islam', 'Sadia Sultana', 'Mehedi Hasan', 'Rubel Mia',
  'Sumaiya Islam', 'Kamrul Hassan', 'Arifur Rahman', 'Rashedul Karim', 'Shakil Ahmed',
  'Ayesha Siddiqua', 'Mustafizur Rahman', 'Fatema Begum', 'Nazmul Huda', 'Sharmin Akter',
  'Hasan Mahmud', 'Tania Sultana', 'Mahbub Alam', 'Kazi Monir', 'Nasrin Akter',
  'Imran Khan', 'Rokeya Begum', 'Ashikur Rahman', 'Sultana Razia', 'Fahim Faisal',
  'Nahid Hasan', 'Samiul Bashar', 'Ruma Akter', 'Shahadat Hossain', 'Salma Khatun',
  'Zubair Ahmed', 'Nargis Parvin', 'Saiful Islam', 'Rifat Hossain', 'Taslima Nasrin',
  'Anwar Hossain', 'Shirin Akter', 'Habibur Rahman', 'Mithila Roy', 'Sujon Mia',
  'Shovon Das', 'Priya Rani', 'Al Amin', 'Munira Akter', 'Joynal Abedin',
  'Mominul Haque', 'Shamima Nasrin', 'Delwar Hossain', 'Farzana Yasmin', 'Biplob Kumar',
  'Tarikul Islam', 'Rabeya Basri', 'Moniruzzaman', 'Shahnaz Parvin', 'Asaduzzaman',
  'Sonia Akter', 'Mostafa Kamal', 'Papia Sultana', 'Shahidul Islam', 'Bilkis Begum',
  'Liton Das', 'Mousumi Akter', 'Golam Rabbani', 'Jannatul Ferdous', 'Abu Bakar',
  'Rehana Akter', 'Mosharraf Hossain', 'Rozina Begum', 'Abdul Mazid', 'Afroza Sultana',
  'Rana Mia', 'Shampa Rani', 'Khurshid Alam', 'Zohra Khatun', 'Babul Akter',
  'Firoza Begum', 'Hafizur Rahman', 'Parvin Akter', 'Maksudul Hasan', 'Kulsum Bibi',
  'Enamul Haque', 'Rina Akter', 'Nurul Islam', 'Swapna Rani', 'Aminul Islam',
  'Nilufar Yasmin', 'Shafiqul Islam', 'Sheuli Akter', 'Sirajul Islam', 'Sabina Yasmin',
  'Mizanur Rahman', 'Hazera Begum', 'Sohag Mia', 'Marufa Akter', 'Zahid Hasan',
  'Nahar Begum', 'Mainul Islam', 'Kohinur Akter', 'Abdul Mannan', 'Roksana Parvin',
  'Shamim Reza', 'Maya Rani', 'Badiul Alam', 'Jharna Akter', 'Abdur Rahim',
  'Suraiya Begum', 'Monirul Islam', 'Nasima Akter', 'Shohel Rana', 'Jesmin Akter',
  'Saidur Rahman', 'Lipi Akter', 'Anisur Rahman', 'Shipra Rani', 'Belal Hossain',
  'Rani Begum', 'Masud Rana', 'Momotaz Begum', 'Ashraf Ali', 'Lucky Akter',
  'Abdul Barek', 'Sanjida Akter', 'Shamsul Alam', 'Beauty Begum', 'Nur Mohammad'
];

const PAYMENT_AMOUNTS = [
  130, 150, 200, 250, 320, 450, 500, 600, 700, 750, 850, 920, 1000,
  1150, 1200, 1350, 1400, 1500, 1650, 1750, 1850, 1920, 1980
];

const METHODS: PaymentRecord['type'][] = [
  'Balance Transfer', 'bKash Payout', 'Nagad Payout', 'Rocket Payout', 'Balance Transfer'
];

export const LivePayments: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [realTransfers, setRealTransfers] = useState<PaymentRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'transfer' | 'payout'>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Generate 130+ realistic top payment records
  useEffect(() => {
    const generated: PaymentRecord[] = [];

    generated.push({
      id: 'seed-top-1',
      name: 'Md. Ibrahim',
      studentId: '5938210',
      amount: 130,
      type: 'Balance Transfer',
      timeAgo: '2 mins ago',
      status: 'Completed'
    });
    generated.push({
      id: 'seed-top-2',
      name: 'Tanvir Ahmed',
      studentId: '7120492',
      amount: 700,
      type: 'bKash Payout',
      timeAgo: '5 mins ago',
      status: 'Verified'
    });
    generated.push({
      id: 'seed-top-3',
      name: 'Nusrat Jahan',
      studentId: '4819203',
      amount: 1850,
      type: 'Nagad Payout',
      timeAgo: '8 mins ago',
      status: 'Verified'
    });
    generated.push({
      id: 'seed-top-4',
      name: 'Rahim Uddin',
      studentId: '3920184',
      amount: 500,
      type: 'Balance Transfer',
      timeAgo: '12 mins ago',
      status: 'Completed'
    });
    generated.push({
      id: 'seed-top-5',
      name: 'Farhana Akter',
      studentId: '6829104',
      amount: 600,
      type: 'Rocket Payout',
      timeAgo: '16 mins ago',
      status: 'Verified'
    });
    generated.push({
      id: 'seed-top-6',
      name: 'Sabbir Hossain',
      studentId: '8291047',
      amount: 1000,
      type: 'Balance Transfer',
      timeAgo: '22 mins ago',
      status: 'Completed'
    });

    const SEED_AMOUNTS = [
      120, 130, 150, 200, 250, 320, 450, 500, 600, 700, 750, 850, 920, 1000,
      1150, 1200, 1350, 1400, 1500, 1650, 1750, 1850, 1920, 1980, 2100, 2500
    ];

    for (let i = 6; i < 420; i++) {
      const name = INITIAL_NAMES[i % INITIAL_NAMES.length];
      const randomId = (1000000 + ((i * 73939 + 18273) % 8999999)).toString();
      const amount = SEED_AMOUNTS[(i * 7 + 3) % SEED_AMOUNTS.length];
      const type = METHODS[(i * 3 + 1) % METHODS.length];

      const minsAgo = (i * 3) + ((i * 2) % 11);
      let timeAgo = `${minsAgo} mins ago`;
      if (minsAgo === 1) timeAgo = '1 min ago';
      else if (minsAgo === 0) timeAgo = 'Just now';
      else if (minsAgo > 60 && minsAgo < 1440) {
        timeAgo = `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`;
      } else if (minsAgo >= 1440) {
        timeAgo = '1 day ago';
      }

      generated.push({
        id: `seed-${i}`,
        name,
        studentId: randomId,
        amount,
        type,
        timeAgo,
        status: i % 4 === 0 ? 'Verified' : 'Completed'
      });
    }

    setRecords(generated);
  }, []);

  // Real-time Firestore transfers listener
  useEffect(() => {
    if (!user?.uid) return;
    try {
      const q = query(collection(db, 'transfers'), where('status', '==', 'completed'));
      const unsub = onSnapshot(q, (snap) => {
        const docsSorted = [...snap.docs]
          .sort((a, b) => {
            const ta = new Date(a.data()?.createdAt || 0).getTime();
            const tb = new Date(b.data()?.createdAt || 0).getTime();
            return tb - ta;
          })
          .slice(0, 20);

        const liveList: PaymentRecord[] = docsSorted.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            name: d.senderName || 'Active Member',
            studentId: d.senderStudentId || d.recipientStudentId || '7291048',
            amount: Number(d.amount) || 100,
            type: 'Balance Transfer',
            timeAgo: 'Just now',
            status: 'Completed',
            isReal: true
          };
        });
        setRealTransfers(liveList);
      }, (error) => {
        console.warn("Transfers sync warning:", error);
      });

      return () => unsub();
    } catch (err) {
      console.error(err);
    }
  }, [user?.uid]);

  // Dynamic live auto-update ticker every 1 to 3 minutes randomly
  useEffect(() => {
    let timeoutId: any = null;

    const runTicker = () => {
      const randomSeconds = Math.floor(Math.random() * (180 - 60 + 1)) + 60;

      timeoutId = setTimeout(() => {
        setRecords((prev) => {
          if (prev.length < 5) return prev;
          const randomName = INITIAL_NAMES[Math.floor(Math.random() * INITIAL_NAMES.length)];
          const randomId = (1000000 + Math.floor(Math.random() * 9000000)).toString();
          const randomAmount = PAYMENT_AMOUNTS[Math.floor(Math.random() * PAYMENT_AMOUNTS.length)];
          const randomType = METHODS[Math.floor(Math.random() * METHODS.length)];

          const newRecord: PaymentRecord = {
            id: `live-${Date.now()}`,
            name: randomName,
            studentId: randomId,
            amount: randomAmount,
            type: randomType,
            timeAgo: 'Just now',
            status: 'Completed'
          };

          return [newRecord, ...prev.slice(0, 420)];
        });

        setLastUpdated('Updated just now');
        runTicker();
      }, randomSeconds * 1000);
    };

    runTicker();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const combinedRecords = [...realTransfers, ...records];

  const filtered = combinedRecords.filter(r => {
    if (filter === 'transfer') return r.type === 'Balance Transfer';
    if (filter === 'payout') return r.type !== 'Balance Transfer';
    return true;
  });

  return (
    <div className="p-3.5 sm:p-5 pb-24 space-y-4 bg-[#F4F5F7]">

      {/* Top Formal Summary Header */}
      <div className="bg-[#0A4D8C] rounded-xl p-5 text-white shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/75 font-medium">Transaction Ledger</p>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight mt-0.5">Verified Payouts & Transfers</h1>
            <p className="text-xs text-white/80 mt-1">
              Member balance transfers and automated gateway disbursements.
            </p>
          </div>
          <span className="text-[11px] text-white/80 font-mono shrink-0">{lastUpdated}</span>
        </div>

        <div className="pt-3 border-t border-white/15">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open_balance_transfer'))}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0A4D8C] py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowRightLeft size={14} />
            <span>New Balance Transfer</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 bg-white p-1 rounded-xl border border-slate-200/90 text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            filter === 'all'
              ? 'bg-[#0A4D8C] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('transfer')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            filter === 'transfer'
              ? 'bg-[#0A4D8C] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft size={13} />
          <span>Transfers</span>
        </button>
        <button
          onClick={() => setFilter('payout')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            filter === 'payout'
              ? 'bg-[#0A4D8C] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet size={13} />
          <span>Withdrawals</span>
        </button>
      </div>

      {/* Ledger Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-[#F8FAFC]">
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
            <Receipt size={15} className="text-[#0A4D8C]" />
            <span>Recent Transactions</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">{filtered.length} entries</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map((item, index) => {
            const isTransfer = item.type === 'Balance Transfer';

            return (
              <div
                key={item.id + index}
                className={`px-4 py-3 flex items-center justify-between gap-3 ${
                  item.isReal ? 'bg-[#EEF5FC]/60' : 'hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
                    {isTransfer ? <ArrowRightLeft size={16} strokeWidth={1.75} /> : <TrendingUp size={16} strokeWidth={1.75} />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-semibold text-slate-900 truncate">{item.name}</h4>
                      {item.isReal && (
                        <span className="text-[10.5px] font-semibold text-[#0A4D8C]">Recent</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate tabular-nums">
                      ID {item.studentId} <span className="mx-1 text-slate-300">·</span> {item.type}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[13px] font-semibold text-slate-900 font-mono tabular-nums">
                    BDT {item.amount.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10.5px] text-[#0D7A5F] font-medium">
                    <CheckCircle2 size={11} className="shrink-0" />
                    <span>{item.status}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400 font-mono font-normal tabular-nums">{item.timeAgo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
