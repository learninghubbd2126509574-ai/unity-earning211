import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Receipt, 
  Clock, 
  Users, 
  ShieldCheck, 
  RefreshCw,
  Wallet,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

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
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [realTransfers, setRealTransfers] = useState<PaymentRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'transfer' | 'payout'>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Generate 130 realistic top payment records
  useEffect(() => {
    const generated: PaymentRecord[] = [];
    
    // Specific requested records
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

    for (let i = 6; i < 130; i++) {
      const name = INITIAL_NAMES[i % INITIAL_NAMES.length];
      const randomId = (1000000 + ((i * 73939 + 18273) % 8999999)).toString();
      const amount = PAYMENT_AMOUNTS[(i * 7 + 3) % PAYMENT_AMOUNTS.length];
      const type = METHODS[(i * 3 + 1) % METHODS.length];
      
      const minsAgo = (i * 9) + ((i * 3) % 15);
      let timeAgo = `${minsAgo} mins ago`;
      if (minsAgo > 60 && minsAgo < 1440) {
        timeAgo = `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`;
      } else if (minsAgo >= 1440) {
        timeAgo = 'Yesterday';
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
    try {
      const q = query(collection(db, 'transfers'), orderBy('createdAt', 'desc'), limit(20));
      const unsub = onSnapshot(q, (snap) => {
        const liveList: PaymentRecord[] = snap.docs.map((docSnap) => {
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
        console.error("Transfers sync:", error);
      });

      return () => unsub();
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Dynamic live auto-update ticker every 6 seconds to rotate / shift items dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setRecords((prev) => {
        if (prev.length < 5) return prev;
        // Pick a random user from list and generate a new live transaction at the top
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

        const updated = [newRecord, ...prev.slice(0, 129)];
        return updated;
      });

      setLastUpdated('Updated just now');
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const combinedRecords = [...realTransfers, ...records];

  const filtered = combinedRecords.filter(r => {
    if (filter === 'transfer') return r.type === 'Balance Transfer';
    if (filter === 'payout') return r.type !== 'Balance Transfer';
    return true;
  });

  return (
    <div className="p-4 pb-24 h-full overflow-y-auto space-y-5 bg-slate-50">
      
      {/* Top Statistics & Live Feed Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE PAYMENTS & TRANSFERS</span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <RefreshCw size={12} className="animate-spin text-emerald-400" />
              <span>Auto-Sync</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight">Verified Payouts & Transfers</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time member balance transfers and automated gateway withdrawals.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-800 text-center">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's Payouts</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">BDT 148,650</div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Live Queue</div>
              <div className="text-sm font-bold text-orange-400 font-mono mt-0.5">130+ Active</div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg. Speed</div>
              <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">&lt; 2 Mins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 text-xs font-bold">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Activity (130+)
        </button>
        <button
          onClick={() => setFilter('transfer')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            filter === 'transfer'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft size={13} />
          <span>Balance Transfers</span>
        </button>
        <button
          onClick={() => setFilter('payout')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            filter === 'payout'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet size={13} />
          <span>Withdrawals</span>
        </button>
      </div>

      {/* Payment Transactions List */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Receipt size={14} className="text-orange-500" />
            <span>Top Recent Transfers & Payouts</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{lastUpdated}</span>
        </div>

        <div className="space-y-2.5">
          {filtered.map((item, index) => {
            const isTransfer = item.type === 'Balance Transfer';

            return (
              <div
                key={item.id + index}
                className={`p-3.5 rounded-2xl border transition-all ${
                  item.isReal
                    ? 'bg-orange-50/70 border-orange-200 shadow-xs'
                    : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isTransfer 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {isTransfer ? <ArrowRightLeft size={18} /> : <TrendingUp size={18} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                        {item.isReal && (
                          <span className="bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                            LIVE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 font-medium">
                          ID: {item.studentId}
                        </span>
                        <span>•</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-slate-800 font-mono">
                      BDT {item.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-emerald-600 font-semibold">
                      <CheckCircle2 size={11} className="shrink-0" />
                      <span>{item.status}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 font-mono font-normal">{item.timeAgo}</span>
                    </div>
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
