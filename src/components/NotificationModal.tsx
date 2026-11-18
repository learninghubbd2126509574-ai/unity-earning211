import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Gift,
  FileText,
  CreditCard,
  TrendingUp
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeString: string;
  category: string;
  icon: React.ReactNode;
  isImportant?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [readIds, setReadIds] = useState<string[]>([]);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekendFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;

  const notifications: NotificationItem[] = isWeekendFridayOrSaturday
    ? [
        {
          id: 'notif-lead-130',
          title: 'শুক্রবার ও শনিবারের লিড জেনারেশন অফার',
          description: 'আজ লিড জেনারেশনের কাজ করে প্রতি অনুমোদিত কনভার্সনে ১৩০ টাকা কমিশন পাওয়া যাচ্ছে। নির্ধারিত নিয়ম মেনে কাজ জমা দিন।',
          timeString: 'সকাল ০৯:০০',
          category: 'Lead Offer · ৳130',
          icon: <TrendingUp size={17} strokeWidth={1.75} className="text-[#0A4D8C]" />,
          isImportant: true
        },
        {
          id: 'notif-discount-55',
          title: 'আইডি অ্যাক্টিভেশনে ৫৫% ছাড়',
          description: 'নতুন মেম্বার আইডি অ্যাক্টিভেশনে নির্ধারিত সময়ের জন্য ৫৫% ডিসকাউন্ট সুবিধা চালু রয়েছে।',
          timeString: 'সকাল ০৯:১৫',
          category: 'Discount · 55%',
          icon: <CheckCircle2 size={17} strokeWidth={1.75} className="text-emerald-700" />,
          isImportant: true
        },
        {
          id: 'notif-friday-gift',
          title: 'সাপ্তাহিক বোনাস ফলাফল ঘোষণা',
          description: 'আজ শুক্রবার রাত ৮:০০ টায় শীর্ষ ৩ জন কর্মীর তালিকা প্রকাশ করা হবে। ১ম ৳১,০০০, ২য় ৳৭০০ এবং ৩য় ৳৫০০ বোনাস পাবেন।',
          timeString: 'সকাল ১০:০০',
          category: 'Weekly Bonus',
          icon: <Gift size={17} strokeWidth={1.75} className="text-amber-600" />
        },
        {
          id: 'notif-fast-payout',
          title: 'উইকএন্ড পে-আউট প্রসেসিং সক্রিয়',
          description: 'শুক্রবার ও শনিবারের বিকাশ, নগদ ও রকেট উইথড্রয়াল নিয়মিত যাচাইয়ের মাধ্যমে দ্রুত সম্পন্ন করা হচ্ছে।',
          timeString: 'সম্প্রতি',
          category: 'Payout Desk',
          icon: <CreditCard size={17} strokeWidth={1.75} className="text-slate-700" />
        }
      ]
    : [
        {
          id: 'notif-form-typing-20',
          title: 'ফর্ম ফিলাপ ও টাইপিং কাজে ২০% অতিরিক্ত কমিশন',
          description: 'আজ ফর্ম ফিলাপ ও টাইপিং মডিউলের অনুমোদিত প্রতিটি টাস্কের সাথে ২০% অতিরিক্ত কমিশন যুক্ত হবে।',
          timeString: 'সকাল ০৯:০০',
          category: 'Bonus · +20%',
          icon: <FileText size={17} strokeWidth={1.75} className="text-[#0A4D8C]" />,
          isImportant: true
        },
        {
          id: 'notif-data-entry-20',
          title: 'ডাটা এন্ট্রি প্রজেক্টে ২০% অতিরিক্ত বোনাস',
          description: 'ডাটা এন্ট্রি টাস্ক নির্ভুলভাবে সম্পন্ন করলে মূল আয়ের সাথে অতিরিক্ত ২০% বোনাস যোগ করা হবে।',
          timeString: 'সকাল ০৯:৩০',
          category: 'Data Entry · +20%',
          icon: <TrendingUp size={17} strokeWidth={1.75} className="text-[#0A4D8C]" />,
          isImportant: true
        },
        {
          id: 'notif-quota-boost',
          title: 'দৈনিক টাস্ক কোটা আপডেট',
          description: 'আজকের কাজের কোটা বৃদ্ধি করা হয়েছে। অনুমোদিত মডিউল অনুযায়ী নিয়মিত কাজ জমা দেওয়া যাবে।',
          timeString: 'সকাল ১০:০০',
          category: 'Operations',
          icon: <CheckCircle2 size={17} strokeWidth={1.75} className="text-emerald-700" />
        },
        {
          id: 'notif-weekly-campaign',
          title: 'সাপ্তাহিক গিফট ক্যাম্পেইন নিবন্ধন',
          description: 'শনিবার থেকে শুক্রবার পর্যন্ত চলা সাপ্তাহিক ক্যাম্পেইনে কাজের সংখ্যা জমা দিয়ে শীর্ষ ৩ বিজয়ীর তালিকায় অংশ নিতে পারেন।',
          timeString: 'সম্প্রতি',
          category: 'Campaign',
          icon: <Gift size={17} strokeWidth={1.75} className="text-amber-600" />
        }
      ];

  const handleMarkAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  const handleItemClick = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-[2px]">
      <div className="bg-white border border-slate-200 text-[#1E2329] rounded-xl w-full max-w-[440px] max-h-[88vh] flex flex-col shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center">
              <Bell size={18} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1E2329] text-sm sm:text-base">
                নোটিফিকেশন সেন্টার
              </h3>
              <p className="text-[11px] text-slate-500">
                {notifications.length}টি বিজ্ঞপ্তি · {isWeekendFridayOrSaturday ? 'উইকএন্ড আপডেট' : 'দৈনিক কাজের আপডেট'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub-bar */}
        <div className="bg-[#F4F5F7] px-5 py-2 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Calendar size={13} className="text-slate-500" />
            <span>
              {isWeekendFridayOrSaturday ? 'শুক্রবার / শনিবার শিডিউল' : 'নিয়মিত কার্যদিবস'}
            </span>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-[#0A4D8C] hover:underline cursor-pointer"
          >
            সব পঠিত করুন
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-[#F4F5F7]">
          {notifications.map((item) => {
            const isRead = readIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer bg-white ${
                  item.isImportant && !isRead
                    ? 'border-[#D4E4F7] bg-[#FAFCFF]'
                    : 'border-slate-200 hover:border-slate-300'
                } ${isRead ? 'opacity-70' : 'opacity-100'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F5F7] border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-1">
                      <span className="font-medium text-[#0A4D8C]">
                        {item.category}
                      </span>
                      <span className="font-mono flex items-center gap-1">
                        <Clock size={10} />
                        {item.timeString}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-[13px] font-semibold text-[#1E2329] leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">Unity Earning Notices</span>
          <button
            onClick={onClose}
            className="text-xs font-medium text-[#0A4D8C] hover:underline cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
